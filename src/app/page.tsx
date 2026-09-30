'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { 
  Trophy, 
  MapPin, 
  Film, 
  Info
} from 'lucide-react';

export default function HomePage() {
  const { tournament, schools } = useTournament();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'video' | 'info'>('video');

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-2 sm:pb-4">
      {/* 🌊 1. ENCABEZADO DE BIENVENIDA */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200/90 p-5 sm:p-7 md:p-8 shadow-xs space-y-3.5">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-950 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{t('hero.welcomeBadge')}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Sedes rotativas · Guanacaste</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200">
              Octubre - noviembre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-normal">
            {t('hero.tagline')}
          </p>
        </div>
      </section>

      {/* 🗂️ 2. PESTAÑAS DE CONTENIDO SECCIONADO: VIDEO VS INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        {/* Selector de pestañas con mayor área táctil y textos grandes */}
        <div className="flex items-center gap-2 p-2 bg-slate-200/80 rounded-2xl border border-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                : 'text-slate-800 hover:text-slate-950 hover:bg-white/70 font-bold'
            }`}
          >
            <Film className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'video' ? 'text-amber-400' : 'text-amber-700'}`} />
            <span>Video del evento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                : 'text-slate-800 hover:text-slate-950 hover:bg-white/70 font-bold'
            }`}
          >
            <Info className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'info' ? 'text-amber-400' : 'text-amber-700'}`} />
            <span>Información general</span>
          </button>
        </div>

        {/* Pestaña 1: Video Oficial */}
        {activeTab === 'video' && (
          <div className="animate-fade-in">
            <EventIntroVideo />
          </div>
        )}

        {/* Pestaña 2: Información General detallada */}
        {activeTab === 'info' && (
          <div className="animate-fade-in">
            <EventGeneralInfoCards schools={schools} />
          </div>
        )}
      </section>

    </div>
  );
}

