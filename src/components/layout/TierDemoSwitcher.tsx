'use client';

import React, { useState } from 'react';
import { useTier } from '@/context/TierContext';
import { TIERS_CATALOG } from '@/config/tierConfig';
import { TierOption } from '@/types/tournament';
import { Layers, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function TierDemoSwitcher() {
  const { activeTier, setTier, tierConfig } = useTier();
  const [isOpen, setIsOpen] = useState(false);

  const tierOptions: TierOption[] = ['option1', 'option2', 'option3'];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Selector de Paquete Activo:</span>
          <span className="font-semibold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {tierConfig.name} ({tierConfig.priceLabel})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {tierOptions.map((opt) => {
              const cfg = TIERS_CATALOG[opt];
              const isActive = activeTier === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setTier(opt)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {opt === 'option3' && <Sparkles className="w-3 h-3" />}
                  <span>{cfg.badge}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 flex items-center gap-1 ml-1"
            title="Ver desglose de características por paquete"
          >
            <span className="hidden sm:inline">Detalles</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          {tierOptions.map((opt) => {
            const cfg = TIERS_CATALOG[opt];
            const isSelected = activeTier === opt;
            return (
              <div
                key={opt}
                onClick={() => setTier(opt)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-100 text-xs">{cfg.badge}</span>
                  <span className="font-extrabold text-amber-400 text-sm">{cfg.priceLabel}</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2 leading-tight">{cfg.subtitle}</p>

                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Marcadores y Tablas en Vivo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cfg.features.sponsorBanners ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                    <span className={cfg.features.sponsorBanners ? 'text-slate-300' : 'text-slate-500'}>
                      Patrocinadores Comerciales
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cfg.features.fanShortsVideo ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                    <span className={cfg.features.fanShortsVideo ? 'text-slate-300' : 'text-slate-500'}>
                      Mural Fan Shorts (Videos Cortos)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cfg.features.interactiveCoupons ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                    <span className={cfg.features.interactiveCoupons ? 'text-slate-300' : 'text-slate-500'}>
                      Cupones WhatsApp Interactivos
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
