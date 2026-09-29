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
    <nav className="lg:hidden fixed bottom-2.5 left-3 right-3 z-50 max-w-md mx-auto bg-slate-950/95 backdrop-blur-md border border-slate-800/90 rounded-2xl shadow-xl px-1.5 py-1 text-white">
      <div className="grid grid-cols-6 items-center h-12">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-0.5 transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-amber-400/15' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'stroke-[1.7]'}`} />
              </div>
              <span className={`text-[9px] mt-0.5 tracking-tight leading-none ${isActive ? 'font-bold text-amber-300' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
