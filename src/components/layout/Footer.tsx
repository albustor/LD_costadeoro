import React from 'react';
import Link from 'next/link';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <img
              src="/logos/curiol_logo_oficial_transparente_hd.png"
              alt="Curiol Studio"
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma deportiva oficial desarrollada por <strong>Curiol Studio</strong> para la{' '}
              <strong>{TOURNAMENT_CONFIG.name}</strong>. Fotografía profesional, cobertura digital en tiempo real y memoria histórica deportiva.
            </p>
          </div>

          {/* Tournament Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Sede y Organización
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-300">
              <li><strong>Institución Anfitriona:</strong> {TOURNAMENT_CONFIG.host.name}</li>
              <li><strong>Sedes:</strong> {TOURNAMENT_CONFIG.host.campuses.join(' / ')}</li>
              <li><strong>Temporada:</strong> Octubre - Noviembre 2026 (4 Festivales)</li>
              <li><strong>Colegios:</strong> 6 Instituciones Bilingües de Guanacaste</li>
            </ul>
          </div>

          {/* Legal & Image Rights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Derechos de Imagen y Contenido</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El material fotográfico y audiovisual capturado por <strong>Curiol Studio</strong> durante el torneo forma parte de la galería oficial y el portafolio institucional de divulgación deportiva bajo autorización de los colegios participantes.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 {TOURNAMENT_CONFIG.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado y desarrollado con excelencia por <strong className="text-slate-400">Curiol Studio</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
