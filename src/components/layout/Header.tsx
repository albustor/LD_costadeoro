'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTier } from '@/context/TierContext';
import { 
  Trophy, 
  Calendar, 
  Table2, 
  Film, 
  Camera, 
  Sparkles, 
  SlidersHorizontal,
  ShieldCheck,
  Award,
  Menu,
  X
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { isFeatureEnabled } = useTier();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'En Vivo', href: '/', icon: Trophy, enabled: true },
    { label: 'Tablas', href: '/tabla', icon: Table2, enabled: true },
    { label: 'Calendario', href: '/calendario', icon: Calendar, enabled: true },
    { label: 'Colegios', href: '/colegios', icon: ShieldCheck, enabled: true },
    { label: 'Certificados', href: '/certificados', icon: Award, enabled: true },
    { 
      label: 'Fan Shorts', 
      href: '/mural', 
      icon: Film, 
      enabled: isFeatureEnabled('fanShortsVideo'),
      badge: '9:16'
    },
    { label: 'Galería', href: '/galeria', icon: Camera, enabled: isFeatureEnabled('officialPhotos') },
    { 
      label: 'Patrocinadores', 
      href: '/patrocinadores', 
      icon: Sparkles, 
      enabled: isFeatureEnabled('sponsorBanners'),
      badge: 'Cupones'
    },
    { label: 'Mesa de Control', href: '/admin', icon: SlidersHorizontal, enabled: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logos/curiol_logo_oficial_transparente_hd.png"
              alt="Curiol Studio"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block border-l border-slate-700 pl-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                Liga Deportiva
              </span>
              <span className="block text-sm font-extrabold text-white tracking-tight">
                Costa de Oro 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (!item.enabled) return null;
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Alternar menú móvil"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            if (!item.enabled) return null;
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
