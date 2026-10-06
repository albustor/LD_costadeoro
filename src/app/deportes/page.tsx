'use client';

import React, { useState } from 'react';
import { SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { DailyEmotionalMediaCapsule } from '@/components/sports/DailyEmotionalMediaCapsule';
import { formatTime12h, formatFullDateCostaRica } from '@/lib/utils';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Lock, 
  ChevronRight,
  CheckCircle2,
  MapPin,
  Flame
} from 'lucide-react';
import Link from 'next/link';

export default function DeportesPage() {
  const { categories, matches, getSchoolById } = useTournament();
  const { t } = useLanguage();
  const [activeSport, setActiveSport] = useState<SportType>('futbol');

  const sportCategories = categories.filter((c) => c.sport === activeSport);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(sportCategories[0]?.id || 'cat-fem-futbol');

  // Actualizar categoría al cambiar deporte
  const handleSportSelect = (sport: SportType) => {
    setActiveSport(sport);
    const firstCat = categories.find((c) => c.sport === sport);
    if (firstCat) setSelectedCategoryId(firstCat.id);
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || sportCategories[0];
  const categoryMatches = matches.filter((m) => m.categoryId === (currentCategory?.id || ''));

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

      {/* 🏅 ESPACIO INTERMEDIO: LOGOTIPO NEXTPLAY ARMONIOSO */}
      <div className="flex items-center justify-center -my-1 sm:-my-2">
        <div className="flex items-center gap-3 w-full max-w-sm px-2">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-slate-300" />
          <img
            src="/logos/nextplay_logo.png"
            alt="NextPlay"
            className="h-6 sm:h-7 w-auto object-contain transition-transform hover:scale-105"
          />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-slate-200 to-slate-300" />
        </div>
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
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                {activeSport === 'futbol' ? 'Fútbol Formativo' : activeSport === 'voleibol' ? 'Voleibol Sala' : 'Baloncesto FIBA'}
              </span>
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

        {/* Categorías Oficiales y Días (Selector Interactivo de Rama y Categoría) */}
        <div className="p-5 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Categorías y Ramas ({sportCategories.length}):</span>
            </h3>
            <span className="text-[11px] text-amber-800 font-semibold">
              Selecciona una categoría para ver sus partidos y tabla
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sportCategories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-400/50'
                      : 'bg-slate-50/70 border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-900 text-sm truncate">{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs shrink-0 ${
                      isSelected ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}>
                      {cat.gender === 'Femenino' ? '👩 Femenino' : '👦 Masculino'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{t('sports.day')}: <strong>{cat.dayOfWeek}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t('sports.time')}: {cat.scheduleTime}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⚔️ 1. PARTIDOS DEL DÍA / DE LA CATEGORÍA SELECCIONADA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wide">
                {currentCategory?.name || 'Categoría'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-bold">
                {currentCategory?.gender === 'Femenino' ? '👩 Rama Femenina' : '👦 Rama Masculina'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>Partidos de la Jornada ({categoryMatches.length})</span>
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Día de competencia: <strong>{currentCategory?.dayOfWeek}</strong>
          </span>
        </div>

        {categoryMatches.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No hay partidos programados actualmente para esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {categoryMatches.map((m) => {
              const h = getSchoolById(m.homeTeamId);
              const a = getSchoolById(m.awayTeamId);
              const isCompleted = m.status === 'completed';
              const isLive = m.status === 'live';

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatTime12h(m.time)}</span>
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Finalizado
                      </span>
                    ) : isLive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10.5px] font-black animate-pulse border border-red-200">
                        🔴 En vivo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10.5px] font-bold border border-amber-200">
                        Programado
                      </span>
                    )}
                  </div>

                  {/* Enfrentamiento cara a cara */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <SchoolEmblem schoolId={m.homeTeamId} size="sm" showBorder={false} />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {h?.shortName || m.homeTeamId}
                      </span>
                    </div>

                    <div className="px-2 text-center">
                      {isCompleted || isLive ? (
                        <span className="font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-slate-900 text-amber-300 shadow-2xs whitespace-nowrap">
                          {m.homeScore} : {m.awayScore}
                        </span>
                      ) : (
                        <span className="font-bold text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-200/80">
                          VS
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 min-w-0 text-right">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {a?.shortName || m.awayTeamId}
                      </span>
                      <SchoolEmblem schoolId={m.awayTeamId} size="sm" showBorder={false} />
                    </div>
                  </div>

                  {/* Notas o sede */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{m.venue}</span>
                    </span>
                    {m.notes && (
                      <span className="text-[10px] text-amber-800 font-medium truncate max-w-[180px]">
                        {m.notes}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🏆 2. TABLA DE POSICIONES OFICIAL DE LA CATEGORÍA */}
      <StandingsTable categoryId={selectedCategoryId} hideCategoryPills />

      {/* 🌟 3. CÁPSULA EMOTIVA Y DE VALOR HUMANO (FOTOS Y VIDEOS) */}
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
