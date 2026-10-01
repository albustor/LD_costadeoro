'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronLeft, ChevronRight, Play, Zap, Shield, HeartHandshake, Volume2, Timer } from 'lucide-react';

interface MediaSlide {
  id: string;
  type: 'video' | 'image';
  title: string;
  subtitle: string;
  ariaLabel: string;
  icon: (isActive: boolean) => React.ReactNode;
  badge: string;
  imageSrc?: string;
  bunnyIframeUrl?: string;
}

const MEDIA_SLIDES: MediaSlide[] = [
  {
    id: 'official-video',
    type: 'video',
    title: 'Presentación oficial · Liga Costa de Oro 2026',
    subtitle: 'Video oficial del Festival Deportivo Intercolegial Guanacaste 2026',
    ariaLabel: 'Ver Video Oficial',
    icon: (isActive) => (
      <Play
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
          isActive ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-600'
        }`}
      />
    ),
    badge: 'Spot Oficial',
    bunnyIframeUrl:
      'https://player.mediadelivery.net/embed/766057/796e64d3-a2f6-46fa-b540-9e4310cb217b?autoplay=true&loop=false&muted=false&preload=true&responsive=true',
  },
  {
    id: 'nextplay-falling',
    type: 'image',
    title: 'Falling is not the end',
    subtitle: 'Get up and look for the next play · Resiliencia y superación',
    ariaLabel: 'Ver Postal 1: Falling is not the end',
    icon: (isActive) => (
      <Shield
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
          isActive ? 'text-emerald-400 scale-110' : 'text-slate-600'
        }`}
      />
    ),
    badge: 'NextPlay · Valor 1',
    imageSrc: '/nextplay/card_falling_not_end.jpg',
  },
  {
    id: 'nextplay-proxima-jugada',
    type: 'image',
    title: 'Próxima Jugada',
    subtitle: 'Olvida la anterior. Enfócate en la siguiente · Concentración total',
    ariaLabel: 'Ver Postal 2: Próxima Jugada',
    icon: (isActive) => (
      <Zap
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
          isActive ? 'text-amber-400 scale-110' : 'text-slate-600'
        }`}
      />
    ),
    badge: 'NextPlay · Valor 2',
    imageSrc: '/nextplay/card_proxima_jugada.jpg',
  },
  {
    id: 'nextplay-nueva-jugada',
    type: 'image',
    title: 'Cada día es una nueva jugada',
    subtitle: 'Juntos vamos más lejos · Solidaridad y trabajo en equipo',
    ariaLabel: 'Ver Postal 3: Nueva Jugada',
    icon: (isActive) => (
      <HeartHandshake
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
          isActive ? 'text-orange-400 scale-110' : 'text-slate-600'
        }`}
      />
    ),
    badge: 'NextPlay · Valor 3',
    imageSrc: '/nextplay/card_nueva_jugada.jpg',
  },
];

export function EventIntroVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const touchStartX = useRef<number | null>(null);

  const activeSlide = MEDIA_SLIDES[currentIndex];

  // Cuenta regresiva automática de 3 segundos al ingresar a la página
  useEffect(() => {
    if (countdown > 0 && !isVideoActive) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isVideoActive) {
      setIsVideoActive(true);
    }
  }, [countdown, isVideoActive]);

  const handleStartImmediately = () => {
    setCountdown(0);
    setIsVideoActive(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? MEDIA_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === MEDIA_SLIDES.length - 1 ? 0 : prev + 1));
  };

  // Soporte de gestos táctiles swipe en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3 select-none">
      {/* 🎬 CONTENEDOR PRINCIPAL MULTIMEDIA (RESPONSIVE 16:9) */}
      <div
        className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-300/80 shadow-xl group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Aspect Ratio 16:9 */}
        <div className="relative w-full pb-[56.25%] bg-slate-950">
          {activeSlide.type === 'video' ? (
            isVideoActive ? (
              <iframe
                src={activeSlide.bunnyIframeUrl}
                loading="eager"
                className="absolute inset-0 w-full h-full border-0 animate-fade-in"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
                allowFullScreen={true}
                title={activeSlide.title}
              />
            ) : (
              /* ⏳ Portada con cuenta regresiva de 3 segundos */
              <div 
                onClick={handleStartImmediately}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 p-6 text-center cursor-pointer group"
              >
                {/* Botón de Play Central con Anillo de Pulso */}
                <div className="relative mb-3.5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/50 shadow-2xl group-hover:scale-110 transition-transform">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-amber-400 text-amber-300 text-xs font-black flex items-center justify-center animate-pulse">
                    {countdown}
                  </span>
                </div>

                <div className="space-y-1.5 max-w-md">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/40">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    <span>Iniciando video con sonido en {countdown}s...</span>
                  </span>
                  <h3 className="text-sm sm:text-lg font-black text-white leading-tight">
                    {activeSlide.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Toca aquí para reproducir de inmediato
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
              <Image
                src={activeSlide.imageSrc || '/nextplay/card_falling_not_end.jpg'}
                alt={activeSlide.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Indicador numérico de diapositiva (1/4) */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
          <span>{currentIndex + 1}</span>
          <span className="text-slate-400">/</span>
          <span>{MEDIA_SLIDES.length}</span>
        </div>

        {/* Badge de tipo de recurso */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
          {activeSlide.icon(true)}
          <span>{activeSlide.badge}</span>
        </div>

        {/* Flecha lateral izquierda */}
        <button
          onClick={handlePrev}
          aria-label="Ver recurso anterior"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/65 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-lg focus:outline-hidden"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Flecha lateral derecha */}
        <button
          onClick={handleNext}
          aria-label="Ver siguiente recurso"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/65 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-lg focus:outline-hidden"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* 🧭 BARRA DE NAVEGACIÓN MINIMALISTA EN 1 SOLA LÍNEA (FLECHAS + SOLO ICONOS) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-2 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Botón Flecha Izquierda */}
        <button
          onClick={handlePrev}
          aria-label="Retroceder a la acción anterior"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center shadow-xs transition-all active:scale-90 hover:border-slate-300"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Contenedor de Botones de Icono (Sin texto) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {MEDIA_SLIDES.map((slide, index) => {
            const isActive = currentIndex === index;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={slide.ariaLabel}
                title={slide.title}
                className={`w-10 h-10 sm:w-12 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-950 text-amber-300 shadow-md ring-2 ring-amber-400/60 border border-amber-400/50 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 active:scale-95'
                }`}
              >
                {slide.icon(isActive)}
              </button>
            );
          })}
        </div>

        {/* Botón Flecha Derecha (Avanzar) con sutil acento invitante */}
        <button
          onClick={handleNext}
          aria-label="Avanzar a la siguiente acción"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-900 border border-amber-400/50 flex items-center justify-center shadow-xs transition-all active:scale-90 hover:border-amber-500"
        >
          <ChevronRight className="w-5 h-5 text-amber-900" />
        </button>
      </div>
    </div>
  );
}

