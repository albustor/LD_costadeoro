'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Maximize2 } from 'lucide-react';

export function EventIntroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-lg group">
      {/* Video Element */}
      <video
        ref={videoRef}
        loop
        playsInline
        muted={isMuted}
        poster="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&auto=format&fit=crop&q=80"
        className="w-full aspect-video sm:aspect-21/9 object-cover opacity-90 transition-opacity group-hover:opacity-100"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
        Tu navegador no soporta la reproducción de video.
      </video>

      {/* Gradiente Protector y Superposición */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Badge Superior */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-bold text-xs border border-white/10">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>Video Introductorio Oficial</span>
        </span>

        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-[11px] border border-white/20">
          Edición 2026
        </span>
      </div>

      {/* Botón Central Grande de Reproducción si está pausado */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            aria-label="Reproducir Video"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-slate-950 ml-1" />
          </button>
        </div>
      )}

      {/* Barra de Controles Inferior */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <div className="hidden sm:block text-xs font-semibold text-slate-200">
            <span>Liga Deportiva Intercolegial Costa de Oro • Guanacaste</span>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
