'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { SchoolRosterManager } from '@/components/sports/SchoolRosterManager';
import { MatchDetailModal } from '@/components/sports/MatchDetailModal';
import { formatDateCostaRica, formatFullDateCostaRica, formatTime12h } from '@/lib/utils';
import { Match } from '@/types/tournament';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  Trophy, 
  Award, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from 'lucide-react';

export default function ColegiosPage() {
  const { schools, matches, getSchoolById, getCategoryById } = useTournament();
  const { t } = useLanguage();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [sportFilter, setSportFilter] = useState<'all' | 'futbol' | 'voleibol' | 'baloncesto'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const activeSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const allSchoolMatches = matches.filter(
    (m) => m.homeTeamId === activeSchool.id || m.awayTeamId === activeSchool.id
  );

  const filteredMatches = sportFilter === 'all'
    ? allSchoolMatches
    : allSchoolMatches.filter((m) => m.sport === sportFilter);

  const completedMatches = allSchoolMatches.filter((m) => m.status === 'completed');
  
  const stats = completedMatches.reduce(
    (acc, m) => {
      const isHome = m.homeTeamId === activeSchool.id;
      const myScore = isHome ? m.homeScore : m.awayScore;
      const oppScore = isHome ? m.awayScore : m.homeScore;

      if (myScore > oppScore) acc.wins += 1;
      else if (myScore === oppScore) acc.draws += 1;
      else acc.losses += 1;

      return acc;
    },
    { wins: 0, draws: 0, losses: 0 }
  );

  const getSchoolMascot = (schoolId: string) => {
    if (schoolId === 'la-paz-cabo-velas') return 'Tiburones (Sharks) 🦈';
    if (schoolId === 'la-paz-tempisque') return 'Pumas 🐾';
    if (schoolId === 'cria') return 'CRIA Oficial';
    if (schoolId === 'journey-school') return 'The Journey School';
    if (schoolId === 'vittorino') return 'Centro Educativo Vittorino Girardi';
    return 'Educarte High';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 🏷️ CABECERA PRINCIPAL */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-amber-600" />
          <span>{t('schools.headerTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('schools.headerSubtitle')}
        </p>
      </div>

      {/* 🏫 SELECTOR DE COLEGIOS (2 EN 2 / GRID SIMÉTRICO) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {schools.map((s) => {
          const isSelected = s.id === activeSchool.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSchoolId(s.id);
                setSportFilter('all');
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-2 shadow-2xs">
                <SchoolEmblem schoolId={s.id} size="sm" showBorder={false} />
              </div>
              <div className="min-w-0 w-full">
                <span className="block font-extrabold text-slate-900 text-xs truncate">
                  {s.shortName || s.name}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {s.city}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 🏆 PERFIL MINIMALISTA DE LA INSTITUCIÓN SELECCIONADA */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6">
        {/* Cabecera del Colegio + Métricas Rápidas */}
        <div className="p-5 sm:p-7 bg-gradient-to-r from-slate-50 via-amber-50/20 to-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-amber-300 shadow-md flex items-center justify-center p-2.5 shrink-0">
              <SchoolEmblem schoolId={activeSchool.id} size="lg" showBorder={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase tracking-wider">
                  {activeSchool.acronym}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{getSchoolMascot(activeSchool.id)}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {activeSchool.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{activeSchool.location}, {activeSchool.city}</span>
              </p>
            </div>
          </div>

          {/* Tarjetas de Métricas Resumidas */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center shadow-2xs">
              <span className="block text-base sm:text-lg font-black text-slate-900 font-mono">{allSchoolMatches.length}</span>
              <span className="text-[9.5px] text-slate-400 font-bold uppercase">{t('schools.matches')}</span>
            </div>
            <div className="bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-center shadow-2xs">
              <span className="block text-base sm:text-lg font-black text-emerald-700 font-mono">{stats.wins}</span>
              <span className="text-[9.5px] text-emerald-600 font-bold uppercase">{t('schools.wins')}</span>
            </div>
            <div className="bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-center shadow-2xs">
              <span className="block text-base sm:text-lg font-black text-amber-700 font-mono">3</span>
              <span className="text-[9.5px] text-amber-600 font-bold uppercase">{t('schools.sportsCount')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 MÓDULO DE NÓMINA OFICIAL Y GESTIÓN DE EXCEL DE LA INSTITUCIÓN */}
      <SchoolRosterManager activeSchool={activeSchool} />

      {/* 📅 CALENDARIO Y ENCUENTROS DE LA INSTITUCIÓN */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6">
        {/* ⚽ FILTROS POR DEPORTE (CÓDIGO DE COLORES) */}
        <div className="p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{t('schools.scheduleTitle')} {activeSchool.shortName}</span>
            </h3>

            {/* Píldoras de Filtro por Deporte */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSportFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  sportFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('schools.allFilter')} ({allSchoolMatches.length})
              </button>

              <button
                onClick={() => setSportFilter('futbol')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  sportFilter === 'futbol'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <span>⚽ {t('sports.soccer')}</span>
              </button>

              <button
                onClick={() => setSportFilter('voleibol')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  sportFilter === 'voleibol'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-sky-800 hover:bg-sky-50'
                }`}
              >
                <span>🏐 {t('sports.volleyball')}</span>
              </button>

              <button
                onClick={() => setSportFilter('baloncesto')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  sportFilter === 'baloncesto'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-orange-800 hover:bg-orange-50'
                }`}
              >
                <span>🏀 {t('sports.basketball')}</span>
              </button>
            </div>
          </div>

          {/* 📋 LISTA RESUMIDA Y MINIMALISTA DE ENCUENTROS (1 COLUMNA EN MÓVIL) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
            {filteredMatches.map((match) => {
              const homeSchool = getSchoolById(match.homeTeamId) || schools[0];
              const awaySchool = getSchoolById(match.awayTeamId) || schools[1];
              const isHome = match.homeTeamId === activeSchool.id;
              const category = getCategoryById(match.categoryId);
              
              const isCompleted = match.status === 'completed';
              const isScheduled = match.status === 'scheduled';
              const isLive = match.status === 'live';

              const myScore = isHome ? match.homeScore : match.awayScore;
              const oppScore = isHome ? match.awayScore : match.homeScore;
              const isWin = isCompleted && myScore > oppScore;
              const isDraw = isCompleted && myScore === oppScore;

              // Color Theme per Sport
              const sportStyle = 
                match.sport === 'futbol'
                  ? { border: 'border-emerald-200', bg: 'bg-emerald-50/30', badge: 'bg-emerald-100 text-emerald-950', icon: '⚽' }
                  : match.sport === 'voleibol'
                  ? { border: 'border-sky-200', bg: 'bg-sky-50/30', badge: 'bg-sky-100 text-sky-950', icon: '🏐' }
                  : { border: 'border-orange-200', bg: 'bg-orange-50/30', badge: 'bg-orange-100 text-orange-950', icon: '🏀' };

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-4 sm:p-5 rounded-3xl border ${sportStyle.border} ${sportStyle.bg} hover:shadow-md transition-all flex flex-col justify-between gap-3.5 cursor-pointer group bg-white shadow-2xs`}
                >
                  {/* Fila Superior: Deporte + Fecha / Hora + Estado */}
                  <div className="flex items-center justify-between gap-2 text-xs flex-wrap border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-xl font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5 shadow-2xs ${sportStyle.badge}`}>
                        <span>{sportStyle.icon}</span>
                        <span>{category?.name || match.sport}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 text-white font-bold text-[11px] shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatTime12h(match.time)}</span>
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isCompleted && (
                        <span className={`px-2.5 py-1 rounded-xl font-bold text-[10.5px] flex items-center gap-1 shadow-2xs ${
                          isWin 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : isDraw 
                            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {isWin ? t('schools.win') : isDraw ? t('schools.draw') : t('schools.loss')} ({myScore} - {oppScore})
                        </span>
                      )}
                      {isScheduled && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-[10.5px] flex items-center gap-1 border border-amber-200 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>{t('schools.scheduled')}</span>
                        </span>
                      )}
                      {isLive && (
                        <span className="px-2.5 py-1 rounded-xl bg-red-100 text-red-700 font-black text-[10.5px] flex items-center gap-1 animate-pulse border border-red-200 shadow-2xs">
                          <span>{t('schools.live')} ({myScore} - {oppScore})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fila Central: Enfrentamiento Cara a Cara 1:1 (Simétrico y Nítido) */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="grid grid-cols-7 items-center gap-2">
                      {/* Equipo Local (Lado Izquierdo) */}
                      <div className={`col-span-3 flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left p-2 rounded-xl transition-colors ${
                        match.homeTeamId === activeSchool.id ? 'bg-amber-50/80 border border-amber-200' : ''
                      }`}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                          <SchoolEmblem schoolId={homeSchool.id} size="sm" showBorder={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 justify-center sm:justify-start flex-wrap">
                            <span className="text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Local
                            </span>
                            {match.homeTeamId === activeSchool.id && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                Mi equipo
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-tight mt-1">
                            {homeSchool.shortName || homeSchool.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                            {homeSchool.city}
                          </span>
                        </div>
                      </div>

                      {/* VS o Marcador Central */}
                      <div className="col-span-1 text-center flex flex-col items-center justify-center">
                        {isCompleted || isLive ? (
                          <span className="font-mono font-black text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 block shadow-2xs">
                            {match.homeScore} : {match.awayScore}
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="font-black text-[11px] text-amber-950 bg-amber-400 px-2.5 py-1 rounded-xl shadow-xs border border-amber-500">
                              VS
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Equipo Visita (Lado Derecho) */}
                      <div className={`col-span-3 flex flex-col sm:flex-row-reverse items-center sm:items-start gap-2 text-center sm:text-right p-2 rounded-xl transition-colors ${
                        match.awayTeamId === activeSchool.id ? 'bg-amber-50/80 border border-amber-200' : ''
                      }`}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                          <SchoolEmblem schoolId={awaySchool.id} size="sm" showBorder={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 justify-center sm:justify-end flex-wrap">
                            {match.awayTeamId === activeSchool.id && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                Mi equipo
                              </span>
                            )}
                            <span className="text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Visita
                            </span>
                          </div>
                          <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-tight mt-1">
                            {awaySchool.shortName || awaySchool.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                            {awaySchool.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voleibol: Resumen de Sets si aplica */}
                  {match.sport === 'voleibol' && match.setScores && match.setScores.length > 0 && (
                    <div className="flex items-center justify-center gap-2 text-[10.5px] text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-medium">
                      <span>Sets ({match.homeSetsWon ?? 0} - {match.awaySetsWon ?? 0}):</span>
                      <span className="font-mono font-bold">
                        {match.setScores.map((s, idx) => `S${idx + 1}: ${s.home}-${s.away}`).join(' | ')}
                      </span>
                    </div>
                  )}

                  {/* Fila Inferior: Fecha Completa RAE + Sede con Salto Responsivo */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{formatFullDateCostaRica(match.date)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{match.venue}</span>
                    </div>

                    {match.mvpPlayerName && (
                      <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shrink-0">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>MVP: {match.mvpPlayerName}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Detalle al hacer clic */}
      {selectedMatch && (
        <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}

