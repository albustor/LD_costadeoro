import { Match, School, Standing, SportType } from '@/types/tournament';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';

export function isRescheduledMatch(match: Match): boolean {
  if (!match) return false;
  if (match.status === 'postponed') return true;
  if (match.currentPeriod === 'Por reprogramar' || match.currentPeriod === 'Reprogramado') return true;
  if (match.walkover && match.walkover !== 'none') return true;
  const notes = (match.notes || '').toLowerCase();
  if (notes.includes('reprogram') || notes.includes('no se presentó') || notes.includes('incomparecencia') || notes.includes('ausencia')) return true;
  return false;
}

export function calculateStandings(
  categoryId: string,
  sport: SportType,
  matches: Match[],
  schools: School[] = SCHOOLS_DATA
): Standing[] {
  // Filter matches for this category and completed or live status
  const categoryMatches = matches.filter(
    (m) => m.categoryId === categoryId && (m.status === 'completed' || m.status === 'live' || m.status === 'postponed')
  );

  // Delegaciones oficiales registradas por categoría
  const OFFICIAL_CATEGORY_TEAMS: Record<string, string[]> = {
    'cat-c-voleibol': ['la-paz-cabo-velas', 'educarte', 'vittorino', 'la-paz-tempisque'],
    'cat-d-voleibol': ['la-paz-cabo-velas', 'vittorino'],
    'cat-fem-futbol': ['la-paz-cabo-velas', 'cria', 'la-paz-tempisque', 'vittorino'],
    'cat-c-futbol': ['la-paz-cabo-velas', 'la-paz-tempisque', 'cria', 'vittorino', 'journey-school'],
    'cat-d-futbol': ['cria', 'la-paz-cabo-velas', 'la-paz-tempisque', 'vittorino'],
    'cat-c-baloncesto': ['la-paz-cabo-velas', 'la-paz-tempisque', 'educarte'],
    'cat-d-baloncesto': ['journey-school', 'la-paz-tempisque', 'cria', 'la-paz-cabo-velas'],
  };

  // Filtrar colegios que efectivamente participan en esta categoría
  const officialIds = OFFICIAL_CATEGORY_TEAMS[categoryId] || [];
  const participatingIds = new Set<string>(officialIds);
  matches
    .filter((m) => m.categoryId === categoryId)
    .forEach((m) => {
      participatingIds.add(m.homeTeamId);
      participatingIds.add(m.awayTeamId);
    });

  const participatingSchools = participatingIds.size > 0
    ? schools.filter((s) => participatingIds.has(s.id))
    : schools;

  // Initialize map of standings for participating schools
  const standingsMap = new Map<string, Standing>();

  participatingSchools.forEach((school) => {
    standingsMap.set(school.id, {
      teamId: school.id,
      school,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      diff: 0,
      points: 0,
      setsWon: sport === 'voleibol' ? 0 : undefined,
      setsLost: sport === 'voleibol' ? 0 : undefined,
      setsDiff: sport === 'voleibol' ? 0 : undefined,
      form: [],
    });
  });

  // Sort matches chronologically to build accurate form
  const sortedMatches = [...categoryMatches].sort((a, b) => {
    const timeA = a.time ? (a.time.length === 5 ? `${a.time}:00` : a.time) : '00:00:00';
    const timeB = b.time ? (b.time.length === 5 ? `${b.time}:00` : b.time) : '00:00:00';
    const dateA = new Date(`${a.date}T${timeA}`).getTime() || 0;
    const dateB = new Date(`${b.date}T${timeB}`).getTime() || 0;
    return dateA - dateB;
  });

  sortedMatches.forEach((match) => {
    const home = standingsMap.get(match.homeTeamId);
    const away = standingsMap.get(match.awayTeamId);

    if (!home || !away) return;

    const isRescheduled = isRescheduledMatch(match);

    // Regla Oficial Festival Deportivo Costa de Oro:
    // Cuando un partido se reprograma (o un equipo no se presenta), NO se asignan puntos a ningún equipo.
    // Ninguno de los dos equipos suma partidos jugados (0 PJ ficticios) ni goles artificiales.
    if (isRescheduled) {
      return;
    }

    home.played += 1;
    away.played += 1;

    // Goles / Puntos acumulados en partidos válidos disputados
    const effectiveHomeScore = match.homeScore || 0;
    const effectiveAwayScore = match.awayScore || 0;

    home.pointsFor += effectiveHomeScore;
    home.pointsAgainst += effectiveAwayScore;
    away.pointsFor += effectiveAwayScore;
    away.pointsAgainst += effectiveHomeScore;

    if (sport === 'futbol') {
      // Formato Oficial Festival Deportivo Costa de Oro (Fútbol):
      // Victoria = 3 Puntos | Empate = 1 Punto | Derrota = 0 Puntos
      const winPoints = 3;
      const drawPoints = 1;

      if (match.homeScore > match.awayScore) {
        home.won += 1;
        home.points += winPoints;
        home.form.push('W');
        away.lost += 1;
        away.form.push('L');
      } else if (match.homeScore < match.awayScore) {
        away.won += 1;
        away.points += winPoints;
        away.form.push('W');
        home.lost += 1;
        home.form.push('L');
      } else {
        home.drawn += 1;
        home.points += drawPoints;
        home.form.push('D');
        away.drawn += 1;
        away.points += drawPoints;
        away.form.push('D');
      }
    } else if (sport === 'baloncesto') {
      // En baloncesto (FIBA): Victoria = 2 pts | Derrota = 1 pt.
      if (match.homeScore > match.awayScore) {
        home.won += 1;
        home.points += 2;
        home.form.push('W');
        away.lost += 1;
        away.points += 1;
        away.form.push('L');
      } else if (match.homeScore < match.awayScore) {
        away.won += 1;
        away.points += 2;
        away.form.push('W');
        home.lost += 1;
        home.points += 1;
        home.form.push('L');
      }
    } else if (sport === 'voleibol') {
      const homeSets = match.homeSetsWon ?? 0;
      const awaySets = match.awaySetsWon ?? 0;

      if (home.setsWon !== undefined) home.setsWon += homeSets;
      if (home.setsLost !== undefined) home.setsLost += awaySets;
      if (away.setsWon !== undefined) away.setsWon += awaySets;
      if (away.setsLost !== undefined) away.setsLost += homeSets;

      const isFiveSetsMatch = homeSets === 3 || awaySets === 3;

      if (homeSets > awaySets) {
        home.won += 1;
        home.form.push('W');
        away.lost += 1;
        away.form.push('L');

        if (isFiveSetsMatch) {
          // Normativa MEP 2026 Art. 77.4 (3 de 5 sets): 3-0: 5pts | 3-1: 4pts/1pt | 3-2: 3pts/2pts
          if (awaySets === 0) {
            home.points += 5;
            away.points += 0;
          } else if (awaySets === 1) {
            home.points += 4;
            away.points += 1;
          } else {
            home.points += 3;
            away.points += 2;
          }
        } else {
          // Normativa MEP 2026 Art. 77.4 (2 de 3 sets): 2-0: 3pts/0pts | 2-1: 2pts/1pt
          if (awaySets === 1) {
            home.points += 2;
            away.points += 1;
          } else {
            home.points += 3;
            away.points += 0;
          }
        }
      } else if (awaySets > homeSets) {
        away.won += 1;
        away.form.push('W');
        home.lost += 1;
        home.form.push('L');

        if (isFiveSetsMatch) {
          if (homeSets === 0) {
            away.points += 5;
            home.points += 0;
          } else if (homeSets === 1) {
            away.points += 4;
            home.points += 1;
          } else {
            away.points += 3;
            home.points += 2;
          }
        } else {
          if (homeSets === 1) {
            away.points += 2;
            home.points += 1;
          } else {
            away.points += 3;
            home.points += 0;
          }
        }
      }
    }
  });

  // Calculate differentials and official ratios
  const standingsList = Array.from(standingsMap.values()).map((st) => {
    st.diff = st.pointsFor - st.pointsAgainst;
    if (st.setsWon !== undefined && st.setsLost !== undefined) {
      st.setsDiff = st.setsWon - st.setsLost;
      st.setsRatio = st.setsWon / Math.max(st.setsLost, 1);
    }
    st.pointsRatio = st.pointsFor / Math.max(st.pointsAgainst, 1);
    // Keep last 5 form results
    st.form = st.form.slice(-5);
    return st;
  });

  // Sort standings with official tie-breakers per sport (MEP / ICODER / FECOVOL / FECOBA / FEDEFUTBOL)
  standingsList.sort((a, b) => {
    // 1. Mayor Puntaje Oficial (PTS)
    if (b.points !== a.points) return b.points - a.points;

    // 2. Mayor cantidad de Partidos Ganados (PG) - Criterio Oficial FECOVOL / FIVB / FIBA / MEP
    if (b.won !== a.won) return b.won - a.won;

    // A. VOLEIBOL (Normativa MEP 2026 Art. 77 numeral 5 / FECOVOL / FIVB)
    if (sport === 'voleibol') {
      // Protección 0 PJ: Si ambos tienen 0 puntos y uno no ha debutado, el equipo inactivo no salta por encima
      if (a.points === 0 && b.points === 0) {
        if (a.played === 0 && b.played > 0) return 1;
        if (b.played === 0 && a.played > 0) return -1;
      }

      // 5.b Cociente de Puntos (Ratio PF / PC)
      const aPointsRatio = a.pointsFor / Math.max(a.pointsAgainst, 1);
      const bPointsRatio = b.pointsFor / Math.max(b.pointsAgainst, 1);
      if (Math.abs(bPointsRatio - aPointsRatio) > 0.0001) {
        return bPointsRatio - aPointsRatio;
      }

      // 5.c Cociente de Sets (Ratio SG / SP)
      const aSetsRatio = (a.setsWon ?? 0) / Math.max(a.setsLost ?? 0, 1);
      const bSetsRatio = (b.setsWon ?? 0) / Math.max(b.setsLost ?? 0, 1);
      if (Math.abs(bSetsRatio - aSetsRatio) > 0.0001) {
        return bSetsRatio - aSetsRatio;
      }

      // 5.d Mayor Diferencia de Sets (DS)
      if (a.setsDiff !== undefined && b.setsDiff !== undefined && b.setsDiff !== a.setsDiff) {
        return b.setsDiff - a.setsDiff;
      }
    }

    // B. BALONCESTO (Normativa MEP 2026 Art. 68 numeral 4.b / FECOBA / FIBA)
    if (sport === 'baloncesto') {
      // 4.b.i Mayor diferencia de puntos en serie particular entre equipos empatados
      const headToHead = categoryMatches.find(
        (m) =>
          (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
          (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
      );
      if (headToHead) {
        const aScore = headToHead.homeTeamId === a.teamId ? headToHead.homeScore : headToHead.awayScore;
        const bScore = headToHead.homeTeamId === b.teamId ? headToHead.homeScore : headToHead.awayScore;
        if (aScore !== bScore) return bScore - aScore;
      }

      // 4.b.iii Mayor diferencia de puntos en todos los partidos del grupo (DG)
      if (b.diff !== a.diff) return b.diff - a.diff;

      // 4.b.iv Mayor número de puntos anotados en todos los partidos del grupo (PF)
      if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    }

    // C. FÚTBOL / GENERAL (Normativa MEP 2026 Art. 72 numeral 6.b / FEDEFUTBOL)
    // Mayor Gol / Punto Diferencia (GD / DG)
    if (b.diff !== a.diff) return b.diff - a.diff;

    // Mayor Cantidad de Goles / Puntos a Favor (GF / PF)
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;

    // Enfrentamiento particular / Serie directa entre equipos empatados
    const headToHead = categoryMatches.find(
      (m) =>
        (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
    );
    if (headToHead) {
      const aScore = headToHead.homeTeamId === a.teamId ? headToHead.homeScore : headToHead.awayScore;
      const bScore = headToHead.homeTeamId === b.teamId ? headToHead.homeScore : headToHead.awayScore;
      if (aScore !== bScore) return bScore - aScore;
    }

    // Menor cantidad de goles / puntos recibidos (GC / PC)
    if (a.pointsAgainst !== b.pointsAgainst) return a.pointsAgainst - b.pointsAgainst;

    // Orden alfabético por nombre corto
    return a.school.shortName.localeCompare(b.school.shortName);
  });

  // Assign 1-indexed position
  return standingsList.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

/**
 * Determina la disciplina y categoría activa por defecto según el día de competición oficial en Costa Rica
 */
export function getActiveCompetitionDayInfo(): {
  sport: SportType;
  categoryId: string;
  dayName: string;
} {
  // Día de la semana (0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado)
  const day = new Date().getDay();

  switch (day) {
    case 1: // Lunes: Fútbol Femenino Abierto
      return { sport: 'futbol', categoryId: 'cat-fem-futbol', dayName: 'Lunes' };
    case 2: // Martes: Fútbol Masculino Categoría C
      return { sport: 'futbol', categoryId: 'cat-c-futbol', dayName: 'Martes' };
    case 3: // Miércoles: Fútbol Masculino Categoría D
      return { sport: 'futbol', categoryId: 'cat-d-futbol', dayName: 'Miércoles' };
    case 4: // Jueves: Voleibol Femenino Categoría C
      return { sport: 'voleibol', categoryId: 'cat-c-voleibol', dayName: 'Jueves' };
    case 5: // Viernes: Baloncesto Masculino Categoría C
      return { sport: 'baloncesto', categoryId: 'cat-c-baloncesto', dayName: 'Viernes' };
    default: // Fin de semana o fuera de horario: Martes (Categoría C activa)
      return { sport: 'futbol', categoryId: 'cat-c-futbol', dayName: 'Martes' };
  }
}

