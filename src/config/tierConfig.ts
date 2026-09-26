import { TierConfig, TierOption } from '@/types/tournament';

export const TIERS_CATALOG: Record<TierOption, TierConfig> = {
  option1: {
    id: 'option1',
    name: 'Opción 1: Plataforma Institucional Limpia',
    subtitle: 'Presencia Deportiva Oficial 100% Sin Publicidad',
    priceUSD: 650,
    priceLabel: '$650 USD',
    badge: 'Institucional Limpia',
    description: 'Diseño minimalista y exclusivo enfocado en la identidad de La Paz Community School y los colegios participantes, sin banners comerciales.',
    features: {
      liveScores: true,
      fullStandings: true,
      cleanInstitutionalUI: true,
      sponsorBanners: false,
      interactiveCoupons: false,
      officialPhotos: false,
      fanShortsVideo: false,
      communityMVPVoting: false,
      adminScoreControl: true,
      commercialSharing: false,
    },
  },
  option2: {
    id: 'option2',
    name: 'Opción 2: Co-Gestión Comercial',
    subtitle: 'Distribución Compartida de Espacios 50/50',
    priceUSD: 800,
    priceLabel: '$800 USD',
    badge: 'Co-Gestión 50/50',
    description: 'La institución aporta 2 patrocinadores y Curiol Studio comercializa 2 espacios. Permite recuperar parte de la inversión inicial.',
    features: {
      liveScores: true,
      fullStandings: true,
      cleanInstitutionalUI: false,
      sponsorBanners: true,
      interactiveCoupons: false,
      officialPhotos: true,
      fanShortsVideo: false,
      communityMVPVoting: false,
      adminScoreControl: true,
      commercialSharing: true,
    },
  },
  option3: {
    id: 'option3',
    name: 'Opción 3: Experiencia Total y Comercial Autónoma',
    subtitle: 'Suite Completa con Video Fan Shorts y Monetización',
    priceUSD: 1300,
    priceLabel: '$1,300 USD',
    badge: 'Comercial Autónoma',
    description: 'El paquete más robusto y rentable: 4 patrocinadores exclusivos con cupones WhatsApp, mural de videos cortos y votación MVP.',
    features: {
      liveScores: true,
      fullStandings: true,
      cleanInstitutionalUI: false,
      sponsorBanners: true,
      interactiveCoupons: true,
      officialPhotos: true,
      fanShortsVideo: true,
      communityMVPVoting: true,
      adminScoreControl: true,
      commercialSharing: true,
    },
  },
};

// Default active tier is Option 1 (Institucional Limpia) as chosen by the school
export const DEFAULT_ACTIVE_TIER: TierOption = 'option1';

export const ADDITIONAL_SERVICES = {
  shortVideoAddon: {
    name: 'Módulo de Videos Cortos (Shorts de Familias en Bunny.net)',
    priceUSD: 220,
    priceLabel: '$220 USD',
  },
  scoreManagementAssistance: {
    name: 'Asistencia y Carga Externa de Actas (Curiol Studio)',
    priceUSD: 150,
    priceLabel: '$150 USD por temporada',
  },
  photographyPerEvent: {
    name: 'Cobertura Fotográfica por Jornada Individual',
    priceUSD: 320,
    priceLabel: '$320 USD por jornada (3 momentos)',
  },
  photographyFinalsPackage: {
    name: 'Paquete Fotográfico Semana de Finales (5 Días)',
    priceUSD: 290,
    priceLabel: '$290 USD por día de final ($1,450 USD total 5 días)',
  },
};
