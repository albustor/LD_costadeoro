'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Flame, MapPin, Clock } from 'lucide-react';

export function LiveMatchBanner() {
  const { matches, getSchoolById, getCategoryById } = useTournament();
  const liveMatches = matches.filter((m) => m.status === 'live');

  if (liveMatches.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border-y border-red-500/40 py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Encuentro en Vivo Ahora Mismo</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {liveMatches.map((match) => {
            const home = getSchoolById(match.homeTeamId);
            const away = getSchoolById(match.awayTeamId);
            const category = getCategoryById(match.categoryId);

            return (
              <div
                key={match.id}
                className="bg-slate-900/90 rounded-xl p-3.5 border border-red-500/30 flex items-center justify-between shadow-inner"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-amber-400">{category?.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {match.venue}
                    </span>
                  </div>

                  {/* Team vs Team with Scores */}
                  <div className="grid grid-cols-5 items-center gap-2">
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="text-xl">{home?.logo}</span>
                      <span className="font-bold text-white text-sm truncate">{home?.shortName}</span>
                    </div>

                    <div className="col-span-1 text-center bg-slate-950/80 py-1 px-2 rounded-lg border border-red-500/40">
                      <span className="text-lg font-black text-white tracking-wider">
                        {match.homeScore} : {match.awayScore}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                      <span className="font-bold text-white text-sm truncate">{away?.shortName}</span>
                      <span className="text-xl">{away?.logo}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 pl-4 border-l border-slate-800 text-center shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                    {match.currentPeriod || 'En Juego'}
                  </span>
                  {match.minute && (
                    <span className="block text-[10px] text-slate-400 mt-0.5">Minuto {match.minute}&apos;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
