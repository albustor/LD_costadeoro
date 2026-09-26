'use client';

import React, { useState } from 'react';
import { Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { formatDateCostaRica } from '@/lib/utils';
import { MapPin, Clock, Award, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { MatchDetailModal } from './MatchDetailModal';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getSchoolById, getCategoryById } = useTournament();
  const home = getSchoolById(match.homeTeamId);
  const away = getSchoolById(match.awayTeamId);
  const category = getCategoryById(match.categoryId);

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`bg-slate-900 rounded-2xl border transition-all p-4 relative overflow-hidden cursor-pointer group hover:scale-[1.01] ${
          isLive
            ? 'border-red-500/50 shadow-lg shadow-red-950/20'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Header with category and status */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">{category?.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{match.jornadaName}</span>
          </div>

          <div className="flex items-center gap-2">
            {isLive && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center gap-1 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                En Vivo ({match.currentPeriod})
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Finalizado
              </span>
            )}
            {isScheduled && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Programado
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>

        {/* Teams and Score Box */}
        <div className="grid grid-cols-7 items-center gap-2 my-2">
          {/* Home Team */}
          <div className="col-span-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
              {home?.logo}
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-white text-sm truncate">{home?.name}</span>
              <span className="block text-xs text-slate-400">{home?.city}</span>
            </div>
          </div>

          {/* Score or VS */}
          <div className="col-span-1 text-center">
            {isScheduled ? (
              <div className="inline-block py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">VS</span>
              </div>
            ) : (
              <div
                className={`py-1.5 px-3 rounded-xl border font-black text-lg tracking-wider ${
                  isLive
                    ? 'bg-slate-950 border-red-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-amber-400'
                }`}
              >
                {match.homeScore} : {match.awayScore}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-3 flex items-center justify-end gap-3 text-right">
            <div className="min-w-0">
              <span className="block font-bold text-white text-sm truncate">{away?.name}</span>
              <span className="block text-xs text-slate-400">{away?.city}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
              {away?.logo}
            </div>
          </div>
        </div>

        {/* Volleyball Sets Breakdown */}
        {match.sport === 'voleibol' && match.setScores && match.setScores.length > 0 && (
          <div className="mt-2 py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              Sets ({match.homeSetsWon ?? 0} - {match.awaySetsWon ?? 0}):
            </span>
            {match.setScores.map((set, idx) => (
              <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                S{idx + 1}: {set.home}-{set.away}
              </span>
            ))}
          </div>
        )}

        {/* Footer Info: Venue & Date & MVP */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDateCostaRica(match.date)} • {match.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {match.venue}
            </span>
          </div>

          {match.mvpPlayerName && (
            <div className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Award className="w-3.5 h-3.5 text-amber-400" />
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
