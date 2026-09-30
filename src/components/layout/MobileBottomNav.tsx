'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Calendar, Heart, Shield, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Deportes', href: '/deportes', icon: Trophy },
    { label: 'Horarios', href: '/calendario', icon: Calendar },
    { label: 'Muro', href: '/mural', icon: Heart },
    { label: 'Colegios', href: '/colegios', icon: Shield },
    { label: 'Admin', href: '/admin', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 w-full z-50 bg-slate-950/98 backdrop-blur-lg border-t border-slate-800/90 shadow-2xl px-1 pt-1.5 pb-safe safe-bottom text-white">
      <div className="w-full grid grid-cols-6 items-center h-13 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-amber-400/20 text-amber-300' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight leading-none ${isActive ? 'font-extrabold text-amber-300' : 'font-semibold text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
