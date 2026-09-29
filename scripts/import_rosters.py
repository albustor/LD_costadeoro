"""
====================================================================
LIGA DEPORTIVA COSTA DE ORO 2026 - ROSTER IMPORTER & VALIDATOR
Procesador Masivo de Nóminas de Jugadores por Colegio y Deporte
Curiol Studio • Arquitectura Phygital & Resiliencia
====================================================================
"""

import sys
import os
import csv
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# Configurar salida UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
ROSTERS_DIR = DATA_DIR / "rosters"
PLANTILLAS_DIR = DATA_DIR / "plantillas"
OUTPUT_DIR = DATA_DIR / "processed_rosters"

ROSTERS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VALID_SCHOOL_IDS = {
    "la-paz-cabo-velas",
    "la-paz-tempisque",
    "cria",
    "journey-school",
    "vittorino",
    "educarte",
}

VALID_SPORTS = {"futbol", "voleibol", "baloncesto"}

def import_roster_file(csv_file_path: Path):
    """
    Importa y valida un archivo CSV de roster por colegio y deporte.
    """
    if not csv_file_path.exists():
        print(f"[ERROR] Archivo no encontrado: {csv_file_path}")
        return None

    print(f"📥 Procesando archivo de nómina: {csv_file_path.name}")

    rosters = defaultdict(lambda: {
        "schoolId": "",
        "schoolName": "",
        "sport": "",
        "categoryId": "",
        "categoryName": "",
        "coachName": "",
        "players": [],
        "updatedAt": datetime.now().isoformat(),
    })

    valid_rows = 0
    skipped_rows = 0

    with open(csv_file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        header = None

        for row_idx, row in enumerate(reader):
            # Omitir líneas vacías o de comentario (#)
            if not row or (len(row) > 0 and row[0].startswith("#")):
                continue

            if header is None:
                header = [h.strip().lower() for h in row]
                continue

            if len(row) < 6:
                skipped_rows += 1
                continue

            row_dict = dict(zip(header, [c.strip() for c in row]))

            school_id = row_dict.get("colegio_id", "").lower()
            sport = row_dict.get("deporte", "").lower()
            cat_id = row_dict.get("categoria_id", "")
            dorsal_str = row_dict.get("dorsal", "0")
            full_name = row_dict.get("nombre_completo", "")
            posicion = row_dict.get("posicion", "")
            capitan_str = row_dict.get("capitan", "NO").upper()
            ano_nac = row_dict.get("ano_nacimiento", "")
            coach = row_dict.get("entrenador_principal", "")

            # Validación de identificador de colegio
            if school_id not in VALID_SCHOOL_IDS:
                # Normalización inteligente de nombres de colegio
                if "cabo" in school_id or "velas" in school_id:
                    school_id = "la-paz-cabo-velas"
                elif "tempisque" in school_id:
                    school_id = "la-paz-tempisque"
                elif "cria" in school_id:
                    school_id = "cria"
                elif "journey" in school_id:
                    school_id = "journey-school"
                elif "vittorino" in school_id:
                    school_id = "vittorino"
                elif "educarte" in school_id:
                    school_id = "educarte"
                else:
                    print(f"  ⚠️ [Fila {row_idx}] Colegio no reconocido '{school_id}', omitida.")
                    skipped_rows += 1
                    continue

            # Parsear dorsal numérico
            try:
                jersey_num = int(dorsal_str)
            except ValueError:
                jersey_num = 0

            is_cap = capitan_str in {"SI", "S", "YES", "Y", "TRUE", "1"}

            roster_key = f"{school_id}_{sport}_{cat_id}"
            r = rosters[roster_key]
            r["schoolId"] = school_id
            r["schoolName"] = row_dict.get("colegio_nombre", school_id)
            r["sport"] = sport
            r["categoryId"] = cat_id
            r["categoryName"] = row_dict.get("categoria_nombre", cat_id)
            if coach and not r["coachName"]:
                r["coachName"] = coach

            player_id = f"p-{school_id[:4]}-{jersey_num}-{len(r['players']) + 1}"
            r["players"].append({
                "id": player_id,
                "jerseyNumber": jersey_num,
                "fullName": full_name,
                "position": posicion,
                "isCaptain": is_cap,
                "birthYear": int(ano_nac) if ano_nac.isdigit() else None,
            })

            valid_rows += 1

    # Guardar en archivo JSON consolidado
    output_file = OUTPUT_DIR / f"rosters_consolidados_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    latest_file = OUTPUT_DIR / "rosters_latest.json"

    rosters_list = list(rosters.values())
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(rosters_list, f, indent=2, ensure_ascii=False)

    with open(latest_file, "w", encoding="utf-8") as f:
        json.dump(rosters_list, f, indent=2, ensure_ascii=False)

    print(f"✅ [IMPORT COMPLETED]")
    print(f"  • Filas procesadas: {valid_rows} jugadores válidos (omitidas: {skipped_rows})")
    print(f"  • Equipos/Categorías configuradas: {len(rosters_list)}")
    print(f"  • Guardado en: {output_file.name}")

    return rosters_list

if __name__ == "__main__":
    # Probar importando la plantilla oficial
    plantilla = PLANTILLAS_DIR / "plantilla_roster_oficial.csv"
    if plantilla.exists():
        import_roster_file(plantilla)
    else:
        print(f"[INFO] Para importar, coloque archivos CSV en {ROSTERS_DIR}")
