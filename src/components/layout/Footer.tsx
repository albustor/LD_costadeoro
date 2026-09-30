import React from 'react';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { MapPin } from 'lucide-react';
import { PwaInstallButton } from '@/components/pwa/PwaInstallButton';

export function Footer() {
  return (
    <footer className="bg-slate-100/90 border-t border-slate-200 py-6 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        {/* FILA PRINCIPAL: EVENTO + SEDE + BOTÓN PWA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Identidad de la Liga */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-6 rounded-lg overflow-hidden bg-black border border-amber-500/50 shadow-2xs shrink-0 flex items-center justify-center p-0.5">
              <img
                src="/logos/liga_costa_de_oro_gold_black.jpg"
                alt="Liga Deportiva Costa de Oro"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-xs tracking-tight">
                Liga Deportiva Costa de Oro 2026
              </span>
              <span className="hidden sm:inline text-slate-400 mx-2">•</span>
              <span className="block sm:inline text-[11px] text-slate-500 font-medium">
                Festival formativo intercolegial · Guanacaste
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Sede Oficial */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sede anfitriona: <strong className="text-slate-800 font-bold">{TOURNAMENT_CONFIG.host.name}</strong></span>
            </div>

            {/* Botón PWA */}
            <PwaInstallButton variant="footer" />
          </div>
        </div>

        {/* LÍNEA DIVISORIA SUTIL */}
        <div className="h-[1px] w-full bg-slate-200/80" />

        {/* FILA INFERIOR: DERECHOS INSTITUCIONALES + CRÉDITOS CURIOL STUDIO */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span>Desarrollo e innovación web:</span>
            <a
              href="https://curiol.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-black hover:bg-slate-800 transition-colors shadow-2xs border border-amber-500/20"
            >
              <img
                src="/logos/curiol_logo_oficial_transparente_hd.png"
                alt="Curiol Studio"
                className="h-3.5 w-auto object-contain brightness-125"
              />
              <span className="tracking-tight text-[11px]">CURIOL STUDIO</span>
            </a>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            © 2026 {TOURNAMENT_CONFIG.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
