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
  X
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Avance Global', href: '/tabla', icon: Trophy },
    { label: 'Deportes y Horarios', href: '/calendario', icon: Calendar },
    { label: 'Muro Familiar', href: '/mural', icon: Heart },
    { label: 'Colegios', href: '/colegios', icon: ShieldCheck },
    { label: 'Panel de Control', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/98 backdrop-blur-xl border-b border-amber-500/40 shadow-xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 py-2">
          {/* 🌟 IDENTIDAD OFICIAL: LOGOTIPO OFICIAL EXACTO + LÍNEAS DORADAS */}
          <div className="flex items-center">
            {/* Logotipo Oficial Exacto Subido (Sin Alteraciones) */}
            <Link 
              href="/" 
              className="flex items-center group transition-transform hover:scale-103 shrink-0"
              title="Liga Deportiva Costa de Oro 2026"
            >
              <img
                src="/logos/liga_costa_de_oro_gold_black.jpg"
                alt="Liga de la Costa de Oro"
                className="h-13 sm:h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]"
              />
            </Link>

            {/* Línea Divisoria Dorada */}
            <div className="h-9 w-[1px] bg-gradient-to-b from-transparent via-amber-500/60 to-transparent mx-3 sm:mx-4 hidden xs:block" />

            {/* Titulación Oficial */}
            <div className="flex flex-col justify-center">
              <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-[0.2em] text-amber-400 leading-none drop-shadow-xs">
                Liga Deportiva Oficial
              </span>
              <span className="text-sm sm:text-base font-black text-white tracking-tight leading-tight mt-0.5 font-serif">
                Costa de Oro 2026
              </span>
            </div>

            {/* Línea Divisoria Dorada */}
            <div className="h-9 w-[1px] bg-gradient-to-b from-transparent via-amber-500/40 to-transparent mx-3 sm:mx-4 hidden md:block" />

            {/* Sede Anfitriona con Distintivo Dorado */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-[10px] font-black text-amber-300 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>LA PAZ ANFITRIÓN</span>
            </div>
          </div>

          {/* 🧭 NAVEGACIÓN DESKTOP CON SEPARACIÓN Y PÍLDORAS DORADAS */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-black/50 rounded-2xl border border-amber-500/30 backdrop-blur-md">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <React.Fragment key={item.href}>
                  {index > 0 && (
                    <div className="h-4 w-[1px] bg-amber-500/20 my-auto" />
                  )}
                  <Link
                    href={item.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] ring-1 ring-amber-400/30'
                        : 'text-slate-300 hover:text-amber-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Botón Menú Móvil con Borde Dorado */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-black border border-amber-500/40 text-amber-400 hover:bg-slate-900 hover:border-amber-300 transition-colors cursor-pointer shadow-sm"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil con Líneas Divisoras Doradas */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-amber-500/40 px-4 py-4 space-y-1.5 shadow-2xl animate-fade-in">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
