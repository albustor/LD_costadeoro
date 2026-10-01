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
            src="https://player.mediadelivery.net/embed/766057/47767415-6c27-4ba6-878b-fdbaaff55e8d?autoplay=true&loop=false&muted=true&preload=true&responsive=true"
            loading="lazy"
            style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
            allowFullScreen={true}
            title="Video oficial Liga Costa de Oro 2026"
          />
        </div>
      </div>

      {/* Pie descriptivo del video con mayor tamaño de texto */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-2xs">
        <span className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>Presentación oficial · Liga Costa de Oro 2026</span>
        </span>
        <p className="text-sm sm:text-base md:text-lg text-slate-800 font-medium leading-relaxed">
          Festival deportivo y formativo intercolegial de Guanacaste. Transmisión y video oficial.
        </p>
      </div>
    </div>
  );
}
