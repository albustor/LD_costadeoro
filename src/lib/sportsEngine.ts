import { Match, School, Standing, SportType } from '@/types/tournament';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';

export function calculateStandings(
  categoryId: string,
  sport: SportType,
  matches: Match[],
  schools: School[] = SCHOOLS_DATA
): Standing[] {
  // Filter matches for this category and completed or live status
  const categoryMatches = matches.filter(
    (m) => m.categoryId === categoryId && (m.status === 'completed' || m.status === 'live')
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

    home.played += 1;
    away.played += 1;

    const isAwayAbsent =
      match.walkover === 'away_forfeit' ||
      (match.notes?.toLowerCase().includes('no se presentó') && !match.notes?.toLowerCase().includes('local'));
    const isHomeAbsent = match.walkover === 'home_forfeit';
    const isWalkover =
      isAwayAbsent ||
      isHomeAbsent ||
      match.notes?.toLowerCase().includes('w.o.') ||
      match.notes?.toLowerCase().includes('no presentación');

    // Goles / Puntos reglamentarios: si un equipo no se presentó y el marcador está en empate/0-0, se asegura 2-0 oficial a favor del presente
    const effectiveHomeScore =
      isAwayAbsent && match.homeScore === match.awayScore
        ? Math.max(match.homeScore, 2)
        : isHomeAbsent
        ? 0
        : match.homeScore;
    const effectiveAwayScore =
      isHomeAbsent && match.homeScore === match.awayScore
        ? Math.max(match.awayScore, 2)
        : isAwayAbsent
        ? 0
        : match.awayScore;

    home.pointsFor += effectiveHomeScore;
    home.pointsAgainst += effectiveAwayScore;
    away.pointsFor += effectiveAwayScore;
    away.pointsAgainst += effectiveHomeScore;

    if (sport === 'futbol') {
      // Victoria regular: 3 pts. Victoria por no presentación (W.O. / Forfeit): 2 pts según reglamento MEP
      const winPoints = isWalkover ? 2 : 3;

      if (isAwayAbsent) {
        // Visitante no se presentó: queda estrictamente en 0 puntos y se asignan 2 puntos al equipo contrario
        home.won += 1;
        home.points += winPoints;
        home.form.push('W');
        away.lost += 1;
        away.points += 0;
        away.form.push('L');
      } else if (isHomeAbsent) {
        // Local no se presentó: queda estrictamente en 0 puntos y se asignan 2 puntos al equipo contrario
        away.won += 1;
        away.points += winPoints;
        away.form.push('W');
        home.lost += 1;
        home.points += 0;
        home.form.push('L');
      } else if (match.homeScore > match.awayScore) {
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
        home.points += 1;
        home.form.push('D');
        away.drawn += 1;
        away.points += 1;
        away.form.push('D');
      }
    } else if (sport === 'baloncesto') {
      // In basketball: Win = 2 pts, Loss = 1 pt (FIBA). Si un equipo no se presenta queda en 0 puntos!
      if (isAwayAbsent) {
        home.won += 1;
        home.points += 2;
        home.form.push('W');
        away.lost += 1;
        away.points += 0;
        away.form.push('L');
      } else if (isHomeAbsent) {
        away.won += 1;
        away.points += 2;
        away.form.push('W');
        home.lost += 1;
        home.points += 0;
        home.form.push('L');
      } else if (match.homeScore > match.awayScore) {
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

  // Sort standings with official tie-breakers
  standingsList.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;

    // 2. Volleyball: Sets Differential
    if (sport === 'voleibol' && a.setsDiff !== undefined && b.setsDiff !== undefined) {
      if (b.setsDiff !== a.setsDiff) return b.setsDiff - a.setsDiff;
    }

    // 3. Goal / Point Differential
    if (b.diff !== a.diff) return b.diff - a.diff;

    // 4. Points / Goals For (Most scored)
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;

    // 5. Least points / goals against
    if (a.pointsAgainst !== b.pointsAgainst) return a.pointsAgainst - b.pointsAgainst;

    // 6. Alphabetical
    return a.school.shortName.localeCompare(b.school.shortName);
  });

  // Assign 1-indexed position
  return standingsList.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}
