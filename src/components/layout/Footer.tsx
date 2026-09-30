import React from 'react';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100/95 border-t border-slate-200/90 pt-8 pb-10 text-slate-600 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-6">
        
        {/* 1. CENTRO PRINCIPAL: LOGO OFICIAL DEL TORNEO DESTACADO Y MÁS GRANDE */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-28 sm:h-40 sm:w-32 rounded-3xl overflow-hidden shadow-lg flex items-center justify-center bg-black border-2 border-amber-500/60 p-2 transition-transform hover:scale-105">
            <img
              src="/logos/liga_costa_de_oro_gold_black.jpg"
              alt="Liga Costa de Oro 2026"
              className="h-full w-full object-contain"
            />
          </div>

          {/* 2. LOGO NEXTPLAY: DEBAJO DEL ESCUDO OFICIAL EN TAMAÑO CONCORDANTE */}
          <div className="flex flex-col items-center gap-2">
            <img
              src="/logos/nextplay_logo.png"
              alt="NextPlay"
              className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105"
            />
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-3.5 py-1 rounded-full shadow-2xs mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sedes rotativas · <strong className="text-slate-900 font-bold">Guanacaste, Costa Rica</strong></span>
            </div>
          </div>
        </div>

        {/* 3. DERECHOS INSTITUCIONALES */}
        <p className="text-[11.5px] text-slate-500 font-medium max-w-md">
          © 2026 {TOURNAMENT_CONFIG.name}. Festival deportivo intercolegial. Guanacaste, Costa Rica. Todos los derechos reservados.
        </p>

        {/* LÍNEA DIVISORIA SUTIL */}
        <div className="h-[1px] w-32 bg-slate-300/80 my-2" />

        {/* 4. TOTALMENTE ABAJO: CURIOL STUDIO ELEGANTE Y MÁS DISCRETO */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <a
            href="https://curiol.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center group transition-transform hover:scale-105"
            title="Curiol Studio • Fotografía, Tecnología y Legado"
          >
            <img
              src="/logos/curiol_logo_oficial_transparente_hd.png"
              alt="Curiol Studio"
              className="h-7 sm:h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}
