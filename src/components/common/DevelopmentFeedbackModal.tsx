'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, MessageCircle, X, ArrowRight, Construction } from 'lucide-react';

export function DevelopmentFeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Abrir suavemente tras 300ms de cargar la página
    const timer = setTimeout(() => {
      // Si no ha sido cerrado en la sesión actual, mostrar modal
      const dismissed = sessionStorage.getItem('dev_feedback_dismissed');
      if (!dismissed) {
        setIsOpen(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('dev_feedback_dismissed', 'true');
  };

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    '¡Hola Curiol Studio! 👋 Comparto mi nota de audio / retroalimentación de validación para la plataforma de la Liga Costa de Oro 2026:'
  );
  const whatsappUrl = `https://wa.me/50660602617?text=${whatsappMessage}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-white space-y-6 overflow-hidden transform transition-all animate-scale-up">
        
        {/* Glow de fondo decorativo */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón de cerrar superior */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana emergente"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge superior */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Construction className="w-3.5 h-3.5" />
            <span>Fase de Validación Activa</span>
          </span>
        </div>

        {/* Encabezado y Texto Principal */}
        <div className="space-y-2.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Plataforma en Desarrollo · <span className="text-amber-400 font-serif">Liga Costa de Oro</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Este sitio web oficial se encuentra actualmente en <strong className="text-white">construcción, afinamiento e integración interactiva</strong> previa al inicio oficial de las jornadas deportivas.
          </p>
        </div>

        {/* Caja Destacada: Aportes vía Audio por WhatsApp */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-amber-500/30 p-4 sm:p-5 space-y-3 shadow-inner">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Aportes y Sugerencias de Validación</span>
              </h4>
              <p className="text-[11.5px] sm:text-xs text-slate-300 leading-normal">
                Puedes enviar tus observaciones, ajustes o comentarios mediante <strong className="text-emerald-400 font-semibold">nota de voz / audio</strong> directamente a nuestro WhatsApp oficial:
              </p>
              <div className="pt-1">
                <span className="font-mono font-bold text-amber-300 text-sm bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800 inline-block">
                  📱 6060-2617
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Enviar audio al 6060-2617</span>
          </a>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explorar plataforma</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Nota al pie de la empresa */}
        <p className="text-[10px] text-center text-slate-500">
          Curiol Studio • Fotografía, Tecnología y Legado Deportivo Guanacaste 2026
        </p>

      </div>
    </div>
  );
}
