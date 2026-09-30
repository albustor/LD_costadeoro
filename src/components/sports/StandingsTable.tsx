'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Trophy, HelpCircle } from 'lucide-react';
import { SchoolEmblem } from './SchoolEmblem';

export function StandingsTable() {

  const { categories, selectedCategoryId, setSelectedCategoryId, getStandingsForCategory, getCategoryById } =
    useTournament();

  const currentCategory = getCategoryById(selectedCategoryId) || categories[0];
  const standings = getStandingsForCategory(currentCategory.id);
  const sport = currentCategory.sport;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Category Pills Navigation */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Tabla de posiciones oficial</span>
          </h3>
          <span className="text-xs text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 font-medium">
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
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* ℹ️ Nota Oficial de Prueba */}
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px]">
          <span className="font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 uppercase text-[9.5px]">Modo de pruebas</span>
          <span className="font-medium">Información de prueba de marcadores · Entorno de simulación previa al evento oficial (puntos y marcadores en 0).</span>
        </div>
      </div>

      {/* Standings Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/80 text-slate-700 uppercase text-[10.5px] tracking-wider border-b border-slate-200 font-bold">
            <tr>
              <th className="py-3 px-3 text-center w-10">Pos</th>
              <th className="py-3 px-4">Equipo o institución</th>
              <th className="py-3 px-2 text-center" title="Partidos jugados">PJ</th>
              <th className="py-3 px-2 text-center" title="Partidos ganados">PG</th>
              {sport === 'futbol' && (
                <th className="py-3 px-2 text-center" title="Partidos empatados">PE</th>
              )}
              <th className="py-3 px-2 text-center" title="Partidos perdidos">PP</th>
              {sport === 'voleibol' ? (
                <>
                  <th className="py-3 px-2 text-center" title="Sets ganados">SG</th>
                  <th className="py-3 px-2 text-center" title="Sets perdidos">SP</th>
                  <th className="py-3 px-2 text-center" title="Diferencia de sets">DS</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-2 text-center" title="Goles o puntos a favor">
                    {sport === 'futbol' ? 'GF' : 'PF'}
                  </th>
                  <th className="py-3 px-2 text-center" title="Goles o puntos en contra">
                    {sport === 'futbol' ? 'GC' : 'PC'}
                  </th>
                  <th className="py-3 px-2 text-center" title="Diferencia de goles o puntos">
                    {sport === 'futbol' ? 'DG' : 'DIF'}
                  </th>
                </>
              )}
              <th className="py-3 px-3 text-center font-bold text-slate-900" title="Puntos totales">PTS</th>
              <th className="py-3 px-4 text-center hidden md:table-cell" title="Racha reciente (últimos 5)">Racha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {standings.map((row, idx) => {
              const isLeader = idx === 0;

              return (
                <tr
                  key={row.teamId}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isLeader ? 'bg-amber-50/40 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-slate-500 bg-slate-100'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <SchoolEmblem schoolId={row.school.id} size="sm" />
                      <div>
                        <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                          {row.school.name}
                        </span>
                        <span className="block text-[10.5px] text-slate-500">
                          {row.school.location}
                        </span>
                      </div>
                    </div>
                  </td>


                  <td className="py-3 px-2 text-center text-slate-700 font-mono">{row.played}</td>
                  <td className="py-3 px-2 text-center text-emerald-600 font-mono font-bold">{row.won}</td>
                  {sport === 'futbol' && (
                    <td className="py-3 px-2 text-center text-slate-500 font-mono">{row.drawn}</td>
                  )}
                  <td className="py-3 px-2 text-center text-red-500 font-mono">{row.lost}</td>

                  {sport === 'voleibol' ? (
                    <>
                      <td className="py-3 px-2 text-center text-slate-700 font-mono">{row.setsWon}</td>
                      <td className="py-3 px-2 text-center text-slate-700 font-mono">{row.setsLost}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {row.setsDiff && row.setsDiff > 0 ? `+${row.setsDiff}` : row.setsDiff}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2 text-center text-slate-700 font-mono">{row.pointsFor}</td>
                      <td className="py-3 px-2 text-center text-slate-700 font-mono">{row.pointsAgainst}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {row.diff > 0 ? `+${row.diff}` : row.diff}
                      </td>
                    </>
                  )}

                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-black font-mono text-xs sm:text-sm shadow-sm">
                      {row.points}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        row.form.map((res, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9.5px] font-black text-white ${
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

      {/* Rules Legend Footnote */}
      <div className="p-3 bg-slate-50 text-[10.5px] text-slate-500 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {sport === 'futbol' && 'Reglamento: victoria = 3 pts | empate = 1 pt | derrota = 0 pts. Desempate: GD, GF, duelo directo.'}
            {sport === 'baloncesto' && 'Reglamento FIBA: victoria = 2 pts | derrota = 1 pt. Desempate: puntos en tabla, diferencia, PF.'}
            {sport === 'voleibol' && 'Reglamento: 2-0 / 3-0 / 3-1 = 3 pts | 3-2 = 2 pts / 1 pt. Desempate: ratio de sets.'}
          </span>
        </div>
        <span className="text-amber-700 font-semibold">Actualización en tiempo real</span>
      </div>
    </div>
  );
}
