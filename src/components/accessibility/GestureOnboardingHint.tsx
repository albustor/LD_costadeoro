'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, HandMetal } from 'lucide-react';

export function GestureOnboardingHint() {
  const [visible, setVisible] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Mostrar con un retardo suave de 500ms tras la carga de la página
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    const handleReopen = () => {
      setVisible(true);
      setIsMinimized(false);
    };

    window.addEventListener('costa_show_gesture_hint', handleReopen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('costa_show_gesture_hint', handleReopen);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-slate-950/95 border-2 border-amber-400/70 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-[0_15px_50px_rgba(0,0,0,0.9)] text-white relative overflow-hidden">
        {/* Filete superior dorado ultra brillante */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm"
          aria-label="Cerrar guía"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5">
          {/* 🖐️ Canvas Gráfico Ilustrado de Dos Dedos con Pulso Táctil y Reflow */}
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-amber-400/50 flex items-center justify-center relative overflow-hidden shadow-inner p-1.5">
            {/* Fondo con líneas de texto simuladas que se agrandan */}
            <div className="w-full h-full rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center gap-1 p-1 animate-pinch-card">
              <div className="w-8 h-1.5 rounded-full bg-amber-400/70" />
              <div className="w-11 h-1 rounded-full bg-slate-400/60" />
              <div className="w-9 h-1 rounded-full bg-slate-400/40" />
            </div>

            {/* Dedo Índice (Superior Izquierdo) con Anillos de Pulso */}
            <div className="absolute top-1/2 left-1/2 -mt-2 -ml-2 animate-finger-left pointer-events-none">
              <div className="w-6 h-6 rounded-full border border-amber-400/60 bg-amber-400/20 animate-touch-ripple absolute -top-1 -left-1" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,1)] border-2 border-white flex items-center justify-center text-[7px] font-black text-slate-950">
                1
              </div>
            </div>

            {/* Dedo Pulgar (Inferior Derecho) con Anillos de Pulso */}
            <div className="absolute top-1/2 left-1/2 -mt-2 -ml-2 animate-finger-right pointer-events-none">
              <div className="w-6 h-6 rounded-full border border-amber-400/60 bg-amber-400/20 animate-touch-ripple absolute -top-1 -left-1" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,1)] border-2 border-white flex items-center justify-center text-[7px] font-black text-slate-950">
                2
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pr-5 flex-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Gesto de 2 Dedos (Reflow)
              </h4>
            </div>
            <p className="text-xs text-slate-100 leading-snug font-medium">
              Separa <strong>dos dedos</strong> en la pantalla para ampliar el texto suavemente hasta el <strong>200%</strong> sin scroll lateral.
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-amber-400/90 font-mono font-medium flex items-center gap-1">
            <span>✨</span> 100% ➔ 130% ➔ 160% ➔ 200%
          </span>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-lg"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}
