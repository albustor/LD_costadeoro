'use client';

import React, { useState } from 'react';

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
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-18 h-18',
};

// Direct mapping to official files stored in public/logos/colegios/
const schoolLogoFiles: Record<string, { src: string; alt: string; name: string }> = {
  'la-paz-cabo-velas': {
    src: '/logos/colegios/la_paz_cabo_velas.svg',
    alt: 'La Paz Community School - Cabo Velas',
    name: 'La Paz CV',
  },
  'la-paz-tempisque': {
    src: '/logos/colegios/la_paz_tempisque.svg',
    alt: 'La Paz Community School - Tempisque',
    name: 'La Paz TP',
  },
  'cria': {
    src: '/logos/colegios/cria.svg',
    alt: 'Costa Rica International Academy',
    name: 'CRIA',
  },
  'journey-school': {
    src: '/logos/colegios/journey_school.svg',
    alt: 'The Journey School of Costa Rica',
    name: 'The Journey School',
  },
  'vittorino': {
    src: '/logos/colegios/vittorino.svg',
    alt: 'Centro Educativo Monseñor Vittorino Girardi',
    name: 'Vittorino Prep',
  },
  'educarte': {
    src: '/logos/colegios/educarte.svg',
    alt: 'Educarte Bilingual High School',
    name: 'Educarte',
  },
};

/**
 * Official School Emblem Component:
 * Renders the official stored SVG/PNG logo files from /logos/colegios/
 * with automatic fallback to native inline vector geometry.
 */
export function SchoolEmblem({
  schoolId,
  size = 'md',
  className = '',
  showBorder = true,
}: SchoolEmblemProps) {
  const [hasError, setHasError] = useState(false);
  const sizeClass = sizeMap[size] || sizeMap.md;
  const logoInfo = schoolLogoFiles[schoolId];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xs transition-transform ${
        showBorder ? 'border border-slate-200/90 bg-white p-0.5' : ''
      } ${sizeClass} ${className}`}
      title={logoInfo?.name || schoolId}
    >
      {logoInfo && !hasError ? (
        <img
          src={logoInfo.src}
          alt={logoInfo.alt}
          className="w-full h-full object-contain rounded-xl"
          loading="eager"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
          🏫
        </div>
      )}
    </div>
  );
}
