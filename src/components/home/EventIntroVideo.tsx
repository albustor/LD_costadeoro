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
            src="https://player.mediadelivery.net/embed/766057/915f0d1a-c8f5-4858-9756-addb7283fd16?autoplay=true&loop=false&muted=true&preload=true&responsive=true"
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
        <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Presentación oficial · Liga Deportiva Costa de Oro 2026</span>
        </span>
        <p className="text-[11px] text-slate-500">
          Festival deportivo y formativo intercolegial de Guanacaste. Transmisión y video oficial.
        </p>
      </div>
    </div>
  );
}
