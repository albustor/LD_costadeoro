'use client';

import React, { useState } from 'react';
import { Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { formatDateCostaRica } from '@/lib/utils';
import { MapPin, Clock, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { MatchDetailModal } from './MatchDetailModal';
import { SportWatermark, getSportTheme } from './SportGlyphs';

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
        className={`${theme.bgPastelClass} rounded-2xl border ${theme.borderClass} ${theme.borderHoverClass} transition-all p-4 relative overflow-hidden cursor-pointer group hover:shadow-md ${
          isLive ? 'ring-2 ring-red-400 border-red-300' : ''
        }`}
      >
        {/* Discrete Sport Watermark Glyph (Stroke 1.5px, <300 bytes, Opacity 12%-14%) */}
        <div
          className="absolute top-2 right-2 pointer-events-none transition-opacity duration-300 opacity-12 group-hover:opacity-22 text-slate-800"
          style={{ color: theme.accentColor }}
        >
          <SportWatermark sport={match.sport} size={85} />
        </div>

        {/* Header with category badge and status */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/70 text-xs relative z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wide ${theme.badgeBgClass} ${theme.badgeTextClass}`}>
              {category?.name || theme.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium text-[11px] truncate">{match.jornadaName}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLive && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10.5px] flex items-center gap-1 border border-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                En Vivo ({match.currentPeriod})
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full bg-white/90 text-emerald-700 font-semibold text-[10.5px] flex items-center gap-1 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Finalizado
              </span>
            )}
            {isScheduled && (
              <span className="px-2 py-0.5 rounded-full bg-white/90 text-slate-600 font-medium text-[10.5px] flex items-center gap-1 border border-slate-200 shadow-2xs">
                <Clock className="w-3 h-3 text-slate-500" />
                Programado
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        </div>

        {/* Teams and Score Box */}
        <div className="grid grid-cols-7 items-center gap-2 my-2.5 relative z-10">
          {/* Home Team */}
          <div className="col-span-3 flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              {home?.logo}
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-xs sm:text-sm truncate">{home?.name}</span>
              <span className="block text-[10.5px] text-slate-500 truncate">{home?.city}</span>
            </div>
          </div>

          {/* Score or VS */}
          <div className="col-span-1 text-center">
            {isScheduled ? (
              <div className="inline-block py-1 px-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-black text-slate-600">VS</span>
              </div>
            ) : (
              <div
                className={`py-1.5 px-2.5 rounded-xl border font-black text-base sm:text-lg font-mono tracking-wider shadow-2xs ${
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
          <div className="col-span-3 flex items-center justify-end gap-2.5 text-right min-w-0">
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-xs sm:text-sm truncate">{away?.name}</span>
              <span className="block text-[10.5px] text-slate-500 truncate">{away?.city}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              {away?.logo}
            </div>
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
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateCostaRica(match.date)} • {match.time}
            </span>
            <span className="flex items-center gap-1">
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

