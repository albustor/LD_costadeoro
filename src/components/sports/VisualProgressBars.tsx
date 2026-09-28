'use client';

import React, { useState } from 'react';
import { Standing, School } from '@/types/tournament';
import { SchoolEmblem } from './SchoolEmblem';
import { Trophy, ChevronDown, ChevronRight, Sparkles, TrendingUp, Info } from 'lucide-react';

export interface VisualBarItem {
  school: School;
  points: number;
  maxPoints: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  diff: number;
  rank: number;
  sportBreakdown?: {
    futbol: number;
    voleibol: number;
    baloncesto: number;
  };
  highlightNote?: string;
}

interface VisualProgressBarsProps {
  items: VisualBarItem[];
  title?: string;
  subtitle?: string;
  sportColor?: string;
  sportAccent?: string;
  sportLightBg?: string;
  showBreakdown?: boolean;
}

export function VisualProgressBars({
  items,
  title = 'Avance y Puntuación',
  subtitle = 'Toca cualquier barra para ver el detalle de partidos y rendimiento',
  sportColor = '#0F172A',
  sportAccent = '#3B82F6',
  sportLightBg = '#F8FAFC',
  showBreakdown = false,
}: VisualProgressBarsProps) {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  // Encontrar el colegio líder
  const leader = items.length > 0 ? items[0] : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>

        {leader && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 self-start sm:self-auto">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900">
              Líder: {leader.school.shortName} ({leader.points} pts)
            </span>
          </div>
        )}
      </div>

      {/* Lista de Barras de Progreso Interactivas */}
      <div className="space-y-3.5">
        {items.map((item, index) => {
          const isSelected = selectedSchoolId === item.school.id;
          const percentage = Math.max(
            8,
            Math.min(100, item.maxPoints > 0 ? Math.round((item.points / item.maxPoints) * 100) : 0)
          );

          // Medallas para el podio
          const rankBadge =
            index === 0
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : index === 1
              ? 'bg-slate-200 text-slate-800 border-slate-300'
              : index === 2
              ? 'bg-orange-100 text-orange-900 border-orange-200'
              : 'bg-slate-100 text-slate-600 border-slate-200';

          return (
            <div
              key={item.school.id}
              onClick={() => setSelectedSchoolId(isSelected ? null : item.school.id)}
              className={`group cursor-pointer rounded-2xl p-3.5 transition-all duration-200 border ${
                isSelected
                  ? 'bg-slate-50/90 border-slate-300 shadow-md ring-2 ring-slate-400/20'
                  : 'bg-white hover:bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Fila Superior: Escudo, Nombre, Posición y Puntos Grandes */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Número de posición / Medalla */}
                  <span
                    className={`w-6 h-6 rounded-full border text-xs font-black flex items-center justify-center shrink-0 ${rankBadge}`}
                  >
                    {item.rank}
                  </span>

                  {/* Escudo del Colegio */}
                  <SchoolEmblem schoolId={item.school.id} size="sm" />

                  {/* Nombre y Ubicación */}
                  <div className="min-w-0">
                    <span className="block font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-amber-800">
                      {item.school.name}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {item.school.location} • {item.won}V - {item.drawn}E - {item.lost}D
                    </span>
                  </div>
                </div>

                {/* Puntaje Prominente + Flechita de Despliegue */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                        {item.points}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">pts</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {percentage}% avance
                    </span>
                  </div>

                  {/* Flechita Indicadora Expandir/Contraer */}
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                        : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-amber-50 group-hover:text-amber-700'
                    }`}
                    title={isSelected ? 'Contraer información' : 'Expandir información'}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'rotate-180 text-amber-900' : 'text-slate-500 group-hover:text-amber-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Barra Gráfica de Progreso */}
              <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                {/* Si tiene desglose multi-deporte (Avance General) */}
                {showBreakdown && item.sportBreakdown ? (
                  <div className="flex h-full rounded-full overflow-hidden w-full">
                    {/* Fútbol (Verde) */}
                    <div
                      style={{
                        width: `${item.maxPoints > 0 ? (item.sportBreakdown.futbol / item.maxPoints) * 100 : 0}%`,
                        backgroundColor: '#16A34A',
                      }}
                      className="h-full transition-all duration-700 ease-out"
                      title={`Fútbol: ${item.sportBreakdown.futbol} pts`}
                    />
                    {/* Voleibol (Azul) */}
                    <div
                      style={{
                        width: `${item.maxPoints > 0 ? (item.sportBreakdown.voleibol / item.maxPoints) * 100 : 0}%`,
                        backgroundColor: '#0284C7',
                      }}
                      className="h-full transition-all duration-700 ease-out"
                      title={`Voleibol: ${item.sportBreakdown.voleibol} pts`}
                    />
                    {/* Baloncesto (Naranja) */}
                    <div
                      style={{
                        width: `${item.maxPoints > 0 ? (item.sportBreakdown.baloncesto / item.maxPoints) * 100 : 0}%`,
                        backgroundColor: '#EA580C',
                      }}
                      className="h-full transition-all duration-700 ease-out"
                      title={`Baloncesto: ${item.sportBreakdown.baloncesto} pts`}
                    />
                  </div>
                ) : (
                  /* Barra Monocromática del Deporte Seleccionado */
                  <div
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: index === 0 ? '#F59E0B' : sportAccent,
                    }}
                    className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-slate-400 to-amber-500"
                  />
                )}
              </div>

              {/* Detalle Desplegable al Tocar o Hacer Clic (Interactividad Táctil) */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center animate-fade-in">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Partidos</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">{item.played} jugados</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Efectividad</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {item.played > 0 ? Math.round((item.won / item.played) * 100) : 0}% victorias
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Diferencia</span>
                    <span className={`text-xs font-bold font-mono ${item.diff >= 0 ? 'text-blue-700' : 'text-slate-600'}`}>
                      {item.diff >= 0 ? `+${item.diff}` : item.diff}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Estado</span>
                    <span className="text-xs font-bold text-amber-700">
                      {index === 0 ? '🏆 1.er Lugar' : index === 1 ? '🥈 2.° Lugar' : 'En competencia'}
                    </span>
                  </div>

                  {showBreakdown && item.sportBreakdown && (
                    <div className="col-span-2 sm:col-span-4 mt-1 p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-around text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        Fútbol: <strong>{item.sportBreakdown.futbol} pts</strong>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                        Voleibol: <strong>{item.sportBreakdown.voleibol} pts</strong>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                        Baloncesto: <strong>{item.sportBreakdown.baloncesto} pts</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
