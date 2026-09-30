'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

const PAGE_AUDIO_SUMMARIES: Record<string, string> = {
  '/': '¡Bienvenidos a la Liga Deportiva Costa de Oro 2026! Este festival formativo reúne a seis instituciones educativas de Guanacaste en fútbol, voleibol y baloncesto. Puedes disfrutar del video oficial o explorar las sedes, fechas de los cuatro festivales y normas de convivencia. ¡Vamos todos a apoyar a nuestros estudiantes con entusiasmo y juego limpio!',
  '/deportes': '¡Pasión y compañerismo en cada jugada! En esta sección puedes consultar las tablas de posiciones, los resultados en vivo y las actas oficiales de los partidos en todas las categorías. Recordemos que el verdadero triunfo es el respeto, la sana competencia y la amistad entre nuestros colegios.',
  '/calendario': '¡Prepárate para la jornada! Aquí encuentras la programación de partidos de lunes a viernes, con las fechas y sedes de cada encuentro deportivo. Te invitamos a acompañar a tu equipo favorito y llenar las canchas de porras positivas y juego limpio.',
  '/mural': '¡El corazón de nuestra comunidad! En el Muro Familiar puedes compartir tus fotos, videos y mensajes de aliento para las atletas y jugadores. Deja tu porra, celebra el esfuerzo de cada estudiante y vive la fiesta deportiva.',
  '/colegios': '¡Nuestra juventud de Guanacaste! Conoce a las seis instituciones educativas hermanadas en esta liga: La Paz Community School Cabo Velas, La Paz Community School Tempisque, CRIA, The Journey School, Instituto Vittorino y Educarte. Todas unidas por la educación y el deporte formativo.',
  '/admin': 'Mesa técnica y panel de control. Espacio para registrar y validar los marcadores oficiales de los encuentros con total transparencia y precisión formativa.',
};

interface DuaAccessibilityBarProps {
  compact?: boolean;
}

export function DuaAccessibilityBar({ compact = false }: DuaAccessibilityBarProps) {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<number>(100);

  // Cargar escala de texto guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScale = localStorage.getItem('costa_de_oro_text_scale');
      if (savedScale) {
        const scale = parseInt(savedScale, 10);
        if (!isNaN(scale)) {
          setTextScale(scale);
          document.documentElement.style.fontSize = `${(scale / 100) * 16}px`;
        }
      }
    }
  }, []);

  // Detener audio al cambiar de ruta
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [pathname]);

  const changeTextScale = (delta: number) => {
    setTextScale((prev) => {
      const newScale = Math.min(130, Math.max(90, prev + delta));
      if (typeof window !== 'undefined') {
        localStorage.setItem('costa_de_oro_text_scale', newScale.toString());
        document.documentElement.style.fontSize = `${(newScale / 100) * 16}px`;
      }
      return newScale;
    });
  };

  const resetTextScale = () => {
    setTextScale(100);
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_text_scale', '100');
      document.documentElement.style.fontSize = '16px';
    }
  };

  const toggleAudioSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const summary =
      PAGE_AUDIO_SUMMARIES[pathname] ||
      PAGE_AUDIO_SUMMARIES['/'] ||
      'Bienvenido a la Liga Deportiva Costa de Oro 2026.';

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = 'es-CR';
    utterance.rate = 0.95; // Velocidad pausada y clara para accesibilidad DUA
    utterance.pitch = 1.05;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleAudioSummary}
        title={isPlaying ? 'Detener audio resumen' : 'Escuchar audio resumen emotivo de la página (DUA)'}
        className={`h-9 px-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
          isPlaying
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md animate-pulse'
            : 'bg-slate-900 border-slate-800 text-amber-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4 text-slate-950" />
            <span className="text-[11px] font-black">Pausar</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold">Audio</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 shadow-2xs">
      {/* 🔊 Botón de Audio Resumen Emotivo DUA */}
      <button
        type="button"
        onClick={toggleAudioSummary}
        title={isPlaying ? 'Detener audio resumen' : 'Escuchar audio resumen emotivo de la página (DUA)'}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
          isPlaying
            ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
            : 'text-amber-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Pausar</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-bold">Audio DUA</span>
            <span className="sm:hidden font-bold">Audio</span>
          </>
        )}
      </button>

      <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

      {/* 🔍 Controles de Zoom Tipográfico DUA */}
      <button
        type="button"
        onClick={() => changeTextScale(-10)}
        title="Disminuir tamaño de texto (A-)"
        disabled={textScale <= 90}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors cursor-pointer"
      >
        A-
      </button>

      <button
        type="button"
        onClick={resetTextScale}
        title={`Tamaño actual: ${textScale}%. Clic para restablecer a 100%`}
        className="px-2 py-1 rounded-md font-mono font-black text-xs text-amber-400 hover:bg-slate-800 transition-colors"
      >
        {textScale}%
      </button>

      <button
        type="button"
        onClick={() => changeTextScale(10)}
        title="Aumentar tamaño de texto (A+)"
        disabled={textScale >= 130}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors cursor-pointer"
      >
        A+
      </button>
    </div>
  );
}
