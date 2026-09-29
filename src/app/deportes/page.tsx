'use client';

import React, { useState } from 'react';
import { SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { DailyEmotionalMediaCapsule } from '@/components/sports/DailyEmotionalMediaCapsule';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Lock, 
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DeportesPage() {
  const { categories } = useTournament();
  const { t } = useLanguage();
  const [activeSport, setActiveSport] = useState<SportType>('futbol');

  const sportCategories = categories.filter((c) => c.sport === activeSport);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 🏷️ CABECERA DEPORTES */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('sports.badge')}</span>
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-xs font-semibold text-slate-500">{t('sports.season')}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('sports.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          {t('sports.subtitle')}
        </p>
      </div>

      {/* ⚽🏐🏀 1. SELECTOR PRINCIPAL DE DEPORTES */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Fútbol */}
        <button
          onClick={() => setActiveSport('futbol')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            activeSport === 'futbol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">⚽</span>
          <div>
            <span className="font-black text-sm sm:text-base block">{t('sports.soccer')}</span>
            <span className={`text-[10px] sm:text-xs font-semibold block ${activeSport === 'futbol' ? 'text-amber-300' : 'text-slate-400'}`}>
              {t('sports.soccerDays')}
            </span>
          </div>
        </button>

        {/* Voleibol */}
        <button
          onClick={() => setActiveSport('voleibol')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            activeSport === 'voleibol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🏐</span>
          <div>
            <span className="font-black text-sm sm:text-base block">{t('sports.volleyball')}</span>
            <span className={`text-[10px] sm:text-xs font-semibold block ${activeSport === 'voleibol' ? 'text-amber-300' : 'text-slate-400'}`}>
              {t('sports.volleyballDays')}
            </span>
          </div>
        </button>

        {/* Baloncesto */}
        <button
          onClick={() => setActiveSport('baloncesto')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            activeSport === 'baloncesto'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🏀</span>
          <div>
            <span className="font-black text-sm sm:text-base block">{t('sports.basketball')}</span>
            <span className={`text-[10px] sm:text-xs font-semibold block ${activeSport === 'baloncesto' ? 'text-amber-300' : 'text-slate-400'}`}>
              {t('sports.basketballDays')}
            </span>
          </div>
        </button>
      </div>

      {/* 📋 2. FICHA TÉCNICA Y CATEGORÍAS DE LA DISCIPLINA ACTIVA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Cabecera del Deporte */}
        <div className="p-5 sm:p-7 bg-gradient-to-r from-slate-50 via-amber-50/20 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
              {activeSport === 'futbol' ? '⚽' : activeSport === 'voleibol' ? '🏐' : '🏀'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10.5px] uppercase tracking-wider">
                  {t('sports.badge')}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeSport === 'futbol' ? 'Fútbol Formativo' : activeSport === 'voleibol' ? 'Voleibol Sala' : 'Baloncesto FIBA'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {activeSport === 'futbol' ? t('sports.soccer') : activeSport === 'voleibol' ? t('sports.volleyball') : t('sports.basketball')}
              </h2>
            </div>
          </div>

          <Link
            href="/calendario"
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 self-start sm:self-auto transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('sports.btnSchedule')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categorías Oficiales y Días */}
        <div className="p-5 sm:p-7 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{t('sports.categoriesTitle')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sportCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2 hover:border-amber-300 hover:bg-amber-50/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{cat.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-bold border border-slate-200 shadow-2xs">
                    {cat.division}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{t('sports.day')}: <strong>{cat.dayOfWeek}s</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t('sports.time')}: {cat.scheduleTime}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t('sports.gender')}: {cat.gender}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 3. CÁPSULA EMOTIVA Y DE VALOR HUMANO CON IA (2 FOTOS + 1 VIDEO) */}
      <DailyEmotionalMediaCapsule sport={activeSport} />

      {/* 🔒 4. PRÓXIMAS MODALIDADES DEPORTIVAS (EN PREPARACIÓN) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {t('sports.upcomingTitle')}
              </h3>
              <span className="text-xs text-slate-500">
                {t('sports.upcomingSubtitle')}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px]">
            {t('sports.inPrep')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">🏄 Surfing</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Exhibición de olas en Playa Tamarindo y Playa Grande.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">♟️ Ajedrez</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Torneo intercolegial de ajedrez rápido y clásico.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">🏃 Atletismo</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pruebas de pista y velocidad en arena en Brasilito.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">🏊 Natación</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Travesía en aguas abiertas en Bahía Flamingo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
