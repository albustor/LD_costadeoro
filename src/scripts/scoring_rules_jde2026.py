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
    Si el partido ya fue disputado en cancha (completed + Finalizado + marcador > 0 sin walkover),
    es un partido válido aunque sus notas históricas mencionen que fue reprogramado.
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

    home_score = match.get("homeScore", 0) or 0
    away_score = match.get("awayScore", 0) or 0
    home_sets = match.get("homeSetsWon", 0) or 0
    away_sets = match.get("awaySetsWon", 0) or 0
    if status == "completed" and current_period == "Finalizado" and (
        home_score > 0 or away_score > 0 or home_sets > 0 or away_sets > 0
    ):
        return False

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

            if sport == "voleibol":
                # En voleibol: si existe setScores, sumar los puntos reales de cada set para PF/PC y pointsRatio
                set_scores = match.get("setScores")
                if isinstance(set_scores, list) and len(set_scores) > 0:
                    pts_home = sum(int(s.get("home", 0) or 0) for s in set_scores if isinstance(s, dict))
                    pts_away = sum(int(s.get("away", 0) or 0) for s in set_scores if isinstance(s, dict))
                    home.pointsFor += pts_home
                    home.pointsAgainst += pts_away
                    away.pointsFor += pts_away
                    away.pointsAgainst += pts_home
                else:
                    home.pointsFor += home_score
                    home.pointsAgainst += away_score
                    away.pointsFor += away_score
                    away.pointsAgainst += home_score
            else:
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
                raw_home_sets = match.get("homeSetsWon")
                raw_away_sets = match.get("awaySetsWon")
                home_sets = int(raw_home_sets) if raw_home_sets is not None else int(home_score)
                away_sets = int(raw_away_sets) if raw_away_sets is not None else int(away_score)

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

        # Resolver serie particular acumulada (Head-to-Head multi-jornada) si hay empate en fútbol o baloncesto
        if sport in ("futbol", "baloncesto") and len(rows) > 1:
            for _pass in range(len(rows)):
                for i in range(len(rows) - 1):
                    a = rows[i]
                    b = rows[i + 1]
                    if a.points == b.points and a.won == b.won and a.diff == b.diff and a.pointsFor == b.pointsFor:
                        h2h_matches = [
                            m for m in category_matches
                            if not is_rescheduled_match(m) and (
                                (m.get("homeTeamId") == a.teamId and m.get("awayTeamId") == b.teamId) or
                                (m.get("homeTeamId") == b.teamId and m.get("awayTeamId") == a.teamId)
                            )
                        ]
                        if h2h_matches:
                            a_h2h_pts, b_h2h_pts = 0, 0
                            a_h2h_for, b_h2h_for = 0, 0
                            for hm in h2h_matches:
                                hs = hm.get("homeScore", 0) or 0
                                aws = hm.get("awayScore", 0) or 0
                                a_sc = hs if hm.get("homeTeamId") == a.teamId else aws
                                b_sc = hs if hm.get("homeTeamId") == b.teamId else aws
                                a_h2h_for += a_sc
                                b_h2h_for += b_sc
                                if a_sc > b_sc:
                                    a_h2h_pts += 3 if sport == "futbol" else 2
                                    b_h2h_pts += 0 if sport == "futbol" else 1
                                elif b_sc > a_sc:
                                    b_h2h_pts += 3 if sport == "futbol" else 2
                                    a_h2h_pts += 0 if sport == "futbol" else 1
                                else:
                                    a_h2h_pts += 1
                                    b_h2h_pts += 1

                            if (b_h2h_pts, b_h2h_for - a_h2h_for) > (a_h2h_pts, a_h2h_for - b_h2h_for):
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

    def calculate_statistics(
        self,
        matches: List[Dict[str, Any]],
        standings_by_cat: Optional[Dict[str, List[Dict[str, Any]]]] = None,
    ) -> Dict[str, Any]:
        """
        Calcula de forma 100% determinista las estadísticas globales, por jornada y por categoría.
        Cero cálculo aritmético en el navegador.
        """
        if standings_by_cat is None:
            standings_by_cat = self.calculate_all(matches)

        total_matches = len(matches)
        completed_valid = [m for m in matches if m.get("status") == "completed" and not is_rescheduled_match(m)]
        live_matches = [m for m in matches if m.get("status") == "live"]
        postponed_matches = [m for m in matches if is_rescheduled_match(m)]
        scheduled_matches = [
            m for m in matches
            if m.get("status") == "scheduled" and not is_rescheduled_match(m)
        ]

        total_goals_futbol = sum(
            (m.get("homeScore", 0) or 0) + (m.get("awayScore", 0) or 0)
            for m in completed_valid if m.get("sport") == "futbol"
        )
        total_sets_voleibol = sum(
            (m.get("homeSetsWon") if m.get("homeSetsWon") is not None else (m.get("homeScore", 0) or 0)) +
            (m.get("awaySetsWon") if m.get("awaySetsWon") is not None else (m.get("awayScore", 0) or 0))
            for m in completed_valid if m.get("sport") == "voleibol"
        )
        total_points_baloncesto = sum(
            (m.get("homeScore", 0) or 0) + (m.get("awayScore", 0) or 0)
            for m in completed_valid if m.get("sport") == "baloncesto"
        )

        # Resumen por Jornada (Jornadas 1, 2 y 3)
        jornadas_summary: Dict[str, Dict[str, Any]] = {}
        for j_num in (1, 2, 3):
            j_matches = [m for m in matches if int(m.get("jornada", 1) or 1) == j_num]
            j_comp = [m for m in j_matches if m.get("status") == "completed" and not is_rescheduled_match(m)]
            j_post = [m for m in j_matches if is_rescheduled_match(m)]
            j_sched = [m for m in j_matches if m.get("status") == "scheduled" and not is_rescheduled_match(m)]
            j_total = len(j_matches)
            pct = round((len(j_comp) / j_total) * 100, 1) if j_total > 0 else 0.0
            jornadas_summary[f"jornada_{j_num}"] = {
                "jornada": j_num,
                "total_matches": j_total,
                "completed_matches": len(j_comp),
                "scheduled_matches": len(j_sched),
                "postponed_matches": len(j_post),
                "completion_pct": pct,
            }

        # Métricas por categoría
        category_metrics: Dict[str, Dict[str, Any]] = {}
        for cat_id, sport in CATEGORY_SPORTS.items():
            c_matches = [m for m in matches if m.get("categoryId") == cat_id]
            c_comp = [m for m in c_matches if m.get("status") == "completed" and not is_rescheduled_match(m)]
            c_sched = [m for m in c_matches if m.get("status") == "scheduled" and not is_rescheduled_match(m)]
            c_post = [m for m in c_matches if is_rescheduled_match(m)]

            if sport == "voleibol":
                total_scored = sum(
                    (m.get("homeSetsWon") if m.get("homeSetsWon") is not None else (m.get("homeScore", 0) or 0)) +
                    (m.get("awaySetsWon") if m.get("awaySetsWon") is not None else (m.get("awayScore", 0) or 0))
                    for m in c_comp
                )
                unit_label = "sets"
            elif sport == "futbol":
                total_scored = sum((m.get("homeScore", 0) or 0) + (m.get("awayScore", 0) or 0) for m in c_comp)
                unit_label = "goles"
            else:
                total_scored = sum((m.get("homeScore", 0) or 0) + (m.get("awayScore", 0) or 0) for m in c_comp)
                unit_label = "puntos"

            avg_per_match = round(total_scored / len(c_comp), 2) if len(c_comp) > 0 else 0.0

            rows = standings_by_cat.get(cat_id, [])
            active_rows = [r for r in rows if (r.get("played", 0) or 0) > 0]
            leader = rows[0]["school"]["shortName"] if rows else None
            top_offense = None
            if active_rows:
                if sport == "voleibol":
                    best_off = max(active_rows, key=lambda r: (r.get("setsWon", 0) or 0, r.get("pointsFor", 0) or 0))
                else:
                    best_off = max(active_rows, key=lambda r: r.get("pointsFor", 0) or 0)
                top_offense = best_off["school"]["shortName"]

            category_metrics[cat_id] = {
                "categoryId": cat_id,
                "sport": sport,
                "total_matches": len(c_matches),
                "completed_matches": len(c_comp),
                "scheduled_matches": len(c_sched),
                "postponed_matches": len(c_post),
                "total_scored": total_scored,
                "unit_label": unit_label,
                "avg_per_match": avg_per_match,
                "leader_school": leader,
                "top_offense_school": top_offense,
            }

        return {
            "global_summary": {
                "total_matches": total_matches,
                "completed_matches": len(completed_valid),
                "live_matches": len(live_matches),
                "scheduled_matches": len(scheduled_matches),
                "postponed_matches": len(postponed_matches),
                "total_goals_futbol": total_goals_futbol,
                "total_sets_voleibol": total_sets_voleibol,
                "total_points_baloncesto": total_points_baloncesto,
            },
            "jornadas_summary": jornadas_summary,
            "category_metrics": category_metrics,
        }
