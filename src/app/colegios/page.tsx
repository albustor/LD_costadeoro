'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { MatchDetailModal } from '@/components/sports/MatchDetailModal';
import { formatDateCostaRica } from '@/lib/utils';
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
    if (schoolId === 'la-paz-cabo-velas') return 'Pumas 🐾';
    if (schoolId === 'la-paz-tempisque') return 'Tiburones 🦈';
    if (schoolId === 'cria') return 'CRIA Oficial';
    if (schoolId === 'journey-school') return 'The Journey School';
    if (schoolId === 'vittorino') return 'Vittorino Prep';
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
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shadow-2xs">
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

        {/* ⚽ FILTROS POR DEPORTE (CÓDIGO DE COLORES) */}
        <div className="px-5 sm:px-7 space-y-4">
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

          {/* 📋 LISTA RESUMIDA Y MINIMALISTA DE ENCUENTROS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
            {filteredMatches.map((match) => {
              const isHome = match.homeTeamId === activeSchool.id;
              const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
              const opponent = getSchoolById(opponentId);
              const category = getCategoryById(match.categoryId);
              
              const isCompleted = match.status === 'completed';
              const isScheduled = match.status === 'scheduled';
              const isLive = match.status === 'live';

              const myScore = isHome ? match.homeScore : match.awayScore;
              const oppScore = isHome ? match.awayScore : match.homeScore;
              const isWin = isCompleted && myScore > oppScore;
              const isDraw = isCompleted && myScore === oppScore;
              const isLoss = isCompleted && myScore < oppScore;

              // Color Theme per Sport
              const sportStyle = 
                match.sport === 'futbol'
                  ? { border: 'border-emerald-200', bg: 'bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-900', icon: '⚽' }
                  : match.sport === 'voleibol'
                  ? { border: 'border-sky-200', bg: 'bg-sky-50/40', badge: 'bg-sky-100 text-sky-900', icon: '🏐' }
                  : { border: 'border-orange-200', bg: 'bg-orange-50/40', badge: 'bg-orange-100 text-orange-900', icon: '🏀' };

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-4 rounded-2xl border ${sportStyle.border} ${sportStyle.bg} hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer group bg-white`}
                >
                  {/* Fila Superior: Deporte + Jornada + Estado */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] uppercase tracking-wide flex items-center gap-1 ${sportStyle.badge}`}>
                        <span>{sportStyle.icon}</span>
                        <span>{category?.name || match.sport}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500 font-medium truncate">{match.jornadaName}</span>
                    </div>

                    <div className="shrink-0">
                      {isCompleted && (
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                          isWin 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isDraw 
                            ? 'bg-slate-100 text-slate-700' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isWin ? t('schools.win') : isDraw ? t('schools.draw') : t('schools.loss')} ({myScore} - {oppScore})
                        </span>
                      )}
                      {isScheduled && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>{t('schools.scheduled')}</span>
                        </span>
                      )}
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                          <span>{t('schools.live')} ({myScore} - {oppScore})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fila Central: Enfrentamiento Directo vs Rival */}
                  <div className="flex items-center justify-between gap-3 bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        {isHome ? t('schools.vsLocal') : t('schools.vsAway')}
                      </span>
                      <SchoolEmblem schoolId={opponent?.id || ''} size="sm" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate block">
                          {opponent?.name || opponent?.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {opponent?.location || opponent?.city}
                        </span>
                      </div>
                    </div>

                    {/* Marcador Oficial o VS */}
                    <div className="shrink-0 text-right">
                      {isCompleted ? (
                        <span className="font-mono font-black text-sm sm:text-base text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {match.homeScore} : {match.awayScore}
                        </span>
                      ) : (
                        <span className="font-bold text-xs text-amber-800 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-300/80">
                          VS
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Voleibol: Resumen de Sets si aplica */}
                  {match.sport === 'voleibol' && match.setScores && match.setScores.length > 0 && (
                    <div className="flex items-center gap-2 text-[10.5px] text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-medium">
                      <span>Sets ({match.homeSetsWon ?? 0} - {match.awaySetsWon ?? 0}):</span>
                      <span className="font-mono font-bold">
                        {match.setScores.map((s, idx) => `S${idx + 1}: ${s.home}-${s.away}`).join(' | ')}
                      </span>
                    </div>
                  )}

                  {/* Fila Inferior: Fecha, Sede y MVP */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-slate-700">
                        📅 {formatDateCostaRica(match.date)} • {match.time}
                      </span>
                      <span>•</span>
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {match.venue}
                      </span>
                    </div>

                    {match.mvpPlayerName && (
                      <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shrink-0">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>MVP</span>
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

