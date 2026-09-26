'use client';

import React from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { MatchCard } from '@/components/sports/MatchCard';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { SponsorsBanner } from '@/components/sponsors/SponsorsBanner';
import { VideoShortsWall } from '@/components/media/VideoShortsWall';
import { PhotoGalleryGrid } from '@/components/media/PhotoGalleryGrid';
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Shield, 
  Flame,
  Camera
} from 'lucide-react';

export default function HomePage() {
  const { tournament, matches, schools } = useTournament();
  const { isFeatureEnabled, tierConfig } = useTier();

  const recentMatches = matches.filter((m) => m.status === 'completed').slice(0, 4);
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').slice(0, 4);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Welcome Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>{tournament.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium text-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Sede: {tournament.host.name}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            El Epicentro Deportivo Escolar de la Costa Guanacasteca
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Sigue en tiempo real las 7 categorías oficiales en Fútbol, Voleibol y Baloncesto con 6 colegios de élite: <em>La Paz Cabo Velas, La Paz Tempisque, CRIA, The Journey School, Vittorino Prep y Educarte</em>.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">6</span>
              <span className="text-[11px] text-slate-400">Colegios Rivales</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">7</span>
              <span className="text-[11px] text-slate-400">Categorías Oficiales</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">4</span>
              <span className="text-[11px] text-slate-400">Festivales Deportivos</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">100%</span>
              <span className="text-[11px] text-slate-400">Tiempo Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Participating Schools Badges */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Instituciones Educativas Participantes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {schools.map((school) => (
            <div
              key={school.id}
              className="bg-slate-900/80 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-800 transition-all flex items-center gap-2.5"
            >
              <span className="text-2xl">{school.logo}</span>
              <div className="min-w-0">
                <span className="block font-bold text-white text-xs truncate">{school.shortName}</span>
                <span className="block text-[10px] text-slate-400 truncate">{school.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid: Standings + Recent Matches */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Standings Table (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <StandingsTable />
        </div>

        {/* Matches Feed (1 Column) */}
        <div className="space-y-6">
          {/* Recent Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Resultados Recientes</span>
              </h3>
              <Link
                href="/calendario"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
              >
                <span>Ver todos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Próximos Encuentros</span>
                </h3>
              </div>
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sponsors Section (Conditional on Tier) */}
      <SponsorsBanner />

      {/* Fan Shorts Section (Conditional on Tier) */}
      <VideoShortsWall />

      {/* Photo Gallery Preview */}
      <PhotoGalleryGrid />
    </div>
  );
}
