"""
sport_scoring_strategies.py
Arquitectura SOLID (SRP + OCP + LSP + DIP) para Reglas Deportivas MEP-ICODER 2026
Liga Costa de Oro 2026 · Curiol Studio

Cada disciplina deportiva encapsula su propia lógica de puntuación, acumulación de puntos/sets
y clave de desempate bajo un contrato común (Protocolo ISportScoringStrategy), permitiendo
extender deportes (OCP) e intercambiarlos (LSP) sin modificar el motor central.
"""

from typing import Dict, Any, Tuple, Protocol

class ISportScoringStrategy(Protocol):
    """Contrato base (LSP + ISP) para cualquier disciplina deportiva."""
    sport_id: str
    unit_label: str

    def apply_match_result(self, home_row: Any, away_row: Any, match: Dict[str, Any]) -> None:
        ...

    def tiebreaker_key(self, row: Any) -> Tuple[Any, ...]:
        ...

    def match_total_scored(self, match: Dict[str, Any]) -> int:
        ...


class FutbolScoringStrategy:
    """Fútbol Reglamentario MEP: Victoria = 3 pts, Empate = 1 pt, Derrota = 0 pts."""
    sport_id = "futbol"
    unit_label = "goles"

    def apply_match_result(self, home_row: Any, away_row: Any, match: Dict[str, Any]) -> None:
        home_score = int(match.get("homeScore", 0) or 0)
        away_score = int(match.get("awayScore", 0) or 0)

        home_row.pointsFor += home_score
        home_row.pointsAgainst += away_score
        away_row.pointsFor += away_score
        away_row.pointsAgainst += home_score

        if home_score > away_score:
            home_row.won += 1
            home_row.points += 3
            home_row.form.append("W")
            away_row.lost += 1
            away_row.form.append("L")
        elif home_score < away_score:
            away_row.won += 1
            away_row.points += 3
            away_row.form.append("W")
            home_row.lost += 1
            home_row.form.append("L")
        else:
            home_row.drawn += 1
            home_row.points += 1
            home_row.form.append("D")
            away_row.drawn += 1
            away_row.points += 1
            away_row.form.append("D")

    def tiebreaker_key(self, row: Any) -> Tuple[Any, ...]:
        return (row.points, row.won, row.diff, row.pointsFor, -row.pointsAgainst)

    def match_total_scored(self, match: Dict[str, Any]) -> int:
        return int(match.get("homeScore", 0) or 0) + int(match.get("awayScore", 0) or 0)


class BaloncestoScoringStrategy:
    """Baloncesto FIBA / MEP: Victoria = 2 pts, Derrota disputada en cancha = 1 pt."""
    sport_id = "baloncesto"
    unit_label = "puntos"

    def apply_match_result(self, home_row: Any, away_row: Any, match: Dict[str, Any]) -> None:
        home_score = int(match.get("homeScore", 0) or 0)
        away_score = int(match.get("awayScore", 0) or 0)

        home_row.pointsFor += home_score
        home_row.pointsAgainst += away_score
        away_row.pointsFor += away_score
        away_row.pointsAgainst += home_score

        if home_score > away_score:
            home_row.won += 1
            home_row.points += 2
            home_row.form.append("W")
            away_row.lost += 1
            away_row.points += 1
            away_row.form.append("L")
        elif home_score < away_score:
            away_row.won += 1
            away_row.points += 2
            away_row.form.append("W")
            home_row.lost += 1
            home_row.points += 1
            home_row.form.append("L")

    def tiebreaker_key(self, row: Any) -> Tuple[Any, ...]:
        return (row.points, row.won, row.diff, row.pointsFor)

    def match_total_scored(self, match: Dict[str, Any]) -> int:
        return int(match.get("homeScore", 0) or 0) + int(match.get("awayScore", 0) or 0)


