'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PhotoItem } from '@/types/tournament';
import { downloadImageAsJpg } from '@/lib/imageProcessor';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Camera, 
  Sparkles,
  Layers
} from 'lucide-react';

interface PinchZoomPhotoModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

export function PinchZoomPhotoModal({ photo, onClose }: PinchZoomPhotoModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const initialTouchDistance = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset zoom when photo changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [photo]);

  if (!photo) return null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const cleanTitle = photo.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadImageAsJpg(photo.imageUrl, `costa_de_oro_${cleanTitle}`);
  };

  // Touch handlers for mobile pinch-to-zoom (like Golden Basketball Academy)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialTouchDistance.current = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistance.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const diff = currentDist - initialTouchDistance.current;
      const newScale = Math.min(Math.max(scale + diff * 0.005, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    initialTouchDistance.current = null;
    setIsDragging(false);
  };

  // Double tap to quick zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Floating Controls Toolbar */}
      <div
        className="p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {photo.momentLabel}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Toca dos veces o usa dos dedos para ampliar
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-900/90 rounded-xl border border-slate-800 p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Aumentar zoom (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reducir zoom (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {scale > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors text-[11px] font-mono font-bold"
                title="Restablecer tamaño normal"
              >
                1x
              </button>
            )}
          </div>

          {/* Download Direct JPG */}
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
            title="Descargar fotografía en formato JPG original"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar JPG</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Zoomable Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center relative touch-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? 'grab' : 'zoom-in',
          }}
          className="max-h-[78vh] max-w-[95vw] object-contain select-none"
        />
      </div>

      {/* Bottom Metadata Bar */}
      <div
        className="p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base">{photo.title}</h3>
          <p className="text-slate-400 text-xs">
            Foto oficial en alta resolución • Captura: <strong>{photo.photographer}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-mono text-[11px] bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
            Formato: JPG de Alta Definición
          </span>
          <span className="text-amber-400 font-bold">Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
