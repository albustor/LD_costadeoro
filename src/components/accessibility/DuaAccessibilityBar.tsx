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

  const applyScaleToHtml = (scale: number) => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;
    html.classList.remove('text-scale-100', 'text-scale-130', 'text-scale-160', 'text-scale-200');
    
    if (scale <= 115) html.classList.add('text-scale-100');
    else if (scale <= 145) html.classList.add('text-scale-130');
    else if (scale <= 180) html.classList.add('text-scale-160');
    else html.classList.add('text-scale-200');

    const basePx = window.innerWidth <= 640 ? 17.5 : 16;
    html.style.fontSize = `${(scale / 100) * basePx}px`;
  };

  // Cargar escala de texto guardada o escuchar cambios de gesto táctil
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScale = localStorage.getItem('costa_de_oro_text_scale');
      if (savedScale) {
        const scale = parseInt(savedScale, 10);
        if (!isNaN(scale)) {
          setTextScale(scale);
          applyScaleToHtml(scale);
        }
      }

      const handleScaleEvent = (e: Event) => {
        const customEvt = e as CustomEvent<number>;
        if (customEvt.detail && typeof customEvt.detail === 'number') {
          setTextScale(customEvt.detail);
        }
      };

      window.addEventListener('costa_text_scale_changed', handleScaleEvent);
      return () => window.removeEventListener('costa_text_scale_changed', handleScaleEvent);
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
      const nextScale = Math.min(200, Math.max(100, prev + delta));
      if (typeof window !== 'undefined') {
        localStorage.setItem('costa_de_oro_text_scale', nextScale.toString());
        applyScaleToHtml(nextScale);
        window.dispatchEvent(new CustomEvent('costa_text_scale_changed', { detail: nextScale }));
      }
      return nextScale;
    });
  };

  const cycleTextScale = () => {
    setTextScale((prev) => {
      let next = 130;
      if (prev <= 115) next = 130; // Modo Cómodo S23 Ultra
      else if (prev <= 145) next = 160; // Modo Grande
      else if (prev <= 180) next = 200; // Modo Ultra 200%
      else next = 100; // Restablecer a estándar

      if (typeof window !== 'undefined') {
        localStorage.setItem('costa_de_oro_text_scale', next.toString());
        applyScaleToHtml(next);
        window.dispatchEvent(new CustomEvent('costa_text_scale_changed', { detail: next }));
      }
      return next;
    });
  };

  const resetTextScale = () => {
    setTextScale(100);
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_text_scale', '100');
      applyScaleToHtml(100);
      window.dispatchEvent(new CustomEvent('costa_text_scale_changed', { detail: 100 }));
    }
  };

  // Selector de voz femenina neuronal de alta definición (Natural/Online/Enhanced)
  const selectOptimalVoice = useCallback(
    (lang: 'es' | 'en'): SpeechSynthesisVoice | null => {
      const allVoices = voices.length > 0 ? voices : typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      if (!allVoices || allVoices.length === 0) return null;

      // Sistema de puntuación ponderada para encontrar la voz más humana y natural
      const rankVoice = (v: SpeechSynthesisVoice): number => {
        let score = 0;
        const name = v.name.toLowerCase();
        const vLang = v.lang.toLowerCase();

        // Descartar voces masculinas
        if (/male|hombre|jorge|diego|carlos|enrique|raul|raúl|pablo|alvaro|álvaro|miguel|manuel|david|guy|george/i.test(name)) {
          return -1000;
        }

        if (lang === 'es') {
          if (!vLang.startsWith('es')) return -2000;

          // 1. Calidad Neuronal / Natural / Online / Enhanced (cero sonido a lata)
          if (/natural|neural|online|enhanced|premium|highquality|hd/i.test(name)) score += 100;
          if (/google/i.test(name)) score += 60;
          if (/siri/i.test(name)) score += 50;

          // 2. Acento Costarricense o Latinoamericano
          if (vLang.includes('es-cr') || vLang.includes('es_cr')) score += 80;
          else if (vLang.includes('es-419') || vLang.includes('es-mx') || vLang.includes('es-co') || vLang.includes('es-us')) score += 40;
          else if (vLang.includes('es-es')) score += 5; // España con menor prioridad

          // 3. Voces femeninas reconocidas por calidez y naturalidad
          if (/salome|salomé|dalia|paulina|sabina|camila|mia|mía|sofia|sofía|monica|mónica|lupe|paloma|rosa|lucia|lucía|valeria/i.test(name)) {
            score += 50;
          }
        } else {
          if (!vLang.startsWith('en')) return -2000;
          if (/natural|neural|online|enhanced|premium/i.test(name)) score += 100;
          if (vLang === 'en-us' || vLang === 'en_us') score += 50;
          if (/jenny|aria|samantha|ava|allison|michelle|siri/i.test(name)) score += 40;
        }

        return score;
      };

      const sorted = [...allVoices].sort((a, b) => rankVoice(b) - rankVoice(a));
      const best = sorted[0];

      return best && rankVoice(best) > -500 ? best : null;
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
      utterance.lang = language === 'en' ? 'en-US' : 'es-CR';
    }

    // Parámetros acústicos naturales (pitch neutro 1.0, cadencia ágil y conversacional 1.10)
    utterance.pitch = 1.0; 
    utterance.rate = 1.10; 
    utterance.volume = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* 🔊 Botón Audio Resumen Compacto */}
        <button
          type="button"
          onClick={toggleAudioSummary}
          title={
            isPlaying
              ? language === 'en' ? 'Stop audio narration' : 'Detener audio resumen'
              : language === 'en' ? 'Listen to audio summary (DUA)' : 'Escuchar audio resumen emotivo (DUA)'
          }
          className={`h-9 px-2 sm:px-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
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

        {/* 🔍 Botón Rápido de Zoom Adaptativo (100% -> 115% -> 130% S23 Ultra -> 145%) */}
        <button
          type="button"
          onClick={cycleTextScale}
          title={`Tamaño actual: ${textScale}%. Toca para cambiar (100%, 115%, 130% S23 Ultra, 145%)`}
          className="h-9 px-2 sm:px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 hover:text-amber-200 hover:bg-slate-800 font-mono font-black text-xs flex items-center gap-0.5 shadow-2xs cursor-pointer transition-all active:scale-95"
        >
          <span className="text-[10px] text-amber-400/80">A</span>
          <span className="text-xs">{textScale}%</span>
        </button>
      </div>
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
            <span className="font-bold">Audio</span>
          </>
        )}
      </button>

      <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

      {/* 🔍 Controles de Zoom Tipográfico DUA */}
      <button
        type="button"
        onClick={() => changeTextScale(-15)}
        title="Disminuir tamaño de texto (A-)"
        disabled={textScale <= 100}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors cursor-pointer"
      >
        A-
      </button>

      <button
        type="button"
        onClick={cycleTextScale}
        title={`Tamaño actual: ${textScale}%. Clic para alternar a 130% (S23 Ultra), 160% o 200% (Ultra)`}
        className={`px-2 py-1 rounded-md font-mono font-black text-xs transition-colors cursor-pointer ${
          textScale > 100
            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
            : 'text-amber-400 hover:bg-slate-800'
        }`}
      >
        {textScale}%
      </button>

      <button
        type="button"
        onClick={() => changeTextScale(15)}
        title="Aumentar tamaño de texto (A+)"
        disabled={textScale >= 200}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors cursor-pointer"
      >
        A+
      </button>
    </div>
  );
}