class VoleibolScoringStrategy:
    """Voleibol FECOVOL / MEP Art 77.4: Marcador principal en SETS GANADOS (2-de-3 o 3-de-5)."""
    sport_id = "voleibol"
    unit_label = "sets"

    def apply_match_result(self, home_row: Any, away_row: Any, match: Dict[str, Any]) -> None:
        home_score = int(match.get("homeScore", 0) or 0)
        away_score = int(match.get("awayScore", 0) or 0)

        set_scores = match.get("setScores")
        if isinstance(set_scores, list) and len(set_scores) > 0:
            pts_home = sum(int(s.get("home", 0) or 0) for s in set_scores if isinstance(s, dict))
            pts_away = sum(int(s.get("away", 0) or 0) for s in set_scores if isinstance(s, dict))
            home_row.pointsFor += pts_home
            home_row.pointsAgainst += pts_away
            away_row.pointsFor += pts_away
            away_row.pointsAgainst += pts_home
        else:
            home_row.pointsFor += home_score
            home_row.pointsAgainst += away_score
            away_row.pointsFor += away_score
            away_row.pointsAgainst += home_score

        raw_home_sets = match.get("homeSetsWon")
        raw_away_sets = match.get("awaySetsWon")
        home_sets = int(raw_home_sets) if raw_home_sets is not None else home_score
        away_sets = int(raw_away_sets) if raw_away_sets is not None else away_score

        if home_row.setsWon is not None:
            home_row.setsWon += home_sets
        if home_row.setsLost is not None:
            home_row.setsLost += away_sets
        if away_row.setsWon is not None:
            away_row.setsWon += away_sets
        if away_row.setsLost is not None:
            away_row.setsLost += home_sets

        is_five_sets = (home_sets == 3 or away_sets == 3)

        if home_sets > away_sets:
            home_row.won += 1
            home_row.form.append("W")
            away_row.lost += 1
            away_row.form.append("L")
            win_pts, loss_pts = self._compute_set_points(away_sets, is_five_sets)
            home_row.points += win_pts
            away_row.points += loss_pts
        elif away_sets > home_sets:
            away_row.won += 1
            away_row.form.append("W")
            home_row.lost += 1
            home_row.form.append("L")
            win_pts, loss_pts = self._compute_set_points(home_sets, is_five_sets)
            away_row.points += win_pts
            home_row.points += loss_pts

    @staticmethod
    def _compute_set_points(loser_sets: int, is_five_sets: bool) -> Tuple[int, int]:
        if is_five_sets:
            if loser_sets == 0:
                return (5, 0)
            if loser_sets == 1:
                return (4, 1)
            return (3, 2)
        else:
            if loser_sets == 1:
                return (2, 1)
            return (3, 0)

    def tiebreaker_key(self, row: Any) -> Tuple[Any, ...]:
        played_factor = 1 if row.played > 0 else (0 if row.points > 0 else -1)
        pts_ratio = row.pointsRatio or 0.0
        sets_ratio = row.setsRatio or 0.0
        sets_diff = row.setsDiff or 0
        return (row.points, row.won, played_factor, pts_ratio, sets_ratio, sets_diff)

    def match_total_scored(self, match: Dict[str, Any]) -> int:
        hs = match.get("homeSetsWon") if match.get("homeSetsWon") is not None else (match.get("homeScore", 0) or 0)
        as_ = match.get("awaySetsWon") if match.get("awaySetsWon") is not None else (match.get("awayScore", 0) or 0)
        return int(hs) + int(as_)


SPORT_STRATEGIES: Dict[str, ISportScoringStrategy] = {
    "futbol": FutbolScoringStrategy(),
    "baloncesto": BaloncestoScoringStrategy(),
    "voleibol": VoleibolScoringStrategy(),
}


def get_sport_strategy(sport: str) -> ISportScoringStrategy:
    """Obtiene la estrategia SOLID correspondiente al deporte (DIP)."""
    return SPORT_STRATEGIES.get(sport, SPORT_STRATEGIES["futbol"])
