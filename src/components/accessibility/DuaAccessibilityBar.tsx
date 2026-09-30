'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Volume2, VolumeX } from 'lucide-react';

const PAGE_AUDIO_SUMMARIES_ES: Record<string, string> = {
  '/': '¡Bienvenidos a la Liga Costa de Oro 2026! Este festival deportivo reúne a seis instituciones educativas de Guanacaste en fútbol, voleibol y baloncesto. Puedes disfrutar del video oficial o explorar las sedes, fechas de los cuatro festivales y normas de convivencia. ¡Vamos todos a apoyar a nuestros estudiantes con entusiasmo y juego limpio!',
  '/deportes': '¡Pasión y compañerismo en cada jugada! En esta sección puedes consultar las tablas de posiciones, los resultados en vivo y las actas oficiales de los partidos en todas las categorías. Recordemos que el verdadero triunfo es el respeto, la sana competencia y la amistad entre nuestros colegios.',
  '/calendario': '¡Prepárate para la jornada! Aquí encuentras la programación de partidos de lunes a viernes, con las fechas y sedes de cada encuentro deportivo. Te invitamos a acompañar a tu equipo favorito y llenar las canchas de porras positivas y juego limpio.',
  '/mural': '¡El corazón de nuestra comunidad! En el Muro Familiar puedes compartir tus fotos, videos y mensajes de aliento para las atletas y jugadores. Deja tu porra, celebra el esfuerzo de cada estudiante y vive la fiesta deportiva.',
  '/colegios': '¡Nuestra juventud de Guanacaste! Conoce a las seis instituciones educativas hermanadas en esta liga: La Paz Community School Cabo Velas, La Paz Community School Tempisque, CRIA, The Journey School, Instituto Vittorino y Educarte. Todas unidas por la educación y el deporte.',
  '/admin': 'Mesa técnica y panel de control. Espacio para registrar y validar los marcadores oficiales de los encuentros con total transparencia y precisión deportiva.',
};

const PAGE_AUDIO_SUMMARIES_EN: Record<string, string> = {
  '/': 'Welcome to Liga Costa de Oro 2026! This athletic festival unites six educational institutions across Guanacaste in soccer, volleyball, and basketball. Explore the official video, festival dates, host venues, and community guidelines. Let us all cheer for our student athletes with fair play and positive energy!',
  '/deportes': 'Passion and teamwork in every match! Here you can check real-time standings, live game results, and official scores across all categories. True victory is friendship, discipline, and mutual respect.',
  '/calendario': 'Get ready for game day! Find the full weekday schedule, dates, and venues for every upcoming match. Join us to support your school community!',
  '/mural': 'The heart of our tournament family! Share your photos, videos, and cheer messages for all players. Celebrate the student athletes and enjoy the festival!',
  '/colegios': 'Guanacaste youth united! Discover our six participating schools: La Paz Community School Cabo Velas, La Paz Community School Tempisque, CRIA, The Journey School, Instituto Vittorino, and Educarte.',
  '/admin': 'Control desk and technical panel for official tournament scoring and sports administration.',
};

interface DuaAccessibilityBarProps {
  compact?: boolean;
}

export function DuaAccessibilityBar({ compact = false }: DuaAccessibilityBarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<number>(100);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pre-cargar voces disponibles en el navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

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

  // Detener audio al cambiar de ruta o de idioma
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [pathname, language]);

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

  // Selector de voz femenina latina para español / voz femenina norteamericana para inglés
  const selectOptimalVoice = useCallback(
    (lang: 'es' | 'en') => {
      const allVoices = voices.length > 0 ? voices : typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];

      if (lang === 'es') {
        // 1. Voz Femenina Latina preferente (México, Costa Rica, US, Colombia, etc.)
        const latamFemale = allVoices.find(
          (v) =>
            (v.lang.startsWith('es-') || v.lang.startsWith('es_')) &&
            !v.lang.includes('es-ES') &&
            (/female|mujer|paulina|sabina|monica|mónica|mia|sofia|sofía|dalia|paloma|camila|lupe|rosa|helena|zira/i.test(v.name) ||
             !/male|hombre|jorge|diego|carlos|enrique|raul|raúl|pablo/i.test(v.name))
        );
        if (latamFemale) return latamFemale;

        // 2. Cualquier voz en español latino
        const latamAny = allVoices.find(
          (v) =>
            v.lang.includes('es-MX') ||
            v.lang.includes('es-CR') ||
            v.lang.includes('es-US') ||
            v.lang.includes('es-419') ||
            v.lang.includes('es-CO') ||
            v.lang.includes('es-CL')
        );
        if (latamAny) return latamAny;

        // 3. Fallback en español
        return allVoices.find((v) => v.lang.startsWith('es')) || null;
      } else {
        // 1. Voz Femenina Norteamericana (en-US)
        const usFemale = allVoices.find(
          (v) =>
            (v.lang === 'en-US' || v.lang === 'en_US') &&
            (/female|zira|jenny|samantha|susan|victoria|karen|allison|ava|aria|natural/i.test(v.name) ||
             !/male|guy|david|mark|alex|george/i.test(v.name))
        );
        if (usFemale) return usFemale;

        // 2. Cualquier voz en-US
        const usAny = allVoices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
        if (usAny) return usAny;

        // 3. Fallback inglés
        return allVoices.find((v) => v.lang.startsWith('en')) || null;
      }
    },
    [voices]
  );

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

    const summaries = language === 'en' ? PAGE_AUDIO_SUMMARIES_EN : PAGE_AUDIO_SUMMARIES_ES;
    const summary =
      summaries[pathname] ||
      summaries['/'] ||
      (language === 'en'
        ? 'Welcome to Liga Costa de Oro 2026.'
        : 'Bienvenido a la Liga Costa de Oro 2026.');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    
    // Asignar voz femenina óptima
    const optimalVoice = selectOptimalVoice(language);
    if (optimalVoice) {
      utterance.voice = optimalVoice;
      utterance.lang = optimalVoice.lang;
    } else {
      utterance.lang = language === 'en' ? 'en-US' : 'es-MX';
    }

    // Tono femenino cálido y ritmo pausado DUA
    utterance.pitch = 1.12; 
    utterance.rate = 0.95; 

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
        title={
          isPlaying
            ? language === 'en' ? 'Stop audio narration' : 'Detener audio resumen'
            : language === 'en' ? 'Listen to audio summary (DUA)' : 'Escuchar audio resumen emotivo (DUA)'
        }
        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
          isPlaying
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md animate-pulse'
            : 'bg-slate-900 border-slate-800 text-amber-300 hover:text-white hover:bg-slate-800'
        }`}
        aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
      >
        {isPlaying ? (
          <VolumeX className="w-4 h-4 text-slate-950" />
        ) : (
          <Volume2 className="w-4 h-4 text-amber-400" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-slate-900/95 border border-slate-800 rounded-2xl p-1 shadow-2xs">
      {/* 🔊 Botón de Audio Resumen Emotivo DUA */}
      <button
        type="button"
        onClick={toggleAudioSummary}
        title={
          isPlaying
            ? language === 'en' ? 'Stop audio narration' : 'Detener audio resumen'
            : language === 'en' ? 'Listen to audio summary (DUA)' : 'Escuchar audio resumen emotivo de la página (DUA)'
        }
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
          isPlaying
            ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
            : 'text-amber-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">{language === 'en' ? 'Pause' : 'Pausar'}</span>
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
