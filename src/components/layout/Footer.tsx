import React from 'react';
import Link from 'next/link';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-10 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* PARTE SUPERIOR: SEDE, ORGANIZACIÓN E INFORMACIÓN DEL EVENTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
          {/* Identidad de la Liga Deportiva Costa de Oro */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-10 rounded-xl overflow-hidden bg-black border border-amber-500/50 shadow-2xs shrink-0 flex items-center justify-center p-0.5">
                <img
                  src="/logos/liga_costa_de_oro_gold_black.jpg"
                  alt="Liga Deportiva Costa de Oro 2026"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-amber-600 leading-none">
                  Liga Deportiva Oficial
                </span>
                <span className="block text-sm font-black text-slate-900 tracking-tight leading-tight">
                  Costa de Oro 2026
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Festival deportivo y formativo intercolegial de Guanacaste. Marcadores en vivo, actas oficiales, calendario de partidos y seguimiento deportivo para familias y estudiantes.
            </p>
          </div>

          {/* Sede y Organización Oficial */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Sede y Organización</span>
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li><strong>Institución Anfitriona:</strong> {TOURNAMENT_CONFIG.host.name}</li>
              <li><strong>Sedes Oficiales:</strong> Campus Cabo Velas (Brasilito) y Campus Tempisque (Comunidad)</li>
              <li><strong>Temporada:</strong> Octubre - Noviembre 2026 (4 Festivales Oficiales)</li>
              <li><strong>Colegios Participantes:</strong> 6 Instituciones Bilingües de la Costa de Oro</li>
            </ul>
          </div>

          {/* Modalidad Institucional Limpia */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Modalidad Institucional Formativa</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plataforma desarrollada con formato institucional exclusivo para <strong>La Paz Community School</strong> y las delegaciones participantes, garantizando un entorno educativo 100% libre de publicidad comercial.
            </p>
          </div>
        </div>

        {/* PARTE INFERIOR: CRÉDITOS TECNOLÓGICOS Y PRODUCCIÓN DE CURIOL STUDIO */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-3">
            <img
              src="/logos/curiol_logo_oficial_transparente_hd.png"
              alt="Curiol Studio"
              className="h-7 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
            />
            <span>
              Plataforma deportiva desarrollada y producida por <strong className="text-slate-700 font-bold">Curiol Studio</strong> • Fotografía • Tecnología • Legado
            </span>
          </div>

          <p className="shrink-0 text-slate-400">
            © 2026 {TOURNAMENT_CONFIG.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
