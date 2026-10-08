import fs from 'fs/promises';
import path from 'path';
import { FamilyPost, Match, PhotoItem, PostComment, ShortVideo, TeamRoster } from '@/types/tournament';
import { 
  INITIAL_FAMILY_POSTS, 
  INITIAL_MATCHES, 
  INITIAL_PHOTOS, 
  INITIAL_SHORT_VIDEOS 
} from './initialData';
import { INITIAL_DEFAULT_ROSTERS } from './rosterService';
import { getFirestoreDb, FieldValue } from './firebaseAdmin';

export interface PageViewEvent {
  path: string;
  device: 'mobile_ios' | 'mobile_android' | 'tablet' | 'desktop' | 'unknown';
  timestamp: string;
  sessionId?: string;
  referrer?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface AnalyticsDbData {
  totalViews: number;
  uniqueSessions: string[];
  viewsByRoute: Record<string, number>;
  deviceDistribution: {
    mobile_ios: number;
    mobile_android: number;
    tablet: number;
    desktop: number;
  };
  geoDistribution?: Record<string, number>;
  dailyHistory: Record<string, { views: number; uniqueSessions: string[] }>;
  hourlyToday: Record<string, number>;
  todayDateStr: string;
  recentEvents: PageViewEvent[];
}

export interface TournamentDbData {
  posts: FamilyPost[];
  photos: PhotoItem[];
  videos: ShortVideo[];
  matches: Match[];
  rosters: TeamRoster[];
  analytics?: AnalyticsDbData;
  updatedAt: string;
}

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'tournament_db.json');

let inMemoryDb: TournamentDbData | null = null;
let writeQueue: Promise<void> = Promise.resolve();

/**
 * Inicializa y recupera la base de datos centralizada del torneo
 */
export async function getTournamentDb(): Promise<TournamentDbData> {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content) as TournamentDbData;
      return inMemoryDb;
    } catch {
      // Si el archivo no existe, inicializar con los datos semilla
      const defaultDb: TournamentDbData = {
        posts: INITIAL_FAMILY_POSTS,
        photos: INITIAL_PHOTOS,
        videos: INITIAL_SHORT_VIDEOS,
        matches: INITIAL_MATCHES,
        rosters: INITIAL_DEFAULT_ROSTERS,
        updatedAt: new Date().toISOString(),
      };
      await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      inMemoryDb = defaultDb;
      return inMemoryDb;
    }
  } catch (err) {
    console.error('[Server DB Init Error]:', err);
    return {
      posts: INITIAL_FAMILY_POSTS,
      photos: INITIAL_PHOTOS,
      videos: INITIAL_SHORT_VIDEOS,
      matches: INITIAL_MATCHES,
      rosters: INITIAL_DEFAULT_ROSTERS,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Persiste cambios de forma atómica en el archivo de base de datos
 */
async function saveTournamentDb(data: TournamentDbData): Promise<void> {
  inMemoryDb = data;
  data.updatedAt = new Date().toISOString();

  // Encolar escritura para evitar condiciones de carrera concurrentes
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Server DB Save Error]:', err);
    }
  });

  await writeQueue;
}

/**
 * Obtiene todas las publicaciones comunitarias
 */
export async function getAllPosts(): Promise<FamilyPost[]> {
  const db = await getTournamentDb();
  return db.posts || [];
}

/**
 * Inserta una nueva publicación en la base de datos central
 */
