import React from 'react';
import Link from 'next/link';
import { Shield, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
        <Shield className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
          Página no encontrada · 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Liga Costa de Oro 2026
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          La sección solicitada no existe o ha sido reubicada dentro del cronograma oficial del festival deportivo.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm shadow-md transition-all border border-amber-500/30"
      >
        <Home className="w-4 h-4" />
        <span>Volver a la Página Principal</span>
      </Link>
    </div>
  );
}
