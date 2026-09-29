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
  mascot?: string;
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

export interface MatchEvent {
  id: string;
  minute?: number;
  period?: string;
  type: 'goal' | 'point' | 'yellow_card' | 'red_card' | 'foul' | 'mvp' | 'set_end';
  teamSide: 'home' | 'away';
  playerName?: string;
  playerNumber?: number;
  description?: string;
}

export interface SetScore {
  home: number;
  away: number;
}

export interface QuarterScore {
  home: number;
  away: number;
}

export interface MatchOfficialReport {
  refereeName?: string;
  refereeAssistant?: string;
  tableOfficial?: string;
  homeDelegate?: string;
  awayDelegate?: string;
  homeCaptain?: string;
  awayCaptain?: string;
  incidentsNotes?: string;
  fairPlayHomeScore?: number; // 1 to 5
  fairPlayAwayScore?: number; // 1 to 5
  isSigned?: boolean;
  signedAt?: string;
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
  quarterScores?: QuarterScore[]; // For Basketball (Q1, Q2, Q3, Q4, OT)
  halfScores?: { home1T: number; away1T: number; home2T: number; away2T: number }; // For Football
  events?: MatchEvent[];
  officialReport?: MatchOfficialReport;
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

export interface SportDefinition {
  id: string;
  name: string;
  iconName: 'futbol' | 'voleibol' | 'baloncesto' | 'generic';
  primaryColor: string;
  accentColor: string;
  lightBg: string;
  description: string;
  isCustom?: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorRelation?: string;
  text: string;
  createdAt: string;
}

export interface FamilyPost {
  id: string;
  schoolId: string;
  authorName: string;
  authorRelation: 'Mamá' | 'Papá' | 'Abuelo/a' | 'Hermano/a' | 'Familia' | 'Compañero/a' | 'Entrenador';
  message: string;
  mediaType?: 'photo' | 'video' | 'none';
  mediaUrl?: string;
  thumbnailUrl?: string;
  sportId?: string;
  likesCount: number;
  applauseCount: number;
  featuredVotes: number;
  isFeatured: boolean;
  createdAt: string;
  humanValueTag?: 'esfuerzo' | 'companerismo' | 'resiliencia' | 'fairplay' | 'alegria';
  aiModerationStatus?: 'approved' | 'flagged' | 'pending';
  comments?: PostComment[];
}

export interface Player {
  id: string;
  jerseyNumber: number;
  fullName: string;
  position?: string;
  isCaptain?: boolean;
  birthYear?: number;
  categoryDivision?: string;
}

export interface TeamRoster {
  schoolId: string;
  sport: SportType;
  categoryId: string;
  coachName?: string;
  assistantCoachName?: string;
  players: Player[];
  updatedAt?: string;
}

