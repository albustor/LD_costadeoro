'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTier } from '@/context/TierContext';
import { Trophy, Table2, Calendar, ShieldCheck, Award, Film, Sparkles, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isFeatureEnabled } = useTier();

  const items = [
    { label: 'En Vivo', href: '/', icon: Trophy, enabled: true },
    { label: 'Tablas', href: '/tabla', icon: Table2, enabled: true },
    { label: 'Fechas', href: '/calendario', icon: Calendar, enabled: true },
    { label: 'Colegios', href: '/colegios', icon: ShieldCheck, enabled: true },
    { label: 'Diplomas', href: '/certificados', icon: Award, enabled: true },
    { 
      label: 'Shorts', 
      href: '/mural', 
      icon: Film, 
      enabled: isFeatureEnabled('fanShortsVideo') 
    },
    { 
      label: 'Cupones', 
      href: '/patrocinadores', 
      icon: Sparkles, 
      enabled: isFeatureEnabled('sponsorBanners') 
    },
    { label: 'Control', href: '/admin', icon: SlidersHorizontal, enabled: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl safe-bottom">
      <div className="grid grid-flow-col auto-cols-fr items-center h-14 px-1">
        {items.map((item) => {
          if (!item.enabled) return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? 'text-amber-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9.5px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
