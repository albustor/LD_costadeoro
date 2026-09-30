import React from 'react';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100/95 border-t border-slate-200/90 pt-8 pb-10 text-slate-600 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-6">
        
        {/* 0. LOGO NEXTPLAY: SOBRE EL LOGO NEGRO OFICIAL Y ABAJO DE PRESENTACIÓN OFICIAL */}
        <div className="flex flex-col items-center gap-1">
          <img
            src="/logos/nextplay_logo.png"
            alt="NextPlay"
            className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105"
          />
        </div>

        {/* 1. CENTRO PRINCIPAL: LOGO OFICIAL DEL TORNEO DESTACADO Y GRANDE */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-20 w-16 sm:h-24 sm:w-20 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-black border-2 border-amber-500/50 p-1.5 transition-transform hover:scale-105">
            <img
              src="/logos/liga_costa_de_oro_gold_black.jpg"
              alt="Liga Costa de Oro 2026"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              Liga Costa de Oro 2026
            </h4>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-3.5 py-1 rounded-full shadow-2xs mt-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sedes rotativas · <strong className="text-slate-900 font-bold">Guanacaste, Costa Rica</strong></span>
            </div>
          </div>
        </div>

        {/* 2. DERECHOS INSTITUCIONALES */}
        <p className="text-[11.5px] text-slate-500 font-medium max-w-md">
          © 2026 {TOURNAMENT_CONFIG.name}. Festival deportivo intercolegial. Guanacaste, Costa Rica. Todos los derechos reservados.
        </p>

        {/* LÍNEA DIVISORIA SUTIL */}
        <div className="h-[1px] w-32 bg-slate-300/80 my-2" />

        {/* 3. TOTALMENTE ABAJO: CURIOL STUDIO LIMPIO Y EVIDENTE */}
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
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}
