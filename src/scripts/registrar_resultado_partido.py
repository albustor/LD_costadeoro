"""
registrar_resultado_partido.py
Utilidad Determinista CLI para Registrar Resultados de Partidos (Jornadas 1, 2, 3 y Finales)
Liga Costa de Oro 2026 · Curiol Studio

Ejemplos de uso:
  1. Listar todos los partidos programados o pendientes:
     python src/scripts/registrar_resultado_partido.py --list

  2. Registrar resultado de Fútbol o Baloncesto:
     python src/scripts/registrar_resultado_partido.py --id j2-fut-c-01 --home 3 --away 1

  3. Registrar resultado de Voleibol (sets + parciales opcionales):
     python src/scripts/registrar_resultado_partido.py --id j2-vol-c-01 --home 2 --away 0 --sets "25-18,25-21"

  4. Marcar un partido como Por reprogramar (Regla Costa de Oro: 0 pts y 0 PJ a ambos):
     python src/scripts/registrar_resultado_partido.py --id j2-fut-d-01 --postponed --notes "Partido por reprogramar (sin asignación de puntos a ningún equipo)"
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from generate_canonical_standings import generate_canonical_standings

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
DB_PATH = os.path.join(BASE_DIR, "src", "data", "tournament_db.json")


def parse_set_scores(sets_str: str):
    """Convierte '25-18,25-21' en [{'home': 25, 'away': 18}, {'home': 25, 'away': 21}]"""
    result = []
    if not sets_str:
        return result
    for part in sets_str.split(","):
        part = part.strip()
        if "-" in part:
            h, a = part.split("-", 1)
            result.append({"home": int(h.strip()), "away": int(a.strip())})
    return result


def main():
    parser = argparse.ArgumentParser(description="Registrar o consultar resultados oficiales Liga Costa de Oro 2026")
    parser.add_argument("--list", action="store_true", help="Listar todos los partidos registrados y su estado")
    parser.add_argument("--jornada", type=int, help="Filtrar listado por número de jornada (1, 2, 3)")
    parser.add_argument("--id", type=str, help="ID del partido a actualizar (ej. j2-fut-c-01)")
    parser.add_argument("--home", type=int, help="Goles / Puntos / Sets ganados del equipo local")
    parser.add_argument("--away", type=int, help="Goles / Puntos / Sets ganados del equipo visitante")
    parser.add_argument("--sets", type=str, help="Parciales por set en Voleibol (ej. '25-18,25-21')")
    parser.add_argument("--postponed", action="store_true", help="Marcar como Por reprogramar (0 pts y 0 PJ)")
    parser.add_argument("--notes", type=str, help="Nota u observación oficial del partido")
    args = parser.parse_args()

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    matches = db.get("matches", [])

    if args.list:
        print("=" * 95)
        print(f"{'ID':<16} | {'J':<2} | {'Fecha':<10} | {'Deporte':<10} | {'Local vs Visitante':<34} | {'Marcador':<8} | {'Estado'}")
        print("=" * 95)
        for m in matches:
            if args.jornada and int(m.get("jornada", 1) or 1) != args.jornada:
                continue
            pair = f"{m.get('homeTeamId')} vs {m.get('awayTeamId')}"
            score = f"{m.get('homeScore', 0)} : {m.get('awayScore', 0)}"
            st = f"{m.get('status')} ({m.get('currentPeriod', '')})"
            print(f"{m['id']:<16} | {m.get('jornada', 1):<2} | {m.get('date', ''):<10} | {m.get('sport', ''):<10} | {pair:<34} | {score:<8} | {st}")
        return

    if not args.id:
        parser.print_help()
        sys.exit(1)

    target = next((m for m in matches if m.get("id") == args.id), None)
    if not target:
        print(f"❌ No se encontró ningún partido con ID '{args.id}'. Usa --list para ver los IDs.")
        sys.exit(1)

    now_iso = datetime.now(timezone.utc).isoformat()

    if args.postponed:
        target["homeScore"] = 0
        target["awayScore"] = 0
        target["status"] = "postponed"
        target["currentPeriod"] = "Por reprogramar"
        target["notes"] = args.notes or "Partido por reprogramar (sin asignación de puntos a ningún equipo)"
        target["updatedAt"] = now_iso
        print(f"🗓️ Partido {args.id} marcado como POR REPROGRAMAR (0 pts y 0 PJ para ambos equipos).")
    else:
        if args.home is None or args.away is None:
            print("❌ Debes indicar --home y --away para registrar un marcador finalizado (o --postponed).")
            sys.exit(1)

        target["homeScore"] = args.home
        target["awayScore"] = args.away
        target["status"] = "completed"
        target["currentPeriod"] = "Finalizado"
        target["isManualOverride"] = True
        target["walkover"] = "none"
        target["updatedAt"] = now_iso

        if target.get("sport") == "voleibol":
            target["homeSetsWon"] = args.home
            target["awaySetsWon"] = args.away
            if args.sets:
                target["setScores"] = parse_set_scores(args.sets)

        if args.notes:
            target["notes"] = args.notes
        else:
            j_num = target.get("jornada", 2)
            sets_info = f" · Sets: {args.sets}" if args.sets else ""
            target["notes"] = (
                f"Jornada {j_num} - Resultado Oficial ({target.get('homeTeamId')} {args.home} - {args.away} {target.get('awayTeamId')}{sets_info})"
            )

        print(f"✅ Resultado registrado para {args.id}: {target['homeTeamId']} {args.home} - {args.away} {target['awayTeamId']}")

    db["updatedAt"] = now_iso
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    # Regenerar inmediatamente canonical_standings.json con el motor en Python
    generate_canonical_standings()


if __name__ == "__main__":
    main()
