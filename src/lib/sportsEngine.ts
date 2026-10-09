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

  // Filtrar colegios que efectivamente participan en esta categoría (tienen partidos asignados)
  const participatingIds = new Set<string>();
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

      // Volleyball points: 2-0 / 3-0 / 3-1 = 3 pts win, 0 pts loss. 3-2 = 2 pts win, 1 pt loss.
      if (homeSets > awaySets) {
        home.won += 1;
        home.form.push('W');
        away.lost += 1;
        away.form.push('L');

          if (awaySets >= 2 || (homeSets === 2 && awaySets === 1)) {
            home.points += 2;
            away.points += 1;
          } else {
            home.points += 3;
            away.points += 0;
          }
        } else if (awaySets > homeSets) {
          away.won += 1;
          away.form.push('W');
          home.lost += 1;
          home.form.push('L');

        if (homeSets >= 2 || (awaySets === 2 && homeSets === 1)) {
          away.points += 2;
          home.points += 1;
        } else {
          away.points += 3;
          home.points += 0;
        }
      }
    }
  });

  // Calculate differentials
  const standingsList = Array.from(standingsMap.values()).map((st) => {
    st.diff = st.pointsFor - st.pointsAgainst;
    if (st.setsWon !== undefined && st.setsLost !== undefined) {
      st.setsDiff = st.setsWon - st.setsLost;
    }
    // Keep last 5 form results
    st.form = st.form.slice(-5);
    return st;
  });

  // Sort standings with official tie-breakers (FEDEFUTBOL / LINAFA / Liga Menor Costa Rica)
  standingsList.sort((a, b) => {
    // 1. Mayor Puntaje Oficial (PTS)
    if (b.points !== a.points) return b.points - a.points;

    // 2. Voleibol: Mayor Diferencia de Sets (DS)
    if (sport === 'voleibol' && a.setsDiff !== undefined && b.setsDiff !== undefined) {
      if (b.setsDiff !== a.setsDiff) return b.setsDiff - a.setsDiff;
    }

    // 3. Mayor Gol / Punto Diferencia (GD / DG)
    if (b.diff !== a.diff) return b.diff - a.diff;

    // 4. Mayor Cantidad de Goles / Puntos a Favor (GF / PF)
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;

    // 5. Enfrentamiento particular / Serie directa entre equipos empatados
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

    // 6. Menor cantidad de goles / puntos recibidos (GC / PC)
    if (a.pointsAgainst !== b.pointsAgainst) return a.pointsAgainst - b.pointsAgainst;

    // 7. Orden alfabético
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

