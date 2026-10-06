'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, FamilyPost, Match, PhotoItem, PostComment, School, ShortVideo, Sponsor, Standing } from '@/types/tournament';
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
  familyPosts: FamilyPost[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  getStandingsForCategory: (categoryId: string) => Standing[];
  updateMatch: (match: Match) => void;
  recordSponsorClick: (sponsorId: string) => void;
  addVideo: (video: Omit<ShortVideo, 'id' | 'createdAt' | 'likesCount' | 'viewsCount' | 'approved'>) => ShortVideo;
  addPhoto: (photo: Omit<PhotoItem, 'id' | 'createdAt'>) => PhotoItem;
  addFamilyPost: (post: Omit<FamilyPost, 'id' | 'createdAt' | 'likesCount' | 'applauseCount' | 'featuredVotes' | 'comments'> & { comments?: PostComment[] }) => FamilyPost;
  reactToFamilyPost: (postId: string, type: 'like' | 'applause' | 'feature') => void;
  addCommentToFamilyPost: (postId: string, comment: Omit<PostComment, 'id' | 'createdAt'>) => void;
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
  const [familyPosts, setFamilyPosts] = useState<FamilyPost[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES_DATA[0].id);

  useEffect(() => {
    setMatches(tournamentStorage.getMatches());
    setSponsors(tournamentStorage.getSponsors());
    setVideos(tournamentStorage.getVideos());
    setPhotos(tournamentStorage.getPhotos());
    setFamilyPosts(tournamentStorage.getFamilyPosts());

    // Sincronizar partidos oficiales desde la base de datos centralizada
    tournamentStorage.fetchRemoteMatches().then((remoteMatches) => {
      if (remoteMatches && remoteMatches.length > 0) {
        setMatches(remoteMatches);
      }
    });

    // Sincronizar con la base de datos centralizada del servidor
    tournamentStorage.fetchRemoteFamilyPosts().then((posts) => {
      if (posts && posts.length > 0) {
        setFamilyPosts(posts);
      }
    });

    const handleMatchesUpdate = (e: Event) => {
      const custom = e as CustomEvent<Match[]>;
      if (custom.detail) setMatches(custom.detail);
    };

    const handleVideosUpdate = (e: Event) => {
      const custom = e as CustomEvent<ShortVideo[]>;
      if (custom.detail) setVideos(custom.detail);
    };

    const handlePhotosUpdate = (e: Event) => {
      const custom = e as CustomEvent<PhotoItem[]>;
      if (custom.detail) setPhotos(custom.detail);
    };

    const handleFamilyPostsUpdate = (e: Event) => {
      const custom = e as CustomEvent<FamilyPost[]>;
      if (custom.detail) setFamilyPosts(custom.detail);
    };

    window.addEventListener('matches_updated', handleMatchesUpdate);
    window.addEventListener('videos_updated', handleVideosUpdate);
    window.addEventListener('photos_updated', handlePhotosUpdate);
    window.addEventListener('family_posts_updated', handleFamilyPostsUpdate);

    return () => {
      window.removeEventListener('matches_updated', handleMatchesUpdate);
      window.removeEventListener('videos_updated', handleVideosUpdate);
      window.removeEventListener('photos_updated', handlePhotosUpdate);
      window.removeEventListener('family_posts_updated', handleFamilyPostsUpdate);
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

  const addPhoto = (photo: Omit<PhotoItem, 'id' | 'createdAt'>) => {
    const created = tournamentStorage.addPhoto(photo);
    setPhotos(tournamentStorage.getPhotos());
    return created;
  };

  const addFamilyPost = (post: Omit<FamilyPost, 'id' | 'createdAt' | 'likesCount' | 'applauseCount' | 'featuredVotes' | 'comments'> & { comments?: PostComment[] }) => {
    const created = tournamentStorage.addFamilyPost(post);
    setFamilyPosts(tournamentStorage.getFamilyPosts());
    return created;
  };

  const reactToFamilyPost = (postId: string, type: 'like' | 'applause' | 'feature') => {
    const updated = tournamentStorage.reactToFamilyPost(postId, type);
    setFamilyPosts(updated);
  };

  const addCommentToFamilyPost = (postId: string, comment: Omit<PostComment, 'id' | 'createdAt'>) => {
    const updated = tournamentStorage.addCommentToFamilyPost(postId, comment);
    setFamilyPosts(updated);
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
        familyPosts,
        selectedCategoryId,
        setSelectedCategoryId,
        getStandingsForCategory,
        updateMatch,
        recordSponsorClick,
        addVideo,
        addPhoto,
        addFamilyPost,
        reactToFamilyPost,
        addCommentToFamilyPost,
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
