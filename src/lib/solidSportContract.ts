/**
 * Evento Costa de Oro — Contrato SOLID de Dominio Deportivo (SRP + ISP + DIP)
 * ---------------------------------------------------------------------------
 * Sincronizado 1:1 con el motor determinista de Python (src/scripts/scoring_rules_jde2026.py).
 * Garantiza la Regla Universal de No Presentación / Ausencia:
 * - Cero puntos a ambos equipos (0 pts)
 * - Cero partidos jugados sumados (0 PJ)
 * - Estado 'postponed' con periodo 'Por reprogramar'
 */

export type OfficialSportType = 'futbol' | 'voleibol' | 'baloncesto';
export type OfficialMatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed';

export interface ISolidMatchTransitionPayload {
  readonly matchId: string;
  readonly status: OfficialMatchStatus;
  readonly currentPeriod: 'Programado' | 'En Vivo' | 'Finalizado' | 'Por reprogramar';
  readonly homeScore: number;
  readonly awayScore: number;
  readonly homeSetsWon?: number;
  readonly awaySetsWon?: number;
  readonly notes: string;
}

/**
 * Construye una transición inmutable de partido reprogramado / ausencia (Regla Universal Curiol Studio)
 */
export function buildPostponedMatchTransition(
  matchId: string,
  absentTeamName?: string
): ISolidMatchTransitionPayload {
  const note = absentTeamName
    ? `${absentTeamName} no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)`
    : 'Partido por reprogramar (sin asignación de puntos a ningún equipo)';

  return {
    matchId,
    status: 'postponed',
    currentPeriod: 'Por reprogramar',
    homeScore: 0,
    awayScore: 0,
    homeSetsWon: 0,
    awaySetsWon: 0,
    notes: note,
  };
}
