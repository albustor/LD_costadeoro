'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Heart, 
  SlidersHorizontal, 
  Film, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { tournament, schools } = useTournament();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'video' | 'info'>('video');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 🌊 1. ENCABEZADO DE BIENVENIDA */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('hero.welcomeBadge')}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sede: {tournament.host.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
              Octubre - noviembre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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

      {/* 🚀 3. ACCESOS DIRECTOS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
        <Link
          href="/deportes"
          className="bg-white hover:bg-amber-50/50 p-5 rounded-3xl border border-slate-200 hover:border-amber-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Trophy className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-amber-800">
              {t('hero.quickAccess.sports')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Posiciones, tabla general y actas de partido.
            </p>
          </div>
        </Link>

        <Link
          href="/calendario"
          className="bg-white hover:bg-sky-50/50 p-5 rounded-3xl border border-slate-200 hover:border-sky-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
              <Calendar className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-sky-800">
              {t('hero.quickAccess.schedule')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Fútbol, voleibol y baloncesto por jornada.
            </p>
          </div>
        </Link>

        <Link
          href="/mural"
          className="bg-white hover:bg-rose-50/50 p-5 rounded-3xl border border-slate-200 hover:border-rose-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-rose-800">
              {t('hero.quickAccess.mural')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Fotos, mensajes y porras familiares en vivo.
            </p>
          </div>
        </Link>

        <Link
          href="/admin"
          className="bg-white hover:bg-slate-50 p-5 rounded-3xl border border-slate-200 hover:border-slate-400 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-slate-950">
              {t('hero.quickAccess.admin')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Control de marcadores, actas y configuración.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
