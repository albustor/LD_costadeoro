'use client';

import React, { useState } from 'react';
import { School, Standing } from '@/types/tournament';
import { SchoolEmblem } from './SchoolEmblem';
import { VisualProgressBars, VisualBarItem } from './VisualProgressBars';
import { SportIconRenderer, TrophyGlobalGraphic } from './SportGraphicIcons';
import { Trophy, Medal, Sparkles, Award, Star, ArrowUpRight } from 'lucide-react';

interface GlobalProgressHeroProps {
  schools: School[];
  globalStandings: {
    school: School;
    totalPoints: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    diff: number;
    breakdown: {
      futbol: number;
      voleibol: number;
      baloncesto: number;
    };
  }[];
}

export function GlobalProgressHero({ schools, globalStandings }: GlobalProgressHeroProps) {
  const leader = globalStandings.length > 0 ? globalStandings[0] : null;
  const maxPoints = globalStandings.length > 0 ? Math.max(...globalStandings.map((s) => s.totalPoints), 1) : 1;

  // Convert to VisualBarItem format
  const barItems: VisualBarItem[] = globalStandings.map((item, index) => ({
    school: item.school,
    points: item.totalPoints,
    maxPoints: maxPoints * 1.15, // Scale for nice visual progress
    played: item.played,
    won: item.won,
    drawn: item.drawn,
    lost: item.lost,
    diff: item.diff,
    rank: index + 1,
    sportBreakdown: item.breakdown,
  }));

  return (
    <div className="space-y-6">
      {/* 🏆 TARJETA DE HONOR: Colegio con Mayor Avance General */}
      {leader && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-yellow-50/70 border-2 border-amber-300 p-5 sm:p-8 shadow-sm">
          {/* Fondo sutil con trofeo */}
          <div className="absolute right-4 -bottom-4 opacity-15 pointer-events-none">
            <TrophyGlobalGraphic size={180} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Lado Izquierdo: Escudo e Información del Líder */}
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/30 text-amber-950 font-black text-xs border border-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-700" />
                <span>COLEGIO CON MAYOR AVANCE GLOBAL</span>
              </div>

              <div className="flex items-center gap-4">
                <SchoolEmblem schoolId={leader.school.id} size="lg" className="shrink-0" />
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {leader.school.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Lidera la tabla general intercolegial con <strong>{leader.totalPoints} puntos</strong> acumulados en las 7 categorías oficiales.
                  </p>
                </div>
              </div>

              {/* Badges de aporte por disciplina */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Fútbol: <strong>{leader.breakdown.futbol} pts</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  Voleibol: <strong>{leader.breakdown.voleibol} pts</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  Baloncesto: <strong>{leader.breakdown.baloncesto} pts</strong>
                </span>
              </div>
            </div>

            {/* Lado Derecho: Puntuación Gigante y Efectividad */}
            <div className="flex sm:flex-col items-center justify-between sm:justify-center p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm shrink-0 text-center gap-2">
              <div className="text-left sm:text-center">
                <span className="text-3xl sm:text-5xl font-black text-amber-700 font-mono block">
                  {leader.totalPoints}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Puntos Totales
                </span>
              </div>
              <div className="h-8 w-px sm:w-full sm:h-px bg-slate-200" />
              <div className="text-right sm:text-center">
                <span className="text-sm font-bold text-emerald-700 font-mono block">
                  {leader.won} Victorias
                </span>
                <span className="text-[10px] text-slate-500">de {leader.played} jugados</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📊 BARRAS VISUALES INTERACTIVAS: Avance Global de Todos los Colegios */}
      <VisualProgressBars
        items={barItems}
        title="Puntuación General Intercolegial"
        subtitle="Suma combinada de puntos en Fútbol, Voleibol y Baloncesto. Toca una barra para ver detalles."
        showBreakdown={true}
      />
    </div>
  );
}
