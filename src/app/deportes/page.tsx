'use client';

import React, { useState } from 'react';
import { SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { DailyEmotionalMediaCapsule } from '@/components/sports/DailyEmotionalMediaCapsule';
import { formatTime12h, formatFullDateCostaRica } from '@/lib/utils';
import { getActiveCompetitionDayInfo } from '@/lib/sportsEngine';
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

import { SportNavCardsHeader } from '@/components/sports/SportNavCardsHeader';

export default function DeportesPage() {
  const { categories, matches, schools, getSchoolById } = useTournament();
  const { t } = useLanguage();

  // Detección automática del día y categoría en competición
  const initialDayInfo = getActiveCompetitionDayInfo();
  const [activeSport, setActiveSport] = useState<SportType>(initialDayInfo.sport);

  const sportCategories = categories.filter((c) => c.sport === activeSport);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories.some((c) => c.id === initialDayInfo.categoryId)
      ? initialDayInfo.categoryId
      : sportCategories[0]?.id || 'cat-c-futbol'
  );

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

      {/* ⚽🏐🏀 1. SELECTOR PRINCIPAL DE DISCIPLINAS UNIFICADO + LOGO NEXTPLAY */}
      <SportNavCardsHeader
        selectedSport={activeSport}
        onSelectSport={handleSportSelect}
      />

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

      {/* 🏫 1. INSTITUCIONES Y DELEGACIONES PARTICIPANTES EN ESTA DISCIPLINA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
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
              <Users className="w-5 h-5 text-amber-600" />
              <span>Instituciones y Delegaciones en Competencia ({schools.length})</span>
            </h3>
          </div>

          <Link
            href="/marcadores"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs shadow-2xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ver Marcadores y Posiciones →</span>
          </Link>
        </div>

        {/* Tarjetas de Instituciones Participantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {schools.map((school) => {
            const schoolCatMatches = matches.filter(
              (m) => m.categoryId === currentCategory?.id && (m.homeTeamId === school.id || m.awayTeamId === school.id)
            );

            return (
              <div
                key={school.id}
                className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                    <SchoolEmblem schoolId={school.id} size="sm" showBorder={false} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-sm text-slate-900 block truncate">
                      {school.shortName || school.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      📍 {school.location || school.city}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                      {schoolCatMatches.length} {schoolCatMatches.length === 1 ? 'partido asignado' : 'partidos asignados'}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Día: <strong>{currentCategory?.dayOfWeek}</strong></span>
                  <Link
                    href="/marcadores"
                    className="text-amber-600 font-extrabold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ver resultados</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
