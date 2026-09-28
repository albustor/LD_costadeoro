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
    <header className="sticky top-2 sm:top-4 z-50 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="bg-slate-950/90 backdrop-blur-xl border border-amber-500/35 shadow-2xl shadow-black/40 rounded-2xl sm:rounded-3xl px-3.5 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="flex items-center justify-between">
          {/* Logotipo Oficial Nítido Sin Escudo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center group transition-transform hover:scale-102">
              <LigaCostaDeOroLogo variant="horizontal" size="md" />
            </Link>

            {/* Sede Anfitriona */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-[10px] font-black text-amber-400 ml-1 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>LA PAZ ANFITRIÓN</span>
            </div>
          </div>

          {/* Navegación Desktop Flotante con Negro y Dorado */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs ring-1 ring-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Botón Menú Móvil */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-black transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil que se expande hacia abajo desde la isla flotante */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 mt-2 border-t border-amber-500/20 space-y-1.5 animate-fade-in text-white">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
      </div>
    </header>
  );
}
