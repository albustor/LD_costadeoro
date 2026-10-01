import { Match, MatchStatus, SportType } from '@/types/tournament';
import { formatTime12h } from './utils';

/**
 * Duraciones estimadas por disciplina deportiva (en minutos)
 * para el Festival Deportivo Intercolegial 2026.
 */
export const DEFAULT_SPORT_DURATIONS: Record<SportType, number> = {
  futbol: 60,      // 2 tiempos de 25 min + 10 min entretiempo
  voleibol: 50,    // Mejor de 3 sets (25 pts / tie-break 15 pts)
  baloncesto: 50,  // 4 cuartos de 10 min + pausas
};

/**
 * Obtiene la duración estimada en minutos de un deporte
 */
export function getMatchDefaultDuration(sport: SportType, customDuration?: number): number {
  if (customDuration && customDuration > 0) return customDuration;
  return DEFAULT_SPORT_DURATIONS[sport] || 50;
}

/**
 * Convierte fecha y hora (HH:mm) a objeto Date en zona horaria local / Costa Rica
 */
export function parseMatchDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;
  try {
    // Manejo de formatos HH:mm (24h) o H:mm
    const [hoursStr, minsStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const mins = parseInt(minsStr || '0', 10);

    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    return new Date(year, month, day, hours, mins, 0, 0);
  } catch {
    return null;
  }
}

/**
 * Calcula la hora estimada de cierre (formato HH:mm y formato 12h)
 */
export function calculateEstimatedEndTime(
  dateStr: string,
  startTimeStr: string,
  durationMinutes: number,
  customEndTime?: string
): { endTime24h: string; endTime12h: string; endDate: Date | null } {
  if (customEndTime) {
    return {
      endTime24h: customEndTime,
      endTime12h: formatTime12h(customEndTime),
      endDate: parseMatchDateTime(dateStr, customEndTime),
    };
  }

  const startDate = parseMatchDateTime(dateStr, startTimeStr);
  if (!startDate) {
    return { endTime24h: startTimeStr, endTime12h: formatTime12h(startTimeStr), endDate: null };
  }

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMins = String(endDate.getMinutes()).padStart(2, '0');
  const endTime24h = `${endHours}:${endMins}`;

  return {
    endTime24h,
    endTime12h: formatTime12h(endTime24h),
    endDate,
  };
}

export interface MatchLifecycleResult {
  suggestedStatus: MatchStatus;
  isLive: boolean;
  isEnded: boolean;
  isUpcoming: boolean;
  minutesElapsed: number;
  endTime12h: string;
  endTime24h: string;
  suggestedPeriod?: string;
  isOverridden: boolean;
}

/**
 * Evalúa el ciclo de vida automático de un partido contra la hora actual
 */
export function evaluateMatchLifecycle(
  match: Match,
  now: Date = new Date()
): MatchLifecycleResult {
  const duration = getMatchDefaultDuration(match.sport, match.estimatedDurationMinutes);
  const { endTime12h, endTime24h, endDate } = calculateEstimatedEndTime(
    match.date,
    match.time,
    duration,
    match.customEndTime
  );

  const startDate = parseMatchDateTime(match.date, match.time);

  // Si no hay fecha válida o hay override manual activo
  if (!startDate || !endDate) {
    return {
      suggestedStatus: match.status,
      isLive: match.status === 'live',
      isEnded: match.status === 'completed',
      isUpcoming: match.status === 'scheduled',
      minutesElapsed: 0,
      endTime12h,
      endTime24h,
      isOverridden: !!match.isManualOverride,
    };
  }

  const nowMs = now.getTime();
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const minutesElapsed = Math.max(0, Math.floor((nowMs - startMs) / (60 * 1000)));

  // Si tiene bloqueo manual fijado por la mesa técnica, se respeta el estado guardado
  if (match.isManualOverride) {
    return {
      suggestedStatus: match.status,
      isLive: match.status === 'live',
      isEnded: match.status === 'completed',
      isUpcoming: match.status === 'scheduled',
      minutesElapsed,
      endTime12h,
      endTime24h,
      suggestedPeriod: match.currentPeriod,
      isOverridden: true,
    };
  }

  // 1. Antes de iniciar
  if (nowMs < startMs) {
    return {
      suggestedStatus: 'scheduled',
      isLive: false,
      isEnded: false,
      isUpcoming: true,
      minutesElapsed: 0,
      endTime12h,
      endTime24h,
      suggestedPeriod: 'Por Iniciar',
      isOverridden: false,
    };
  }

  // 2. En ventana de juego (En vivo)
  if (nowMs >= startMs && nowMs < endMs) {
    let suggestedPeriod = '1.er Tiempo';
    if (match.sport === 'futbol') {
      suggestedPeriod = minutesElapsed < 25 ? '1.er Tiempo' : minutesElapsed < 35 ? 'Entretiempo' : '2.º Tiempo';
    } else if (match.sport === 'voleibol') {
      suggestedPeriod = minutesElapsed < 20 ? 'Set 1' : minutesElapsed < 35 ? 'Set 2' : 'Set 3 / Tie-Break';
    } else if (match.sport === 'baloncesto') {
      suggestedPeriod = minutesElapsed < 12 ? '1.er Cuarto' : minutesElapsed < 24 ? '2.º Cuarto' : minutesElapsed < 36 ? '3.er Cuarto' : '4.º Cuarto';
    }

    return {
      suggestedStatus: 'live',
      isLive: true,
      isEnded: false,
      isUpcoming: false,
      minutesElapsed,
      endTime12h,
      endTime24h,
      suggestedPeriod,
      isOverridden: false,
    };
  }

  // 3. Posterior a la hora de cierre (Finalizado)
  return {
    suggestedStatus: 'completed',
    isLive: false,
    isEnded: true,
    isUpcoming: false,
    minutesElapsed,
    endTime12h,
    endTime24h,
    suggestedPeriod: 'Finalizado',
    isOverridden: false,
  };
}

/**
 * Añade minutos adicionales de prórroga o extiende la hora de cierre
 */
export function extendMatchTime(match: Match, additionalMinutes: number): Match {
  const currentDuration = getMatchDefaultDuration(match.sport, match.estimatedDurationMinutes);
  const newDuration = currentDuration + additionalMinutes;
  const { endTime24h } = calculateEstimatedEndTime(match.date, match.time, newDuration);

  return {
    ...match,
    estimatedDurationMinutes: newDuration,
    customEndTime: endTime24h,
    isManualOverride: false, // Permite que el ciclo automático continúe hasta la nueva hora
    updatedAt: new Date().toISOString(),
  };
}
