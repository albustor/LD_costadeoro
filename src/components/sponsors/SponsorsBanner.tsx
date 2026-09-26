'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { Sparkles, MessageCircle, Copy, Check, ExternalLink, Tag } from 'lucide-react';

export function SponsorsBanner() {
  const { sponsors, recordSponsorClick } = useTournament();
  const { isFeatureEnabled } = useTier();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isFeatureEnabled('sponsorBanners')) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleWhatsApp = (sponsorId: string, url: string) => {
    recordSponsorClick(sponsorId);
    window.open(url, '_blank');
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Marcas Patrocinadoras Oficiales</h3>
          </div>
          <p className="text-xs text-slate-400">
            Beneficios exclusivos y convenios comerciales para familias y atletas de la Liga Costa de Oro
          </p>
        </div>

        <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          4 Alianzas Comerciales
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sponsors.map((sp) => (
          <div
            key={sp.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all overflow-hidden flex flex-col justify-between group shadow-lg"
          >
            {/* Image Banner */}
            <div className="relative h-32 w-full overflow-hidden bg-slate-950">
              <img
                src={sp.bannerUrl}
                alt={sp.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] text-amber-300 font-bold">
                <span>{sp.logoUrl}</span>
                <span>{sp.tier}</span>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                -{sp.discountPercentage}% OFF
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {sp.categoryTag}
                </span>
                <h4 className="text-sm font-bold text-white mb-1.5 leading-snug group-hover:text-amber-300 transition-colors">
                  {sp.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {sp.promoTitle}
                </p>
              </div>

              {/* Coupon and Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Coupon Code Pill */}
                <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono font-bold text-amber-300">{sp.couponCode}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(sp.couponCode)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors text-[11px] flex items-center gap-1"
                    title="Copiar código"
                  >
                    {copiedCode === sp.couponCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp Action */}
                <button
                  onClick={() => handleWhatsApp(sp.id, sp.whatsappUrl)}
                  className="w-full py-2 px-3 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Canjear por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
