'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2">
          {/* Logo Oficial de la Liga Deportiva Costa de Oro 2026 */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-11 sm:h-12 w-8 sm:w-9 rounded-xl overflow-hidden bg-black border border-amber-500/50 shadow-xs shrink-0 flex items-center justify-center p-0.5 transition-transform group-hover:scale-105 group-hover:border-amber-400">
                <img
                  src="/logos/liga_costa_de_oro_gold_black.jpg"
                  alt="Liga de la Costa de Oro"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-600 leading-none">
                  Liga Deportiva Oficial
                </span>
                <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-tight">
                  Costa de Oro 2026
                </span>
              </div>
            </Link>

            {/* Sede Anfitriona */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-[10px] font-black text-amber-400 ml-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>LA PAZ ANFITRIÓN</span>
            </div>
          </div>

          {/* Navegación Desktop Limpia con acentos Negro y Dorado */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-950 text-amber-300 border border-amber-500/40 shadow-xs ring-1 ring-amber-500/20'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Botón Menú Móvil */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-black transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-amber-500/30 px-4 py-4 space-y-2 shadow-xl animate-fade-in text-white">
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
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
