'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallButtonProps {
  variant?: 'header' | 'footer' | 'inline';
  className?: string;
}

export function PwaInstallButton({ variant = 'header', className = '' }: PwaInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está ejecutándose como PWA instalada
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detectar si es dispositivo iOS (iPhone / iPad / iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleMobile);

    // Capturar evento de instalación nativo para Android / Chromium
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Si ya está instalada, no mostrar botón
  if (isStandalone || installed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback para navegadores móviles o de escritorio que no dispararon beforeinstallprompt aún
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          type="button"
          title="Instalar aplicación en tu pantalla de inicio"
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden xs:inline">Instalar app</span>
          <span className="xs:hidden">App</span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          type="button"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold transition-all shadow-2xs cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Instalar app oficial (PWA)</span>
        </button>
      )}

      {variant === 'inline' && (
        <button
          onClick={handleInstallClick}
          type="button"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Instalar en tu celular</span>
        </button>
      )}

      {/* Modal Instructivo para iPhone (iOS) y Navegadores */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            {/* Botón Cerrar */}
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabecera del Modal */}
            <div className="flex items-center gap-3 pr-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black border border-amber-500/50 shadow-md shrink-0 flex items-center justify-center p-1">
                <img
                  src="/logos/liga_costa_de_oro_gold_black.jpg"
                  alt="Liga Costa de Oro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Instalar Liga Costa de Oro
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Acceso directo rápido y sin descargas pesadas
                </p>
              </div>
            </div>

            {/* Pasos para iPhone / iOS Safari */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="leading-snug">
                  Toca el botón <strong className="text-slate-900">Compartir</strong>{' '}
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-amber-300 text-[10px] font-bold text-amber-900 mx-1">
                    <Share className="w-3 h-3 inline mr-1 text-blue-600" /> Compartir
                  </span>{' '}
                  o los tres puntitos en la barra inferior de Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="leading-snug">
                  Desplaza hacia abajo y selecciona la opción{' '}
                  <strong className="text-slate-900">"Agregar a inicio"</strong>{' '}
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-amber-300 text-[10px] font-bold text-slate-900 mx-1">
                    <PlusSquare className="w-3 h-3 inline mr-1 text-slate-700" /> Agregar a inicio
                  </span>.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="leading-snug">
                  Toca <strong className="text-slate-900">"Agregar"</strong> en la esquina superior derecha y ¡listo! Tendrás el icono oficial en tu pantalla.
                </div>
              </div>
            </div>

            {/* Ventajas */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Marcadores en vivo, sin anuncios y consumo ultra-bajo de datos.</span>
            </div>

            {/* Botón de Entendido */}
            <button
              onClick={() => setShowIOSModal(false)}
              type="button"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
