'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { MatchCard } from '@/components/sports/MatchCard';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { SponsorsBanner } from '@/components/sponsors/SponsorsBanner';
import { VideoShortsWall } from '@/components/media/VideoShortsWall';
import { PhotoGalleryGrid } from '@/components/media/PhotoGalleryGrid';
import { DaySportFilterTabs, DayFilterValue } from '@/components/sports/DaySportFilterTabs';
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Shield, 
  Flame
} from 'lucide-react';

export default function HomePage() {
  const { tournament, matches, schools, categories } = useTournament();
  const { isFeatureEnabled } = useTier();
  const [selectedDay, setSelectedDay] = useState<DayFilterValue>('all');

  const recentMatches = matches.filter((m) => m.status === 'completed').slice(0, 4);
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').slice(0, 4);

  const displayedMatches = selectedDay === 'all'
    ? recentMatches
    : matches.filter((m) => {
        const cat = categories.find((c) => c.id === m.categoryId);
        return cat?.dayOfWeek === selectedDay;
      });


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Minimalist Light Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              <span>{tournament.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sede: {tournament.host.name}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Portal Oficial de la Liga Deportiva Costa de Oro 2026
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Sigue en tiempo real las 7 categorías oficiales en Fútbol, Voleibol y Baloncesto de los 6 colegios participantes: <em>La Paz Cabo Velas, La Paz Tempisque, CRIA, The Journey School, Vittorino Prep y Educarte</em>.
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xl font-black text-slate-900 font-mono block">6</span>
              <span className="text-[11px] text-slate-500 font-medium">Colegios Rivales</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xl font-black text-slate-900 font-mono block">7</span>
              <span className="text-[11px] text-slate-500 font-medium">Categorías Oficiales</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xl font-black text-slate-900 font-mono block">4</span>
              <span className="text-[11px] text-slate-500 font-medium">Festivales Deportivos</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xl font-black text-amber-600 font-mono block">100%</span>
              <span className="text-[11px] text-slate-500 font-medium">Tiempo Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Participating Schools Badges */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Instituciones Educativas Participantes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {schools.map((school) => (
            <Link
              key={school.id}
              href="/colegios"
              className="bg-white hover:bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all flex items-center gap-2.5 shadow-sm group"
            >
              <span className="text-2xl shrink-0 group-hover:scale-105 transition-transform">{school.logo}</span>
              <div className="min-w-0">
                <span className="block font-bold text-slate-900 text-xs truncate group-hover:text-amber-700">{school.shortName}</span>
                <span className="block text-[10px] text-slate-500 truncate">{school.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Day / Sport Selector Tabs */}
      <section className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <DaySportFilterTabs
          selectedDay={selectedDay}
          onSelectDay={(day) => setSelectedDay(day)}
        />
      </section>

      {/* Main Content Grid: Standings + Matches */}
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
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>
                  {selectedDay === 'all' ? 'Resultados Recientes' : `Partidos (${selectedDay})`}
                </span>
              </h3>
              <Link
                href="/calendario"
                className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-0.5"
              >
                <span>Ver calendario completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {displayedMatches.length === 0 ? (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  No hay partidos registrados para este día.
                </div>
              ) : (
                displayedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              )}
            </div>
          </div>

          {/* Upcoming Matches */}
          {selectedDay === 'all' && upcomingMatches.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
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


      {/* Sponsors & Shorts (Conditioned on feature flags) */}
      {isFeatureEnabled('sponsorBanners') && <SponsorsBanner />}
      {isFeatureEnabled('fanShortsVideo') && <VideoShortsWall />}
      {isFeatureEnabled('officialPhotos') && <PhotoGalleryGrid />}
    </div>
  );
}
