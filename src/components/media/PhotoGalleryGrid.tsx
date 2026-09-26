'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { PhotoItem } from '@/types/tournament';
import { Camera, Download, Eye, Layers, Filter } from 'lucide-react';
import { PinchZoomPhotoModal } from './PinchZoomPhotoModal';

export function PhotoGalleryGrid() {
  const { photos } = useTournament();
  const [selectedMoment, setSelectedMoment] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const moments = [
    { id: 'all', label: 'Todas las Tomas' },
    { id: 'previo', label: '1. Previo (Calentamiento)' },
    { id: 'durante', label: '2. Durante (Acción Pura)' },
    { id: 'final_premiacion', label: '3. Posterior & Celebración' },
  ];

  const filteredPhotos = selectedMoment === 'all'
    ? photos
    : photos.filter((p) => p.moment === selectedMoment);

  return (
    <section className="my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Galería Fotográfica Oficial</h3>
          </div>
          <p className="text-xs text-slate-400">
            Cobertura profesional por <strong>Curiol Studio</strong> en los 3 momentos clave de la jornada
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {moments.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMoment(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMoment === m.id
                  ? 'bg-amber-500 text-slate-950 shadow font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-amber-300 font-bold">
                {photo.momentLabel.split(' ')[1]} {photo.momentLabel.split(' ')[2]}
              </div>

              <div className="absolute bottom-2 right-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded">
                <Eye className="w-3.5 h-3.5" />
                <span>Ver HD</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-800/80">
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {photo.title}
                </h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Foto: {photo.photographer}
                </span>
              </div>

              <a
                href={photo.imageUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all"
                title="Descargar Foto Oficial"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* High-Definition Pinch-to-Zoom Lightbox Modal with Direct JPG Download */}
      {activePhoto && (
        <PinchZoomPhotoModal
          photo={activePhoto}
          onClose={() => setActivePhoto(null)}
        />
      )}
    </section>
  );
}
