'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { PhotoItem } from '@/types/tournament';
import { Camera, Download, Eye, UploadCloud, X, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PinchZoomPhotoModal } from './PinchZoomPhotoModal';
import { uploadPhotoToBunny, validateMediaFile } from '@/lib/bunnyMediaService';
import { processImageForUpload, downloadImageAsJpg } from '@/lib/imageProcessor';

export function PhotoGalleryGrid() {
  const { photos, addPhoto, schools } = useTournament();
  const { t } = useLanguage();
  const [selectedMoment, setSelectedMoment] = useState<string>('all');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photographerName, setPhotographerName] = useState('');
  const [momentType, setMomentType] = useState<'previo' | 'durante' | 'final_premiacion'>('durante');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || 'la-paz-cabo-velas');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const moments = [
    { id: 'all', label: t('gallery.all') },
    { id: 'previo', label: t('gallery.warmup') },
    { id: 'durante', label: t('gallery.action') },
    { id: 'final_premiacion', label: t('gallery.celebration') },
  ];

  const filteredPhotos = photos.filter((p) => {
    const matchMoment = selectedMoment === 'all' || p.moment === selectedMoment;
    const matchSchool = selectedSchoolFilter === 'all' || p.schoolId === selectedSchoolFilter;
    return matchMoment && matchSchool;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Archivo de imagen no válido');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Por favor selecciona una fotografía.');
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    setUploadError(null);

    try {
      // 1. Optimizar imagen en el cliente a formato WebP ultraligero
      let fileToUpload = selectedFile;
      try {
        const processed = await processImageForUpload(selectedFile, { maxWidth: 1600, quality: 0.82 });
        fileToUpload = processed.file;
      } catch (compressErr) {
        console.warn('Compresión local omitida, subiendo original:', compressErr);
      }

      setUploadProgress(35);

      // 2. Subida física garantizada al servidor / CDN
      const result = await uploadPhotoToBunny(
        fileToUpload,
        'costa_de_oro_2026/fotos',
        (pct) => setUploadProgress(pct)
      );

      if (result.success && result.url) {
        const momentLabelMap = {
          previo: '🟡 Previo y Calentamiento',
          durante: '🔵 En Cancha / Jugadas',
          final_premiacion: '🏆 Premiación y Celebración',
        };

        addPhoto({
          title: photoTitle.trim() || 'Momento del Festival Deportivo',
          photographer: photographerName.trim() || 'Comunidad Costa de Oro',
          imageUrl: result.url,
          thumbnailUrl: result.thumbnailUrl || result.url,
          moment: momentType,
          momentLabel: momentLabelMap[momentType],
          schoolId: selectedSchoolId,
          tags: ['festival2026', momentType, selectedSchoolId],
        });

        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setPhotoPreview(null);
          setPhotoTitle('');
          setPhotographerName('');
          setUploadProgress(0);
        }, 1500);
      } else {
        setUploadError(result.error || 'Error al guardar la fotografía en el servidor.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error inesperado durante la subida.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-bold text-slate-900">{t('gallery.title')}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Action Button & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Subir Fotografía</span>
          </button>

          {/* Selector de Colegio */}
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Todos los Colegios</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {moments.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMoment(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedMoment === m.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-900 font-bold shadow-xs">
                {photo.momentLabel ? photo.momentLabel.split(' ')[1] || 'Momento' : 'Momento'}
              </div>

              <div className="absolute bottom-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] bg-slate-950/80 px-2 py-0.5 rounded shadow">
                <Eye className="w-3.5 h-3.5" />
                <span>{t('gallery.viewHd')}</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {photo.title}
                </h4>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {t('gallery.by')} {photo.photographer}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const cleanTitle = photo.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
                  downloadImageAsJpg(photo.imageUrl, `costa_de_oro_${cleanTitle}`);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 transition-all cursor-pointer"
                title={t('gallery.download')}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* High-Definition Pinch-to-Zoom Lightbox Modal */}
      {activePhoto && (
        <PinchZoomPhotoModal
          photo={activePhoto}
          onClose={() => setActivePhoto(null)}
        />
      )}

      {/* Modal de Subida de Fotografía */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Subir Fotografía del Festival</h3>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">¡Fotografía Guardada con Éxito!</h4>
                <p className="text-xs text-slate-500">
                  La foto ha sido optimizada e integrada en la galería oficial.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Dropzone / File Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Seleccionar Foto del Dispositivo:
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 bg-slate-50 text-center flex flex-col items-center justify-center min-h-[140px] relative">
                    {photoPreview ? (
                      <div className="relative w-full aspect-[16/9] max-h-[160px] rounded-xl overflow-hidden bg-black">
                        <img src={photoPreview} alt="Previa" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPhotoPreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700">Toca para elegir foto (JPG, PNG, WebP)</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Optimización automática en alta fidelidad</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileSelect}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          required
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Título & Fotógrafo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título de la Foto
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Gol en semifinales"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre del Fotógrafo / Familiar
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Profe Juan / Familia Mora"
                      value={photographerName}
                      onChange={(e) => setPhotographerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Momento & Colegio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Momento del Evento
                    </label>
                    <select
                      value={momentType}
                      onChange={(e) => setMomentType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="durante">🔵 Durante el Partido (En Cancha)</option>
                      <option value="previo">🟡 Previo y Calentamiento</option>
                      <option value="final_premiacion">🏆 Premiación y Celebración</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Colegio
                    </label>
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => setSelectedSchoolId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shortName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Optimizando y guardando imagen...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-xs transition"
                  >
                    {uploading ? 'Guardando...' : 'Publicar en Galería'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

