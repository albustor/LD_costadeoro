'use client';

import React from 'react';
import { SportType } from '@/types/tournament';

interface SportNavCardsHeaderProps {
  selectedSport: SportType;
  onSelectSport: (sport: SportType) => void;
}

export function SportNavCardsHeader({
  selectedSport,
  onSelectSport,
}: SportNavCardsHeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ⚽🏐🏀 1. SELECTOR PRINCIPAL DE DISCIPLINAS (3 TARJETAS GRANDES CON BALONES) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Fútbol */}
        <button
          type="button"
          onClick={() => onSelectSport('futbol')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            selectedSport === 'futbol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">⚽</span>
          <div>
            <span className="font-black text-sm sm:text-base block">Fútbol</span>
            <span
              className={`text-[10px] sm:text-xs font-semibold block ${
                selectedSport === 'futbol' ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              Lun, mar y mié
            </span>
          </div>
        </button>

        {/* Voleibol */}
        <button
          type="button"
          onClick={() => onSelectSport('voleibol')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            selectedSport === 'voleibol'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🏐</span>
          <div>
            <span className="font-black text-sm sm:text-base block">Voleibol</span>
            <span
              className={`text-[10px] sm:text-xs font-semibold block ${
                selectedSport === 'voleibol' ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              Jueves
            </span>
          </div>
        </button>

        {/* Baloncesto */}
        <button
          type="button"
          onClick={() => onSelectSport('baloncesto')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            selectedSport === 'baloncesto'
              ? 'bg-slate-950 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🏀</span>
          <div>
            <span className="font-black text-sm sm:text-base block">Baloncesto</span>
            <span
              className={`text-[10px] sm:text-xs font-semibold block ${
                selectedSport === 'baloncesto' ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              Viernes
            </span>
          </div>
        </button>
      </div>

      {/* 🏅 ESPACIO INTERMEDIO: LOGOTIPO NEXTPLAY ARMONIOSO */}
      <div className="flex items-center justify-center -my-1 sm:-my-2">
        <div className="flex items-center gap-3 w-full max-w-sm px-2">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-slate-300" />
          <img
            src="/logos/nextplay_logo.png"
            alt="NextPlay"
            className="h-6 sm:h-7 w-auto object-contain transition-transform hover:scale-105"
          />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-slate-200 to-slate-300" />
        </div>
      </div>
    </div>
  );
}
