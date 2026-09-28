'use client';

import React from 'react';

interface LigaCostaDeOroLogoProps {
  variant?: 'horizontal' | 'emblem' | 'floating-shield' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Logotipo Vectorial Oficial de la Liga Deportiva Costa de Oro 2026:
 * Renderizado nítido en SVG vectorial de alta resolución con gradientes dorados metálicos,
 * sol naciente guanacasteco y variantes en Escudo Flotante (Floating Badge) y Formato Horizontal.
 */
export function LigaCostaDeOroLogo({
  variant = 'floating-shield',
  className = '',
  size = 'md',
}: LigaCostaDeOroLogoProps) {
  // 🛡️ VARIANTE: ESCUDO FLOTANTE DE ALTA GAMA (Floating Shield Badge)
  if (variant === 'floating-shield') {
    const shieldHeight = size === 'sm' ? 'h-18 sm:h-20' : size === 'lg' ? 'h-24 sm:h-28' : 'h-20 sm:h-24';

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_16px_32px_rgba(212,175,55,0.3)] ${shieldHeight} ${className}`}>
        <svg
          viewBox="0 0 140 192"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente Dorado Metálico Principal */}
            <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="25%" stopColor="#F5D061" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="75%" stopColor="#AA771C" />
              <stop offset="100%" stopColor="#E5C158" />
            </linearGradient>

            {/* Gradiente Borde de Oro Biselado */}
            <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE58F" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="80%" stopColor="#875A12" />
              <stop offset="100%" stopColor="#FFE58F" />
            </linearGradient>

            {/* Fondo Negro Obsidiana con Resplandor Ámbar */}
            <radialGradient id="shieldBgGlow" cx="50%" cy="48%" r="65%">
              <stop offset="0%" stopColor="#1E1404" />
              <stop offset="55%" stopColor="#0B0D14" />
              <stop offset="100%" stopColor="#020306" />
            </radialGradient>

            {/* Sombra Interior */}
            <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
              <feFlood floodColor="#D4AF37" floodOpacity="0.25" />
              <feComposite in2="shadowDiff" operator="in" />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* Silueta del Escudo */}
          <path
            d="M 8 0 L 132 0 C 137 0 139 3 139 8 L 139 106 C 139 148 70 190 70 190 C 70 190 1 148 1 106 L 1 8 C 1 3 3 0 8 0 Z"
            fill="url(#shieldBgGlow)"
            stroke="url(#shieldBorderGrad)"
            strokeWidth="2.8"
          />

          {/* Filigrana / Línea Interior Dorada */}
          <path
            d="M 12 5 L 128 5 C 132 5 134 7 134 11 L 134 104 C 134 142 70 182 70 182 C 70 182 6 142 6 104 L 6 11 C 6 7 8 5 12 5 Z"
            fill="none"
            stroke="url(#shieldGoldGrad)"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />

          {/* 🌟 1. TEXTO LIGA */}
          <text
            x="70"
            y="52"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Times New Roman', 'Playfair Display', serif"
            fontWeight="900"
            fontSize="46"
            letterSpacing="3"
            fill="url(#shieldGoldGrad)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            LIGA
          </text>

          {/* ☀️ 2. SOL NACIENTE GUANACASTECO */}
          <g transform="translate(70, 78)">
            {/* Rayos de Luz */}
            <line x1="-26" y1="-8" x2="-18" y2="-4" stroke="url(#shieldGoldGrad)" strokeWidth="2" strokeLinecap="round" />
            <line x1="-15" y1="-18" x2="-10" y2="-10" stroke="url(#shieldGoldGrad)" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-21" x2="0" y2="-12" stroke="url(#shieldGoldGrad)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="15" y1="-18" x2="10" y2="-10" stroke="url(#shieldGoldGrad)" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="-8" x2="18" y2="-4" stroke="url(#shieldGoldGrad)" strokeWidth="2" strokeLinecap="round" />
            
            {/* Semicírculo del Sol */}
            <path d="M -13 0 A 13 13 0 0 1 13 0 Z" fill="url(#shieldGoldGrad)" />
            
            {/* Olas / Mar de Costa de Oro */}
            <line x1="-36" y1="4" x2="36" y2="4" stroke="url(#shieldGoldGrad)" strokeWidth="2" strokeLinecap="round" />
            <line x1="-26" y1="9" x2="26" y2="9" stroke="url(#shieldGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-16" y1="13" x2="16" y2="13" stroke="url(#shieldGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* 🏖️ 3. DE LA COSTA DE */}
          <text
            x="70"
            y="112"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="10.5"
            letterSpacing="3.5"
            fill="url(#shieldGoldGrad)"
            opacity="0.95"
          >
            DE LA COSTA DE
          </text>

          {/* 🏆 4. TEXTO ORO */}
          <text
            x="70"
            y="160"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Times New Roman', 'Playfair Display', serif"
            fontWeight="900"
            fontSize="52"
            letterSpacing="4"
            fill="url(#shieldGoldGrad)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            ORO
          </text>

          {/* 🏷️ 5. AÑO 2026 */}
          <rect x="50" y="167" width="40" height="13" rx="4" fill="#181205" stroke="url(#shieldGoldGrad)" strokeWidth="0.8" />
          <text
            x="70"
            y="177"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="8.5"
            letterSpacing="1.5"
            fill="#FFE58F"
          >
            2026
          </text>
        </svg>
      </div>
    );
  }

  // 🔹 VARIANTE: HORIZONTAL (Limpia para barras laterales o footers)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${size === 'sm' ? 'h-9' : 'h-11 sm:h-12'} ${className}`}>
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
          <path d="M 16 33 A 14 14 0 0 1 44 33 Z" fill="url(#iconGold)" />
          <line x1="30" y1="10" x2="30" y2="15" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="15" x2="22" y2="19" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="15" x2="38" y2="19" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="26" x2="17" y2="27" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="48" y1="26" x2="43" y2="27" stroke="url(#iconGold)" strokeWidth="2.5" strokeLinecap="round" />
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
