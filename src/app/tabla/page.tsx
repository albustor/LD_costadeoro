'use client';

import React from 'react';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { Trophy, HelpCircle } from 'lucide-react';

export default function TablaPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Tablas de Clasificación Oficiales</span>
          </h1>
          <p className="text-xs text-slate-400">
            Seguimiento de puntos, goles, sets y rachas para las 7 categorías de la Liga Costa de Oro 2026
          </p>
        </div>
      </div>

      <StandingsTable />
    </div>
  );
}
