import React from 'react';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100/90 border-t border-slate-200 py-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* FILA PRINCIPAL */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* IZQUIERDA: CURIOL STUDIO */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <a
              href="https://curiol.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 group transition-opacity hover:opacity-90"
              title="Curiol Studio"
            >
              <img
                src="/logos/curiol_logo_oficial_transparente_hd.png"
                alt="Curiol Studio"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </a>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-700">
              Fotografía • Tecnología • Legado
            </p>
          </div>

          {/* CENTRO: SEDE Y DERECHOS */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sede anfitriona: <strong className="text-slate-900 font-bold">{TOURNAMENT_CONFIG.host.name}</strong></span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              © 2026 {TOURNAMENT_CONFIG.name}. Festival deportivo intercolegial. Guanacaste, Costa Rica.
            </p>
          </div>

          {/* DERECHA: LOGO OFICIAL DEL TORNEO */}
          <div className="flex items-center justify-center">
            <div className="h-14 w-12 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-black border border-amber-500/40 p-1">
              <img
                src="/logos/liga_costa_de_oro_gold_black.jpg"
                alt="Liga Deportiva Costa de Oro"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
