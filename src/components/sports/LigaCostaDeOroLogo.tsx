'use client';

import React from 'react';

interface LigaCostaDeOroLogoProps {
  variant?: 'horizontal' | 'emblem' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logotipo Vectorial Oficial de la Liga Deportiva Costa de Oro 2026:
 * Renderizado nítido en SVG de alta resolución con gradientes dorados metálicos
 * y sol naciente guanacasteco, garantizando máxima legibilidad en barra de navegación y móviles.
 */
export function LigaCostaDeOroLogo({
  variant = 'horizontal',
  className = '',
  size = 'md',
}: LigaCostaDeOroLogoProps) {
  const heightClass = size === 'sm' ? 'h-9' : size === 'lg' ? 'h-16' : 'h-11 sm:h-12';

  if (variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${heightClass} ${className}`}>
        <svg
          viewBox="0 0 160 220"
          className="h-full w-auto drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="35%" stopColor="#E6B800" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
            <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="50%" stopColor="#E5C158" />
              <stop offset="100%" stopColor="#C59B27" />
            </linearGradient>
          </defs>

          {/* LIGA Superior Curvado */}
          <text
            x="80"
            y="65"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="900"
            fontSize="58"
            letterSpacing="2"
            fill="url(#goldTextGrad)"
            stroke="#AA771C"
            strokeWidth="0.8"
          >
            LIGA
          </text>

          {/* Sol Naciente / Atardecer Costa de Oro */}
          <g transform="translate(80, 92)">
            {/* Rayos del Sol */}
            <line x1="-32" y1="-12" x2="-22" y2="-6" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-18" y1="-22" x2="-12" y2="-12" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="-26" x2="0" y2="-15" stroke="url(#goldGradient)" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="18" y1="-22" x2="12" y2="-12" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="-12" x2="22" y2="-6" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Semicírculo del Sol */}
            <path
              d="M -16 0 A 16 16 0 0 1 16 0 Z"
              fill="url(#goldGradient)"
            />
            {/* Líneas Horizontales del Mar */}
            <line x1="-48" y1="5" x2="48" y2="5" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-38" y1="12" x2="38" y2="12" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" />
            <line x1="-24" y1="18" x2="24" y2="18" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* DE LA COSTA DE */}
          <text
            x="80"
            y="136"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="14.5"
            letterSpacing="3.5"
            fill="url(#goldTextGrad)"
          >
            DE LA COSTA DE
          </text>

          {/* ORO Inferior */}
          <text
            x="80"
            y="204"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="900"
            fontSize="66"
            letterSpacing="3"
            fill="url(#goldTextGrad)"
            stroke="#AA771C"
            strokeWidth="0.8"
          >
            ORO
          </text>
        </svg>
      </div>
    );
  }

  // Variant 'horizontal' (Ideal y ultralegible para el Navbar)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${heightClass} ${className}`}>
      {/* Icono de Sol / Escudo Guanacasteco Dorado */}
      <div className="h-full aspect-square rounded-xl bg-gradient-to-b from-black via-slate-950 to-black border border-amber-500/60 shadow-sm flex items-center justify-center p-1 shrink-0 group-hover:border-amber-400 transition-colors">
        <svg
          viewBox="0 0 60 60"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="50%" stopColor="#E5C158" />
              <stop offset="100%" stopColor="#C59B27" />
            </linearGradient>
          </defs>
          {/* Sol Naciente */}
          <path d="M 16 33 A 14 14 0 0 1 44 33 Z" fill="url(#iconGold)" />
          {/* Rayos */}
          <line x1="30" y1="10" x2="30" y2="15" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="15" x2="22" y2="19" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="15" x2="38" y2="19" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="26" x2="17" y2="27" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="48" y1="26" x2="43" y2="27" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Océano Dorado */}
          <line x1="10" y1="36" x2="50" y2="36" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="42" x2="44" y2="42" stroke="url(#iconGold)" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="47" x2="38" y2="47" stroke="url(#iconGold)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Tipografía Oficial Nítida y Legible */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[9.5px] sm:text-[10.5px] tracking-[0.2em] uppercase text-amber-400 leading-none">
            LIGA DE LA
          </span>
          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[8.5px] leading-tight">
            2026
          </span>
        </div>
        <span className="font-black text-sm sm:text-base tracking-tight text-white uppercase leading-tight font-serif drop-shadow-xs">
          COSTA DE ORO
        </span>
      </div>
    </div>
  );
}
