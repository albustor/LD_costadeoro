import React from 'react';
import Link from 'next/link';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-10 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
          {/* Brand Info */}
          <div className="space-y-3">
            <img
              src="/logos/curiol_logo_oficial_transparente_hd.png"
              alt="Curiol Studio"
              className="h-9 w-auto object-contain"
            />
            <p className="text-xs text-slate-600 leading-relaxed">
              Plataforma deportiva oficial desarrollada por <strong>Curiol Studio</strong> para la{' '}
              <strong>{TOURNAMENT_CONFIG.name}</strong>. Marcadores en tiempo real, actas digitales y memoria histórica intercolegial.
            </p>
          </div>

          {/* Tournament Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Sede y Organización
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li><strong>Institución Anfitriona:</strong> {TOURNAMENT_CONFIG.host.name}</li>
              <li><strong>Sedes:</strong> {TOURNAMENT_CONFIG.host.campuses.join(' / ')}</li>
              <li><strong>Temporada:</strong> Octubre - Noviembre 2026 (4 Festivales)</li>
              <li><strong>Colegios:</strong> 6 Instituciones Bilingües de Guanacaste</li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Modalidad Institucional Limpia</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Esta plataforma opera bajo el formato institucional exclusivo para <strong>La Paz Community School</strong> y los colegios participantes, con entorno 100% libre de publicidad comercial.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 {TOURNAMENT_CONFIG.name}. Todos los derechos reservados.</p>
          <p>
            Diseñado y desarrollado por <strong className="text-slate-700 font-bold">Curiol Studio • Fotografía • Tecnología • Legado</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
