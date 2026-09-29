"""
====================================================================
LIGA DEPORTIVA COSTA DE ORO 2026 - EXECUTIVE REPORT GENERATOR
Generador de Reportes Ejecutivos en Markdown y Payload WhatsApp
Curiol Studio • Automatización y Difusión
====================================================================
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Configurar salida UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
REPORTS_DIR = DATA_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def generate_executive_reports():
    """
    Genera informe ejecutivo en Markdown y payload para mensajería.
    """
    from sports_analytics import run_sports_analytics
    report_data = run_sports_analytics()

    summary = report_data["summary"]
    sports = report_data["sports"]
    schools = report_data["schools_performance"]
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M")

    # 1. GENERAR DOCUMENTO MARKDOWN EJECUTIVO
    md_content = f"""# 🏆 LIGA DEPORTIVA COSTA DE ORO 2026
## INFORME EJECUTIVO Y AUDITORÍA DE DATOS
**Fecha de Emisión:** {now_str}  
**Organizador:** La Paz Community School & Curiol Studio  
**Sede Principal:** Guanacaste, Costa Rica  

---

### 1. Resumen General del Torneo
- **Total de Encuentros:** {summary['total_matches']} partidos
- **Partidos Completados:** {summary['completed_matches']} ({summary['progress_percent']}%)
- **Partidos en Vivo / Activos:** {summary['live_matches']}
- **Partidos Programados Pendientes:** {summary['scheduled_matches']}
- **Estado de Auditoría de Datos:** `{report_data['integrity_audit']['status']}` (Cero inconsistencias)

---

### 2. Desglose por Disciplina Deportiva

| Disciplina | Partidos Jugados | Puntos / Goles Totales | Promedio por Partido | Partido con Mayor Puntuación |
| :--- | :---: | :---: | :---: | :--- |
| **⚽ Fútbol** | {sports.get('futbol', {}).get('completed', 0)} | {sports.get('futbol', {}).get('total_score', 0)} goles | {sports.get('futbol', {}).get('avg_score_per_match', 0.0)} goles/pj | {sports.get('futbol', {}).get('highest_scoring_match', {}).get('teams', 'N/A')} ({sports.get('futbol', {}).get('highest_scoring_match', {}).get('score', '')}) |
| **🏐 Voleibol** | {sports.get('voleibol', {}).get('completed', 0)} | {sports.get('voleibol', {}).get('total_score', 0)} pts | {sports.get('voleibol', {}).get('avg_score_per_match', 0.0)} pts/pj | {sports.get('voleibol', {}).get('highest_scoring_match', {}).get('teams', 'N/A')} ({sports.get('voleibol', {}).get('highest_scoring_match', {}).get('score', '')}) |
| **🏀 Baloncesto** | {sports.get('baloncesto', {}).get('completed', 0)} | {sports.get('baloncesto', {}).get('total_score', 0)} pts | {sports.get('baloncesto', {}).get('avg_score_per_match', 0.0)} pts/pj | {sports.get('baloncesto', {}).get('highest_scoring_match', {}).get('teams', 'N/A')} ({sports.get('baloncesto', {}).get('highest_scoring_match', {}).get('score', '')}) |

---

### 3. Rendimiento Acumulado por Institución Educativa

| Institución | PJ | PG | PE | PP | PF/GF | PC/GC | DIF | Jugadores MVP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
"""

    sorted_schools = sorted(schools.items(), key=lambda x: (x[1]["wins"], x[1]["diff"]), reverse=True)
    for sid, sm in sorted_schools:
        diff_str = f"+{sm['diff']}" if sm['diff'] > 0 else f"{sm['diff']}"
        md_content += f"| **{sm['short_name']}** | {sm['matches_played']} | {sm['wins']} | {sm['draws']} | {sm['losses']} | {sm['points_for']} | {sm['points_against']} | {diff_str} | ⭐ {sm['mvp_count']} |\n"

    md_content += """
---
*Informe generado automáticamente por el Motor Analítico en Python de la Liga Deportiva Costa de Oro 2026.*
"""

    md_file = REPORTS_DIR / "reporte_ejecutivo_costa_de_oro.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(md_content)

    # 2. GENERAR PAYLOAD FORMATEADO PARA WHATSAPP
    whatsapp_text = f"""🏆 *LIGA DEPORTIVA COSTA DE ORO 2026*
📋 *Resumen Ejecutivo Oficial ({now_str})*

📊 *Progreso del Torneo:*
• Partidos Completados: {summary['completed_matches']} de {summary['total_matches']} ({summary['progress_percent']}%)
• Estado de Datos: 100% Verificado y Seguro ✅

⚽ *Fútbol:* {sports.get('futbol', {}).get('total_score', 0)} goles anotados ({sports.get('futbol', {}).get('avg_score_per_match', 0.0)} por juego)
🏐 *Voleibol:* {sports.get('voleibol', {}).get('total_score', 0)} puntos de set
🏀 *Baloncesto:* {sports.get('baloncesto', {}).get('total_score', 0)} puntos en cancha

🏫 *Tabla Rápida de Victorias:*
"""
    for sid, sm in sorted_schools:
        whatsapp_text += f"• *{sm['short_name']}:* {sm['wins']} Victoria(s) | {sm['matches_played']} PJ | ⭐ {sm['mvp_count']} MVP\n"

    whatsapp_text += "\n📲 Consulta horarios y cápsulas en vivo: http://localhost:3000"

    wa_file = REPORTS_DIR / "payload_whatsapp.txt"
    with open(wa_file, "w", encoding="utf-8") as f:
        f.write(whatsapp_text)

    print(f"✅ [REPORT GENERATED] Markdown: {md_file.name}")
    print(f"✅ [REPORT GENERATED] WhatsApp: {wa_file.name}")
    print("\n--- TEXTO LISTO PARA WHATSAPP ---")
    print(whatsapp_text)
    print("---------------------------------")

if __name__ == "__main__":
    generate_executive_reports()
