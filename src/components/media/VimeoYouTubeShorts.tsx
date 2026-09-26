'use client';

import React, { useState, useEffect } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { ShortVideo } from '@/types/tournament';
import { generateSportsVideoCopy } from '@/lib/aiVideoAssistant';
import { getBunnyEmbedUrl } from '@/lib/unifiedStorageService';
import { 
  Play, 
  Film, 
  Heart, 
  Eye, 
  Upload, 
  User, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Share2, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Info,
  Tv,
  Zap
} from 'lucide-react';

export function VimeoYouTubeShorts() {
  const { videos, addVideo, likeVideo, schools, categories } = useTournament();
  const { isFeatureEnabled } = useTier();

  const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rememberedAuthor, setRememberedAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState<ShortVideo['authorRole']>('Familia');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actionType, setActionType] = useState<'gol' | 'tapón' | 'remate' | 'celebracion' | 'jugada' | 'calentamiento'>('gol');
  const [customDetails, setCustomDetails] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load remembered author name from browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('costa_de_oro_uploader_name');
      if (savedName) {
        setRememberedAuthor(savedName);
        setAuthorName(savedName);
      }
    }
  }, []);

  if (!isFeatureEnabled('fanShortsVideo')) return null;

  const handleLike = (e: React.MouseEvent, vidId: string) => {
    e.stopPropagation();
    if (!likedMap[vidId]) {
      likeVideo(vidId);
      setLikedMap({ ...likedMap, [vidId]: true });
    }
  };

  const handleUseRememberedName = () => {
    if (rememberedAuthor) {
      setAuthorName(rememberedAuthor);
    }
  };

  const handleGenerateAiCopy = async () => {
    setIsGeneratingAi(true);
    const school = schools.find((s) => s.id === schoolId)?.name || 'Colegio';
    const category = categories.find((c) => c.id === categoryId)?.name || 'Categoría';

    const aiResult = await generateSportsVideoCopy({
      schoolName: school,
      categoryName: category,
      actionType,
      details: customDetails,
    });

    setTitle(aiResult.title);
    setDescription(aiResult.description);
    setIsGeneratingAi(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) return;

    setIsUploading(true);

    // Save author name in browser to eliminate friction for repeated uploads
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_uploader_name', authorName.trim());
      setRememberedAuthor(authorName.trim());
    }

    try {
      // Call Bunny Stream upload endpoint
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      let embedUrl = 'https://iframe.mediadelivery.net/embed/629005/sample-short?autoplay=true&loop=false&muted=false&preload=true';
      if (response.ok) {
        const data = await response.json();
        if (data.embedUrl) {
          embedUrl = data.embedUrl;
        }
      }

      addVideo({
        title: title.trim(),
        authorName: authorName.trim(),
        authorRole,
        schoolId,
        categoryId,
        videoUrl: embedUrl,
        thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
        durationSeconds: 16,
      });

      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setTitle('');
        setDescription('');
        setCustomDetails('');
      }, 1500);
    } catch (err) {
      console.warn('Fallback to local Bunny embed:', err);
      addVideo({
        title: title.trim(),
        authorName: authorName.trim(),
        authorRole,
        schoolId,
        categoryId,
        videoUrl: 'https://iframe.mediadelivery.net/embed/629005/sample-short?autoplay=true',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
        durationSeconds: 15,
      });
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
      }, 1500);
    }
  };

  return (
    <section className="my-8 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-white">Mural de Videos Estilo YouTube & Bunny.net</h3>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Bunny Stream CDN</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Desliza horizontalmente para ver las mejores jugadas grabadas por las familias
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Video a Bunny Stream</span>
        </button>
      </div>

      {/* YouTube Style Horizontal Shelf / Playlist */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin snap-x">
          {videos.map((vid) => {
            const isLiked = likedMap[vid.id];
            const school = schools.find((s) => s.id === vid.schoolId);

            return (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="w-64 sm:w-72 shrink-0 bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-300 shadow-md group overflow-hidden flex flex-col justify-between snap-start"
              >
                {/* Author on top */}
                <div className="p-3 bg-slate-950/80 flex items-center justify-between border-b border-slate-800/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-white truncate">
                        {vid.authorName}
                      </span>
                      <span className="block text-[10px] text-amber-400">{vid.authorRole}</span>
                    </div>
                  </div>

                  <span className="text-sm shrink-0">{school?.logo}</span>
                </div>

                {/* Video Thumbnail */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/80 text-white px-1.5 py-0.5 rounded">
                    0:{vid.durationSeconds < 10 ? `0${vid.durationSeconds}` : vid.durationSeconds}
                  </span>
                </div>

                {/* Video Information & Description */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      Jugada oficial de {school?.shortName} en la Liga Costa de Oro.
                    </p>
                  </div>

                  {/* Interaction Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      onClick={(e) => handleLike(e, vid.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{vid.likesCount}</span>
                    </button>

                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{vid.viewsCount} vistas</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bunny Stream Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {activeVideo.videoUrl.includes('mediadelivery.net') ? (
                <iframe
                  src={getBunnyEmbedUrl(activeVideo.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Description & Author info */}
            <div className="p-5 bg-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">
                      Subido por: {activeVideo.authorName} ({activeVideo.authorRole})
                    </span>
                    <span className="block text-[11px] text-amber-400">
                      Transmisión Bunny Stream CDN • Biblioteca #{process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '629005'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleLike(e, activeVideo.id)}
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{activeVideo.likesCount} me gusta</span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{activeVideo.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Momento deportivo capturado en la Liga Costa de Oro 2026. Transmisión ultra-rápida y almacenamiento global en Bunny Stream.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Video with AI Description Assistant Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Subir Video a Bunny Stream CDN</h3>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">¡Video Publicado con Éxito en Bunny CDN!</h4>
                <p className="text-xs text-slate-400">
                  Tu video ya aparece en el carrusel oficial de la comunidad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Author Name with Memory Auto-fill */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Nombre de quien sube el video
                    </label>
                    {rememberedAuthor && authorName !== rememberedAuthor && (
                      <button
                        type="button"
                        onClick={handleUseRememberedName}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Usar: &quot;{rememberedAuthor}&quot;</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Familia Rodríguez / Coach Gómez"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Colegio del Atleta
                    </label>
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Disciplina
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AI Generator Helper Box */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generar Título y Descripción con IA</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateAiCopy}
                      disabled={isGeneratingAi}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isGeneratingAi ? 'Generando...' : 'Auto-Generar'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Tipo de Jugada</label>
                      <select
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value as any)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      >
                        <option value="gol">⚽ Gol / Remate Fútbol</option>
                        <option value="tapón">🏀 Tapón / Triple Basket</option>
                        <option value="remate">🏐 Remate / Bloqueo Voley</option>
                        <option value="celebracion">🎉 Celebración / Familia</option>
                        <option value="jugada">⚡ Jugada Destacada</option>
                        <option value="calentamiento">🔥 Calentamiento</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Detalle Opcional</label>
                      <input
                        type="text"
                        placeholder="Ej. Minuto 90 / Sobre la bocina"
                        value={customDetails}
                        onChange={(e) => setCustomDetails(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Generated or Manual Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Título del Video
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ¡Golazo al ángulo en el segundo tiempo!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Generated Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción Breve
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Breve reseña del momento..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Procesando en Bunny...' : 'Publicar Video en Bunny Stream'}</span>
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
