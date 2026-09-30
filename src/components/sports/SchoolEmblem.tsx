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
  xs: 'w-10 h-10',
  sm: 'w-14 h-14 sm:w-16 sm:h-16',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  lg: 'w-32 h-32 sm:w-36 sm:h-36',
  xl: 'w-44 h-44 sm:w-48 sm:h-48',
};

// Mapeo directo a los archivos oficiales locales de alta resolución en public/logos/colegios/
const schoolLogoFiles: Record<string, { src: string; fallbackSrc?: string; alt: string; name: string }> = {
  'la-paz-cabo-velas': {
    src: '/logos/colegios/la_paz_cabo_velas.png',
    fallbackSrc: '/logos/colegios/la_paz_cabo_velas.svg',
    alt: 'Logo Oficial La Paz Community School Cabo Velas',
    name: 'La Paz Community School Cabo Velas',
  },
  'la-paz-tempisque': {
    src: '/logos/colegios/la_paz_tempisque.png',
    fallbackSrc: '/logos/colegios/la_paz_tempisque.svg',
    alt: 'Logo Oficial La Paz Community School Tempisque',
    name: 'La Paz Community School Tempisque',
  },
  'cria': {
    src: '/logos/colegios/cria.png',
    fallbackSrc: '/logos/colegios/cria.svg',
    alt: 'Logo Oficial Costa Rica International Academy (CRIA)',
    name: 'CRIA',
  },
  'journey-school': {
    src: '/logos/colegios/journey_school.png',
    fallbackSrc: '/logos/colegios/journey_school.svg',
    alt: 'Logo Oficial The Journey School of Costa Rica',
    name: 'The Journey School',
  },
  'vittorino': {
    src: '/logos/colegios/vittorino.svg',
    alt: 'Logo Oficial Centro Educativo Monseñor Vittorino Girardi',
    name: 'Vittorino Prep',
  },
  'educarte': {
    src: '/logos/colegios/educarte.png',
    fallbackSrc: '/logos/colegios/educarte.svg',
    alt: 'Logo Oficial Educarte Bilingual High School',
    name: 'Educarte',
  },
};

/**
 * Componente de Emblema Oficial Institucional:
 * Renderiza los logos oficiales en alta resolución (PNG/SVG) almacenados localmente en /logos/colegios/
 */
export function SchoolEmblem({
  schoolId,
  size = 'md',
  className = '',
  showBorder = true,
}: SchoolEmblemProps) {
  const [currentSrcIndex, setCurrentSrcIndex] = useState<number>(0);
  const sizeClass = sizeMap[size] || sizeMap.md;
  const logoInfo = schoolLogoFiles[schoolId];

  const handleImageError = () => {
    if (logoInfo?.fallbackSrc && currentSrcIndex === 0) {
      setCurrentSrcIndex(1);
    } else {
      setCurrentSrcIndex(2); // Fallback final
    }
  };

  const imageSrc =
    currentSrcIndex === 0 ? logoInfo?.src : currentSrcIndex === 1 ? logoInfo?.fallbackSrc : null;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xs transition-transform bg-white ${
        showBorder ? 'border border-slate-200/90 p-0.5' : ''
      } ${sizeClass} ${className}`}
      title={logoInfo?.name || schoolId}
    >
      {logoInfo && imageSrc ? (
        <img
          src={imageSrc}
          alt={logoInfo.alt}
          className="w-full h-full object-contain rounded-xl p-0.5"
          loading="eager"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
          🏫
        </div>
      )}
    </div>
  );
}
