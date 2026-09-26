'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTier } from '@/context/TierContext';
import { Trophy, Table2, Calendar, Film, Camera, Sparkles, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isFeatureEnabled } = useTier();

  const items = [
    { label: 'En Vivo', href: '/', icon: Trophy, enabled: true },
    { label: 'Tablas', href: '/tabla', icon: Table2, enabled: true },
    { label: 'Fechas', href: '/calendario', icon: Calendar, enabled: true },
    { 
      label: 'Shorts', 
      href: '/mural', 
      icon: Film, 
      enabled: isFeatureEnabled('fanShortsVideo') 
    },
    { label: 'Fotos', href: '/galeria', icon: Camera, enabled: isFeatureEnabled('officialPhotos') },
    { 
      label: 'Cupones', 
      href: '/patrocinadores', 
      icon: Sparkles, 
      enabled: isFeatureEnabled('sponsorBanners') 
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 safe-bottom">
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
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
