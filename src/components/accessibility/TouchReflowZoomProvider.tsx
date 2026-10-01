'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ZoomIn } from 'lucide-react';

interface TouchReflowZoomProviderProps {
  children: React.ReactNode;
}

export function TouchReflowZoomProvider({ children }: TouchReflowZoomProviderProps) {
  const [currentScale, setCurrentScale] = useState<number>(100);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [showBadge, setShowBadge] = useState<boolean>(false);
  
  const initialTouchDistance = useRef<number | null>(null);
  const startScale = useRef<number>(100);
  const badgeTimer = useRef<NodeJS.Timeout | null>(null);

  // Aplicar escala al elemento raíz <html> con reflow estricto
  const applyScale = useCallback((scale: number, animate = false) => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;

    if (animate) {
      html.classList.add('scale-animating');
      setTimeout(() => html.classList.remove('scale-animating'), 200);
    }

    html.classList.remove('text-scale-100', 'text-scale-130', 'text-scale-160', 'text-scale-200');

    if (scale <= 115) html.classList.add('text-scale-100');
    else if (scale <= 145) html.classList.add('text-scale-130');
    else if (scale <= 180) html.classList.add('text-scale-160');
    else html.classList.add('text-scale-200');

    // Escala continua precisa en px base
    const basePx = window.innerWidth <= 640 ? 17.5 : 16;
    html.style.fontSize = `${(scale / 100) * basePx}px`;

    setCurrentScale(scale);
    localStorage.setItem('costa_de_oro_text_scale', scale.toString());
    window.dispatchEvent(new CustomEvent('costa_text_scale_changed', { detail: scale }));
  }, []);

  // Cargar escala inicial guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('costa_de_oro_text_scale');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) {
          applyScale(val);
        }
      }

      const handleExternalScaleChange = (e: Event) => {
        const customEvt = e as CustomEvent<number>;
        if (customEvt.detail && typeof customEvt.detail === 'number') {
          setCurrentScale(customEvt.detail);
        }
      };

      window.addEventListener('costa_text_scale_changed', handleExternalScaleChange);
      return () => window.removeEventListener('costa_text_scale_changed', handleExternalScaleChange);
    }
  }, [applyScale]);

  const targetScaleRef = useRef<number>(100);
  const currentRenderedScaleRef = useRef<number>(100);
  const animFrameId = useRef<number | null>(null);

  // Bucle de física e interpolación suave continua (LERP)
  const startPhysicsLoop = useCallback(() => {
    if (animFrameId.current) return;

    const loop = () => {
      const diff = targetScaleRef.current - currentRenderedScaleRef.current;
      if (Math.abs(diff) > 0.2) {
        // Factor de amortiguación (0.10): deslizamiento continuo, sedoso y elástico
        currentRenderedScaleRef.current += diff * 0.10;
        applyScale(Math.round(currentRenderedScaleRef.current), false);
        animFrameId.current = requestAnimationFrame(loop);
      } else {
        currentRenderedScaleRef.current = targetScaleRef.current;
        applyScale(targetScaleRef.current, false);
        animFrameId.current = null;
      }
    };

    animFrameId.current = requestAnimationFrame(loop);
  }, [applyScale]);

  // Manejo de Gestos Táctiles de 2 Dedos (Pinch-to-Scale) con Cero Scroll Horizontal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const x1 = e.touches[0].clientX;
        const y1 = e.touches[0].clientY;
        const x2 = e.touches[1].clientX;
        const y2 = e.touches[1].clientY;
        initialTouchDistance.current = Math.hypot(x2 - x1, y2 - y1);
        startScale.current = currentScale;
        targetScaleRef.current = currentScale;
        currentRenderedScaleRef.current = currentScale;
        setIsZooming(true);
        setShowBadge(true);
        if (badgeTimer.current) clearTimeout(badgeTimer.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDistance.current !== null && initialTouchDistance.current > 10) {
        // Prevenir zoom rígido nativo del viewport del navegador para evitar scroll horizontal
        if (e.cancelable) {
          e.preventDefault();
        }

        const x1 = e.touches[0].clientX;
        const y1 = e.touches[0].clientY;
        const x2 = e.touches[1].clientX;
        const y2 = e.touches[1].clientY;
        const currentDistance = Math.hypot(x2 - x1, y2 - y1);
        const ratio = currentDistance / initialTouchDistance.current;

        // Calcular nueva escala objetivo con amortiguación suave entre 100% y 200%
        let target = Math.round(startScale.current * ratio);
        target = Math.min(200, Math.max(100, target));

        targetScaleRef.current = target;
        startPhysicsLoop();
      }
    };

    const handleTouchEnd = () => {
      if (initialTouchDistance.current !== null) {
        initialTouchDistance.current = null;
        setIsZooming(false);
        // Ocultar badge flotante tras 2 segundos de inactividad
        badgeTimer.current = setTimeout(() => {
          setShowBadge(false);
        }, 2000);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (badgeTimer.current) clearTimeout(badgeTimer.current);
    };
  }, [currentScale, applyScale]);

  return (
    <>
      {children}

      {/* 🔍 Badge Flotante de Porcentaje de Reflow en Tiempo Real */}
      {showBadge && (
        <div className="fixed bottom-24 right-4 z-50 pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 bg-slate-950/90 text-amber-300 border border-amber-400/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl font-mono font-black text-sm">
            <ZoomIn className={`w-4 h-4 text-amber-400 ${isZooming ? 'animate-bounce' : ''}`} />
            <span>{currentScale}%</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
              {currentScale >= 200 ? 'Macro' : currentScale >= 160 ? 'Grande' : currentScale >= 130 ? 'S23 Ultra' : 'Normal'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
