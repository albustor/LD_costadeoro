'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Calendar, Heart, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Avance', href: '/tabla', icon: Trophy },
    { label: 'Deportes', href: '/calendario', icon: Calendar },
    { label: 'Familias', href: '/mural', icon: Heart },
    { label: 'Panel', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-amber-500/30 shadow-2xl safe-bottom text-white">
      <div className="grid grid-cols-5 items-center h-14 px-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-amber-300' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
