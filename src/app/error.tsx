'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-black uppercase tracking-widest text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
          Incidencia Temporal
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
          Se presentó un error al cargar la vista
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {error?.message || 'Error de sincronización con la base de datos local o multimedia.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm shadow-md transition-all border border-amber-500/30 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reintentar Carga</span>
      </button>
    </div>
  );
}
