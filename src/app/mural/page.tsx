'use client';

import React from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { FamilyCheerWall } from '@/components/family/FamilyCheerWall';
import { Heart, Sparkles, Trophy } from 'lucide-react';

export default function MuralPage() {
  const { schools } = useTournament();
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Cabecera del Muro Familiar */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-rose-50/30 to-amber-50/40 border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{t('mural.pinActive')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('mural.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('mural.subtitle')}
          </p>
        </div>
      </div>

      {/* Muro Familiar Completo */}
      <FamilyCheerWall schools={schools} featuredOnly={false} />
    </div>
  );
}
