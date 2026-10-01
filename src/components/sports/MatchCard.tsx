'use client';

import React, { useState } from 'react';
import { Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { formatDateCostaRica, formatFullDateCostaRica, formatTime12h } from '@/lib/utils';
import { MapPin, Clock, Award, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';
import { MatchDetailModal } from './MatchDetailModal';
import { SportWatermark, getSportTheme } from './SportGlyphs';
import { SchoolEmblem } from './SchoolEmblem';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getSchoolById, getCategoryById } = useTournament();
  const home = getSchoolById(match.homeTeamId);
  const away = getSchoolById(match.awayTeamId);
  const category = getCategoryById(match.categoryId);

  const theme = getSportTheme(match.sport);

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`${theme.bgPastelClass} rounded-3xl border ${theme.borderClass} ${theme.borderHoverClass} transition-all p-4 sm:p-5 relative overflow-hidden cursor-pointer group hover:shadow-md ${
          isLive ? 'ring-2 ring-red-400 border-red-300' : ''
        }`}
      >
        {/* Header with category badge, date/time and status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200/70 text-xs relative z-10">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wide flex items-center gap-1.5 shadow-2xs ${theme.badgeBgClass} ${theme.badgeTextClass}`}>
              <span>{match.sport === 'futbol' ? '⚽' : match.sport === 'voleibol' ? '🏐' : '🏀'}</span>
              <span>{category?.name || theme.name}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 text-white font-mono font-bold text-[11px] shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime12h(match.time)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLive && (
              <span className="px-2.5 py-1 rounded-xl bg-red-100 text-red-700 font-black text-[10.5px] flex items-center gap-1 border border-red-200 animate-pulse shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                En vivo ({match.currentPeriod})
              </span>
            )}
            {isCompleted && (
              <span className="px-2.5 py-1 rounded-xl bg-white/90 text-emerald-700 font-bold text-[10.5px] flex items-center gap-1 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Finalizado
              </span>
            )}
            {isScheduled && (
              <span className="px-2.5 py-1 rounded-xl bg-white/90 text-slate-700 font-bold text-[10.5px] flex items-center gap-1 border border-slate-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Programado
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        </div>

        {/* Teams and Score Box (Mobile Resilient) */}
        <div className="flex items-center justify-between gap-2.5 my-3 relative z-10 bg-white/90 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          {/* Home Team */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <SchoolEmblem schoolId={home?.id || ''} size="sm" />
            <div className="min-w-0 flex-1">
              <span className="block font-black text-slate-900 text-xs sm:text-sm leading-tight">{home?.shortName || home?.name}</span>
              <span className="block text-[10px] text-slate-500 truncate mt-0.5">{home?.city}</span>
            </div>
          </div>

          {/* Score or VS */}
          <div className="shrink-0 text-center px-1">
            {isScheduled ? (
              <div className="inline-block py-1 px-2.5 rounded-xl bg-amber-400 border border-amber-500 shadow-2xs">
                <span className="text-xs font-black text-slate-950">VS</span>
              </div>
            ) : (
              <div
                className={`py-1.5 px-3 rounded-xl border font-black text-sm sm:text-base font-mono tracking-wider shadow-2xs ${
                  isLive
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-slate-900 border-slate-300'
                }`}
              >
                {match.homeScore} : {match.awayScore}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-end gap-2.5 text-right min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <span className="block font-black text-slate-900 text-xs sm:text-sm leading-tight">{away?.shortName || away?.name}</span>
              <span className="block text-[10px] text-slate-500 truncate mt-0.5">{away?.city}</span>
            </div>
            <SchoolEmblem schoolId={away?.id || ''} size="sm" />
          </div>
        </div>

        {/* Volleyball Sets Breakdown */}
        {match.sport === 'voleibol' && match.setScores && match.setScores.length > 0 && (
          <div className="mt-2 py-1 px-3 rounded-lg bg-white/80 border border-sky-200 flex items-center justify-center gap-2.5 text-xs text-sky-900 relative z-10">
            <span className="font-semibold text-sky-950">
              Sets ({match.homeSetsWon ?? 0} - {match.awaySetsWon ?? 0}):
            </span>
            {match.setScores.map((set, idx) => (
              <span key={idx} className="bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-mono text-[11px] font-bold text-sky-800">
                S{idx + 1}: {set.home}-{set.away}
              </span>
            ))}
          </div>
        )}

        {/* Footer Info: Venue & Date & MVP */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-slate-600 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              {formatFullDateCostaRica(match.date)}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {match.venue}
            </span>
          </div>

          {match.mvpPlayerName && (
            <div className="flex items-center gap-1 text-slate-800 font-bold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>MVP: {match.mvpPlayerName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Match Center Modal */}
      {isModalOpen && (
        <MatchDetailModal match={match} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

