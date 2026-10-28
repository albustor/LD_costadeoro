"""
generate_canonical_standings.py
Generador Canónico de Tablas de Posiciones Inmutables
Liga Costa de Oro 2026 (MEP - ICODER 2026)
Curiol Studio
"""

import os
import sys
import json
from datetime import datetime, timezone

# Compatibilidad con terminal Windows UTF-8
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from scoring_rules_jde2026 import CostaDeOroCalculator

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
DB_PATH = os.path.join(BASE_DIR, "src", "data", "tournament_db.json")
CANONICAL_OUTPUT_PATH = os.path.join(BASE_DIR, "src", "data", "canonical_standings.json")

def generate_canonical_standings():
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: No se encontró la base de datos en {DB_PATH}")
        sys.exit(1)

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db_data = json.load(f)

    matches = db_data.get("matches", [])
    print(f"📊 Procesando {len(matches)} partidos registrados en tournament_db.json...")

    calc = CostaDeOroCalculator()
    standings_by_category = calc.calculate_all(matches)
    computed_statistics = calc.calculate_statistics(matches, standings_by_category)

    payload = {
        "generator": "costa_de_oro_calculator.py (MEP-ICODER 2026 Engine)",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "version": "1.1.0",
        "matches_processed": len(matches),
        "computed_standing_points": standings_by_category,
        "computed_statistics": computed_statistics,
    }

    with open(CANONICAL_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"✅ Archivo canónico generado con éxito en: {CANONICAL_OUTPUT_PATH}")

    g_sum = computed_statistics.get("global_summary", {})
    print(
        f"📈 Estadísticas Globales: {g_sum.get('completed_matches', 0)} jugados | "
        f"{g_sum.get('scheduled_matches', 0)} programados | "
        f"{g_sum.get('postponed_matches', 0)} por reprogramar | "
        f"Goles Fútbol: {g_sum.get('total_goals_futbol', 0)} | "
        f"Sets Voleibol: {g_sum.get('total_sets_voleibol', 0)} | "
        f"Puntos Baloncesto: {g_sum.get('total_points_baloncesto', 0)}"
    )

    # Imprimir resumen de posiciones oficiales
    print("\n" + "=" * 60)
    print("🏆 RESUMEN CANÓNICO DE CLASIFICACIONES (PRODUCCIÓN)")
    print("=" * 60)
    for cat_id, rows in standings_by_category.items():
        print(f"\n📁 Categoría: {cat_id.upper()}")
        print(f"{'Pos':<4} | {'Colegio':<24} | {'PJ':<3} | {'PG':<3} | {'PTS':<4} | {'Dif':<4}")
        print("-" * 50)
        for r in rows:
            name = r["school"]["shortName"]
            print(f"{r['position']:<4} | {name:<24} | {r['played']:<3} | {r['won']:<3} | {r['points']:<4} | {r['diff']:<4}")

if __name__ == "__main__":
    generate_canonical_standings()
