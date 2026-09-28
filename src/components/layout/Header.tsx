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
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl overflow-hidden border border-amber-300 shadow-2xs bg-white shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/logos/costa_de_oro_logo_oficial.jpg"
                  alt="Liga Deportiva Costa de Oro 2026"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600 leading-none">
                  Liga Deportiva Oficial
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                  Costa de Oro 2026
                </span>
              </div>
            </Link>

            {/* Sede Anfitriona */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 ml-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>LA PAZ ANFITRIÓN</span>
            </div>
          </div>

          {/* Navegación Desktop Limpia */}
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
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Botón Menú Móvil */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-fade-in">
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
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
