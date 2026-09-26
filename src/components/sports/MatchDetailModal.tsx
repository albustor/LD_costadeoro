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
  Share2,
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
  const isCompleted = match.status === 'completed';

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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {category?.name}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">{match.jornadaName}</span>
          </div>

          {/* Big Scoreboard Box */}
          <div className="grid grid-cols-7 items-center gap-3 py-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4">
            {/* Home */}
            <div className="col-span-3 flex flex-col items-center text-center gap-1.5">
              <span className="text-4xl">{home?.logo}</span>
              <span className="font-extrabold text-white text-sm sm:text-base leading-tight">
                {home?.name}
              </span>
              <span className="text-[11px] text-slate-400">{home?.city}</span>
            </div>

            {/* Score */}
            <div className="col-span-1 text-center">
              {match.status === 'scheduled' ? (
                <div className="text-xs font-bold text-slate-400 bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-800">
                  {match.time}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-3xl font-black text-amber-400 font-mono tracking-wider block">
                    {match.homeScore} : {match.awayScore}
                  </span>
                  {isLive && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
                      {match.currentPeriod}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away */}
            <div className="col-span-3 flex flex-col items-center text-center gap-1.5">
              <span className="text-4xl">{away?.logo}</span>
              <span className="font-extrabold text-white text-sm sm:text-base leading-tight">
                {away?.name}
              </span>
              <span className="text-[11px] text-slate-400">{away?.city}</span>
            </div>
          </div>

          {/* Volleyball Sets Breakdown */}
          {match.sport === 'voleibol' && match.setScores && (
            <div className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Desglose de Sets:</span>
              {match.setScores.map((set, idx) => (
                <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded font-mono border border-slate-800">
                  Set {idx + 1}: {set.home} - {set.away}
                </span>
              ))}
            </div>
          )}

          {/* Venue & Date Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDateCostaRica(match.date)} a las {match.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {match.venue}
            </span>
          </div>
        </div>

        {/* Modal Body: Notes, MVP, Fan Voting */}
        <div className="p-6 space-y-6">
          {/* Official Match Commentary / Notes */}
          {match.notes && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Reseña y Crónica del Encuentro
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{match.notes}</p>
            </div>
          )}

          {/* Official MVP Award */}
          {match.mvpPlayerName && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Jugador Más Valioso Oficial
                </span>
                <span className="text-sm font-extrabold text-white">{match.mvpPlayerName}</span>
              </div>
            </div>
          )}

          {/* Community MVP Fan Voting (Tier 3 Feature) */}
          {isFeatureEnabled('communityMVPVoting') ? (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Votación Popular en Vivo de la Afición
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {totalVotes} votos registrados
                </span>
              </div>

              {votedPlayer ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      {home?.logo} {home?.shortName} ({homePct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      ({awayPct}%) {away?.shortName} {away?.logo}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${homePct}%` }}
                      className="bg-amber-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${awayPct}%` }}
                      className="bg-sky-500 transition-all duration-500"
                    />
                  </div>

                  <p className="text-center text-[11px] text-emerald-400 font-medium">
                    ¡Gracias por apoyar a tu institución favorita!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVote('home')}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">{home?.logo}</span>
                    <span className="text-xs font-bold text-white block group-hover:text-amber-400">
                      Votar por {home?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-400">Rendimiento Destacado</span>
                  </button>

                  <button
                    onClick={() => handleVote('away')}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">{away?.logo}</span>
                    <span className="text-xs font-bold text-white block group-hover:text-amber-400">
                      Votar por {away?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-400">Rendimiento Destacado</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                La votación comunitaria en vivo es exclusiva de la <strong>Opción 3 (Comercial Autónoma)</strong>.
              </span>
            </div>
          )}

          {/* Quick Action: Upload Short for this match */}
          {isFeatureEnabled('fanShortsVideo') && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">¿Estás en la cancha grabando jugadas?</span>
              <Link
                href="/mural"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Subir Short (9:16)</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
