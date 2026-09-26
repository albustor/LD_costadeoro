'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Match, PhotoItem, School, ShortVideo, Sponsor, Standing } from '@/types/tournament';
import { CATEGORIES_DATA, SCHOOLS_DATA, TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { tournamentStorage } from '@/lib/storageAdapter';
import { calculateStandings } from '@/lib/sportsEngine';

interface TournamentContextType {
  tournament: typeof TOURNAMENT_CONFIG;
  schools: School[];
  categories: Category[];
  matches: Match[];
  sponsors: Sponsor[];
  videos: ShortVideo[];
  photos: PhotoItem[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  getStandingsForCategory: (categoryId: string) => Standing[];
  updateMatch: (match: Match) => void;
  recordSponsorClick: (sponsorId: string) => void;
  addVideo: (video: Omit<ShortVideo, 'id' | 'createdAt' | 'likesCount' | 'viewsCount' | 'approved'>) => ShortVideo;
  likeVideo: (videoId: string) => void;
  getSchoolById: (id: string) => School | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [videos, setVideos] = useState<ShortVideo[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES_DATA[0].id);

  useEffect(() => {
    setMatches(tournamentStorage.getMatches());
    setSponsors(tournamentStorage.getSponsors());
    setVideos(tournamentStorage.getVideos());
    setPhotos(tournamentStorage.getPhotos());

    const handleMatchesUpdate = (e: Event) => {
      const custom = e as CustomEvent<Match[]>;
      if (custom.detail) setMatches(custom.detail);
    };

    const handleVideosUpdate = (e: Event) => {
      const custom = e as CustomEvent<ShortVideo[]>;
      if (custom.detail) setVideos(custom.detail);
    };

    window.addEventListener('matches_updated', handleMatchesUpdate);
    window.addEventListener('videos_updated', handleVideosUpdate);

    return () => {
      window.removeEventListener('matches_updated', handleMatchesUpdate);
      window.removeEventListener('videos_updated', handleVideosUpdate);
    };
  }, []);

  const updateMatch = (match: Match) => {
    const updated = tournamentStorage.updateMatch(match);
    setMatches(updated);
  };

  const recordSponsorClick = (sponsorId: string) => {
    tournamentStorage.recordSponsorClick(sponsorId);
    setSponsors(tournamentStorage.getSponsors());
  };

  const addVideo = (video: Omit<ShortVideo, 'id' | 'createdAt' | 'likesCount' | 'viewsCount' | 'approved'>) => {
    const created = tournamentStorage.addVideo(video);
    setVideos(tournamentStorage.getVideos());
    return created;
  };

  const likeVideo = (videoId: string) => {
    tournamentStorage.likeVideo(videoId);
    setVideos(tournamentStorage.getVideos());
  };

  const getStandingsForCategory = (categoryId: string): Standing[] => {
    const category = CATEGORIES_DATA.find((c) => c.id === categoryId);
    if (!category) return [];
    return calculateStandings(categoryId, category.sport, matches, SCHOOLS_DATA);
  };

  const getSchoolById = (id: string): School | undefined => {
    return SCHOOLS_DATA.find((s) => s.id === id);
  };

  const getCategoryById = (id: string): Category | undefined => {
    return CATEGORIES_DATA.find((c) => c.id === id);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament: TOURNAMENT_CONFIG,
        schools: SCHOOLS_DATA,
        categories: CATEGORIES_DATA,
        matches,
        sponsors,
        videos,
        photos,
        selectedCategoryId,
        setSelectedCategoryId,
        getStandingsForCategory,
        updateMatch,
        recordSponsorClick,
        addVideo,
        likeVideo,
        getSchoolById,
        getCategoryById,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
