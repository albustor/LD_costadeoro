'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Clock,
  Heart
} from 'lucide-react';
import { School, FamilyPost } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { downloadImageAsJpg } from '@/lib/imageProcessor';

export interface PhotoViewerItem {
  id: string;
  url: string;
  authorName: string;
  authorRelation: string;
  schoolId: string;
  message: string;
  dateLabel?: string;
  likesCount?: number;
}

interface TouchPhotoViewerModalProps {
  isOpen: boolean;
  photos: PhotoViewerItem[];
  currentIndex: number;
  schools: School[];
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const TouchPhotoViewerModal: React.FC<TouchPhotoViewerModalProps> = ({
  isOpen,
  photos,
  currentIndex,
  schools,
  onClose,
  onNavigate,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentPhoto = photos[currentIndex];
  const school = currentPhoto ? schools.find((s) => s.id === currentPhoto.schoolId) || schools[0] : null;

  // Reset zoom & pan when photo changes or modal opens
  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetTransform();
  }, [currentIndex, isOpen, resetTransform]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1) return;
    const newIdx = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onNavigate(newIdx);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    const newIdx = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIdx);
  }, [currentIndex, photos.length, onNavigate]);

  // Zoom helpers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Double tap detection
  const handleDoubleTap = (clientX: number, clientY: number) => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      if (scale > 1) {
        resetTransform();
      } else {
        setScale(2.2);
      }
      setLastTapTime(0);
    } else {
      setLastTapTime(now);
    }
  };

  // Touch Events Handlers (Pinch-to-zoom & Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers pinch
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      handleDoubleTap(touch.clientX, touch.clientY);

      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Pinching
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDist / lastTouchDistance;
      setScale((prev) => Math.min(Math.max(prev * ratio, 0.9), 3.5));
      setLastTouchDistance(currentDist);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Panning when zoomed
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      // Bound limits
      const maxOffset = (scale - 1) * 200;
      setPosition({
        x: Math.max(Math.min(newX, maxOffset), -maxOffset),
        y: Math.max(Math.min(newY, maxOffset), -maxOffset),
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setLastTouchDistance(null);
    setIsDragging(false);

    // If scale is back to around 1, reset perfectly
    if (scale < 1.05) {
      resetTransform();
    }

    // Swipe detection if scale === 1
    if (scale === 1 && touchStartX !== null && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      if (diffX > 55) {
        handlePrev();
      } else if (diffX < -55) {
        handleNext();
      }
      setTouchStartX(null);
    }
  };

  // Mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const maxOffset = (scale - 1) * 300;
      setPosition({
        x: Math.max(Math.min(newX, maxOffset), -maxOffset),
        y: Math.max(Math.min(newY, maxOffset), -maxOffset),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none touch-none animate-fade-in">
      {/* 🏷️ BARRA SUPERIOR: DATOS DEL AUTOR, COLEGIO Y BOTÓN CERRAR */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent z-20 text-white">
        <div className="flex items-center gap-3 min-w-0">
          {school && <SchoolEmblem schoolId={school.id} size="sm" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                {currentPhoto.authorName}
              </span>
              {currentPhoto.authorName.includes('Comité') && (
                <span className="px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                  Oficial
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-300/90 font-medium truncate">
              {currentPhoto.authorRelation} · {school?.shortName || ''}
            </p>
          </div>
        </div>

        {/* Contador y Botón Cerrar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {photos.length > 1 && (
            <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full text-slate-200 border border-white/10">
              {currentIndex + 1} / {photos.length}
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
            title="Cerrar visor (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 🖼️ ÁREA CENTRAL: IMAGEN CON ZOOM Y NAVEGACIÓN */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={currentPhoto.url}
          alt={currentPhoto.message || 'Fotografía de la Liga Costa de Oro'}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="max-h-[75vh] max-w-[95vw] sm:max-w-[85vw] object-contain rounded-lg shadow-2xl pointer-events-auto"
          draggable={false}
        />

        {/* Botón Navegación Izquierda */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer border border-white/20 active:scale-90 z-20 shadow-lg"
            title="Foto anterior (←)"
          >
            <ChevronLeft className="w-6 h-6 text-amber-300" />
          </button>
        )}

        {/* Botón Navegación Derecha */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer border border-white/20 active:scale-90 z-20 shadow-lg"
            title="Foto siguiente (→)"
          >
            <ChevronRight className="w-6 h-6 text-amber-300" />
          </button>
        )}
      </div>

      {/* 💬 BARRA INFERIOR: MENSAJE, CONTROLES DE ZOOM Y DESCARGA */}
      <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20 text-white space-y-2.5">
        {/* Mensaje de Apoyo */}
        {currentPhoto.message && (
          <div className="max-w-2xl mx-auto text-center px-2">
            <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed line-clamp-2">
              "{currentPhoto.message}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto pt-1">
          {/* Controles de Zoom Táctil */}
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs rounded-xl p-1 border border-white/10">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer text-white"
              title="Reducir zoom (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-amber-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.5}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer text-white"
              title="Aumentar zoom (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={resetTransform}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-amber-300"
                title="Restablecer tamaño (100%)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Botón de Descarga JPG en Alta Resolución */}
          <button
            type="button"
            onClick={() => downloadImageAsJpg(currentPhoto.url, `CostaDeOro_${school?.shortName || 'Foto'}_${currentPhoto.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer"
            title="Descargar esta fotografía en alta calidad JPG"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Descargar JPG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
