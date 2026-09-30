'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function EventIntroVideo() {
  return (
    <div className="space-y-3">
      {/* 🎬 CONTENEDOR PRINCIPAL DEL VIDEO OFICIAL BUNNY STREAM (RESPONSIVE 16:9) */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-300/80 shadow-xl">
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src="https://player.mediadelivery.net/embed/766057/642b0c4a-96fa-431a-9915-32dee5a0633b?autoplay=true&loop=false&muted=true&preload=true&responsive=true&captions=false&showAudioTracks=false"
            loading="lazy"
            style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
            allowFullScreen={true}
            title="Video oficial Liga Deportiva Costa de Oro 2026"
          />
        </div>
      </div>

      {/* Pie descriptivo del video */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center space-y-0.5 shadow-2xs">
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Presentación oficial · Liga Deportiva Costa de Oro 2026</span>
        </span>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Festival deportivo y formativo intercolegial de Guanacaste. Transmisión y video oficial.
        </p>
      </div>
    </div>
  );
}
