'use client';

import React, { useState } from 'react';
import { Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { formatDateCostaRica } from '@/lib/utils';
import { 
  X, 
  MapPin, 
  Clock, 
  Award, 
  Flame, 
  CheckCircle2, 
  Film, 
  Sparkles,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const { getSchoolById, getCategoryById } = useTournament();
  const { isFeatureEnabled } = useTier();

  // Local state for MVP voting
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
    home: 42,
    away: 35,
  });

  if (!match) return null;

  const home = getSchoolById(match.homeTeamId);
  const away = getSchoolById(match.awayTeamId);
  const category = getCategoryById(match.categoryId);

  const isLive = match.status === 'live';

  const handleVote = (side: 'home' | 'away') => {
    if (votedPlayer) return;
    setVotedPlayer(side);
    setVoteCounts((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
  };

  const totalVotes = voteCounts.home + voteCounts.away;
  const homePct = Math.round((voteCounts.home / totalVotes) * 100);
  const awayPct = 100 - homePct;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {category?.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">{match.jornadaName}</span>
          </div>

          {/* Big Scoreboard Box */}
          <div className="grid grid-cols-7 items-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-200 p-4">
            {/* Home */}
            <div className="col-span-3 flex flex-col items-center text-center gap-1.5 min-w-0">
              <span className="text-4xl">{home?.logo}</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {home?.name}
              </span>
              <span className="text-[11px] text-slate-500">{home?.city}</span>
            </div>

            {/* Score */}
            <div className="col-span-1 text-center">
              {match.status === 'scheduled' ? (
                <div className="text-xs font-bold text-slate-600 bg-white py-1.5 px-2 rounded-lg border border-slate-200 shadow-sm">
                  {match.time}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-wider block">
                    {match.homeScore} : {match.awayScore}
                  </span>
                  {isLive && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      {match.currentPeriod}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away */}
            <div className="col-span-3 flex flex-col items-center text-center gap-1.5 min-w-0">
              <span className="text-4xl">{away?.logo}</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {away?.name}
              </span>
              <span className="text-[11px] text-slate-500">{away?.city}</span>
            </div>
          </div>

          {/* Volleyball Sets Breakdown */}
          {match.sport === 'voleibol' && match.setScores && (
            <div className="py-2 px-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2.5 text-xs text-slate-700 shadow-sm">
              <span className="font-semibold text-amber-700">Desglose de Sets:</span>
              {match.setScores.map((set, idx) => (
                <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200 text-[11px]">
                  Set {idx + 1}: {set.home} - {set.away}
                </span>
              ))}
            </div>
          )}

          {/* Venue & Date Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateCostaRica(match.date)} a las {match.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {match.venue}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Official Match Commentary / Notes */}
          {match.notes && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                Reseña Oficial del Encuentro
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{match.notes}</p>
            </div>
          )}

          {/* Official MVP Award */}
          {match.mvpPlayerName && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Jugador Más Valioso Oficial
                </span>
                <span className="text-sm font-extrabold text-slate-900">{match.mvpPlayerName}</span>
              </div>
            </div>
          )}

          {/* Community MVP Fan Voting (Conditional on Option 3) */}
          {isFeatureEnabled('communityMVPVoting') && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Votación Popular en Vivo de la Afición
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {totalVotes} votos registrados
                </span>
              </div>

              {votedPlayer ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      {home?.logo} {home?.shortName} ({homePct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      ({awayPct}%) {away?.shortName} {away?.logo}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${homePct}%` }}
                      className="bg-amber-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${awayPct}%` }}
                      className="bg-sky-500 transition-all duration-500"
                    />
                  </div>

                  <p className="text-center text-[11px] text-emerald-700 font-medium">
                    ¡Gracias por apoyar a tu institución favorita!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVote('home')}
                    className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all shadow-sm group"
                  >
                    <span className="text-xl block mb-1">{home?.logo}</span>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
                      Votar por {home?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-500">Rendimiento Destacado</span>
                  </button>

                  <button
                    onClick={() => handleVote('away')}
                    className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all shadow-sm group"
                  >
                    <span className="text-xl block mb-1">{away?.logo}</span>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
                      Votar por {away?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-500">Rendimiento Destacado</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
