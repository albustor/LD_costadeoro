"""
scoring_rules_jde2026.py
Motor Canónico Determinista de Clasificaciones Deportivas
Liga Costa de Oro 2026 (MEP - ICODER - FECOVOL - FECOBA - FEDEFUTBOL)
Curiol Studio · Cero Alucinación Aritmética
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field, asdict
import json
import math

OFFICIAL_SCHOOLS = [
    {
        "id": "la-paz-cabo-velas",
        "name": "La Paz Community School Cabo Velas",
        "shortName": "La Paz Cabo Velas",
        "acronym": "LPCV",
        "logo": "🌊",
        "primaryColor": "#0284c7",
        "secondaryColor": "#0369a1",
        "location": "Brasilito, Cabo Velas",
        "city": "Santa Cruz, Guanacaste",
    },
    {
        "id": "la-paz-tempisque",
        "name": "La Paz Community School Tempisque",
        "shortName": "La Paz Tempisque",
        "acronym": "LPTP",
        "logo": "🌿",
        "primaryColor": "#059669",
        "secondaryColor": "#047857",
        "location": "Comunidad, Carrillo",
        "city": "Guanacaste",
    },
    {
        "id": "cria",
        "name": "Costa Rica International Academy",
        "shortName": "CRIA",
        "acronym": "CRIA",
        "logo": "🦅",
        "primaryColor": "#b91c1c",
        "secondaryColor": "#991b1b",
        "location": "Playa Flamingo",
        "city": "Santa Cruz, Guanacaste",
    },
    {
        "id": "journey-school",
        "name": "The Journey School",
        "shortName": "Journey School",
        "acronym": "TJS",
        "logo": "🧭",
        "primaryColor": "#d97706",
        "secondaryColor": "#b45309",
        "location": "Tamarindo",
        "city": "Santa Cruz, Guanacaste",
    },
    {
        "id": "vittorino",
        "name": "Centro Educativo Católico Monseñor Vittorino Girardi Stellin",
        "shortName": "Monseñor Vittorino",
        "acronym": "VIT",
        "logo": "🛡️",
        "primaryColor": "#0284c7",
        "secondaryColor": "#0369a1",
        "location": "Huacas",
        "city": "Santa Cruz, Guanacaste",
    },
    {
        "id": "educarte",
        "name": "Educarte Bilingual High School",
        "shortName": "Educarte",
        "acronym": "EDU",
        "logo": "☀️",
        "primaryColor": "#e11d48",
        "secondaryColor": "#be123c",
        "location": "Tamarindo",
        "city": "Santa Cruz, Guanacaste",
    },
]

OFFICIAL_CATEGORY_TEAMS = {
    "cat-c-voleibol": ["la-paz-cabo-velas", "educarte", "vittorino", "la-paz-tempisque"],
    "cat-d-voleibol": ["la-paz-cabo-velas", "vittorino"],
    "cat-fem-futbol": ["la-paz-cabo-velas", "cria", "la-paz-tempisque", "vittorino"],
    "cat-c-futbol": ["la-paz-cabo-velas", "la-paz-tempisque", "cria", "vittorino", "journey-school"],
    "cat-d-futbol": ["cria", "la-paz-cabo-velas", "la-paz-tempisque", "vittorino"],
    "cat-c-baloncesto": ["la-paz-cabo-velas", "la-paz-tempisque", "educarte"],
    "cat-d-baloncesto": ["journey-school", "la-paz-tempisque", "cria", "la-paz-cabo-velas"],
}

CATEGORY_SPORTS = {
    "cat-fem-futbol": "futbol",
    "cat-c-futbol": "futbol",
    "cat-d-futbol": "futbol",
    "cat-c-voleibol": "voleibol",
    "cat-d-voleibol": "voleibol",
    "cat-c-baloncesto": "baloncesto",
    "cat-d-baloncesto": "baloncesto",
}

@dataclass
class StandingRow:
    teamId: str
    school: Dict[str, Any]
    played: int = 0
    won: int = 0
    drawn: int = 0
    lost: int = 0
    pointsFor: int = 0
    pointsAgainst: int = 0
    diff: int = 0
    points: int = 0
    setsWon: Optional[int] = None
    setsLost: Optional[int] = None
    setsDiff: Optional[int] = None
    setsRatio: Optional[float] = None
    pointsRatio: Optional[float] = None
    form: List[str] = field(default_factory=list)
    position: int = 0

def is_rescheduled_match(match: Dict[str, Any]) -> bool:
    """
    Detecta si un partido está en condición de no presentación o reprogramación oficial.
    Regla Sagrada Costa de Oro: Cero puntos a ambos equipos y cero partidos jugados.
    """
    if not match:
        return False
    status = match.get("status", "")
    if status in ("postponed", "reprogramado"):
        return True
    current_period = match.get("currentPeriod", "")
    if current_period in ("Por reprogramar", "Reprogramado"):
        return True
    walkover = match.get("walkover")
    if walkover and walkover != "none":
        return True
    notes = (match.get("notes") or "").lower()
    for kw in ["reprogram", "no se presentó", "incomparecencia", "ausencia"]:
        if kw in notes:
            return True
    return False

class CostaDeOroCalculator:
    def __init__(self, schools: Optional[List[Dict[str, Any]]] = None):
        self.schools = schools or OFFICIAL_SCHOOLS
        self.schools_by_id = {s["id"]: s for s in self.schools}

    def calculate_category_standings(
        self,
        category_id: str,
        sport: str,
        matches: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        # Filtro de partidos válidos para la categoría
        category_matches = [
            m for m in matches
            if m.get("categoryId") == category_id and m.get("status") in ("completed", "live", "postponed", "reprogramado")
        ]

        # Colegios participantes
        official_ids = OFFICIAL_CATEGORY_TEAMS.get(category_id, [])
        participating_ids = set(official_ids)
        for m in matches:
            if m.get("categoryId") == category_id:
                participating_ids.add(m.get("homeTeamId"))
                participating_ids.add(m.get("awayTeamId"))

        participating_schools = [
            self.schools_by_id[sid]
            for sid in participating_ids
            if sid in self.schools_by_id
        ]

        standings_map: Dict[str, StandingRow] = {}
        for s in participating_schools:
            standings_map[s["id"]] = StandingRow(
                teamId=s["id"],
                school=s,
                setsWon=0 if sport == "voleibol" else None,
                setsLost=0 if sport == "voleibol" else None,
                setsDiff=0 if sport == "voleibol" else None,
            )

        # Ordenar cronológicamente para la racha (form)
        def get_match_timestamp(m):
            date_str = m.get("date", "2026-01-01")
            time_str = m.get("time", "00:00")
            if len(time_str) == 5:
                time_str = f"{time_str}:00"
            return f"{date_str}T{time_str}"

        sorted_matches = sorted(category_matches, key=get_match_timestamp)

        for match in sorted_matches:
            home_id = match.get("homeTeamId")
            away_id = match.get("awayTeamId")
            if home_id not in standings_map or away_id not in standings_map:
                continue

            # Regla de no presentación / reprogramación (Anti-Walkover)
            if is_rescheduled_match(match):
                continue

            home = standings_map[home_id]
            away = standings_map[away_id]

            home_score = match.get("homeScore", 0) or 0
            away_score = match.get("awayScore", 0) or 0

            home.played += 1
            away.played += 1
            home.pointsFor += home_score
            home.pointsAgainst += away_score
            away.pointsFor += away_score
            away.pointsAgainst += home_score

            if sport == "futbol":
                # Normativa Fútbol MEP: Victoria = 3, Empate = 1, Derrota = 0
                if home_score > away_score:
                    home.won += 1
                    home.points += 3
                    home.form.append("W")
                    away.lost += 1
                    away.form.append("L")
                elif home_score < away_score:
                    away.won += 1
                    away.points += 3
                    away.form.append("W")
                    home.lost += 1
                    home.form.append("L")
                else:
                    home.drawn += 1
                    home.points += 1
                    home.form.append("D")
                    away.drawn += 1
                    away.points += 1
                    away.form.append("D")

            elif sport == "baloncesto":
                # Normativa Baloncesto FIBA / MEP: Victoria = 2, Derrota = 1
                if home_score > away_score:
                    home.won += 1
                    home.points += 2
                    home.form.append("W")
                    away.lost += 1
                    away.points += 1
                    away.form.append("L")
                elif home_score < away_score:
                    away.won += 1
                    away.points += 2
                    away.form.append("W")
                    home.lost += 1
                    home.points += 1
                    home.form.append("L")

            elif sport == "voleibol":
                home_sets = match.get("homeSetsWon", 0) or 0
                away_sets = match.get("awaySetsWon", 0) or 0

                if home.setsWon is not None:
                    home.setsWon += home_sets
                if home.setsLost is not None:
                    home.setsLost += away_sets
                if away.setsWon is not None:
                    away.setsWon += away_sets
                if away.setsLost is not None:
                    away.setsLost += home_sets

                is_five_sets = (home_sets == 3 or away_sets == 3)

                if home_sets > away_sets:
                    home.won += 1
                    home.form.append("W")
                    away.lost += 1
                    away.form.append("L")

                    if is_five_sets:
                        # MEP Art 77.4 (3 de 5 sets): 3-0: 5pts | 3-1: 4pts/1pt | 3-2: 3pts/2pts
                        if away_sets == 0:
                            home.points += 5
                            away.points += 0
                        elif away_sets == 1:
                            home.points += 4
                            away.points += 1
                        else:
                            home.points += 3
                            away.points += 2
                    else:
                        # MEP Art 77.4 (2 de 3 sets): 2-0: 3pts/0pts | 2-1: 2pts/1pt
                        if away_sets == 1:
                            home.points += 2
                            away.points += 1
                        else:
                            home.points += 3
                            away.points += 0
                elif away_sets > home_sets:
                    away.won += 1
                    away.form.append("W")
                    home.lost += 1
                    home.form.append("L")

                    if is_five_sets:
                        if home_sets == 0:
                            away.points += 5
                            home.points += 0
                        elif home_sets == 1:
                            away.points += 4
                            home.points += 1
                        else:
                            away.points += 3
                            home.points += 2
                    else:
                        if home_sets == 1:
                            away.points += 2
                            home.points += 1
                        else:
                            away.points += 3
                            home.points += 0

        # Calcular diferenciales y ratios oficiales
        rows: List[StandingRow] = []
        for row in standings_map.values():
            row.diff = row.pointsFor - row.pointsAgainst
            if row.setsWon is not None and row.setsLost is not None:
                row.setsDiff = row.setsWon - row.setsLost
                row.setsRatio = round(row.setsWon / max(row.setsLost, 1), 4)
            row.pointsRatio = round(row.pointsFor / max(row.pointsAgainst, 1), 4)
            row.form = row.form[-5:]
            rows.append(row)

        # Criterios Oficiales de Desempate (MEP - ICODER 2026)
        def tiebreaker_key(r: StandingRow):
            # Mayor puntuación
            score_pts = r.points
            # Mayor partidos ganados (PG)
            score_won = r.won

            # A. Voleibol
            if sport == "voleibol":
                # Protección 0 PJ: Si tiene 0 puntos y 0 PJ, no debe saltar sobre quien jugó y perdió
                played_factor = 1 if r.played > 0 else (0 if r.points > 0 else -1)
                pts_ratio = r.pointsRatio or 0.0
                sets_ratio = r.setsRatio or 0.0
                sets_diff = r.setsDiff or 0
                return (score_pts, score_won, played_factor, pts_ratio, sets_ratio, sets_diff)

            # B. Baloncesto
            if sport == "baloncesto":
                return (score_pts, score_won, r.diff, r.pointsFor)

            # C. Fútbol
            # Mayor Gol Diferencia (GD), Mayor Goles a Favor (GF), Menor Goles en Contra
            return (score_pts, score_won, r.diff, r.pointsFor, -r.pointsAgainst)

        # Ordenar de mayor a menor
        rows.sort(key=tiebreaker_key, reverse=True)

        # Resolver enfrentamiento particular si hay empate exacto en fútbol o baloncesto
        if sport in ("futbol", "baloncesto") and len(rows) > 1:
            for i in range(len(rows) - 1):
                a = rows[i]
                b = rows[i + 1]
                if a.points == b.points and a.won == b.won and a.diff == b.diff and a.pointsFor == b.pointsFor:
                    # Buscar enfrentamiento directo
                    h2h = next(
                        (
                            m for m in category_matches
                            if (m.get("homeTeamId") == a.teamId and m.get("awayTeamId") == b.teamId) or
                               (m.get("homeTeamId") == b.teamId and m.get("awayTeamId") == a.teamId)
                        ),
                        None
                    )
                    if h2h and not is_rescheduled_match(h2h):
                        a_score = h2h.get("homeScore", 0) if h2h.get("homeTeamId") == a.teamId else h2h.get("awayScore", 0)
                        b_score = h2h.get("homeScore", 0) if h2h.get("homeTeamId") == b.teamId else h2h.get("awayScore", 0)
                        if b_score > a_score:
                            # Invertir posiciones
                            rows[i], rows[i + 1] = rows[i + 1], rows[i]

        # Asignar posición 1-indexed
        output: List[Dict[str, Any]] = []
        for idx, item in enumerate(rows):
            item.position = idx + 1
            output.append(asdict(item))

        return output

    def calculate_all(self, matches: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        result: Dict[str, List[Dict[str, Any]]] = {}
        for cat_id, sport in CATEGORY_SPORTS.items():
            result[cat_id] = self.calculate_category_standings(cat_id, sport, matches)
        return result
