"""
====================================================================
LIGA DEPORTIVA COSTA DE ORO 2026 - PYTHON BACKUP ENGINE
Motor de Respaldo, Persistencia Segura y Exportación Tabular (CSV/JSON)
Curiol Studio • Arquitectura Phygital & Resiliencia
====================================================================
"""

import os
import sys
import json
import csv
import re
from datetime import datetime
from pathlib import Path

# Configurar salida UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Rutas Base del Proyecto
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
BACKUP_DIR = DATA_DIR / "backups"
EXPORT_DIR = DATA_DIR / "exports"

# Asegurar directorios
BACKUP_DIR.mkdir(parents=True, exist_ok=True)
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

# 6 Colegios Oficiales
OFFICIAL_SCHOOLS = [
    {
        "id": "la-paz-cabo-velas",
        "name": "La Paz Cabo Velas",
        "short_name": "La Paz CV",
        "acronym": "LPCV",
        "city": "Brasilito, Cabo Velas",
        "mascot": "Pumas 🐾",
    },
    {
        "id": "la-paz-tempisque",
        "name": "La Paz Tempisque",
        "short_name": "La Paz TP",
        "acronym": "LPTP",
        "city": "Comunidad, Carrillo",
        "mascot": "Tiburones 🦈",
    },
    {
        "id": "cria",
        "name": "Costa Rica International Academy",
        "short_name": "CRIA",
        "acronym": "CRIA",
        "city": "Playa Flamingo",
        "mascot": "CRIA Oficial",
    },
    {
        "id": "journey-school",
        "name": "The Journey School",
        "short_name": "Journey School",
        "acronym": "TJS",
        "city": "Tamarindo",
        "mascot": "The Journey School",
    },
    {
        "id": "vittorino",
        "name": "Instituto Vittorino Prep",
        "short_name": "Vittorino",
        "acronym": "IVP",
        "city": "Huacas",
        "mascot": "Vittorino Prep",
    },
    {
        "id": "educarte",
        "name": "Educarte Bilingual High School",
        "short_name": "Educarte",
        "acronym": "EDU",
        "city": "Tamarindo",
        "mascot": "Educarte High",
    },
]

def load_tournament_matches_from_source():
    """
    Carga los partidos desde el archivo de datos iniciales TypeScript o un snapshot JSON reciente.
    """
    initial_data_path = PROJECT_ROOT / "src" / "lib" / "initialData.ts"
    latest_backup = BACKUP_DIR / "snapshot_latest.json"

    if latest_backup.exists():
        try:
            with open(latest_backup, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "matches" in data and len(data["matches"]) > 0:
                    return data["matches"]
        except Exception as e:
            print(f"[WARN] Error leyendo snapshot_latest.json: {e}")

    # Fallback: Extraer del archivo TypeScript
    if initial_data_path.exists():
        try:
            with open(initial_data_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Extraer objetos de partido mediante regex estructurada
            matches = []
            # Buscar bloques de partido { id: '...', ... }
            match_blocks = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"].*?updatedAt:\s*['\"]([^'\"]+)['\"],?\s*\}", content, re.DOTALL)
            
            for m_id, updated_at in match_blocks:
                # Extraer atributos individuales
                block_match = re.search(r"\{\s*id:\s*['\"]" + re.escape(m_id) + r"['\"].*?\}", content, re.DOTALL)
                if block_match:
                    blk = block_match.group(0)
                    
                    def extract_field(field_name, default=""):
                        m = re.search(rf"{field_name}:\s*['\"]([^'\"]+)['\"]", blk)
                        return m.group(1) if m else default

                    def extract_int(field_name, default=0):
                        m = re.search(rf"{field_name}:\s*(\d+)", blk)
                        return int(m.group(1)) if m else default

                    matches.append({
                        "id": m_id,
                        "jornada": extract_int("jornada", 1),
                        "jornadaName": extract_field("jornadaName", "Jornada Oficial"),
                        "categoryId": extract_field("categoryId", "cat-fem-futbol"),
                        "sport": extract_field("sport", "futbol"),
                        "date": extract_field("date", "2026-10-05"),
                        "time": extract_field("time", "13:30"),
                        "venue": extract_field("venue", "Campus Oficial"),
                        "homeTeamId": extract_field("homeTeamId"),
                        "awayTeamId": extract_field("awayTeamId"),
                        "homeScore": extract_int("homeScore", 0),
                        "awayScore": extract_int("awayScore", 0),
                        "status": extract_field("status", "scheduled"),
                        "currentPeriod": extract_field("currentPeriod", "Finalizado"),
                        "mvpPlayerName": extract_field("mvpPlayerName"),
                        "mvpSchoolId": extract_field("mvpSchoolId"),
                        "notes": extract_field("notes"),
                        "updatedAt": updated_at,
                    })

            if len(matches) > 0:
                return matches
        except Exception as e:
            print(f"[WARN] Error parseando initialData.ts: {e}")

    return []

def create_full_backup():
    """
    Crea un snapshot completo e inmutable en JSON y exporta tablas CSV.
    """
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    matches = load_tournament_matches_from_source()

    snapshot_data = {
        "metadata": {
            "tournamentId": "costa-de-oro-2026",
            "tournamentName": "Liga Deportiva Costa de Oro 2026",
            "createdAt": datetime.now().isoformat(),
            "totalSchools": len(OFFICIAL_SCHOOLS),
            "totalMatches": len(matches),
            "backupEngineVersion": "2.0.0-py",
        },
        "schools": OFFICIAL_SCHOOLS,
        "matches": matches,
    }

    # 1. Guardar Snapshot con Timestamp
    timestamp_file = BACKUP_DIR / f"snapshot_{timestamp_str}.json"
    with open(timestamp_file, "w", encoding="utf-8") as f:
        json.dump(snapshot_data, f, indent=2, ensure_ascii=False)

    # 2. Guardar Snapshot 'Latest'
    latest_file = BACKUP_DIR / "snapshot_latest.json"
    with open(latest_file, "w", encoding="utf-8") as f:
        json.dump(snapshot_data, f, indent=2, ensure_ascii=False)

    # 3. Exportar Partidos a CSV
    csv_matches_file = EXPORT_DIR / "partidos_costa_de_oro.csv"
    with open(csv_matches_file, "w", newline="", encoding="utf-8-sig") as f:
        fieldnames = [
            "id", "jornada", "jornadaName", "sport", "categoryId", "date", "time",
            "venue", "homeTeamId", "awayTeamId", "homeScore", "awayScore",
            "status", "currentPeriod", "mvpPlayerName", "notes", "updatedAt"
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for m in matches:
            writer.writerow(m)

    # 4. Exportar Colegios a CSV
    csv_schools_file = EXPORT_DIR / "colegios_participantes.csv"
    with open(csv_schools_file, "w", newline="", encoding="utf-8-sig") as f:
        fieldnames = ["id", "name", "short_name", "acronym", "city", "mascot"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for s in OFFICIAL_SCHOOLS:
            writer.writerow(s)

    print(f"✅ [BACKUP SUCCESS] Snapshot creado: {timestamp_file.name}")
    print(f"✅ [BACKUP SUCCESS] Latest actualizado: {latest_file.name}")
    print(f"✅ [EXPORT SUCCESS] CSV Partidos: {csv_matches_file.name} ({len(matches)} filas)")
    print(f"✅ [EXPORT SUCCESS] CSV Colegios: {csv_schools_file.name} ({len(OFFICIAL_SCHOOLS)} filas)")

    return snapshot_data

if __name__ == "__main__":
    create_full_backup()
