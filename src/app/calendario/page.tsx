'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { MatchCard } from '@/components/sports/MatchCard';
import { Calendar, Filter } from 'lucide-react';

export default function CalendarioPage() {
  const { matches, categories, schools } = useTournament();
  const [selectedJornada, setSelectedJornada] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  const filteredMatches = matches.filter((m) => {
    if (selectedJornada !== 'all' && m.jornada !== selectedJornada) return false;
    if (selectedCategory !== 'all' && m.categoryId !== selectedCategory) return false;
    if (selectedSchool !== 'all' && m.homeTeamId !== selectedSchool && m.awayTeamId !== selectedSchool) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Calendario Oficial de Encuentros</span>
          </h1>
          <p className="text-xs text-slate-400">
            Programación de los 4 festivales deportivos (Octubre - Noviembre 2026)
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Jornada / Festival
          </label>
          <select
            value={selectedJornada}
            onChange={(e) => setSelectedJornada(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas las Jornadas</option>
            <option value={1}>1.ª Jornada (Octubre 5-9)</option>
            <option value={2}>2.ª Jornada (Noviembre 2-6)</option>
            <option value={3}>3.ª Jornada (Noviembre 16-20)</option>
            <option value={4}>Semana de Finales (Noviembre 23-27)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Institución
          </label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todos los Colegios</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
            No se encontraron encuentros con los filtros seleccionados.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}
