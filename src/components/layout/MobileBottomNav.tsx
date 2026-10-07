'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Calendar, Heart, Award, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Deportes', href: '/deportes', icon: Trophy },
    { label: 'Horarios', href: '/calendario', icon: Calendar },
    { label: 'Muro', href: '/mural', icon: Heart },
    { label: 'Marcadores', href: '/marcadores', icon: Award },
    { label: 'Admin', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 w-full z-[60] bg-slate-950/98 backdrop-blur-md border-t border-amber-500/40 shadow-[0_-6px_30px_rgba(0,0,0,0.85)] px-1 py-2 safe-bottom text-white select-none">
      <div className="w-full grid grid-cols-6 items-center max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              target="_self"
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/40'
                    : 'text-slate-400'
                }`}
              >
                <Icon className={`w-7 h-7 ${isActive ? 'text-amber-400 stroke-[2.4]' : 'stroke-[1.9]'}`} />
              </div>
              <span
                className={`text-[11px] sm:text-xs mt-1 tracking-tight leading-none text-center truncate w-full px-0.5 ${
                  isActive ? 'font-black text-amber-300' : 'font-semibold text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
