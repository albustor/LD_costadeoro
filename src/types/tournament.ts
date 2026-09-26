export type SportType = 'futbol' | 'baloncesto' | 'voleibol';

export type TierOption = 'option1' | 'option2' | 'option3';

export interface TierConfig {
  id: TierOption;
  name: string;
  subtitle: string;
  priceUSD: number;
  priceLabel: string;
  badge: string;
  description: string;
  features: {
    liveScores: boolean;
    fullStandings: boolean;
    cleanInstitutionalUI: boolean;
    sponsorBanners: boolean;
    interactiveCoupons: boolean;
    officialPhotos: boolean;
    fanShortsVideo: boolean;
    communityMVPVoting: boolean;
    adminScoreControl: boolean;
    commercialSharing: boolean;
  };
}

export interface School {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  location: string;
  city: string;
  founded?: number;
}

export interface Category {
  id: string;
  name: string;
  sport: SportType;
  gender: 'Femenino' | 'Masculino' | 'Mixto';
  division: 'Categoría C (2010-2011)' | 'Categoría D (2012-2014)' | 'Abierta';
  dayOfWeek: string;
  scheduleTime: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed';

export interface SetScore {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  jornada: number;
  jornadaName: string;
  categoryId: string;
  sport: SportType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  venue: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  homeSetsWon?: number;
  awaySetsWon?: number;
  setScores?: SetScore[];
  status: MatchStatus;
  currentPeriod?: string; // '1.er Tiempo', '2.° Tiempo', 'Set 2', 'Q3', 'Final'
  minute?: number;
  mvpPlayerName?: string;
  mvpSchoolId?: string;
  notes?: string;
  updatedAt: string;
}

export interface Standing {
  teamId: string;
  school: School;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number; // GF / PF / Puntos Voleibol
  pointsAgainst: number; // GC / PC
  diff: number; // DG / PD
  points: number; // PTS
  setsWon?: number;
  setsLost?: number;
  setsDiff?: number;
  form: ('W' | 'D' | 'L')[];
  position?: number;
}

export interface ShortVideo {
  id: string;
  title: string;
  authorName: string;
  authorRole: 'Familia' | 'Estudiante' | 'Entrenador' | 'Curiol Studio';
  schoolId: string;
  categoryId: string;
  matchId?: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  approved: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  categoryId: string;
  schoolId?: string;
  jornada: number;
  date: string;
  moment: 'previo' | 'durante' | 'final_premiacion';
  momentLabel: string;
  imageUrl: string;
  watermarkUrl?: string;
  photographer: 'Curiol Studio';
  viewsCount: number;
  downloadUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  categoryTag: string;
  tier: 'Diamante' | 'Oro' | 'Plata';
  logoUrl: string;
  bannerUrl: string;
  promoTitle: string;
  promoDescription: string;
  couponCode: string;
  discountPercentage: number;
  whatsappUrl: string;
  websiteUrl: string;
  currentClicks: number;
  estimatedImpressions: number;
}

export interface MVPVote {
  id: string;
  matchId: string;
  schoolId: string;
  playerName: string;
  votesCount: number;
}
