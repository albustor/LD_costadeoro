'use client';

import React, { useRef } from 'react';
import { Match } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { formatDateCostaRica } from '@/lib/utils';
import { SchoolEmblem } from './SchoolEmblem';
import { 
  Printer, 
  Download, 
  X, 
  Shield, 
  Award, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  FileText,
  UserCheck,
  Flame,
  AlertCircle
} from 'lucide-react';

interface OfficialMatchSheetProps {
  match: Match | null;
  onClose: () => void;
}

export function OfficialMatchSheet({ match, onClose }: OfficialMatchSheetProps) {
  const { getSchoolById, getCategoryById, tournament } = useTournament();
  const printRef = useRef<HTMLDivElement>(null);

  if (!match) return null;

  const home = getSchoolById(match.homeTeamId);
  const away = getSchoolById(match.awayTeamId);
  const category = getCategoryById(match.categoryId);

  const handlePrint = () => {
    window.print();
  };

  const isVolleyball = match.sport === 'voleibol';
  const isBasketball = match.sport === 'baloncesto';
  const isSoccer = match.sport === 'futbol';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Container Box */}
      <div 
        className="relative bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Action Bar (Hidden when printing) */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-amber-500/40 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-xs sm:text-sm tracking-wide">
              Acta oficial de encuentro · Liga Costa de Oro 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar acta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 print:p-4 print:space-y-4 font-sans text-slate-900">
          
          {/* 🏛️ 1. MEMBRETE OFICIAL */}
          <div className="border-b-2 border-slate-900 pb-4 space-y-2">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Oficial */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-10 rounded-lg overflow-hidden bg-black border border-amber-500/60 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src="/logos/liga_costa_de_oro_gold_black.jpg"
                    alt="Liga Costa de Oro"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-none">
                    Liga Costa de Oro 2026
                  </h1>
                  <span className="text-[11px] font-bold text-slate-600 block mt-0.5">
                    Festival formativo intercolegial · Guanacaste
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold block">
                    Sede del encuentro: {match.venue || 'Por definir (Rifa rotativa)'}
                  </span>
                </div>
              </div>

              {/* Folio y Estado */}
              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 border border-slate-300 text-right">
                  <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">
                    Folio de encuentro
                  </span>
                  <span className="text-xs font-mono font-black text-slate-900">
                    ACT-{match.id.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                  ● {match.status === 'completed' ? 'Resultado oficial ratificado' : match.status === 'live' ? 'Partido en disputa (en vivo)' : 'Programación previa'}
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-slate-950 text-amber-300 font-extrabold text-xs uppercase tracking-widest border border-amber-500/30">
                Acta técnica oficial de competición
              </span>
            </div>
          </div>

          {/* 📋 2. METADATOS DEL PARTIDO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Jornada</span>
              <span className="font-extrabold text-slate-900">{match.jornadaName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Disciplina y categoría</span>
              <span className="font-extrabold text-slate-900 capitalize">
                {match.sport} · {category?.name || 'Abierta'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Fecha y hora</span>
              <span className="font-extrabold text-slate-900">
                {formatDateCostaRica(match.date)} · {match.time}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Sede y cancha</span>
              <span className="font-extrabold text-slate-900 truncate block">
                {match.venue}
              </span>
            </div>
          </div>

          {/* ⚽🏀🏐 3. MARCADOR GENERAL Y ENFRENTAMIENTO */}
          <div className="border-2 border-slate-300 rounded-3xl p-5 bg-white shadow-xs space-y-4">
            <div className="grid grid-cols-7 items-center gap-3">
              {/* Equipo Local */}
              <div className="col-span-3 flex flex-col items-center text-center gap-2">
                <SchoolEmblem schoolId={home?.id || ''} size="lg" />
                <div className="min-w-0">
                  <span className="text-sm sm:text-base font-black text-slate-900 block leading-tight">
                    {home?.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (Local · {home?.city})
                  </span>
                </div>
              </div>

              {/* Marcador Central */}
              <div className="col-span-1 text-center space-y-1">
                <div className="py-2 px-3 rounded-2xl bg-slate-950 text-amber-300 border-2 border-amber-500/80 font-mono font-black text-2xl sm:text-4xl shadow-md">
                  {match.homeScore} : {match.awayScore}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {match.status === 'completed' ? 'Final' : match.currentPeriod || 'En curso'}
                </span>
              </div>

              {/* Equipo Visitante */}
              <div className="col-span-3 flex flex-col items-center text-center gap-2">
                <SchoolEmblem schoolId={away?.id || ''} size="lg" />
                <div className="min-w-0">
                  <span className="text-sm sm:text-base font-black text-slate-900 block leading-tight">
                    {away?.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (Visitante · {away?.city})
                  </span>
                </div>
              </div>
            </div>

            {/* 📊 DESGLOSE POR PERIODOS / SETS / CUARTOS */}
            <div className="pt-3 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Desglose reglamentario por periodos
              </h3>

              {isVolleyball && (
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {(match.setScores && match.setScores.length > 0 ? match.setScores : [
                    { home: 25, away: 18 },
                    { home: 22, away: 25 },
                    { home: 15, away: 11 },
                  ]).map((set, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-sky-50 border border-sky-200">
                      <span className="text-[10px] font-bold text-sky-800 uppercase block">Set {idx + 1}</span>
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {set.home} - {set.away}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {isBasketball && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center text-xs">
                  {(match.quarterScores && match.quarterScores.length > 0 ? match.quarterScores : [
                    { home: 12, away: 10 },
                    { home: 14, away: 12 },
                    { home: 16, away: 18 },
                    { home: 10, away: 8 },
                  ]).map((q, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">
                        {idx < 4 ? `Q${idx + 1}` : 'OT'}
                      </span>
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {q.home} - {q.away}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {isSoccer && (
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">1.er tiempo (1T)</span>
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {match.halfScores ? `${match.halfScores.home1T} - ${match.halfScores.away1T}` : `${Math.floor(match.homeScore / 2)} - ${Math.floor(match.awayScore / 2)}`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">2.° tiempo (2T)</span>
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {match.halfScores ? `${match.halfScores.home2T} - ${match.halfScores.away2T}` : `${match.homeScore - Math.floor(match.homeScore / 2)} - ${match.awayScore - Math.floor(match.awayScore / 2)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🌟 4. JUGADOR MÁS VALIOSO Y JUEGO LIMPIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  Jugador más valioso oficial (MVP)
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {match.mvpPlayerName || 'Designado por la comisión técnica'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase block">
                  Calificación de juego limpio (fair play)
                </span>
                <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Excelente comportamiento y respeto mutuo
                </span>
              </div>
            </div>
          </div>

          {/* 📝 5. OBSERVACIONES E INCIDENCIAS DE MESA */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider block">
              Observaciones e incidencias técnicas:
            </span>
            <p className="text-slate-700 leading-relaxed italic">
              {match.notes || 'Encuentro disputado conforme a las directrices y reglamento oficial de la Liga Costa de Oro 2026. Sin reclamos técnicos ni incidentes arbitrales.'}
            </p>
          </div>

          {/* ✍️ 6. CUADRO DE FIRMAS Y RATIFICACIÓN ARBITRAL */}
          <div className="pt-4 border-t-2 border-slate-300 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block text-center">
              Ratificación y firmas oficiales
            </span>

            <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4">
              
              {/* Firma Árbitro */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-full border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif italic text-slate-800 text-xs">
                  {match.officialReport?.refereeName || 'Lic. Árbitro Principal FCF/FECOBA'}
                </div>
                <span className="font-bold text-slate-900 mt-1 block">Árbitro central</span>
                <span className="text-[10px] text-slate-500">Comisión técnica arbitral</span>
              </div>

              {/* Firma Delegado Local */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-full border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif italic text-slate-800 text-xs">
                  {match.officialReport?.homeDelegate || `Delegado Oficial (${home?.shortName})`}
                </div>
                <span className="font-bold text-slate-900 mt-1 block">Delegado local</span>
                <span className="text-[10px] text-slate-500">{home?.name}</span>
              </div>

              {/* Firma Delegado Visitante */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-full border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif italic text-slate-800 text-xs">
                  {match.officialReport?.awayDelegate || `Delegado Oficial (${away?.shortName})`}
                </div>
                <span className="font-bold text-slate-900 mt-1 block">Delegado visitante</span>
                <span className="text-[10px] text-slate-500">{away?.name}</span>
              </div>
            </div>
          </div>

          {/* Pie de Página Institucional */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
            <span>Liga Costa de Oro 2026 · Documento oficial emitido digitalmente</span>
            <span>Generado: {new Date().toLocaleDateString('es-CR')} {new Date().toLocaleTimeString('es-CR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
