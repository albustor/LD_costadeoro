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

export interface TournamentDbData {
  posts: FamilyPost[];
  photos: PhotoItem[];
  videos: ShortVideo[];
  matches: Match[];
  rosters: TeamRoster[];
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
