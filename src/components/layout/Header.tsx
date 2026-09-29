'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Trophy, 
  Calendar, 
  Heart, 
  Shield, 
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
    { label: t('nav.home'), shortLabel: 'Inicio', href: '/', icon: Home },
    { label: t('nav.standings.full'), shortLabel: 'Posiciones', href: '/tabla', icon: Trophy },
    { label: t('nav.schedule.full'), shortLabel: 'Calendario', href: '/calendario', icon: Calendar },
    { label: t('nav.mural.full'), shortLabel: 'Muro', href: '/mural', icon: Heart },
    { label: t('nav.schools'), shortLabel: 'Colegios', href: '/colegios', icon: Shield },
    { label: t('nav.admin'), shortLabel: 'Admin', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 text-white backdrop-blur-md border-b border-amber-500/30 transition-all">
      {/* Filete superior dorado ultra-fino */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Logo e Identidad Minimalista */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 group shrink-0 transition-opacity hover:opacity-90"
            title="Liga Deportiva Costa de Oro 2026"
          >
            {/* Emblema Oficial Dorado y Negro */}
            <div className="h-8 w-7 sm:h-9 sm:w-8 rounded-lg overflow-hidden bg-black border border-amber-500/60 shadow-xs shrink-0 flex items-center justify-center p-0.5">
              <img
                src="/logos/liga_costa_de_oro_gold_black.jpg"
                alt="Liga Deportiva Costa de Oro"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Tipografía Minimalista */}
            <div className="flex flex-col justify-center leading-none select-none">
              <div className="flex items-center gap-1.5 font-serif font-black tracking-wide text-xs sm:text-base">
                <span className="text-white">LIGA</span>
                <span className="text-amber-400">COSTA DE ORO</span>
              </div>
              <span className="text-[7.5px] sm:text-[9px] font-sans font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Guanacaste · 2026
              </span>
            </div>
          </Link>

          {/* Navegación Desktop Minimalista */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.shortLabel}</span>
                </Link>
              );
            })}

            {/* Selector Bilingüe Minimalista */}
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <button
              onClick={toggleLanguage}
              title={`Idioma: ${language === 'es' ? 'Español' : 'English'}`}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 text-slate-300 hover:text-amber-300 hover:bg-white/5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </nav>

          {/* Acciones Móviles Minimalistas */}
          <div className="flex items-center lg:hidden gap-1.5">
            <button
              onClick={toggleLanguage}
              title="Cambiar idioma"
              className="px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 text-xs font-mono font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil Minimalista */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-t border-slate-800 px-4 py-3 space-y-1 shadow-2xl animate-fade-in">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
