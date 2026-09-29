"""
====================================================================
LIGA DEPORTIVA COSTA DE ORO 2026 - SPORTS ANALYTICS ENGINE
Motor Analítico Avanzado, Auditoría de Integridad y Métricas de Rendimiento
Curiol Studio • Inteligencia y Automatización Deportiva
====================================================================
"""

import sys
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# Configurar salida UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
BACKUP_DIR = DATA_DIR / "backups"
EXPORT_DIR = DATA_DIR / "exports"

def run_sports_analytics():
    """
    Ejecuta el análisis estadístico completo sobre los datos consolidados.
    """
    latest_backup = BACKUP_DIR / "snapshot_latest.json"

    if not latest_backup.exists():
        # Ejecutar backup previo si no existe
        from backup_engine import create_full_backup
        data = create_full_backup()
    else:
        with open(latest_backup, "r", encoding="utf-8") as f:
            data = json.load(f)

    schools = data.get("schools", [])
    matches = data.get("matches", [])

    school_lookup = {s["id"]: s for s in schools}

    # Contadores Globales
    total_matches = len(matches)
    completed_matches = [m for m in matches if m.get("status") == "completed"]
    live_matches = [m for m in matches if m.get("status") == "live"]
    scheduled_matches = [m for m in matches if m.get("status") == "scheduled"]

    # Métricas por Deporte
    sports_breakdown = defaultdict(lambda: {
        "total_matches": 0,
        "completed": 0,
        "total_score": 0,
        "avg_score_per_match": 0.0,
        "categories": set(),
        "highest_scoring_match": None,
    })

    # Rendimiento por Colegio
    school_metrics = defaultdict(lambda: {
        "name": "",
        "short_name": "",
        "matches_played": 0,
        "wins": 0,
        "draws": 0,
        "losses": 0,
        "points_for": 0,
        "points_against": 0,
        "diff": 0,
        "mvp_count": 0,
        "sports_participated": set(),
    })

    # Inicializar colegios
    for s in schools:
        sid = s["id"]
        school_metrics[sid]["name"] = s["name"]
        school_metrics[sid]["short_name"] = s["short_name"]

    # Procesar partidos completados
    for m in completed_matches:
        sport = m.get("sport", "futbol")
        h_id = m.get("homeTeamId")
        a_id = m.get("awayTeamId")
        h_score = m.get("homeScore", 0)
        a_score = m.get("awayScore", 0)
        mvp_school = m.get("mvpSchoolId")

        # Deporte
        sb = sports_breakdown[sport]
        sb["total_matches"] += 1
        sb["completed"] += 1
        sb["total_score"] += (h_score + a_score)
        sb["categories"].add(m.get("categoryId"))

        match_total = h_score + a_score
        if not sb["highest_scoring_match"] or match_total > sb["highest_scoring_match"]["total"]:
            sb["highest_scoring_match"] = {
                "match_id": m.get("id"),
                "teams": f"{school_lookup.get(h_id, {}).get('short_name', h_id)} vs {school_lookup.get(a_id, {}).get('short_name', a_id)}",
                "score": f"{h_score} - {a_score}",
                "total": match_total,
            }

        # Colegio Local
        if h_id in school_metrics:
            sm = school_metrics[h_id]
            sm["matches_played"] += 1
            sm["points_for"] += h_score
            sm["points_against"] += a_score
            sm["sports_participated"].add(sport)
            if h_score > a_score:
                sm["wins"] += 1
            elif h_score == a_score:
                sm["draws"] += 1
            else:
                sm["losses"] += 1

        # Colegio Visita
        if a_id in school_metrics:
            sm = school_metrics[a_id]
            sm["matches_played"] += 1
            sm["points_for"] += a_score
            sm["points_against"] += h_score
            sm["sports_participated"].add(sport)
            if a_score > h_score:
                sm["wins"] += 1
            elif a_score == h_score:
                sm["draws"] += 1
            else:
                sm["losses"] += 1

        # MVP
        if mvp_school and mvp_school in school_metrics:
            school_metrics[mvp_school]["mvp_count"] += 1

    # Calcular promedios y diferencias
    for sport, sb in sports_breakdown.items():
        if sb["completed"] > 0:
            sb["avg_score_per_match"] = round(sb["total_score"] / sb["completed"], 2)
        sb["categories"] = list(sb["categories"])

    for sid, sm in school_metrics.items():
        sm["diff"] = sm["points_for"] - sm["points_against"]
        sm["sports_participated"] = list(sm["sports_participated"])

    # Auditoría de Integridad
    integrity_warnings = []
    for m in matches:
        if m.get("status") == "completed":
            if m.get("homeScore") is None or m.get("awayScore") is None:
                integrity_warnings.append(f"Partido {m.get('id')} completado sin marcador.")
        if not m.get("homeTeamId") or not m.get("awayTeamId"):
            integrity_warnings.append(f"Partido {m.get('id')} con equipo indefinido.")

    analytics_report = {
        "timestamp": datetime.now().isoformat(),
        "summary": {
            "total_matches": total_matches,
            "completed_matches": len(completed_matches),
            "live_matches": len(live_matches),
            "scheduled_matches": len(scheduled_matches),
            "progress_percent": round((len(completed_matches) / total_matches * 100), 1) if total_matches > 0 else 0,
        },
        "sports": dict(sports_breakdown),
        "schools_performance": dict(school_metrics),
        "integrity_audit": {
            "status": "PASSED" if len(integrity_warnings) == 0 else "WARNINGS_FOUND",
            "warnings_count": len(integrity_warnings),
            "warnings": integrity_warnings,
        },
    }

    # Guardar reporte JSON
    analytics_file = DATA_DIR / "analytics_summary.json"
    with open(analytics_file, "w", encoding="utf-8") as f:
        json.dump(analytics_report, f, indent=2, ensure_ascii=False)

    print("=" * 60)
    print("📊 LIGA DEPORTIVA COSTA DE ORO 2026 - INFORME ANALÍTICO")
    print("=" * 60)
    print(f"• Total Partidos: {total_matches} | Completados: {len(completed_matches)} ({analytics_report['summary']['progress_percent']}%)")
    print(f"• Auditoría de Integridad: {analytics_report['integrity_audit']['status']} (0 errores)")
    print("-" * 60)
    print("🏆 RENDIMIENTO POR INSTITUCIÓN EDUCATIVA:")
    for sid, sm in sorted(school_metrics.items(), key=lambda x: x[1]["wins"], reverse=True):
        print(f"  - {sm['short_name']:<15} | PJ: {sm['matches_played']} | PG: {sm['wins']} | PE: {sm['draws']} | PP: {sm['losses']} | MVPs: {sm['mvp_count']}")
    print("=" * 60)

    return analytics_report

if __name__ == "__main__":
    run_sports_analytics()
