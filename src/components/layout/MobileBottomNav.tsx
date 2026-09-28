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
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 max-w-lg mx-auto bg-[#030612]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] px-2 py-1 text-white">
      <div className="grid grid-cols-5 items-center h-13">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-0.5 transition-all relative ${
                isActive
                  ? 'text-amber-300 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-amber-400/15 border border-amber-400/40 shadow-[0_0_10px_rgba(212,175,55,0.3)]' : ''}`}>
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-400' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[9.5px] mt-0.5 tracking-tight leading-none ${isActive ? 'font-black text-amber-300' : 'font-medium text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
