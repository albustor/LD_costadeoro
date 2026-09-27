import React from 'react';
import { SportType } from '@/types/tournament';

export interface SportThemeConfig {
  sport: SportType;
  dayLabel: string;
  name: string;
  accentColor: string; // Hex for inline styles
  accentTextClass: string;
  bgPastelClass: string;
  borderClass: string;
  borderHoverClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  btnBgClass: string;
  btnHoverClass: string;
  ringClass: string;
}

export function getSportTheme(sport?: SportType | string): SportThemeConfig {
  switch (sport) {
    case 'futbol':
      return {
        sport: 'futbol',
        dayLabel: 'Lunes a Miércoles',
        name: 'Fútbol',
        accentColor: '#16A34A',
        accentTextClass: 'text-emerald-600',
        bgPastelClass: 'bg-[#F0FDF4]',
        borderClass: 'border-[#DCFCE7]',
        borderHoverClass: 'hover:border-[#86EFAC]',
        badgeBgClass: 'bg-[#DCFCE7]',
        badgeTextClass: 'text-[#15803D]',
        btnBgClass: 'bg-[#16A34A]',
        btnHoverClass: 'hover:bg-[#15803D]',
        ringClass: 'ring-emerald-500/20',
      };
    case 'voleibol':
      return {
        sport: 'voleibol',
        dayLabel: 'Jueves',
        name: 'Voleibol',
        accentColor: '#0284C7',
        accentTextClass: 'text-sky-600',
        bgPastelClass: 'bg-[#F0F9FF]',
        borderClass: 'border-[#E0F2FE]',
        borderHoverClass: 'hover:border-[#7DD3FC]',
        badgeBgClass: 'bg-[#E0F2FE]',
        badgeTextClass: 'text-[#0369A1]',
        btnBgClass: 'bg-[#0284C7]',
        btnHoverClass: 'hover:bg-[#0369A1]',
        ringClass: 'ring-sky-500/20',
      };
    case 'baloncesto':
      return {
        sport: 'baloncesto',
        dayLabel: 'Viernes',
        name: 'Baloncesto',
        accentColor: '#EA580C',
        accentTextClass: 'text-amber-600',
        bgPastelClass: 'bg-[#FFF7ED]',
        borderClass: 'border-[#FFEDD5]',
        borderHoverClass: 'hover:border-[#FDBA74]',
        badgeBgClass: 'bg-[#FFEDD5]',
        badgeTextClass: 'text-[#C2410C]',
        btnBgClass: 'bg-[#EA580C]',
        btnHoverClass: 'hover:bg-[#C2410C]',
        ringClass: 'ring-orange-500/20',
      };
    default:
      return {
        sport: 'futbol',
        dayLabel: 'Semana de Festivales',
        name: 'Multideporte',
        accentColor: '#0284C7',
        accentTextClass: 'text-slate-700',
        bgPastelClass: 'bg-white',
        borderClass: 'border-slate-200',
        borderHoverClass: 'hover:border-slate-300',
        badgeBgClass: 'bg-slate-100',
        badgeTextClass: 'text-slate-700',
        btnBgClass: 'bg-slate-900',
        btnHoverClass: 'hover:bg-slate-800',
        ringClass: 'ring-slate-500/20',
      };
  }
}

interface SportGlyphProps {
  sport?: SportType | string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Native, zero-dependency lightweight vector sport watermark glyphs (stroke: 1.5px - 1.8px, no-fill)
 */
export function SportWatermark({
  sport,
  className = 'w-18 h-18 text-current opacity-12',
  size = 80,
  strokeWidth = 1.5,
}: SportGlyphProps) {
  if (sport === 'futbol') {
    return (
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        className={className}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="35" strokeWidth={strokeWidth + 0.3} />
        <polygon
          points="40,25 54,35 49,51 31,51 26,35"
          strokeWidth={strokeWidth}
        />
        <path
          d="M40 25L40 5 M54 35L72 30 M49 51L61 70 M31 51L19 70 M26 35L8 30"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  if (sport === 'voleibol') {
    return (
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        className={className}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="35" strokeWidth={strokeWidth + 0.3} />
        <path
          d="M40 5 Q40 40 75 40 M75 40 Q40 40 40 75 M40 75 Q40 40 5 40 M5 40 Q40 40 40 5"
          strokeWidth={strokeWidth}
        />
        <path
          d="M15 15L65 65 M15 65L65 15"
          strokeWidth={strokeWidth - 0.3}
          strokeDasharray="2 3"
        />
      </svg>
    );
  }

  if (sport === 'baloncesto') {
    return (
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        className={className}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="35" strokeWidth={strokeWidth + 0.3} />
        <line x1="5" y1="40" x2="75" y2="40" strokeWidth={strokeWidth} />
        <line x1="40" y1="5" x2="40" y2="75" strokeWidth={strokeWidth} />
        <path d="M15 15 Q40 40 15 65 M65 15 Q40 40 65 65" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  return null;
}

/**
 * Coastal Shell / Wave continuous line watermark for headers (La Paz coastal identity)
 */
export function CoastalShellWatermark({
  className = 'w-16 h-16 opacity-10 text-sky-600 pointer-events-none',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 40 10 C 60 10, 70 28, 68 48 C 66 63, 55 70, 40 70 C 25 70, 14 63, 12 48 C 10 28, 20 10, 40 10 Z M 40 10 L 40 70 M 40 10 Q 55 38 53 67 M 40 10 Q 25 38 27 67"
        strokeWidth="1.4"
      />
    </svg>
  );
}
