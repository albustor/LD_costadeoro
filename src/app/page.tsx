'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { GlobalProgressHero } from '@/components/sports/GlobalProgressHero';
import { SportScheduleView } from '@/components/sports/SportScheduleView';
import { FamilyCheerWall } from '@/components/family/FamilyCheerWall';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Trophy, 
  MapPin, 
  ChevronRight, 
  Heart, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Sparkles 
} from 'lucide-react';

export default function HomePage() {
  const { tournament, matches, schools, categories, getStandingsForCategory } = useTournament();

  // Calcular la tabla general combinada de todos los colegios y deportes
  const globalStandings = useMemo(() => {
    const map = new Map<
      string,
      {
        school: (typeof schools)[0];
        totalPoints: number;
        played: number;
        won: number;
        drawn: number;
        lost: number;
        diff: number;
        breakdown: { futbol: number; voleibol: number; baloncesto: number };
      }
    >();

    schools.forEach((school) => {
      map.set(school.id, {
        school,
        totalPoints: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        diff: 0,
        breakdown: { futbol: 0, voleibol: 0, baloncesto: 0 },
      });
    });

    categories.forEach((cat) => {
      const standings = getStandingsForCategory(cat.id);
      standings.forEach((st) => {
        const item = map.get(st.teamId);
        if (item) {
          item.totalPoints += st.points;
          item.played += st.played;
          item.won += st.won;
          item.drawn += st.drawn;
          item.lost += st.lost;
          item.diff += st.diff;

          if (cat.sport === 'futbol') item.breakdown.futbol += st.points;
          if (cat.sport === 'voleibol') item.breakdown.voleibol += st.points;
          if (cat.sport === 'baloncesto') item.breakdown.baloncesto += st.points;
        }
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => b.totalPoints - a.totalPoints || b.diff - a.diff
    );
  }, [schools, categories, getStandingsForCategory]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 🌊 CABECERA PRINCIPAL LUMINOSA Y MINIMALISTA */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/50 border border-slate-200 p-5 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              <span>{tournament.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sede: {tournament.host.name}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Portal Familiar y Deportivo Costa de Oro 2026
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Sigue el avance de los 6 colegios participantes, consulta los horarios de partidos por cancha y envía porras y fotos familiares en tiempo real.
          </p>

          {/* Carrusel Rápido de Colegios con Escudos Oficiales */}
          <div className="pt-2">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {schools.map((school) => (
                <Link
                  key={school.id}
                  href="/colegios"
                  className="bg-white hover:bg-slate-50 p-2.5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all flex flex-col items-center gap-1 shadow-2xs text-center group"
                >
                  <SchoolEmblem schoolId={school.id} size="sm" />
                  <span className="text-[10px] font-bold text-slate-800 truncate w-full group-hover:text-amber-700">
                    {school.shortName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 SECCIÓN 1: AVANCE GENERAL INTERCOLEGIAL (COLEGIO CON MAYOR AVANCE + BARRAS) */}
      <section id="avance-general" className="space-y-4">
        <GlobalProgressHero schools={schools} globalStandings={globalStandings} />
      </section>

      {/* ⚽ SECCIÓN 2: POR DEPORTE (FÚTBOL, VOLEIBOL, BALONCESTO, HORARIOS Y BARRAS) */}
      <section id="deportes" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Deportes, Horarios y Puntuaciones</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            3 Disciplinas Base + Modalidades
          </span>
        </div>

        <SportScheduleView
          categories={categories}
          matches={matches}
          schools={schools}
          getStandingsForCategory={getStandingsForCategory}
        />
      </section>

      {/* 📸 SECCIÓN 3: MURO FAMILIAR Y MOMENTOS DESTACADOS */}
      <section id="muro-familiar" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Participación y Muro Familiar</span>
            </h2>
            <p className="text-xs text-slate-500">
              Fotos, videos y porras de las familias durante los festivales
            </p>
          </div>

          <Link
            href="/mural"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <span>Ver Muro Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Momentos Destacados en Portada */}
        <FamilyCheerWall schools={schools} featuredOnly={true} />
      </section>
    </div>
  );
}