export async function createPost(
  newPost: Omit<FamilyPost, 'id' | 'createdAt' | 'likesCount' | 'applauseCount' | 'featuredVotes' | 'comments'> & { comments?: PostComment[] }
): Promise<FamilyPost> {
  const db = await getTournamentDb();

  const created: FamilyPost = {
    ...newPost,
    id: `fp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: 'Justo ahora',
    likesCount: 0,
    applauseCount: 0,
    featuredVotes: 0,
    isFeatured: false,
    comments: newPost.comments || [],
  };

  db.posts = [created, ...(db.posts || [])];
  await saveTournamentDb(db);

  return created;
}

/**
 * Registra una reacción a una publicación (like, aplauso, destacado)
 */
export async function reactToPost(
  postId: string,
  type: 'like' | 'applause' | 'feature'
): Promise<FamilyPost | null> {
  const db = await getTournamentDb();
  let updatedPost: FamilyPost | null = null;

  db.posts = (db.posts || []).map((p) => {
    if (p.id === postId) {
      const updatedLikes = type === 'like' ? (p.likesCount || 0) + 1 : (p.likesCount || 0);
      const updatedApplause = type === 'applause' ? (p.applauseCount || 0) + 1 : (p.applauseCount || 0);
      const updatedVotes = type === 'feature' ? (p.featuredVotes || 0) + 1 : (p.featuredVotes || 0);
      const isFeatured = updatedLikes + updatedApplause >= 35 || updatedVotes >= 8 || p.isFeatured;

      updatedPost = {
        ...p,
        likesCount: updatedLikes,
        applauseCount: updatedApplause,
        featuredVotes: updatedVotes,
        isFeatured,
      };
      return updatedPost;
    }
    return p;
  });

  if (updatedPost) {
    await saveTournamentDb(db);
  }

  return updatedPost;
}

/**
 * Alterna el estado destacado de una publicación desde administración
 */
export async function toggleFeaturePost(postId: string): Promise<FamilyPost | null> {
  const db = await getTournamentDb();
  let updatedPost: FamilyPost | null = null;

  db.posts = (db.posts || []).map((p) => {
    if (p.id === postId) {
      updatedPost = {
        ...p,
        isFeatured: !p.isFeatured,
      };
      return updatedPost;
    }
    return p;
  });

  if (updatedPost) {
    await saveTournamentDb(db);
  }

  return updatedPost;
}

/**
 * Elimina una publicación de la base de datos central
 */
export async function deletePost(postId: string): Promise<boolean> {
  const db = await getTournamentDb();
  const initialLen = (db.posts || []).length;
  db.posts = (db.posts || []).filter((p) => p.id !== postId);

  if (db.posts.length !== initialLen) {
    await saveTournamentDb(db);
    return true;
  }
  return false;
}

/**
 * Agrega un comentario a una publicación en la base de datos central
 */
export async function addCommentToPost(
  postId: string,
  comment: Omit<PostComment, 'id' | 'createdAt'>
): Promise<PostComment | null> {
  const db = await getTournamentDb();
  const createdComment: PostComment = {
    ...comment,
    id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: 'Justo ahora',
  };

  let found = false;
  db.posts = (db.posts || []).map((p) => {
    if (p.id === postId) {
      found = true;
      return {
        ...p,
        comments: [...(p.comments || []), createdComment],
      };
    }
    return p;
  });

  if (found) {
    await saveTournamentDb(db);
    return createdComment;
  }

  return null;
}

/**
 * Obtiene todas las nóminas oficiales desde la base de datos central
 */
export async function getAllRostersFromDb(): Promise<TeamRoster[]> {
  const db = await getTournamentDb();
  if (!db.rosters || db.rosters.length === 0) {
    db.rosters = INITIAL_DEFAULT_ROSTERS;
    await saveTournamentDb(db);
  }
  return db.rosters || [];
}

/**
 * Guarda o actualiza una nómina de categoría en la base de datos central
 */
export async function saveRosterToDb(newRoster: TeamRoster): Promise<TeamRoster> {
  const db = await getTournamentDb();
  const current = db.rosters || [];

  const index = current.findIndex(
    (r) =>
      r.schoolId === newRoster.schoolId &&
      r.sport === newRoster.sport &&
      r.categoryId === newRoster.categoryId
  );

  const updatedRoster: TeamRoster = {
    ...newRoster,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    current[index] = updatedRoster;
  } else {
    current.push(updatedRoster);
  }

  db.rosters = current;
  await saveTournamentDb(db);

  return updatedRoster;
}

/**
 * Guarda un conjunto múltiple de nóminas (ej: importación masiva Excel/CSV)
 */
export async function saveMultipleRostersToDb(rostersToSave: TeamRoster[]): Promise<TeamRoster[]> {
  const db = await getTournamentDb();
  const current = db.rosters || [];

  rostersToSave.forEach((newR) => {
    const idx = current.findIndex(
      (r) =>
        r.schoolId === newR.schoolId &&
        r.sport === newR.sport &&
        r.categoryId === newR.categoryId
    );
    const updatedR: TeamRoster = {
      ...newR,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      current[idx] = updatedR;
    } else {
      current.push(updatedR);
    }
  });

  db.rosters = current;
  await saveTournamentDb(db);

  return current;
}

/**
 * Inicializa el objeto de analítica por defecto
 */
function getDefaultAnalyticsData(todayDateStr: string): AnalyticsDbData {
  return {
    totalViews: 0,
    uniqueSessions: [],
    viewsByRoute: {
      '/': 0,
      '/calendario': 0,
      '/colegios': 0,
      '/deportes': 0,
      '/mural': 0,
      '/galeria': 0,
      '/registro-nomina': 0,
      '/admin': 0,
    },
    deviceDistribution: {
      mobile_ios: 0,
      mobile_android: 0,
      tablet: 0,
      desktop: 0,
    },
    geoDistribution: {},
    dailyHistory: {
      [todayDateStr]: { views: 0, uniqueSessions: [] },
    },
    hourlyToday: {},
    todayDateStr,
    recentEvents: [],
  };
}

/**
 * Registra un evento de visualización de página o flujo de usuario
 */
export async function recordAnalyticsEventInDb(event: PageViewEvent): Promise<void> {
  const db = await getTournamentDb();
  const now = new Date();
  const todayDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' }); // YYYY-MM-DD
  const hourCR = parseInt(
    now.toLocaleTimeString('en-US', { timeZone: 'America/Costa_Rica', hour12: false, hour: 'numeric' }),
    10
  );
  const hourKey = `${String(isNaN(hourCR) ? 0 : hourCR).padStart(2, '0')}:00`;

  if (!db.analytics) {
    db.analytics = getDefaultAnalyticsData(todayDateStr);
  }

  const a = db.analytics;

  // Si cambió el día en Costa Rica, reiniciar el acumulador por hora
  if (a.todayDateStr !== todayDateStr) {
    a.todayDateStr = todayDateStr;
    a.hourlyToday = {};
  }

  // Incrementar visitas totales
  a.totalViews = (a.totalViews || 0) + 1;

  // Registrar sesión única global
  if (event.sessionId && !a.uniqueSessions.includes(event.sessionId)) {
    a.uniqueSessions.push(event.sessionId);
  }

  // Incrementar ruta
  const cleanPath = event.path || '/';
  a.viewsByRoute[cleanPath] = (a.viewsByRoute[cleanPath] || 0) + 1;

  // Incrementar dispositivo
  const devKey = (event.device || 'desktop') as keyof typeof a.deviceDistribution;
  if (a.deviceDistribution[devKey] !== undefined) {
    a.deviceDistribution[devKey] = (a.deviceDistribution[devKey] || 0) + 1;
  } else {
    a.deviceDistribution.desktop = (a.deviceDistribution.desktop || 0) + 1;
  }

  // Geolocalización real por cabeceras Edge CDN verificadas (Regla 15)
  let geoKeyClean = '';
  if (event.city || event.country) {
    if (!a.geoDistribution) a.geoDistribution = {};
    const cityClean = event.city ? decodeURIComponent(event.city).trim() : 'Ciudad no especificada';
    const countryClean = event.country ? event.country.trim().toUpperCase() : 'CR';
    const regionClean = event.region ? ` (${event.region.trim()})` : '';
    geoKeyClean = `${cityClean}${regionClean}, ${countryClean}`;
    a.geoDistribution[geoKeyClean] = (a.geoDistribution[geoKeyClean] || 0) + 1;
  }

  // Historial diario local
  if (!a.dailyHistory[todayDateStr]) {
    a.dailyHistory[todayDateStr] = { views: 0, uniqueSessions: [] };
  }
  a.dailyHistory[todayDateStr].views = (a.dailyHistory[todayDateStr].views || 0) + 1;
  if (event.sessionId && !a.dailyHistory[todayDateStr].uniqueSessions.includes(event.sessionId)) {
    a.dailyHistory[todayDateStr].uniqueSessions.push(event.sessionId);
  }

  // Distribución por hora de hoy
  a.hourlyToday[hourKey] = (a.hourlyToday[hourKey] || 0) + 1;

  // Eventos recientes (máximo 40 registros)
  if (!a.recentEvents) a.recentEvents = [];
  a.recentEvents.unshift({
    path: cleanPath,
    device: event.device,
    timestamp: new Date().toISOString(),
    referrer: event.referrer || 'Directo / PWA',
    city: event.city,
    region: event.region,
    country: event.country,
  });
  if (a.recentEvents.length > 40) {
    a.recentEvents = a.recentEvents.slice(0, 40);
  }

  // Guardar copia local en disco (en local o memoria)
  await saveTournamentDb(db);

  // Sincronización atómica persistente en Firestore (Cloud-First para Vercel Serverless)
  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const summaryRef = firestore.collection('costa_de_oro_analytics').doc('live_summary');
      const dailyRef = firestore.collection('costa_de_oro_analytics').doc(`daily_${todayDateStr}`);

      // Claves sanitizadas para Firestore (sin barras)
      const routeKey = cleanPath.replace(/^\//, '').replace(/\//g, '_') || 'root';
      const devKey = (event.device || 'desktop') as string;

      const summaryPayload: any = {
        totalViews: FieldValue.increment(1),
        [`deviceDistribution.${devKey}`]: FieldValue.increment(1),
        [`viewsByRoute.${routeKey}`]: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (geoKeyClean) {
        const geoFirestoreKey = geoKeyClean.replace(/[\.\/\[\]#$]/g, '_');
        summaryPayload[`geoDistribution.${geoFirestoreKey}`] = FieldValue.increment(1);
      }

      const dailyPayload: any = {
        date: todayDateStr,
        views: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (event.sessionId) {
        dailyPayload.uniqueSessions = FieldValue.arrayUnion(event.sessionId);
      }

      // Guardar con update y fallback a set
      await Promise.all([
        summaryRef.update(summaryPayload).catch(() => summaryRef.set(summaryPayload, { merge: true })),
        dailyRef.set(dailyPayload, { merge: true }),
      ]);
    }
  } catch (fsErr) {
    console.error('[Firestore Telemetry Save Error]:', fsErr);
  }
}

/**
 * Obtiene el resumen de analítica procesado para el panel de administración y cron
 */
export async function getAnalyticsSummaryFromDb() {
  const now = new Date();
  const todayDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });

  // 1. Intentar leer en tiempo real desde Firestore (Fuente de la verdad viva en Vercel)
  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const summarySnap = await firestore.collection('costa_de_oro_analytics').doc('live_summary').get();
      if (summarySnap.exists) {
        const data = summarySnap.data() || {};

        // Consultar historial diario completo
        const dailySnaps = await firestore.collection('costa_de_oro_analytics').get();
        const dailyHistory: Array<{ date: string; views: number; visitors: number }> = [];
        let todayViews = 0;
        let todayVisitors = 0;
        const totalUniqueSessionsSet = new Set<string>();

        dailySnaps.forEach((doc: any) => {
          if (doc.id.startsWith('daily_')) {
            const d = doc.data();
            const dateStr = d.date || doc.id.replace('daily_', '');
            const sessions: string[] = Array.isArray(d.uniqueSessions) ? d.uniqueSessions : [];
            sessions.forEach((s) => totalUniqueSessionsSet.add(s));
            const visitorsCount = d.visitorsCount !== undefined ? d.visitorsCount : sessions.length;

            dailyHistory.push({
              date: dateStr,
              views: d.views || 0,
              visitors: visitorsCount,
            });

            if (dateStr === todayDateStr) {
              todayViews = d.views || 0;
              todayVisitors = visitorsCount;
            }
          }
        });

        dailyHistory.sort((a, b) => a.date.localeCompare(b.date));

        // Reconstruir mapa de rutas (soportar anidados y claves con prefijo)
        const viewsByRoute: Record<string, number> = {};
        if (data.viewsByRoute && typeof data.viewsByRoute === 'object') {
          for (const [k, v] of Object.entries(data.viewsByRoute)) {
            const realPath = k === 'root' ? '/' : `/${k.replace(/_/g, '/')}`;
            viewsByRoute[realPath] = typeof v === 'number' ? v : 0;
          }
        }
        for (const [k, v] of Object.entries(data)) {
          if (k.startsWith('viewsByRoute.')) {
            const realRoute = k.replace('viewsByRoute.', '');
            const cleanPath = realRoute === 'root' ? '/' : `/${realRoute.replace(/_/g, '/')}`;
            viewsByRoute[cleanPath] = (viewsByRoute[cleanPath] || 0) + (typeof v === 'number' ? v : 0);
          }
        }

        // Reconstruir mapa de geolocalización (soportar anidados y claves con prefijo)
        const geoDistribution: Record<string, number> = {};
        if (data.geoDistribution && typeof data.geoDistribution === 'object') {
          for (const [k, v] of Object.entries(data.geoDistribution)) {
            const cleanGeoLabel = k.replace(/_/g, ' ');
            geoDistribution[cleanGeoLabel] = typeof v === 'number' ? v : 0;
          }
        }
        for (const [k, v] of Object.entries(data)) {
          if (k.startsWith('geoDistribution.')) {
            const cleanGeoLabel = k.replace('geoDistribution.', '').replace(/_/g, ' ');
            geoDistribution[cleanGeoLabel] = (geoDistribution[cleanGeoLabel] || 0) + (typeof v === 'number' ? v : 0);
          }
        }

        // Reconstruir distribución de dispositivos
        const deviceDistribution = {
          mobile_ios: data.deviceDistribution?.mobile_ios || 0,
          mobile_android: data.deviceDistribution?.mobile_android || 0,
          tablet: data.deviceDistribution?.tablet || 0,
          desktop: data.deviceDistribution?.desktop || 0,
        };
        for (const [k, v] of Object.entries(data)) {
          if (k.startsWith('deviceDistribution.')) {
            const dev = k.replace('deviceDistribution.', '') as keyof typeof deviceDistribution;
            if (deviceDistribution[dev] !== undefined && typeof v === 'number') {
              deviceDistribution[dev] = (deviceDistribution[dev] || 0) + v;
            }
          }
        }

        const sortedTopRoutes = Object.entries(viewsByRoute)
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views);

        const totalUniqueCount = Math.max(
          data.uniqueVisitorsCount || 0,
          totalUniqueSessionsSet.size
        );

        return {
          totalViews: data.totalViews || 0,
          uniqueVisitorsCount: totalUniqueCount,
          todayViews,
          todayVisitors,
          deviceDistribution: data.deviceDistribution || { mobile_ios: 0, mobile_android: 0, tablet: 0, desktop: 0 },
          geoDistribution,
          viewsByRoute,
          topRoutes: sortedTopRoutes,
          dailyHistory,
          hourlyToday: {},
          recentEvents: [],
          updatedAt: data.updatedAt && (data.updatedAt as any).toDate ? (data.updatedAt as any).toDate().toISOString() : new Date().toISOString(),
          provider: 'firebase_firestore',
        };
      }
    }
  } catch (cloudErr) {
    console.warn('[Firestore Analytics Read Fallback to local]:', cloudErr);
  }

  // 2. Fallback a base local en caso de no contar con conexión cloud
  const db = await getTournamentDb();
  const a = db.analytics || getDefaultAnalyticsData(todayDateStr);
  const todayStats = a.dailyHistory?.[todayDateStr] || { views: 0, uniqueSessions: [] };

  const sortedTopRoutes = Object.entries(a.viewsByRoute || {})
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views);

  return {
    totalViews: a.totalViews || 0,
    uniqueVisitorsCount: a.uniqueSessions?.length || 0,
    todayViews: todayStats.views || 0,
    todayVisitors: todayStats.uniqueSessions?.length || 0,
    deviceDistribution: a.deviceDistribution || { mobile_ios: 0, mobile_android: 0, tablet: 0, desktop: 0 },
    geoDistribution: a.geoDistribution || {},
    viewsByRoute: a.viewsByRoute || {},
    topRoutes: sortedTopRoutes,
    dailyHistory: Object.entries(a.dailyHistory || {}).map(([date, data]) => ({
      date,
      views: data.views,
      visitors: data.uniqueSessions?.length || 0,
    })),
    hourlyToday: a.hourlyToday || {},
    recentEvents: a.recentEvents || [],
    updatedAt: db.updatedAt,
    provider: 'local_json',
  };
}

/**
 * Obtiene todos los partidos oficiales desde la base de datos central
 */
export async function getAllMatchesFromDb(): Promise<Match[]> {
  const db = await getTournamentDb();
  if (!db.matches || db.matches.length === 0) {
    db.matches = INITIAL_MATCHES;
    await saveTournamentDb(db);
  }
  return db.matches || [];
}

/**
 * Actualiza o registra un partido en la base de datos central
 */
export async function updateMatchInDb(updatedMatch: Match): Promise<Match[]> {
  const db = await getTournamentDb();
  const current = db.matches || INITIAL_MATCHES;
  const index = current.findIndex((m) => m.id === updatedMatch.id);

  const finalMatch: Match = {
    ...updatedMatch,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    current[index] = finalMatch;
  } else {
    current.push(finalMatch);
  }

  db.matches = current;
  await saveTournamentDb(db);
  return current;
}
