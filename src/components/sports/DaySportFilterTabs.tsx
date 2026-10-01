'use client';

import React from 'react';
import { SportType } from '@/types/tournament';

export type DayFilterValue = 'all' | 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

interface DaySportFilterTabsProps {
  selectedDay: DayFilterValue;
  onSelectDay: (day: DayFilterValue) => void;
  selectedSport?: SportType | 'all';
  onSelectSport?: (sport: SportType | 'all') => void;
}

export function DaySportFilterTabs({
  selectedDay,
  onSelectDay,
}: DaySportFilterTabsProps) {
  const tabs: {
    id: DayFilterValue;
    label: string;
    sportName: string;
    activeColor: string;
    badgeBg: string;
    badgeText: string;
  }[] = [
    {
      id: 'all',
      label: 'TODOS',
      sportName: 'General',
      activeColor: 'bg-slate-900 text-white border-slate-900',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
    },
    {
      id: 'Lunes',
      label: 'LUN',
      sportName: 'Fútbol Fem.',
      activeColor: 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm',
      badgeBg: 'bg-[#DCFCE7]',
      badgeText: 'text-[#15803D]',
    },
    {
      id: 'Martes',
      label: 'MAR',
      sportName: 'Fútbol Cat. C',
      activeColor: 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm',
      badgeBg: 'bg-[#DCFCE7]',
      badgeText: 'text-[#15803D]',
    },
    {
      id: 'Miércoles',
      label: 'MIÉ',
      sportName: 'Fútbol Cat. D',
      activeColor: 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm',
      badgeBg: 'bg-[#DCFCE7]',
      badgeText: 'text-[#15803D]',
    },
    {
      id: 'Jueves',
      label: 'JUE',
      sportName: 'Voleibol',
      activeColor: 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm',
      badgeBg: 'bg-[#E0F2FE]',
      badgeText: 'text-[#0369A1]',
    },
    {
      id: 'Viernes',
      label: 'VIE',
      sportName: 'Baloncesto',
      activeColor: 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm',
      badgeBg: 'bg-[#FFEDD5]',
      badgeText: 'text-[#C2410C]',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Programación Semanal por Disciplina
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          1:00 pm - 4:30 pm
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {tabs.map((t) => {
          const isSelected = selectedDay === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectDay(t.id)}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? t.activeColor
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <span className={`text-xs font-black tracking-wider ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                {t.label}
              </span>
              <span
                className={`text-[9.5px] font-semibold truncate max-w-full ${
                  isSelected ? 'text-white/90' : 'text-slate-500'
                }`}
              >
                {t.sportName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
