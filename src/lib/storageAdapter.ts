'use client';

import { Match, PhotoItem, ShortVideo, Sponsor, TierOption } from '@/types/tournament';
import { INITIAL_MATCHES, INITIAL_PHOTOS, INITIAL_SHORT_VIDEOS, INITIAL_SPONSORS } from './initialData';
import { DEFAULT_ACTIVE_TIER } from '@/config/tierConfig';

const KEYS = {
  TIER: 'costa_de_oro_tier_active',
  MATCHES: 'costa_de_oro_matches_v3',
  SPONSORS: 'costa_de_oro_sponsors',
  VIDEOS: 'costa_de_oro_videos',
  PHOTOS: 'costa_de_oro_photos',
  VOTES: 'costa_de_oro_mvp_votes',
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

  resetToInitial(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.TIER);
    localStorage.removeItem(KEYS.MATCHES);
    localStorage.removeItem(KEYS.SPONSORS);
    localStorage.removeItem(KEYS.VIDEOS);
    localStorage.removeItem(KEYS.PHOTOS);
    window.location.reload();
  },
};
