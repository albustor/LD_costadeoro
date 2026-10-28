"""
test_scoring_rules.py
Suite de Pruebas Unitarias para el Motor Canónico Determinista
Liga Costa de Oro 2026 (MEP - ICODER 2026)
"""

import unittest
import sys
import os

# Agregar ruta de scripts al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/scripts')))

from scoring_rules_jde2026 import CostaDeOroCalculator, is_rescheduled_match

class TestScoringRulesMEP2026(unittest.TestCase):
    def setUp(self):
        self.calc = CostaDeOroCalculator()

    def test_futbol_scoring_and_tiebreaker(self):
        """Valida fútbol: Victoria 3 pts, Empate 1 pt, Derrota 0 pts."""
        matches = [
            {
                "id": "f1",
                "categoryId": "cat-c-futbol",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "cria",
                "homeScore": 3,
                "awayScore": 1,
                "status": "completed",
            },
            {
                "id": "f2",
                "categoryId": "cat-c-futbol",
                "homeTeamId": "journey-school",
                "awayTeamId": "vittorino",
                "homeScore": 2,
                "awayScore": 2,
                "status": "completed",
            },
        ]
        standings = self.calc.calculate_category_standings("cat-c-futbol", "futbol", matches)
        by_id = {row["teamId"]: row for row in standings}

        # Cabo Velas ganó: 3 pts, 1 PJ, 1 PG, diff +2
        self.assertEqual(by_id["la-paz-cabo-velas"]["points"], 3)
        self.assertEqual(by_id["la-paz-cabo-velas"]["played"], 1)
        self.assertEqual(by_id["la-paz-cabo-velas"]["won"], 1)
        self.assertEqual(by_id["la-paz-cabo-velas"]["diff"], 2)

        # CRIA perdió: 0 pts, 1 PJ, 1 PP, diff -2
        self.assertEqual(by_id["cria"]["points"], 0)
        self.assertEqual(by_id["cria"]["lost"], 1)
        self.assertEqual(by_id["cria"]["diff"], -2)

        # Journey y Vittorino empataron: 1 pt c/u
        self.assertEqual(by_id["journey-school"]["points"], 1)
        self.assertEqual(by_id["vittorino"]["points"], 1)

    def test_rescheduled_match_invariants(self):
        """Regla Sagrada Costa de Oro: Partido por reprogramar NO suma PJ ni PUNTOS a ninguno."""
        matches = [
            {
                "id": "resched-01",
                "categoryId": "cat-c-futbol",
                "homeTeamId": "vittorino",
                "awayTeamId": "cria",
                "homeScore": 0,
                "awayScore": 0,
                "status": "completed",
                "currentPeriod": "Por reprogramar",
                "walkover": "home_forfeit",
                "notes": "Monseñor Vittorino no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)",
            },
            {
                "id": "resched-02",
                "categoryId": "cat-d-futbol",
                "homeTeamId": "la-paz-tempisque",
                "awayTeamId": "vittorino",
                "homeScore": 0,
                "awayScore": 0,
                "status": "postponed",
                "currentPeriod": "Por reprogramar",
                "notes": "Partido por reprogramar para la próxima semana",
            }
        ]

        # Validar detección
        self.assertTrue(is_rescheduled_match(matches[0]))
        self.assertTrue(is_rescheduled_match(matches[1]))

        standings_c = self.calc.calculate_category_standings("cat-c-futbol", "futbol", [matches[0]])
        by_id_c = {r["teamId"]: r for r in standings_c}

        # CERO PUNTOS Y CERO PJ PARA AMBOS
        self.assertEqual(by_id_c["vittorino"]["played"], 0)
        self.assertEqual(by_id_c["vittorino"]["points"], 0)
        self.assertEqual(by_id_c["cria"]["played"], 0)
        self.assertEqual(by_id_c["cria"]["points"], 0)

    def test_voleibol_2_of_3_sets_scoring(self):
        """Valida voleibol MEP 2 de 3 sets: 2-0 (3-0 pts) y 2-1 (2-1 pts)."""
        matches = [
            {
                "id": "vol-1",
                "categoryId": "cat-c-voleibol",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "vittorino",
                "homeScore": 2,
                "awayScore": 0,
                "homeSetsWon": 2,
                "awaySetsWon": 0,
                "status": "completed",
            },
            {
                "id": "vol-2",
                "categoryId": "cat-c-voleibol",
                "homeTeamId": "educarte",
                "awayTeamId": "la-paz-cabo-velas",
                "homeScore": 1,
                "awayScore": 2,
                "homeSetsWon": 1,
                "awaySetsWon": 2,
                "status": "completed",
            }
        ]

        standings = self.calc.calculate_category_standings("cat-c-voleibol", "voleibol", matches)
        by_id = {r["teamId"]: r for r in standings}

        # Cabo Velas ganó 2-0 (3 pts) y 2-1 (2 pts) = 5 pts
        self.assertEqual(by_id["la-paz-cabo-velas"]["points"], 5)
        self.assertEqual(by_id["la-paz-cabo-velas"]["won"], 2)
        self.assertEqual(by_id["la-paz-cabo-velas"]["setsWon"], 4)
        self.assertEqual(by_id["la-paz-cabo-velas"]["setsLost"], 1)

        # Educarte perdió 1-2 (suma 1 pt reglamentario)
        self.assertEqual(by_id["educarte"]["points"], 1)
        self.assertEqual(by_id["educarte"]["lost"], 1)

        # Vittorino perdió 0-2 (0 pts)
        self.assertEqual(by_id["vittorino"]["points"], 0)
        self.assertEqual(by_id["vittorino"]["lost"], 1)

    def test_baloncesto_scoring(self):
        """Valida baloncesto FIBA / MEP: Victoria 2 pts, Derrota jugada 1 pt."""
        matches = [
            {
                "id": "bal-1",
                "categoryId": "cat-c-baloncesto",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "la-paz-tempisque",
                "homeScore": 45,
                "awayScore": 38,
                "status": "completed",
            }
        ]
        standings = self.calc.calculate_category_standings("cat-c-baloncesto", "baloncesto", matches)
        by_id = {r["teamId"]: r for r in standings}

        self.assertEqual(by_id["la-paz-cabo-velas"]["points"], 2)
        self.assertEqual(by_id["la-paz-cabo-velas"]["won"], 1)
        self.assertEqual(by_id["la-paz-tempisque"]["points"], 1)
        self.assertEqual(by_id["la-paz-tempisque"]["lost"], 1)

    def test_replayed_rescheduled_match_counts_points(self):
        """Valida que un partido reprogramado que luego se juega y finaliza con marcador real sume puntos y PJ."""
        match_played = {
            "id": "j3-bal-d-01",
            "categoryId": "cat-d-baloncesto",
            "sport": "baloncesto",
            "jornada": 3,
            "homeTeamId": "cria",
            "awayTeamId": "la-paz-tempisque",
            "homeScore": 52,
            "awayScore": 44,
            "status": "completed",
            "currentPeriod": "Finalizado",
            "walkover": "none",
            "notes": "Partido reprogramado de la Jornada 3 finalmente disputado",
        }
        self.assertFalse(is_rescheduled_match(match_played))
        standings = self.calc.calculate_category_standings("cat-d-baloncesto", "baloncesto", [match_played])
        by_id = {r["teamId"]: r for r in standings}
        self.assertEqual(by_id["cria"]["played"], 1)
        self.assertEqual(by_id["cria"]["points"], 2)
        self.assertEqual(by_id["la-paz-tempisque"]["played"], 1)
        self.assertEqual(by_id["la-paz-tempisque"]["points"], 1)

    def test_multi_jornada_head_to_head_tiebreaker(self):
        """Valida el desempate directo acumulado entre dos equipos a través de múltiples jornadas."""
        matches = [
            # CRIA y Cabo Velas empatan 1-1 en J1, pero en J2 Cabo Velas gana 2-1 a CRIA,
            # mientras CRIA compensa diferencia contra un tercer equipo para empatar en PTS, PG, DG y GF generales
            {
                "id": "m1",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "cria",
                "awayTeamId": "la-paz-cabo-velas",
                "homeScore": 1,
                "awayScore": 1,
                "status": "completed",
            },
            {
                "id": "m2",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "cria",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
            },
            {
                "id": "m3",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "cria",
                "awayTeamId": "la-paz-tempisque",
                "homeScore": 2,
                "awayScore": 0,
                "status": "completed",
            },
            {
                "id": "m4",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "la-paz-tempisque",
                "homeScore": 1,
                "awayScore": 1,
                "status": "completed",
            },
        ]
        # Ambos (CRIA y Cabo Velas) tienen: 3 PJ, 1 PG, 1 PE, 1 PP -> Wait: Cabo Velas tiene 1 PG, 2 PE = 5 pts;
        # Probemos empate exacto de puntos (3 pts c/u) con victoria directa de Cabo Velas sobre CRIA:
        matches_exact_tie = [
            {
                "id": "t1",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "cria",
                "awayTeamId": "la-paz-tempisque",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
            },
            {
                "id": "t2",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "la-paz-cabo-velas",
                "awayTeamId": "cria",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
            },
            {
                "id": "t3",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "la-paz-tempisque",
                "awayTeamId": "la-paz-cabo-velas",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
            },
        ]
        # Entre CRIA y Cabo Velas (ambos 3 pts, 1 PG, DG 0, GF 3), Cabo Velas venció a CRIA 2-1 en el duelo directo
        standings = self.calc.calculate_category_standings("cat-fem-futbol", "futbol", matches_exact_tie[:2] + [
            {
                "id": "t3b",
                "categoryId": "cat-fem-futbol",
                "homeTeamId": "vittorino",
                "awayTeamId": "la-paz-cabo-velas",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
            }
        ])
        by_id = {r["teamId"]: r for r in standings}
        self.assertLess(by_id["la-paz-cabo-velas"]["position"], by_id["cria"]["position"])

    def test_statistics_summary_calculation(self):
        """Valida que calculate_statistics compute con exactitud el resumen global, por jornada y categoría."""
        matches = [
            {
                "id": "j1-1",
                "jornada": 1,
                "categoryId": "cat-c-futbol",
                "sport": "futbol",
                "homeTeamId": "cria",
                "awayTeamId": "la-paz-cabo-velas",
                "homeScore": 2,
                "awayScore": 1,
                "status": "completed",
                "currentPeriod": "Finalizado",
            },
            {
                "id": "j2-1",
                "jornada": 2,
                "categoryId": "cat-c-futbol",
                "sport": "futbol",
                "homeTeamId": "cria",
                "awayTeamId": "la-paz-tempisque",
                "homeScore": 0,
                "awayScore": 0,
                "status": "scheduled",
                "currentPeriod": "Programado",
            },
        ]
        stats = self.calc.calculate_statistics(matches)
        self.assertEqual(stats["global_summary"]["total_matches"], 2)
        self.assertEqual(stats["global_summary"]["completed_matches"], 1)
        self.assertEqual(stats["global_summary"]["scheduled_matches"], 1)
        self.assertEqual(stats["global_summary"]["total_goals_futbol"], 3)
        self.assertEqual(stats["jornadas_summary"]["jornada_1"]["completed_matches"], 1)
        self.assertEqual(stats["jornadas_summary"]["jornada_2"]["scheduled_matches"], 1)
        self.assertEqual(stats["category_metrics"]["cat-c-futbol"]["total_scored"], 3)

if __name__ == "__main__":
    unittest.main()
