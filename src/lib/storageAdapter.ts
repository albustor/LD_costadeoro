'use client';

import { FamilyPost, Match, PhotoItem, PostComment, ShortVideo, Sponsor, TierOption } from '@/types/tournament';
import { INITIAL_FAMILY_POSTS, INITIAL_MATCHES, INITIAL_PHOTOS, INITIAL_SHORT_VIDEOS, INITIAL_SPONSORS } from './initialData';
import { DEFAULT_ACTIVE_TIER } from '@/config/tierConfig';

const KEYS = {
  TIER: 'costa_de_oro_tier_active',
  MATCHES: 'costa_de_oro_matches_v5',
  SPONSORS: 'costa_de_oro_sponsors',
  VIDEOS: 'costa_de_oro_videos',
  PHOTOS: 'costa_de_oro_photos',
  VOTES: 'costa_de_oro_mvp_votes',
  FAMILY_POSTS: 'costa_de_oro_family_posts',
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

export const tournamentStorage = {
  getTier(): TierOption {
    return safeGet<TierOption>(KEYS.TIER, DEFAULT_ACTIVE_TIER);
  },

  setTier(tier: TierOption): void {
    safeSet(KEYS.TIER, tier);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tier_changed', { detail: tier }));
    }
  },

  getMatches(): Match[] {
    return safeGet<Match[]>(KEYS.MATCHES, INITIAL_MATCHES);
  },

  async fetchRemoteMatches(): Promise<Match[]> {
    if (typeof window === 'undefined') return INITIAL_MATCHES;
    try {
      const res = await fetch('/api/matches', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json?.matches || []);
        if (Array.isArray(data) && data.length > 0) {
          safeSet(KEYS.MATCHES, data);
          window.dispatchEvent(new CustomEvent('matches_updated', { detail: data }));
          return data;
        }
      }
    } catch (e) {
      console.warn('[storageAdapter] Error sincronizando partidos:', e);
    }
    return this.getMatches();
  },

  updateMatch(updatedMatch: Match): Match[] {
    const matches = this.getMatches();
    const index = matches.findIndex((m) => m.id === updatedMatch.id);
    let newMatches: Match[];
    if (index >= 0) {
      newMatches = [...matches];
      newMatches[index] = { ...updatedMatch, updatedAt: new Date().toISOString() };
    } else {
      newMatches = [updatedMatch, ...matches];
    }
    safeSet(KEYS.MATCHES, newMatches);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('matches_updated', { detail: newMatches }));
      // Persistir al servidor centralizado
      fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: updatedMatch }),
      }).catch((e) => console.warn('[storageAdapter] Error guardando partido en servidor:', e));
    }
    return newMatches;
  },

  getSponsors(): Sponsor[] {
    return safeGet<Sponsor[]>(KEYS.SPONSORS, INITIAL_SPONSORS);
  },

  recordSponsorClick(sponsorId: string): void {
    const sponsors = this.getSponsors();
    const updated = sponsors.map((sp) => {
      if (sp.id === sponsorId) {
        return { ...sp, currentClicks: sp.currentClicks + 1 };
      }
      return sp;
    });
    safeSet(KEYS.SPONSORS, updated);
  },

  getVideos(): ShortVideo[] {
    return safeGet<ShortVideo[]>(KEYS.VIDEOS, INITIAL_SHORT_VIDEOS);
  },

  addVideo(newVideo: Omit<ShortVideo, 'id' | 'createdAt' | 'likesCount' | 'viewsCount' | 'approved'>): ShortVideo {
    const videos = this.getVideos();
    const created: ShortVideo = {
      ...newVideo,
      id: `v-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
      viewsCount: 1,
      approved: true,
    };
    const updated = [created, ...videos];
    safeSet(KEYS.VIDEOS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('videos_updated', { detail: updated }));
    }
    return created;
  },

  likeVideo(videoId: string): number {
    const videos = this.getVideos();
    let newLikes = 0;
    const updated = videos.map((v) => {
      if (v.id === videoId) {
        newLikes = v.likesCount + 1;
        return { ...v, likesCount: newLikes };
      }
      return v;
    });
    safeSet(KEYS.VIDEOS, updated);
    return newLikes;
  },

  getPhotos(): PhotoItem[] {
    return safeGet<PhotoItem[]>(KEYS.PHOTOS, INITIAL_PHOTOS);
  },

  addPhoto(newPhoto: Omit<PhotoItem, 'id' | 'createdAt'>): PhotoItem {
    const photos = this.getPhotos();
    const created: PhotoItem = {
      ...newPhoto,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...photos];
    safeSet(KEYS.PHOTOS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photos_updated', { detail: updated }));
    }
    return created;
  },

  getFamilyPosts(): FamilyPost[] {
    return safeGet<FamilyPost[]>(KEYS.FAMILY_POSTS, INITIAL_FAMILY_POSTS);
  },

  async fetchRemoteFamilyPosts(): Promise<FamilyPost[]> {
    if (typeof window === 'undefined') return this.getFamilyPosts();
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          safeSet(KEYS.FAMILY_POSTS, json.data);
          window.dispatchEvent(new CustomEvent('family_posts_updated', { detail: json.data }));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[StorageAdapter] Offline fallback para posts:', err);
    }
    return this.getFamilyPosts();
  },

  addFamilyPost(newPost: Omit<FamilyPost, 'id' | 'createdAt' | 'likesCount' | 'applauseCount' | 'featuredVotes' | 'comments'> & { comments?: PostComment[] }): FamilyPost {
    const posts = this.getFamilyPosts();
    const created: FamilyPost = {
      ...newPost,
      id: `fp-${Date.now()}`,
      createdAt: 'Justo ahora',
      likesCount: 0,
      applauseCount: 0,
      featuredVotes: 0,
      isFeatured: false,
      comments: newPost.comments || [],
    };
    const updated = [created, ...posts];
    safeSet(KEYS.FAMILY_POSTS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('family_posts_updated', { detail: updated }));

      // Sincronizar en segundo plano con la base de datos central del servidor
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            // Actualizar ID oficial del servidor si difiere
            const serverUpdated = this.getFamilyPosts().map((p) => (p.id === created.id ? data.data : p));
            safeSet(KEYS.FAMILY_POSTS, serverUpdated);
            window.dispatchEvent(new CustomEvent('family_posts_updated', { detail: serverUpdated }));
          }
        })
        .catch((err) => console.warn('[StorageAdapter Sync Post Error]:', err));
    }
    return created;
  },

  reactToFamilyPost(postId: string, type: 'like' | 'applause' | 'feature'): FamilyPost[] {
    const posts = this.getFamilyPosts();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const updatedLikes = type === 'like' ? (p.likesCount || 0) + 1 : (p.likesCount || 0);
        const updatedApplause = type === 'applause' ? (p.applauseCount || 0) + 1 : (p.applauseCount || 0);
        const updatedVotes = type === 'feature' ? (p.featuredVotes || 0) + 1 : (p.featuredVotes || 0);
        const isFeatured = updatedLikes + updatedApplause >= 35 || updatedVotes >= 8 || p.isFeatured;
        return {
          ...p,
          likesCount: updatedLikes,
          applauseCount: updatedApplause,
          featuredVotes: updatedVotes,
          isFeatured,
        };
      }
      return p;
    });
    safeSet(KEYS.FAMILY_POSTS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('family_posts_updated', { detail: updated }));

      // Sincronizar reacción en el servidor
      fetch(`/api/posts/${encodeURIComponent(postId)}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      }).catch((err) => console.warn('[StorageAdapter Sync React Error]:', err));
    }
    return updated;
  },

  addCommentToFamilyPost(postId: string, comment: Omit<PostComment, 'id' | 'createdAt'>): FamilyPost[] {
    const posts = this.getFamilyPosts();
    const newComment: PostComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      createdAt: 'Justo ahora',
    };
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    });
    safeSet(KEYS.FAMILY_POSTS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('family_posts_updated', { detail: updated }));

      // Sincronizar comentario en el servidor
      fetch(`/api/posts/${encodeURIComponent(postId)}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      }).catch((err) => console.warn('[StorageAdapter Sync Comment Error]:', err));
    }
    return updated;
  },

  resetToInitial(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.TIER);
    localStorage.removeItem(KEYS.MATCHES);
    localStorage.removeItem(KEYS.SPONSORS);
    localStorage.removeItem(KEYS.VIDEOS);
    localStorage.removeItem(KEYS.PHOTOS);
    localStorage.removeItem(KEYS.FAMILY_POSTS);
    window.location.reload();
  },
};
