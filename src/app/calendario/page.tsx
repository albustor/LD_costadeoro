'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { SportScheduleView } from '@/components/sports/SportScheduleView';
import { Calendar } from 'lucide-react';

export default function CalendarioPage() {
  const { matches, categories, schools, getStandingsForCategory } = useTournament();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>Deportes, Horarios y Calendario Oficial</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programación de partidos por cancha, barras de puntuación por disciplina y nuevas modalidades.
          </p>
        </div>
      </div>

      {/* Vista Central de Deportes y Calendario */}
      <SportScheduleView
        categories={categories}
        matches={matches}
        schools={schools}
        getStandingsForCategory={getStandingsForCategory}
      />
    </div>
  );
}
