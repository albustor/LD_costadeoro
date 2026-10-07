'use client';

import React, { useState } from 'react';
import { SportType, Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { MatchDetailModal } from '@/components/sports/MatchDetailModal';
import { formatTime12h, formatFullDateCostaRica } from '@/lib/utils';
import { getActiveCompetitionDayInfo } from '@/lib/sportsEngine';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import Link from 'next/link';

import { SportNavCardsHeader } from '@/components/sports/SportNavCardsHeader';

export default function MarcadoresPage() {
  const { categories, matches, getSchoolById } = useTournament();
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

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
      {/* 🏷️ CABECERA MARCADORES */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Marcadores Oficiales</span>
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">Temporada 2026</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marcadores y Tabla de Posiciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Sigue en tiempo real los resultados de cada encuentro deportivo y la tabla de clasificación por disciplina.
          </p>
        </div>

        <Link
          href="/calendario"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Ver Horarios del Día</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ⚽🏐🏀 1. SELECTOR PRINCIPAL DE DISCIPLINAS UNIFICADO + LOGO NEXTPLAY */}
      <SportNavCardsHeader
        selectedSport={activeSport}
        onSelectSport={handleSportSelect}
      />

      {/* 🏷️ 2. SELECTOR DE CATEGORÍAS FORMATIVAS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-600 block">
              Categorías de {activeSport === 'futbol' ? 'Fútbol' : activeSport === 'voleibol' ? 'Voleibol' : 'Baloncesto'}
            </span>
            <span className="text-xs text-slate-500">
              Selecciona una categoría para consultar sus marcadores y tabla de clasificación:
            </span>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {sportCategories.length} {sportCategories.length === 1 ? 'Categoría' : 'Categorías'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {sportCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border-2 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.gender === 'Femenino'
                        ? 'bg-rose-100 text-rose-800'
                        : cat.gender === 'Masculino'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {cat.gender}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>📅 Día: <strong>{cat.dayOfWeek}</strong></span>
                  <span>⏰ {cat.scheduleTime}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ⚽ 3. MARCADORES OFICIALES DE LA CATEGORÍA */}
      {currentCategory && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                  {currentCategory.name}
                </span>
                <span className="text-xs text-slate-500 font-semibold">• Rama {currentCategory.gender}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Marcadores de los Encuentros ({categoryMatches.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Día de competencia: <strong className="text-slate-800">{currentCategory.dayOfWeek}</strong>
            </span>
          </div>

          {categoryMatches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              No hay partidos registrados aún para esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {categoryMatches.map((m) => {
                const homeSchool = getSchoolById(m.homeTeamId);
                const awaySchool = getSchoolById(m.awayTeamId);

                const isLive = m.status === 'live';
                const isCompleted = m.status === 'completed';

                // Detección de no presentación
                const isWalkover =
                  m.walkover === 'home_forfeit' ||
                  m.walkover === 'away_forfeit' ||
                  m.notes?.toLowerCase().includes('no se presentó');

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all space-y-3 cursor-pointer"
                  >
                    {/* Encabezado del Partido */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{formatTime12h(m.time)}</span>
                      </div>

                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px] animate-pulse">
                          <Flame className="w-3 h-3" />
                          EN VIVO
                        </span>
                      )}

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Finalizado
                        </span>
                      )}

                      {!isLive && !isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                          Programado
                        </span>
                      )}
                    </div>

                    {/* Contenedor Elástico Simétrico: Equipo Local - Marcador - Equipo Visitante */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 py-1">
                      {/* Local */}
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <SchoolEmblem schoolId={m.homeTeamId} size="sm" showBorder={false} />
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words line-clamp-2">
                          {homeSchool?.shortName || m.homeTeamId}
                        </span>
                      </div>

                      {/* Marcador Central */}
                      <div className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-950 text-amber-300 font-black text-sm sm:text-base tracking-wider shrink-0 shadow-inner text-center">
                        {isCompleted || isLive ? `${m.homeScore} : ${m.awayScore}` : 'VS'}
                      </div>

                      {/* Visitante */}
                      <div className="flex items-center justify-end gap-2 sm:gap-2.5 min-w-0 text-right">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words line-clamp-2">
                          {awaySchool?.shortName || m.awayTeamId}
                        </span>
                        <SchoolEmblem schoolId={m.awayTeamId} size="sm" showBorder={false} />
                      </div>
                    </div>

                    {/* Detalle o Nota de No Presentación (Redacción Amigable) */}
                    {isWalkover && m.notes && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                        ℹ️ {m.notes}
                      </div>
                    )}

                    {/* Pie de tarjeta con sede */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[200px]">{m.venue || 'Sede oficial'}</span>
                      </div>
                      <span className="text-amber-600 font-bold hover:underline">Ver detalles →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 📊 4. TABLA DE POSICIONES OFICIAL EN TIEMPO REAL */}
      {currentCategory && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
                Clasificación Oficial
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Tabla de Posiciones · {currentCategory.name}
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              3 pts Victoria • 1 pt Empate
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <StandingsTable categoryId={currentCategory.id} hideCategoryPills />
          </div>
        </div>
      )}

      {/* Modal de Detalle de Partido */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
