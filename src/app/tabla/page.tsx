'use client';

import React, { useMemo } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { GlobalProgressHero } from '@/components/sports/GlobalProgressHero';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { Trophy, TrendingUp } from 'lucide-react';

export default function TablaPage() {
  const { schools, categories, getStandingsForCategory } = useTournament();

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
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-600" />
            <span>Avance Global y Puntuaciones</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Seguimiento visual interactivo del rendimiento de los 6 colegios en todas las disciplinas oficiales.
          </p>
        </div>
      </div>

      {/* Hero de Avance Global con Barras Visuales Interactivas */}
      <GlobalProgressHero schools={schools} globalStandings={globalStandings} />

      {/* Detalle Opcional por Categoría */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-600" />
          <span>Tablas de Posición Detalladas por Categoría</span>
        </h3>
        <StandingsTable />
      </div>
    </div>
  );
}
