'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { PwaInstallButton } from '@/components/pwa/PwaInstallButton';
import { DuaAccessibilityBar } from '@/components/accessibility/DuaAccessibilityBar';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { language, toggleLanguage, t } = useLanguage();

  // Ocultar suavemente al bajar el scroll y mostrar al subir o en el tope
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si estamos muy cerca del tope, siempre visible
      if (currentScrollY < 40) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        // Bajando -> ocultar
        setVisible(false);
        setMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Subiendo -> mostrar
        setVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'), shortLabel: 'Inicio', href: '/', icon: Home },
    { label: t('nav.standings.full'), shortLabel: 'Deportes', href: '/deportes', icon: Trophy },
    { label: t('nav.schedule.full'), shortLabel: 'Horarios', href: '/calendario', icon: Calendar },
    { label: t('nav.mural.full'), shortLabel: 'Muro', href: '/mural', icon: Heart },
    { label: t('nav.schools'), shortLabel: 'Instituciones', href: '/colegios', icon: Shield },
    { label: t('nav.admin'), shortLabel: 'Admin', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-black text-white border-b border-amber-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-transform duration-300 ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Filete superior dorado ultra-fino */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo e Identidad Oficial (Enfocada exclusivamente en Liga Costa de Oro con fondo negro) */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3.5 group transition-opacity hover:opacity-90 min-w-0 flex-1 overflow-hidden"
            title="Liga Costa de Oro 2026"
          >
            {/* Emblema Original Dorado Sol y Olas */}
            <div className="w-[36px] h-[32px] sm:w-[50px] sm:h-[42px] shrink-0 flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 76 64"
                width="36"
                height="32"
                style={{ width: '36px', height: '32px', minWidth: '36px', maxWidth: '50px' }}
                className="w-full h-full drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)] block shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="30%" stopColor="#FCD34D" />
                    <stop offset="70%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                </defs>
                <path d="M 38 2 L 41 7 L 47 5 L 43.5 11 L 32.5 11 L 29 5 L 35 7 Z" fill="url(#headerGoldGrad)" />
                <circle cx="38" cy="1.2" r="1.3" fill="#FFFDF0" />
                <line x1="38" y1="13" x2="38" y2="18" stroke="url(#headerGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="30" y1="14.5" x2="32.5" y2="19.5" stroke="url(#headerGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="46" y1="14.5" x2="43.5" y2="19.5" stroke="url(#headerGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="22" y1="18" x2="26" y2="22" stroke="url(#headerGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="54" y1="18" x2="50" y2="22" stroke="url(#headerGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 21 37.5 A 17 17 0 0 1 55 37.5 Z" fill="url(#headerGoldGrad)" />
                <path d="M 6 41 Q 22 37 38 41 T 70 41" stroke="url(#headerGoldGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 10 47 Q 24 43 38 47 T 66 47" stroke="url(#headerGoldGrad)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 16 53 Q 27 49 38 53 T 60 53" stroke="url(#headerGoldGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Tipografía Exclusiva Liga Costa de Oro */}
            <div className="flex flex-col justify-center leading-tight select-none min-w-0">
              <div className="flex items-center gap-1 font-serif font-black tracking-tight text-xs sm:text-lg whitespace-nowrap">
                <span className="text-white">LIGA</span>
                <span className="text-amber-400">COSTA DE ORO</span>
              </div>
              <span className="text-[8.5px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-amber-300/90 truncate block">
                Festival Deportivo · Guanacaste 2026
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 shrink-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.shortLabel}</span>
                </Link>
              );
            })}

            {/* Selector Bilingüe Desktop */}
            <div className="h-5 w-[1px] bg-slate-800 mx-1" />
            <button
              onClick={toggleLanguage}
              title={`Idioma: ${language === 'es' ? 'Español' : 'English'}`}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 text-slate-300 hover:text-amber-300 hover:bg-white/5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Accesibilidad DUA Desktop */}
            <div className="h-5 w-[1px] bg-slate-800 mx-1" />
            <DuaAccessibilityBar compact={false} />

            {/* Botón PWA Desktop */}
            <div className="h-5 w-[1px] bg-slate-800 mx-1" />
            <PwaInstallButton variant="header" />
          </nav>

          {/* Acciones Móviles */}
          <div className="flex items-center lg:hidden gap-1.5 shrink-0 ml-auto">
            {/* Audio DUA Compacto */}
            <DuaAccessibilityBar compact={true} />

            {/* Selector Idioma Móvil */}
            <button
              onClick={toggleLanguage}
              title="Cambiar idioma"
              className="h-9 px-2 sm:px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 text-xs font-mono font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Botón Menú Hamburguesa */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer shadow-2xs"
              aria-label="Menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-slate-800 px-4 py-4 space-y-4 shadow-2xl animate-fade-in">
          {/* Panel de Accesibilidad DUA Móvil Completo (Zoom + Audio) */}
          <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300">Accesibilidad DUA:</span>
            <DuaAccessibilityBar compact={false} />
          </div>

          {/* Botón Instalar PWA en Móvil */}
          <div className="w-full">
            <PwaInstallButton variant="header" />
          </div>

          {/* Enlaces de Navegación */}
          <div className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
