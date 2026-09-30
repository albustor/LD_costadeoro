'use client';

import React from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { 
  Trophy, 
  Calendar, 
  Heart, 
  SlidersHorizontal 
} from 'lucide-react';

export default function HomePage() {
  const { schools } = useTournament();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 🎬 1. VIDEO OFICIAL EN EL ENCABEZADO PRINCIPAL (AL PURO INICIO) */}
      <section className="space-y-2">
        <EventIntroVideo />
      </section>

      {/* 🗂️ 2. TARJETAS INFORMATIVAS INTERACTIVAS (DESPLEGABLES CON UN CLIC DEBAJO DEL VIDEO) */}
      <section className="space-y-3 pt-1">
        <EventGeneralInfoCards schools={schools} />
      </section>

      {/* 🚀 5. ACCESOS DIRECTOS COMPACTOS (TIPO ICONOS / ACCIONES RÁPIDAS) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Acceso 1: Deportes */}
        <Link
          href="/deportes"
          className="bg-white hover:bg-amber-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-100 transition-transform shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-amber-800 transition-colors">
            {t('hero.quickAccess.sports')}
          </span>
        </Link>

        {/* Acceso 2: Horarios */}
        <Link
          href="/calendario"
          className="bg-white hover:bg-sky-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-sky-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:bg-sky-100 transition-transform shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-sky-800 transition-colors">
            {t('hero.quickAccess.schedule')}
          </span>
        </Link>

        {/* Acceso 3: Muro Familiar */}
        <Link
          href="/mural"
          className="bg-white hover:bg-rose-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-rose-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:bg-rose-100 transition-transform shadow-2xs">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-rose-800 transition-colors">
            {t('hero.quickAccess.mural')}
          </span>
        </Link>

        {/* Acceso 4: Panel Central de Control */}
        <Link
          href="/admin"
          className="bg-white hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/90 hover:border-slate-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:bg-slate-200 transition-transform shadow-2xs">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-slate-950 transition-colors">
            {t('hero.quickAccess.admin')}
          </span>
        </Link>
      </section>
    </div>
  );
}
