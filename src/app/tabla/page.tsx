'use client';

import React, { useState, useMemo } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { SportType } from '@/types/tournament';
import { 
  Trophy, 
  HelpCircle, 
  TrendingUp, 
  Hash, 
  Activity, 
  Award,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function TablaPage() {
  const { categories, getStandingsForCategory, matches } = useTournament();

  // Filtro principal de disciplina deportiva
  const [activeSport, setActiveSport] = useState<SportType>('futbol');

  // Categorías que pertenecen a la disciplina activa
  const sportCategories = useMemo(() => {
    return categories.filter((c) => c.sport === activeSport);
  }, [categories, activeSport]);

  // Categoría seleccionada dentro de la disciplina
  const [selectedCatId, setSelectedCatId] = useState<string>(sportCategories[0]?.id || '');

  // Mantener la categoría sincronizada al cambiar de deporte
  const currentCategory = useMemo(() => {
    const found = sportCategories.find((c) => c.id === selectedCatId);
    return found || sportCategories[0] || categories[0];
  }, [sportCategories, selectedCatId, categories]);

  // Tabla de posiciones de la categoría actual
  const currentStandings = useMemo(() => {
    if (!currentCategory) return [];
    return getStandingsForCategory(currentCategory.id);
  }, [currentCategory, getStandingsForCategory]);

  // Métricas numéricas exclusivas de la disciplina activa
  const sportStats = useMemo(() => {
    const sportMatches = matches.filter((m) => m.sport === activeSport);
    const completedMatches = sportMatches.filter((m) => m.status === 'completed');
    
    let totalScore = 0;
    completedMatches.forEach((m) => {
      totalScore += m.homeScore + m.awayScore;
    });

    const leader = currentStandings[0];

    return {
      totalMatches: sportMatches.length,
      playedMatches: completedMatches.length,
      totalScore,
      avgScorePerMatch: completedMatches.length > 0 ? (totalScore / completedMatches.length).toFixed(1) : '0.0',
      leaderName: leader ? leader.school.name : 'En disputa',
      leaderPoints: leader ? leader.points : 0,
    };
  }, [matches, activeSport, currentStandings]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 🏷️ CABECERA: PUNTUACIONES POR DISCIPLINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-300 font-bold text-xs border border-amber-500/40 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Puntuación Oficial por Disciplina</span>
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tabla de Posiciones y Puntuación Numérica
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Estadísticas y puntuaciones calculadas exclusivamente por cada deporte y categoría oficial.
          </p>
        </div>
      </div>

      {/* ⚽🏐🏀 1. SELECTOR PRINCIPAL POR DISCIPLINA */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Fútbol */}
        <button
          onClick={() => {
            setActiveSport('futbol');
            const first = categories.find((c) => c.sport === 'futbol');
            if (first) setSelectedCatId(first.id);
          }}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            activeSport === 'futbol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-2xl sm:text-3xl">⚽</span>
          <span className="font-black text-xs sm:text-base">Fútbol</span>
          <span className={`text-[10px] sm:text-xs font-semibold ${activeSport === 'futbol' ? 'text-amber-300' : 'text-slate-400'}`}>
            3 Categorías
          </span>
        </button>

        {/* Voleibol */}
        <button
          onClick={() => {
            setActiveSport('voleibol');
            const first = categories.find((c) => c.sport === 'voleibol');
            if (first) setSelectedCatId(first.id);
          }}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            activeSport === 'voleibol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-2xl sm:text-3xl">🏐</span>
          <span className="font-black text-xs sm:text-base">Voleibol</span>
          <span className={`text-[10px] sm:text-xs font-semibold ${activeSport === 'voleibol' ? 'text-amber-300' : 'text-slate-400'}`}>
            2 Categorías
          </span>
        </button>

        {/* Baloncesto */}
        <button
          onClick={() => {
            setActiveSport('baloncesto');
            const first = categories.find((c) => c.sport === 'baloncesto');
            if (first) setSelectedCatId(first.id);
          }}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            activeSport === 'baloncesto'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-2xl sm:text-3xl">🏀</span>
          <span className="font-black text-xs sm:text-base">Baloncesto</span>
          <span className={`text-[10px] sm:text-xs font-semibold ${activeSport === 'baloncesto' ? 'text-amber-300' : 'text-slate-400'}`}>
            2 Categorías
          </span>
        </button>
      </div>

      {/* 📊 2. RESUMEN NUMÉRICO DE LA DISCIPLINA SELECCIONADA (SIN BARRAS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Partidos Disputados
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              {sportStats.playedMatches}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {sportStats.totalMatches} totales
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block">
            {activeSport === 'futbol' ? 'Goles Anotados' : activeSport === 'voleibol' ? 'Puntos de Set' : 'Puntos en Cancha'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
              {sportStats.totalScore}
            </span>
            <span className="text-xs text-slate-500">
              en {activeSport}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Promedio Numérico
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              {sportStats.avgScorePerMatch}
            </span>
            <span className="text-xs text-slate-500">
              por partido
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Líder Categoría Activa
          </span>
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 truncate">
              {sportStats.leaderPoints} pts
            </span>
            <span className="text-xs text-amber-700 font-bold truncate">
              ({currentStandings[0]?.school.shortName || 'Líder'})
            </span>
          </div>
        </div>
      </div>

      {/* 📋 3. TABLA DE POSICIONES 100% NUMÉRICA POR CATEGORÍA */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
        {/* Selector de Categorías de la Disciplina */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {currentCategory?.name}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {currentCategory?.division} • {currentCategory?.dayOfWeek}s ({currentCategory?.scheduleTime})
              </span>
            </div>
          </div>

          {/* Botones de Categorías */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {sportCategories.map((cat) => {
              const isSelected = cat.id === currentCategory?.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.division}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla Numérica de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/90 text-slate-700 uppercase text-[10.5px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">Pos</th>
                <th className="py-3.5 px-4 min-w-[180px]">Equipo / Institución</th>
                <th className="py-3.5 px-2.5 text-center" title="Partidos Jugados">PJ</th>
                <th className="py-3.5 px-2.5 text-center text-emerald-700" title="Partidos Ganados">PG</th>
                {activeSport === 'futbol' && (
                  <th className="py-3.5 px-2.5 text-center text-slate-600" title="Partidos Empatados">PE</th>
                )}
                <th className="py-3.5 px-2.5 text-center text-red-600" title="Partidos Perdidos">PP</th>
                
                {activeSport === 'voleibol' ? (
                  <>
                    <th className="py-3.5 px-2.5 text-center" title="Sets Ganados">SG</th>
                    <th className="py-3.5 px-2.5 text-center" title="Sets Perdidos">SP</th>
                    <th className="py-3.5 px-2.5 text-center font-bold" title="Diferencia de Sets">DS</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-2.5 text-center" title="Goles / Puntos a Favor">
                      {activeSport === 'futbol' ? 'GF' : 'PF'}
                    </th>
                    <th className="py-3.5 px-2.5 text-center" title="Goles / Puntos en Contra">
                      {activeSport === 'futbol' ? 'GC' : 'PC'}
                    </th>
                    <th className="py-3.5 px-2.5 text-center font-bold" title="Diferencia Numérica">
                      {activeSport === 'futbol' ? 'DG' : 'DIF'}
                    </th>
                  </>
                )}

                <th className="py-3.5 px-4 text-center font-black text-slate-900 bg-amber-50/50" title="Puntos Totales de Tabla">
                  PTS
                </th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell" title="Racha reciente de resultados">
                  Racha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentStandings.map((row, idx) => {
                const isLeader = idx === 0;

                return (
                  <tr
                    key={row.teamId}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isLeader ? 'bg-amber-50/30 font-medium' : ''
                    }`}
                  >
                    {/* Posición Numérica */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono ${
                          idx === 0
                            ? 'bg-amber-500 text-slate-950 shadow-2xs'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    {/* Escudo + Nombre */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <SchoolEmblem schoolId={row.school.id} size="sm" />
                        <div>
                          <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                            {row.school.name}
                          </span>
                          <span className="block text-[10.5px] text-slate-400">
                            {row.school.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Estadísticas Numéricas */}
                    <td className="py-3.5 px-2.5 text-center text-slate-700 font-mono font-semibold">{row.played}</td>
                    <td className="py-3.5 px-2.5 text-center text-emerald-700 font-mono font-bold">{row.won}</td>
                    {activeSport === 'futbol' && (
                      <td className="py-3.5 px-2.5 text-center text-slate-500 font-mono">{row.drawn}</td>
                    )}
                    <td className="py-3.5 px-2.5 text-center text-red-600 font-mono">{row.lost}</td>

                    {activeSport === 'voleibol' ? (
                      <>
                        <td className="py-3.5 px-2.5 text-center text-slate-700 font-mono">{row.setsWon}</td>
                        <td className="py-3.5 px-2.5 text-center text-slate-700 font-mono">{row.setsLost}</td>
                        <td className="py-3.5 px-2.5 text-center font-mono font-bold text-slate-900">
                          {row.setsDiff && row.setsDiff > 0 ? `+${row.setsDiff}` : row.setsDiff}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-2.5 text-center text-slate-700 font-mono">{row.pointsFor}</td>
                        <td className="py-3.5 px-2.5 text-center text-slate-700 font-mono">{row.pointsAgainst}</td>
                        <td className="py-3.5 px-2.5 text-center font-mono font-bold text-slate-900">
                          {row.diff > 0 ? `+${row.diff}` : row.diff}
                        </td>
                      </>
                    )}

                    {/* Puntos Oficiales (PTS) */}
                    <td className="py-3.5 px-4 text-center bg-amber-50/50">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 font-black font-mono text-xs sm:text-sm shadow-2xs border border-amber-500/30">
                        {row.points}
                      </span>
                    </td>

                    {/* Racha */}
                    <td className="py-3.5 px-4 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-slate-400 font-mono">-</span>
                        ) : (
                          row.form.map((res, fIdx) => (
                            <span
                              key={fIdx}
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[9.5px] font-black text-white ${
                                res === 'W'
                                  ? 'bg-emerald-600'
                                  : res === 'D'
                                  ? 'bg-slate-400'
                                  : 'bg-red-500'
                              }`}
                            >
                              {res === 'W' ? 'G' : res === 'D' ? 'E' : 'P'}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leyenda y Criterios Reglamentarios */}
        <div className="p-3.5 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {activeSport === 'futbol' && 'Fútbol: Victoria = 3 pts | Empate = 1 pt | Derrota = 0 pts. Criterio de desempate: Diferencia de Goles (DG), Goles a Favor (GF), Duelo Directo.'}
              {activeSport === 'voleibol' && 'Voleibol: Victoria 2-0 / 3-0 / 3-1 = 3 pts | Victoria 3-2 = 2 pts | Derrota 2-3 = 1 pt | Derrota 0-2 / 0-3 = 0 pts. Desempate: Ratio de Sets.'}
              {activeSport === 'baloncesto' && 'Baloncesto (FIBA): Victoria = 2 pts | Derrota = 1 pt. Criterio de desempate: Puntos en tabla, Diferencia de Puntos (DIF), Puntos a Favor (PF).'}
            </span>
          </div>
          <span className="text-amber-700 font-bold">Datos en tiempo real</span>
        </div>
      </div>
    </div>
  );
}
