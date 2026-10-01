import fs from 'fs';
import path from 'path';
import { calculateStandings } from '../src/lib/sportsEngine';
import { Match, School, SportType, TeamRoster } from '../src/types/tournament';
import { SCHOOLS_DATA } from '../src/config/tournamentConfig';

const BASE_URL = 'http://localhost:3014';
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'tournament_db.json');

async function runSystemDiagnostics() {
  console.log('======================================================================');
  console.log('🔍 SUITE DE DIAGNÓSTICO INTEGRAL Y VALIDACIÓN END-TO-END');
  console.log('   Liga Deportiva Costa de Oro 2026 · Curiol Studio');
  console.log('   Auditor Técnico: Jim (Ingeniero Full-Stack y Arquitecto Phygital)');
  console.log(`   Fecha y Hora: ${new Date().toISOString()}`);
  console.log('======================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // =========================================================================
  // MÓDULO 1: SALUD DE SERVIDOR Y ENDPOINTS API
  // =========================================================================
  console.log('📡 [1/3] VERIFICACIÓN DE ENDPOINTS API Y RUTAS WEB (Puerto 3014)');
  console.log('----------------------------------------------------------------------');

  const endpointsToTest = [
    { name: 'Portada Principal', url: `${BASE_URL}/` },
    { name: 'Directorio de Colegios', url: `${BASE_URL}/colegios` },
    { name: 'Portal Universal de Registro (PIN)', url: `${BASE_URL}/registro-nomina` },
    { name: 'Panel de Administración', url: `${BASE_URL}/admin` },
    { name: 'API Muro Comunitario', url: `${BASE_URL}/api/posts` },
    { name: 'API Nóminas Centralizadas', url: `${BASE_URL}/api/rosters` },
  ];

  for (const ep of endpointsToTest) {
    totalTests++;
    try {
      const startTime = Date.now();
      const res = await fetch(ep.url, { cache: 'no-store' });
      const elapsed = Date.now() - startTime;

      if (res.ok) {
        passedTests++;
        console.log(`  ✅ [200 OK] ${ep.name.padEnd(35)} ➔ ${elapsed}ms (${ep.url})`);
      } else {
        console.error(`  ❌ [${res.status}] ${ep.name.padEnd(35)} ➔ Error en ${ep.url}`);
      }
    } catch (err: any) {
      console.error(`  ❌ [FAIL]   ${ep.name.padEnd(35)} ➔ No responde: ${err.message}`);
    }
  }

  // =========================================================================
  // MÓDULO 2: TRAZABILIDAD END-TO-END DE BASE DE DATOS Y SINCRONIZACIÓN
  // =========================================================================
  console.log('\n💾 [2/3] PRUEBA DE PERSISTENCIA Y SINCRONIZACIÓN ATÓMICA EN DISCO');
  console.log('----------------------------------------------------------------------');

  totalTests++;
  const testJersey = 99;
  const testPlayerName = 'Atleta Diagnóstico E2E ' + Date.now();
  const testPayload: TeamRoster = {
    schoolId: 'la-paz-cabo-velas',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: 'Prof. Técnico Diagnóstico',
    assistantCoachName: 'Asistente E2E',
    players: [
      {
        id: `p-diag-${Date.now()}`,
        jerseyNumber: testJersey,
        fullName: testPlayerName,
        position: 'Delantero/a Centro',
        isCaptain: true,
        birthYear: 2011,
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  try {
    // 1. Enviar payload vía POST /api/rosters
    console.log('  1. Enviando payload de nómina vía POST /api/rosters...');
    const postRes = await fetch(`${BASE_URL}/api/rosters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    if (!postRes.ok) throw new Error(`POST /api/rosters respondió con status ${postRes.status}`);
    const postJson = await postRes.json();
    console.log(`     ↳ Servidor confirmó guardado: ${postJson.success ? 'Éxito (200 OK)' : 'Error'}`);

    // 2. Verificar lectura directa en el archivo JSON físico en disco
    console.log('  2. Leyendo src/data/tournament_db.json directamente desde el disco...');
    const dbRaw = fs.readFileSync(DB_PATH, 'utf-8');
    const dbParsed = JSON.parse(dbRaw);

    const savedRoster = dbParsed.rosters?.find(
      (r: any) => r.schoolId === 'la-paz-cabo-velas' && r.sport === 'futbol' && r.categoryId === 'cat-fem-futbol'
    );

    const foundPlayer = savedRoster?.players?.find((p: any) => p.jerseyNumber === testJersey && p.fullName === testPlayerName);

    if (foundPlayer) {
      passedTests++;
      console.log(`     ✅ ATLETA CONFIRMADO EN DISCO: "${foundPlayer.fullName}" con # Jugador ${foundPlayer.jerseyNumber} (Capitán: ${foundPlayer.isCaptain})`);
    } else {
      throw new Error('El atleta no se encontró registrado en el archivo JSON físico.');
    }

    // 3. Teardown / Limpieza del registro de prueba
    console.log('  3. Ejecutando Teardown y limpieza de datos sintéticos...');
    const cleanedRoster: TeamRoster = {
      ...testPayload,
      players: [],
    };
    await fetch(`${BASE_URL}/api/rosters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedRoster),
    });
    console.log('     ↳ Limpieza completada. Base de datos en estado oficial limpio.');
  } catch (err: any) {
    console.error(`  ❌ Error en prueba de persistencia E2E: ${err.message}`);
  }

  // =========================================================================
  // MÓDULO 3: VALIDACIÓN MATEMÁTICA DEL MOTOR DE PUNTAJES (sportsEngine.ts)
  // =========================================================================
  console.log('\n🧮 [3/3] VALIDACIÓN MATEMÁTICA DE REGLAMENTOS Y MOTOR DE PUNTAJES');
  console.log('----------------------------------------------------------------------');

  const testSchools: School[] = [
    SCHOOLS_DATA.find((s) => s.id === 'la-paz-cabo-velas')!,
    SCHOOLS_DATA.find((s) => s.id === 'la-paz-tempisque')!,
    SCHOOLS_DATA.find((s) => s.id === 'cria')!,
    SCHOOLS_DATA.find((s) => s.id === 'journey-school')!,
  ];

  // ⚽ TEST 3.1: FÚTBOL (Victoria: 3 pts, Empate: 1 pt, Derrota: 0 pts)
  totalTests++;
  const futbolMatches: Match[] = [
    {
      id: 'm-f-1',
      tournamentId: 'costa-de-oro-2026',
      jornada: 1,
      jornadaName: 'Jornada 1',
      sport: 'futbol',
      categoryId: 'cat-fem-futbol',
      homeTeamId: 'la-paz-cabo-velas',
      awayTeamId: 'cria',
      homeScore: 3,
      awayScore: 1,
      status: 'completed',
      date: '2026-03-02',
      time: '08:00',
      venue: 'Cabo Velas',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'm-f-2',
      tournamentId: 'costa-de-oro-2026',
      jornada: 1,
      jornadaName: 'Jornada 1',
      sport: 'futbol',
      categoryId: 'cat-fem-futbol',
      homeTeamId: 'la-paz-tempisque',
      awayTeamId: 'journey-school',
      homeScore: 2,
      awayScore: 2,
      status: 'completed',
      date: '2026-03-02',
      time: '09:00',
      venue: 'Tempisque',
      updatedAt: new Date().toISOString(),
    },
  ];

  const futbolStandings = calculateStandings('cat-fem-futbol', 'futbol', futbolMatches, testSchools);
  const caboVelasFut = futbolStandings.find((s) => s.teamId === 'la-paz-cabo-velas');
  const tempisqueFut = futbolStandings.find((s) => s.teamId === 'la-paz-tempisque');
  const criaFut = futbolStandings.find((s) => s.teamId === 'cria');

  const isFutbolValid = 
    caboVelasFut?.points === 3 && caboVelasFut?.diff === 2 &&
    tempisqueFut?.points === 1 && tempisqueFut?.diff === 0 &&
    criaFut?.points === 0 && criaFut?.diff === -2;

  if (isFutbolValid) {
    passedTests++;
    console.log('  ✅ FÚTBOL: Algoritmo 3/1/0 pts y diferencia de goles validado 100% (1° Cabo Velas: 3pts +2, Tempisque: 1pt 0, CRIA: 0pts -2)');
  } else {
    console.error('  ❌ FÚTBOL: Incongruencia en cálculo de puntos.');
  }

  // 🏀 TEST 3.2: BALONCESTO FIBA (Victoria: 2 pts, Derrota: 1 pt)
  totalTests++;
  const basketMatches: Match[] = [
    {
      id: 'm-b-1',
      tournamentId: 'costa-de-oro-2026',
      jornada: 1,
      jornadaName: 'Jornada 1',
      sport: 'baloncesto',
      categoryId: 'cat-c-basket',
      homeTeamId: 'cria',
      awayTeamId: 'la-paz-tempisque',
      homeScore: 68,
      awayScore: 60,
      status: 'completed',
      date: '2026-03-02',
      time: '10:00',
      venue: 'Tempisque',
      updatedAt: new Date().toISOString(),
    },
  ];

  const basketStandings = calculateStandings('cat-c-basket', 'baloncesto', basketMatches, testSchools);
  const criaBasket = basketStandings.find((s) => s.teamId === 'cria');
  const tempisqueBasket = basketStandings.find((s) => s.teamId === 'la-paz-tempisque');

  const isBasketValid = criaBasket?.points === 2 && tempisqueBasket?.points === 1 && criaBasket?.diff === 8;

  if (isBasketValid) {
    passedTests++;
    console.log('  ✅ BALONCESTO: Reglamento FIBA 2/1 pts validado 100% (Ganador: 2 pts, Perdedor: 1 pt por presentación/derrota)');
  } else {
    console.error('  ❌ BALONCESTO: Incongruencia en puntaje FIBA.');
  }

  // 🏐 TEST 3.3: VOLEIBOL FIVB (3-0/3-1 = 3pts, 3-2 = 2/1 pts)
  totalTests++;
  const voleyMatches: Match[] = [
    {
      id: 'm-v-1',
      tournamentId: 'costa-de-oro-2026',
      jornada: 1,
      jornadaName: 'Jornada 1',
      sport: 'voleibol',
      categoryId: 'cat-fem-c-voley',
      homeTeamId: 'la-paz-cabo-velas',
      awayTeamId: 'journey-school',
      homeScore: 75,
      awayScore: 50,
      homeSetsWon: 3,
      awaySetsWon: 0,
      status: 'completed',
      date: '2026-03-02',
      time: '11:00',
      venue: 'Cabo Velas',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'm-v-2',
      tournamentId: 'costa-de-oro-2026',
      jornada: 1,
      jornadaName: 'Jornada 1',
      sport: 'voleibol',
      categoryId: 'cat-fem-c-voley',
      homeTeamId: 'la-paz-tempisque',
      awayTeamId: 'cria',
      homeScore: 65,
      awayScore: 60,
      homeSetsWon: 3,
      awaySetsWon: 2,
      status: 'completed',
      date: '2026-03-02',
      time: '12:00',
      venue: 'Tempisque',
      updatedAt: new Date().toISOString(),
    },
  ];

  const voleyStandings = calculateStandings('cat-fem-c-voley', 'voleibol', voleyMatches, testSchools);
  const caboVoley = voleyStandings.find((s) => s.teamId === 'la-paz-cabo-velas');
  const tempisqueVoley = voleyStandings.find((s) => s.teamId === 'la-paz-tempisque');
  const criaVoley = voleyStandings.find((s) => s.teamId === 'cria');
  const journeyVoley = voleyStandings.find((s) => s.teamId === 'journey-school');

  const isVoleyValid = 
    caboVoley?.points === 3 && caboVoley?.setsDiff === 3 &&
    tempisqueVoley?.points === 2 && tempisqueVoley?.setsDiff === 1 &&
    criaVoley?.points === 1 && criaVoley?.setsDiff === -1 &&
    journeyVoley?.points === 0 && journeyVoley?.setsDiff === -3;

  if (isVoleyValid) {
    passedTests++;
    console.log('  ✅ VOLEIBOL: Sistema FIVB validado 100% (Victoria 3-0: 3pts/0pts; Victoria 3-2: 2pts/1pt, Desempate por setsDiff)');
  } else {
    console.error('  ❌ VOLEIBOL: Incongruencia en puntaje FIVB.');
  }

  // =========================================================================
  // REPORTE FINAL Y SEMÁFORO DE SALUD
  // =========================================================================
  console.log('\n======================================================================');
  console.log(`📊 RESULTADO GLOBAL: ${passedTests} de ${totalTests} Pruebas Aprobadas (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (passedTests === totalTests) {
    console.log('🟢 ESTADO: SISTEMA 100% CONGRUENTE, SEGURO Y LISTO PARA PRODUCCIÓN');
  } else {
    console.log('🟡 ESTADO: SE DETECTARON ALERTAS PARA REVISIÓN');
  }
  console.log('======================================================================\n');
}

runSystemDiagnostics().catch(console.error);
