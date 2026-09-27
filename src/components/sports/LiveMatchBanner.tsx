'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Flame, MapPin, Clock } from 'lucide-react';
import { SportWatermark } from './SportGlyphs';

export function LiveMatchBanner() {
  const { matches, getSchoolById, getCategoryById } = useTournament();
  const liveMatches = matches.filter((m) => m.status === 'live');

  if (liveMatches.length === 0) return null;

  return (
    <div className="bg-red-50 border-y border-red-200 py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1">
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
                className="bg-white rounded-xl p-3.5 border border-red-200 flex items-center justify-between shadow-sm relative overflow-hidden"
              >
                {/* Discrete Sport Watermark */}
                <div className="absolute -right-2 -bottom-2 pointer-events-none opacity-8 text-red-700">
                  <SportWatermark sport={match.sport} size={70} />
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">{category?.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {match.venue}
                    </span>
                  </div>

                  {/* Team vs Team with Scores */}
                  <div className="grid grid-cols-5 items-center gap-2">
                    <div className="col-span-2 flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{home?.logo}</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">{home?.shortName}</span>
                    </div>

                    <div className="col-span-1 text-center bg-red-600 text-white py-1 px-2 rounded-lg font-black font-mono text-sm sm:text-base tracking-wider shadow-sm">
                      {match.homeScore} : {match.awayScore}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2 text-right min-w-0">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">{away?.shortName}</span>
                      <span className="text-xl shrink-0">{away?.logo}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-3 pl-3 border-l border-slate-200 text-center shrink-0 relative z-10">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                    {match.currentPeriod || 'En Juego'}
                  </span>
                  {match.minute && (
                    <span className="block text-[9.5px] text-slate-500 mt-0.5">Minuto {match.minute}&apos;</span>
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
