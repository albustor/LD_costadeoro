'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Shield, 
  HeartHandshake, 
  Zap, 
  Compass, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface ConceptScene {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  sport: string;
  videoSrc: string;
  posterSrc: string;
  cardImage: string;
  accentColor: string;
}

const NEXTPLAY_CONCEPTS: ConceptScene[] = [
  {
    id: 'resiliencia',
    tag: 'Concepto 01 · Resiliencia Deportiva',
    title: 'FALLING IS NOT THE END',
    subtitle: 'GET UP AND LOOK FOR THE NEXT PLAY',
    description: 'En cada partido, el error o la caída son parte del aprendizaje. Los estudiantes se levantan con la mirada puesta en la siguiente oportunidad.',
    sport: 'Fútbol Intercolegial',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterSrc: '/nextplay/card_falling_not_end.jpg',
    cardImage: '/nextplay/card_falling_not_end.jpg',
    accentColor: 'from-emerald-900/90 via-emerald-950/80 to-amber-950/90',
  },
  {
    id: 'acompanamiento',
    tag: 'Concepto 02 · Formación & Guía',
    title: 'CADA DÍA ES UNA NUEVA JUGADA',
    subtitle: 'JUNTOS VAMOS MÁS LEJOS',
    description: 'El valor de los entrenadores y la familia guiando a cada atleta formativo hacia su mejor versión dentro y fuera de la cancha.',
    sport: 'Voleibol & Baloncesto',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterSrc: '/nextplay/card_nueva_jugada.jpg',
    cardImage: '/nextplay/card_nueva_jugada.jpg',
    accentColor: 'from-amber-900/90 via-slate-950/85 to-emerald-950/90',
  },
  {
    id: 'proxima-jugada',
    tag: 'Concepto 03 · Mentalidad Colectiva',
    title: 'PRÓXIMA JUGADA',
    subtitle: 'OLVIDA LA ANTERIOR. ENFÓCATE EN LA SIGUIENTE',
    description: 'La unión de equipo antes del pitazo inicial: manos al centro, mente en el presente y espíritu de superación constante.',
    sport: 'Festival Formativo 2026',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterSrc: '/nextplay/card_proxima_jugada.jpg',
    cardImage: '/nextplay/card_proxima_jugada.jpg',
    accentColor: 'from-teal-950/90 via-slate-950/85 to-amber-950/90',
  },
];

