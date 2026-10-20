'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Trophy, Camera, ChevronRight, Sparkles } from 'lucide-react';

export default function CalendarioPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Encabezado limpio sin mención a meses pasados ni deporte fijo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>Calendario de encuentros</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Programación oficial de jornadas del Festival Deportivo Liga Costa de Oro 2026.
          </p>
        </div>
      </div>

      {/* Tarjeta central limpia: Fechas por definir */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Próxima jornada en preparación</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Próximamente las nuevas fechas
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Fechas por definir · La programación oficial de encuentros, horarios y sedes para la próxima jornada se encuentra en coordinación con las instituciones participantes y se publicará en este espacio.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/marcadores"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ver tablas de posiciones y resultados (1.ª fecha)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/mural"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-700" />
            <span>Compartir fotos y videos en el muro</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

