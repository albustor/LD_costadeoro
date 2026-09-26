'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Trophy, HelpCircle } from 'lucide-react';

export function StandingsTable() {
  const { categories, selectedCategoryId, setSelectedCategoryId, getStandingsForCategory, getCategoryById } =
    useTournament();

  const currentCategory = getCategoryById(selectedCategoryId) || categories[0];
  const standings = getStandingsForCategory(currentCategory.id);
  const sport = currentCategory.sport;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Category Pills Navigation */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Tabla de Posiciones Oficial</span>
          </h3>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            {currentCategory.division}
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Standings Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 text-center w-10">Pos</th>
              <th className="py-3 px-4">Equipo / Institución</th>
              <th className="py-3 px-2 text-center" title="Partidos Jugados">PJ</th>
              <th className="py-3 px-2 text-center" title="Partidos Ganados">PG</th>
              {sport === 'futbol' && (
                <th className="py-3 px-2 text-center" title="Partidos Empatados">PE</th>
              )}
              <th className="py-3 px-2 text-center" title="Partidos Perdidos">PP</th>
              {sport === 'voleibol' ? (
                <>
                  <th className="py-3 px-2 text-center" title="Sets Ganados">SG</th>
                  <th className="py-3 px-2 text-center" title="Sets Perdidos">SP</th>
                  <th className="py-3 px-2 text-center" title="Diferencia de Sets">DS</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-2 text-center" title="Goles/Puntos a Favor">
                    {sport === 'futbol' ? 'GF' : 'PF'}
                  </th>
                  <th className="py-3 px-2 text-center" title="Goles/Puntos en Contra">
                    {sport === 'futbol' ? 'GC' : 'PC'}
                  </th>
                  <th className="py-3 px-2 text-center" title="Diferencia de Goles/Puntos">
                    {sport === 'futbol' ? 'DG' : 'DIF'}
                  </th>
                </>
              )}
              <th className="py-3 px-3 text-center font-bold text-amber-400" title="Puntos Totales">PTS</th>
              <th className="py-3 px-4 text-center hidden md:table-cell" title="Racha reciente (Últimos 5)">Racha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {standings.map((row, idx) => {
              const isLeader = idx === 0;
              const isPodium = idx < 3;

              return (
                <tr
                  key={row.teamId}
                  className={`transition-colors hover:bg-slate-800/40 ${
                    isLeader ? 'bg-amber-500/5 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-amber-700/80 text-white'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{row.school.logo}</span>
                      <div>
                        <span className="block font-bold text-white text-xs sm:text-sm">
                          {row.school.name}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {row.school.location}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.played}</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-mono">{row.won}</td>
                  {sport === 'futbol' && (
                    <td className="py-3 px-2 text-center text-slate-400 font-mono">{row.drawn}</td>
                  )}
                  <td className="py-3 px-2 text-center text-red-400 font-mono">{row.lost}</td>

                  {sport === 'voleibol' ? (
                    <>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.setsWon}</td>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.setsLost}</td>
                      <td className="py-3 px-2 text-center font-mono font-semibold text-slate-200">
                        {row.setsDiff && row.setsDiff > 0 ? `+${row.setsDiff}` : row.setsDiff}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.pointsFor}</td>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.pointsAgainst}</td>
                      <td className="py-3 px-2 text-center font-mono font-semibold text-slate-200">
                        {row.diff > 0 ? `+${row.diff}` : row.diff}
                      </td>
                    </>
                  )}

                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black font-mono text-sm border border-amber-500/30">
                      {row.points}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-slate-600">-</span>
                      ) : (
                        row.form.map((res, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                              res === 'W'
                                ? 'bg-emerald-600'
                                : res === 'D'
                                ? 'bg-slate-500'
                                : 'bg-red-600'
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

      {/* Rules Legend Footnote */}
      <div className="p-3 bg-slate-950 text-[11px] text-slate-400 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {sport === 'futbol' && 'Reglamento: Victoria = 3 pts | Empate = 1 pt | Derrota = 0 pts. Criterio de desempate: GD, GF, Enfrentamiento directo.'}
            {sport === 'baloncesto' && 'Reglamento FIBA: Victoria = 2 pts | Derrota = 1 pt. Criterio de desempate: Puntos tabla, Diferencia de Puntos, PF.'}
            {sport === 'voleibol' && 'Reglamento: 2-0 / 3-0 / 3-1 = 3 pts ganador | 3-2 = 2 pts ganador, 1 pt perdedor. Criterio: Diferencia de Sets.'}
          </span>
        </div>
        <span className="text-amber-400 font-medium">Actualización automática al cierre de acta</span>
      </div>
    </div>
  );
}
