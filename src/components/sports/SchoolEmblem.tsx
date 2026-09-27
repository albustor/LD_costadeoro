'use client';

import React from 'react';

export type SchoolId =
  | 'la-paz-cabo-velas'
  | 'la-paz-tempisque'
  | 'cria'
  | 'journey-school'
  | 'vittorino'
  | 'educarte'
  | string;

interface SchoolEmblemProps {
  schoolId: SchoolId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const sizeMap = {
  xs: { box: 'w-6 h-6', icon: 16 },
  sm: { box: 'w-8 h-8', icon: 20 },
  md: { box: 'w-10 h-10', icon: 26 },
  lg: { box: 'w-14 h-14', icon: 36 },
  xl: { box: 'w-18 h-18', icon: 48 },
};

/**
 * High-definition, native vector SVG school emblems for Costa de Oro 2026.
 * Zero external network dependency, ultra-crisp on high-DPI mobile screens under bright sunlight.
 */
export function SchoolEmblem({
  schoolId,
  size = 'md',
  className = '',
  showBorder = true,
}: SchoolEmblemProps) {
  const currentSize = sizeMap[size] || sizeMap.md;

  const renderVector = () => {
    switch (schoolId) {
      case 'la-paz-cabo-velas':
        return (
          // La Paz Cabo Velas: Pacific Wave + Peace Dove Geometry
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lp-cv-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0284C7" />
                <stop offset="1" stopColor="#0369A1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#lp-cv-grad)" />
            {/* Wave 1 */}
            <path
              d="M18 56C24 44 36 44 44 54C52 64 64 64 72 52C76 46 80 46 84 50"
              stroke="#FFFFFF"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Wave 2 */}
            <path
              d="M22 68C28 58 38 58 46 66C54 74 64 74 72 64C76 59 79 59 82 62"
              stroke="#BAE6FD"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Peace Dove / Sun Silhouette */}
            <path
              d="M50 22C42 22 36 28 36 34C36 42 46 44 50 48C54 44 64 42 64 34C64 28 58 22 50 22Z"
              fill="#FFFFFF"
            />
            <circle cx="50" cy="30" r="3.5" fill="#0284C7" />
          </svg>
        );

      case 'la-paz-tempisque':
        return (
          // La Paz Tempisque: Emerald Sprout + Valley Canopy
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lp-tp-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="1" stopColor="#047857" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#lp-tp-grad)" />
            {/* Central Sprout Stem */}
            <path d="M50 78V34" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            {/* Leaf Right */}
            <path
              d="M50 48C62 48 72 38 72 26C58 26 50 36 50 48Z"
              fill="#A7F3D0"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Leaf Left */}
            <path
              d="M50 60C38 60 28 50 28 38C42 38 50 48 50 60Z"
              fill="#FFFFFF"
            />
            <circle cx="50" cy="24" r="5" fill="#FDE047" />
          </svg>
        );

      case 'cria':
        return (
          // Costa Rica International Academy: Heraldic Falcon/Eagle Crest
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cria-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B91C1C" />
                <stop offset="1" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            {/* Shield Base */}
            <path
              d="M50 10L82 22V52C82 72 68 86 50 92C32 86 18 72 18 52V22L50 10Z"
              fill="url(#cria-grad)"
              stroke="#F59E0B"
              strokeWidth="3.5"
            />
            {/* Eagle Wing Profile */}
            <path
              d="M50 30L64 44L56 50L68 58L50 76L32 58L44 50L36 44L50 30Z"
              fill="#FFFFFF"
            />
            {/* Golden Star Accent */}
            <polygon
              points="50,42 52,48 58,48 53,52 55,58 50,54 45,58 47,52 42,48 48,48"
              fill="#F59E0B"
            />
          </svg>
        );

      case 'journey-school':
        return (
          // The Journey School: Nautical Compass / Rosa de los Vientos
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tjs-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D97706" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#tjs-grad)" />
            <circle cx="50" cy="50" r="38" stroke="#FEF3C7" strokeWidth="2.5" strokeDasharray="3 3" />
            {/* 4-Point Compass Star */}
            <polygon points="50,16 56,44 84,50 56,56 50,84 44,56 16,50 44,44" fill="#FFFFFF" />
            <polygon points="50,16 56,44 50,50 44,44" fill="#0D9488" />
            <polygon points="84,50 56,56 50,50 56,44" fill="#0F766E" />
            <polygon points="50,84 44,56 50,50 56,56" fill="#0D9488" />
            <polygon points="16,50 44,44 50,50 44,56" fill="#0F766E" />
            <circle cx="50" cy="50" r="5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );

      case 'vittorino':
        return (
          // Instituto Vittorino Prep: Royal Academic Shield
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vit-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <path
              d="M50 12L80 24V54C80 72 66 84 50 90C34 84 20 72 20 54V24L50 12Z"
              fill="url(#vit-grad)"
              stroke="#E0E7FF"
              strokeWidth="3.5"
            />
            {/* Academic Torch / Book Symbol */}
            <path
              d="M32 46C38 42 46 44 50 48C54 44 62 42 68 46V66C62 62 54 62 50 66C46 62 38 62 32 66V46Z"
              fill="#FFFFFF"
            />
            <path d="M50 30V48" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="26" r="4" fill="#F59E0B" />
          </svg>
        );

      case 'educarte':
        return (
          // Educarte Bilingual High School: Radiant Solar Crest
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="edu-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#E11D48" />
              </linearGradient>
            </defs>
            {/* 12-Ray Sun Crest */}
            <circle cx="50" cy="50" r="46" fill="url(#edu-grad)" />
            <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round">
              <line x1="50" y1="16" x2="50" y2="24" />
              <line x1="50" y1="76" x2="50" y2="84" />
              <line x1="16" y1="50" x2="24" y2="50" />
              <line x1="76" y1="50" x2="84" y2="50" />
              <line x1="26" y1="26" x2="32" y2="32" />
              <line x1="68" y1="68" x2="74" y2="74" />
              <line x1="26" y1="74" x2="32" y2="68" />
              <line x1="68" y1="32" x2="74" y2="26" />
            </g>
            {/* Inner Core */}
            <circle cx="50" cy="50" r="18" fill="#FFFFFF" />
            <path
              d="M44 44L56 50L44 56Z"
              fill="#E11D48"
            />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            🏅
          </div>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xs transition-transform ${
        showBorder ? 'border border-slate-200/80 bg-white p-0.5' : ''
      } ${currentSize.box} ${className}`}
      title={schoolId}
    >
      {renderVector()}
    </div>
  );
}
