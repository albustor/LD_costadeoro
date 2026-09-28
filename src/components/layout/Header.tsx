'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LigaCostaDeOroLogo } from '@/components/sports/LigaCostaDeOroLogo';
import { 
  Home,
  Trophy, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  SlidersHorizontal,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { label: t('nav.home'), shortLabel: t('nav.home'), href: '/', icon: Home },
    { label: t('nav.standings.full'), shortLabel: t('nav.standings'), href: '/tabla', icon: Trophy },
    { label: t('nav.schedule.full'), shortLabel: t('nav.schedule'), href: '/calendario', icon: Calendar },
    { label: t('nav.mural.full'), shortLabel: t('nav.mural'), href: '/mural', icon: Heart },
    { label: t('nav.schools'), shortLabel: t('nav.schools'), href: '/colegios', icon: ShieldCheck },
    { label: t('nav.admin'), shortLabel: t('nav.admin'), href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#02040a] text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden border-b border-amber-500/40">
      {/* ─── 1. DOBLE FILETE DE ORO REFLECTIVO SUPERIOR ─── */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_8px_rgba(251,191,36,0.6)]" />

      {/* ─── 2. FILIGRANA GUILLOCHÉ DE ONDAS MARINAS CONCÉNTRICAS DE ALTA SEGURIDAD ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.09] text-amber-300"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1400 90"
        >
          <defs>
            <linearGradient id="guillocheGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0" />
              <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFFBEB" stopOpacity="1" />
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0 45 Q 350 10 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="1.2" fill="none" />
          <path d="M 0 45 Q 350 20 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="0.8" fill="none" />
          <path d="M 0 45 Q 350 30 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="0.6" fill="none" />
          <path d="M 0 45 Q 350 60 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="0.8" fill="none" />
          <path d="M 0 45 Q 350 70 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="0.6" fill="none" />
          <path d="M 0 45 Q 350 80 700 45 T 1400 45" stroke="url(#guillocheGold)" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative">
        <div className="flex items-center justify-between h-15 sm:h-17 py-1 gap-2 sm:gap-4">
          
          {/* 🌟 IDENTIDAD DE ALTA JOYERÍA: SOL DE FILIGRANA FINA + TIPOGRAFÍA ESBELTA */}
          <div className="flex items-center justify-start shrink-0 min-w-0 pr-1 sm:pr-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0 transition-transform duration-200 hover:scale-[1.01]"
              title="Liga Deportiva Costa de Oro 2026"
            >
              {/* ☀️ EMBLEMA IMPERIAL OPCIÓN 1 (CORONA 2026 + 11 RAYOS RADIANTES + SOL NACIENTE + 4 OLAS DORADAS) */}
              <div className="h-9 sm:h-11 w-auto aspect-[1.2/1] shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <svg
                  viewBox="0 0 76 64"
                  className="h-full w-auto drop-shadow-[0_2px_12px_rgba(212,175,55,0.55)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="op1Gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFDF0" />
                      <stop offset="20%" stopColor="#F5D061" />
                      <stop offset="55%" stopColor="#D4AF37" />
                      <stop offset="85%" stopColor="#B8860B" />
                      <stop offset="100%" stopColor="#784E08" />
                    </linearGradient>
                    <radialGradient id="op1SunDome" cx="50%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#FFFEEA" />
                      <stop offset="35%" stopColor="#F7DA72" />
                      <stop offset="70%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#8A5A0A" />
                    </radialGradient>
                  </defs>

                  {/* Corona Imperial Superior con 2026 */}
                  <path d="M 38 2 L 41 7 L 47 5 L 43.5 11 L 32.5 11 L 29 5 L 35 7 Z" fill="url(#op1Gold)" />
                  <circle cx="38" cy="1.2" r="1.3" fill="#FFFDF0" />
                  <circle cx="29" cy="4.2" r="0.9" fill="#FFFDF0" />
                  <circle cx="47" cy="4.2" r="0.9" fill="#FFFDF0" />
                  <text x="38" y="10" fontSize="3.8" fontWeight="900" fill="#040711" textAnchor="middle" fontFamily="sans-serif">2026</text>

                  {/* 11 Rayos Radiantes de Oro Cepillado */}
                  <line x1="38" y1="13" x2="38" y2="18" stroke="url(#op1Gold)" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="30" y1="14.5" x2="32.5" y2="19.5" stroke="url(#op1Gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="46" y1="14.5" x2="43.5" y2="19.5" stroke="url(#op1Gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="22" y1="18" x2="26" y2="22" stroke="url(#op1Gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="54" y1="18" x2="50" y2="22" stroke="url(#op1Gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="15" y1="23" x2="20" y2="26" stroke="url(#op1Gold)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="61" y1="23" x2="56" y2="26" stroke="url(#op1Gold)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="9" y1="29.5" x2="15" y2="31" stroke="url(#op1Gold)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="67" y1="29.5" x2="61" y2="31" stroke="url(#op1Gold)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="5" y1="36.5" x2="11" y2="36.5" stroke="url(#op1Gold)" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="71" y1="36.5" x2="65" y2="36.5" stroke="url(#op1Gold)" strokeWidth="1.4" strokeLinecap="round" />

                  {/* Domo del Sol Naciente Dorado */}
                  <path d="M 21 37.5 A 17 17 0 0 1 55 37.5 Z" fill="url(#op1SunDome)" stroke="url(#op1Gold)" strokeWidth="1" />

                  {/* 4 Olas Rítmicas del Océano de la Costa de Oro */}
                  <path d="M 6 41 Q 22 37 38 41 T 70 41" stroke="url(#op1Gold)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <path d="M 10 47 Q 24 43 38 47 T 66 47" stroke="url(#op1Gold)" strokeWidth="2.1" strokeLinecap="round" fill="none" />
                  <path d="M 16 53 Q 27 49 38 53 T 60 53" stroke="url(#op1Gold)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M 23 59 Q 30.5 56 38 59 T 53 59" stroke="url(#op1Gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* ─── LÍNEA DIVISORIA VERTICAL DORADA ULTRA-FINA ─── */}
              <div className="h-6 sm:h-8 w-[1px] bg-gradient-to-b from-transparent via-amber-400/50 to-transparent mx-0.5 sm:mx-1 shrink-0" />

              {/* 🏆 COMPOSICIÓN TIPOGRÁFICA REFINADA EN ORO */}
              <div className="flex flex-col justify-center select-none shrink-0">
                {/* Fila Superior: LIGA DE LA COSTA DE ORO */}
                <div className="flex items-baseline gap-1 sm:gap-1.5 md:gap-2 leading-none">
                  <span className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400 font-serif">
                    LIGA
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-amber-200/90 font-sans">
                    DE LA COSTA DE
                  </span>
                  <span className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-100 font-serif">
                    ORO
                  </span>
                </div>

                {/* Fila Inferior: Sello Fino */}
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                  <div className="h-[1px] w-2 sm:w-4 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400/20" />
                  <span className="text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-amber-300/80 leading-none">
                    ✦ GUANACASTE · EDICIÓN 2026 ✦
                  </span>
                  <div className="h-[1px] w-2 sm:w-4 bg-gradient-to-r from-amber-400/20 via-amber-400/60 to-transparent" />
                </div>
              </div>
            </Link>

            {/* Sede Anfitriona LA PAZ (Solo en pantallas extra anchas 2xl) */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-black/60 text-[10.5px] font-bold text-amber-300 tracking-wider ml-4 shadow-inner shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LA PAZ · SEDE ANFITRIONA</span>
            </div>
          </div>

          {/* 🧭 4. NAVEGACIÓN DESKTOP/LAPTOP CON PÍLDORAS DE CRISTAL OSCURO Y FILO DORADO */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 xl:p-1.5 bg-black/80 rounded-2xl border border-amber-500/40 backdrop-blur-lg shadow-xl shrink-0">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <React.Fragment key={item.href}>
                  {index > 0 && (
                    <div className="h-3.5 xl:h-4 w-[1px] bg-amber-500/20 my-auto shrink-0" />
                  )}
                  <Link
                    href={item.href}
                    className={`px-2.5 xl:px-3.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-bold transition-all flex items-center gap-1.5 relative whitespace-nowrap ${
                      isActive
                        ? 'text-amber-200 border border-amber-400/80 bg-gradient-to-r from-amber-500/20 to-amber-600/10 shadow-[0_0_15px_rgba(212,175,55,0.3)] ring-1 ring-amber-400/40'
                        : 'text-slate-300 hover:text-amber-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="inline xl:hidden">{item.shortLabel}</span>
                  </Link>
                </React.Fragment>
              );
            })}

            {/* Selector Bilingüe ES / EN en Barra Superior */}
            <div className="h-4 w-[1px] bg-amber-500/30 my-auto mx-1 shrink-0" />
            <button
              onClick={toggleLanguage}
              title={`Idioma actual: ${language === 'es' ? 'Español' : 'English'}. Clic para cambiar.`}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 hover:border-amber-300 shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{language === 'es' ? 'ES | EN' : 'EN | ES'}</span>
            </button>
          </nav>

          {/* Botón Menú Móvil con Borde Dorado y Selector de Idioma */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={toggleLanguage}
              title="Cambiar idioma"
              className="px-2.5 py-2 rounded-xl bg-black border border-amber-500/50 text-amber-300 hover:border-amber-300 text-xs font-bold flex items-center gap-1 font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-black border border-amber-500/50 text-amber-400 hover:bg-slate-900 hover:border-amber-300 transition-colors cursor-pointer shadow-lg"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. FILETE INFERIOR DORADO CON RESPLANDOR ─── */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#02040a] border-t border-amber-500/40 px-4 py-4 space-y-2 shadow-2xl animate-fade-in relative z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center px-2">
            <span className="text-xs text-slate-400">Idioma / Language:</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 font-mono"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