export function EventIntroVideo() {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPosterCards, setShowPosterCards] = useState(false);
  const [voiceoverPlaying, setVoiceoverPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentScene = NEXTPLAY_CONCEPTS[activeConceptIndex];

  // Alternar reproducción de video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Alternar audio
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Alternar audio de la cápsula de Don Alejandro / Organización
  const toggleVoiceover = () => {
    if (audioRef.current) {
      if (voiceoverPlaying) {
        audioRef.current.pause();
        setVoiceoverPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setVoiceoverPlaying(true);
      }
    }
  };

  // Pantalla completa
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Cambiar concepto/escena
  const handleSelectScene = (index: number) => {
    setActiveConceptIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 🎬 CONTENEDOR PRINCIPAL DEL VIDEO NEXTPLAY */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-300/80 shadow-xl group">
        
        {/* Elemento de Video */}
        <video
          ref={videoRef}
          loop
          playsInline
          muted={isMuted}
          poster={currentScene.posterSrc}
          className="w-full aspect-video sm:aspect-21/9 object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={currentScene.videoSrc} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* Audio de la organización / Cápsula de Don Alejandro */}
        <audio
          ref={audioRef}
          src="/nextplay/audio_intro.ogg"
          onEnded={() => setVoiceoverPlaying(false)}
        />

        {/* Capa Gradiente Cinemática y Marca de Agua NEXTPLAY Permanente */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentScene.accentColor} opacity-75 mix-blend-multiply pointer-events-none transition-colors duration-700`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

        {/* 🔥 HEADER DEL VIDEO: LOGO NEXTPLAY PERMANENTE + SELLO COSTA DE ORO */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between pointer-events-auto z-20">
          
          {/* Badge Oficial NEXTPLAY Siempre Visible */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-teal-500/40 shadow-lg shadow-teal-500/10">
            <div className="h-5 sm:h-6 flex items-center">
              <img
                src="/nextplay/logo_nextplay.png"
                alt="NEXTPLAY"
                className="h-full w-auto object-contain brightness-125"
              />
            </div>
            <span className="h-3.5 w-px bg-slate-700 hidden sm:block" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-teal-300 hidden sm:inline">
              Campaña Formativa
            </span>
          </div>

          {/* Sello Liga Costa de Oro */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-md">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Costa de Oro 2026</span>
            </span>
          </div>
        </div>

        {/* 🏆 TIPOGRAFÍA MOTIVACIONAL Y CONCEPTO EN PANTALLA */}
        <div className="absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none z-10 space-y-1.5 sm:space-y-2">
          
          {/* Tag del Concepto */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-400/30 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{currentScene.tag}</span>
          </span>

          {/* Título Principal de Impacto */}
          <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight max-w-3xl">
            {currentScene.title}
          </h2>

          {/* Subtítulo Filosófico */}
          <p className="text-xs sm:text-base md:text-lg font-bold text-amber-300 tracking-wide drop-shadow-md max-w-2xl">
            {currentScene.subtitle}
          </p>

          {/* Marca de Agua NEXTPLAY Grande de Fondo */}
          <div className="text-[32px] sm:text-[60px] md:text-[80px] font-black tracking-widest text-white/5 uppercase select-none absolute -bottom-10 pointer-events-none">
            NEXTPLAY
          </div>
        </div>

        {/* ⏯️ BOTÓN CENTRAL DE REPRODUCCIÓN CUANDO ESTÁ PAUSADO */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
            <button
              onClick={togglePlay}
              aria-label="Reproducir Video NextPlay"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/90 hover:bg-black text-amber-400 border-2 border-amber-500/80 flex items-center justify-center shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/50"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-amber-400 ml-1" />
            </button>
          </div>
        )}

        {/* 🎛️ BARRA INFERIOR DE CONTROLES MULTIMEDIA */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between text-white z-20 pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="p-2 sm:p-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Botón de Cápsula de Voz de Organización */}
            <button
              onClick={toggleVoiceover}
              className={`px-3 py-1.5 rounded-xl backdrop-blur-md font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
                voiceoverPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-black/70 hover:bg-black/90 text-amber-300 border-amber-500/30'
              }`}
              title="Escuchar audio de la organización"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{voiceoverPlaying ? 'Pausar Cápsula de Voz' : '🎙️ Cápsula de Organización'}</span>
            </button>
          </div>

          {/* Acciones Derecha: Ver Afiches Originales & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPosterCards(!showPosterCards)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/10 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>{showPosterCards ? 'Ocultar Afiches' : 'Ver Afiches'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 sm:p-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
              title="Pantalla Completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 🧭 SELECTOR DE CONCEPTOS Y ESCENAS NEXTPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {NEXTPLAY_CONCEPTS.map((scene, index) => {
          const isActive = index === activeConceptIndex;
          return (
            <button
              key={scene.id}
              onClick={() => handleSelectScene(index)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isActive
                  ? 'bg-slate-950 text-white border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                  {scene.tag.split('·')[0]}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-600'}`}>
                  {scene.sport}
                </span>
              </div>

              <div className="space-y-0.5">
                <h4 className={`text-xs sm:text-sm font-extrabold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {scene.title}
                </h4>
                <p className={`text-[11px] line-clamp-1 ${isActive ? 'text-amber-300/90' : 'text-slate-500'}`}>
                  {scene.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 🖼️ GALERÍA DESPLEGABLE DE AFICHES ORIGINALES NEXTPLAY */}
      {showPosterCards && (
        <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 space-y-3 animate-fade-in text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/nextplay/logo_nextplay.png"
                alt="NEXTPLAY"
                className="h-5 w-auto object-contain brightness-125"
              />
              <span className="font-extrabold text-xs sm:text-sm text-teal-300">
                Afiches Oficiales de la Campaña Formativa
              </span>
            </div>
            <button
              onClick={() => setShowPosterCards(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {NEXTPLAY_CONCEPTS.map((c) => (
              <div key={c.id} className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
                <img
                  src={c.cardImage}
                  alt={c.title}
                  className="w-full aspect-4/3 object-cover"
                />
                <div className="p-2.5 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 block uppercase">
                    {c.title}
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {c.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
