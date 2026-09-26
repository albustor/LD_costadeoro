'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { ShortVideo } from '@/types/tournament';
import { 
  Film, 
  Heart, 
  Eye, 
  Upload, 
  Play, 
  X, 
  User, 
  School as SchoolIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function VideoShortsWall() {
  const { videos, addVideo, likeVideo, schools, categories } = useTournament();
  const { isFeatureEnabled } = useTier();

  const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Upload Form State
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<ShortVideo['authorRole']>('Familia');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isFeatureEnabled('fanShortsVideo')) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center my-6">
        <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-300 mb-1">
          Mural de Fan Shorts Desactivado en este Paquete
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          El módulo de videos cortos estilo Shorts de YouTube para familias está disponible en la <strong>Opción 3 (Comercial Autónoma)</strong> o como adición modular por <strong>+$220 USD</strong>.
        </p>
      </div>
    );
  }

  const handleLike = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    if (!likedMap[videoId]) {
      likeVideo(videoId);
      setLikedMap({ ...likedMap, [videoId]: true });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) return;

    addVideo({
      title,
      authorName,
      authorRole,
      schoolId,
      categoryId,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
      durationSeconds: 15,
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setTitle('');
      setAuthorName('');
    }, 1500);
  };

  return (
    <section className="my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Mural Fan Shorts (Videos Cortos)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Los mejores momentos, jugadas y celebraciones subidos por las familias y atletas del torneo
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Corto Familiar (9:16)</span>
        </button>
      </div>

      {/* Shorts 9:16 Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {videos.map((vid) => {
          const isLiked = likedMap[vid.id];
          return (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between"
            >
              {/* Thumbnail Background */}
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Top Meta */}
              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-950/80 backdrop-blur text-amber-400 px-2 py-0.5 rounded-md border border-slate-700/60">
                  {vid.authorRole}
                </span>
                <span className="text-[10px] text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  {vid.durationSeconds}s
                </span>
              </div>

              {/* Play Icon Center Hover */}
              <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="relative z-10 p-3 space-y-1.5">
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {vid.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                  <span className="truncate max-w-[80px] text-slate-400">{vid.authorName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(e, vid.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{vid.likesCount}</span>
                    </button>
                    <span className="flex items-center gap-0.5 text-slate-500 text-[10px]">
                      <Eye className="w-3 h-3" />
                      {vid.viewsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[9/16] bg-black">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-400">
                  {activeVideo.authorName} ({activeVideo.authorRole})
                </span>
                <button
                  onClick={(e) => handleLike(e, activeVideo.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{activeVideo.likesCount} me gusta</span>
                </button>
              </div>
              <h3 className="text-sm font-bold text-white">{activeVideo.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Upload Video Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Subir Video Corto Familiar (9:16)</h3>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">¡Video Publicado con Éxito!</h4>
                <p className="text-xs text-slate-400">
                  Tu video ya está disponible en el mural oficial para toda la comunidad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Título o Descripción del Momento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ¡Golazo decisivo en el segundo tiempo!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nombre de quien sube
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Familia Soto / Carlos M."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Rol en el Torneo
                    </label>
                    <select
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value as ShortVideo['authorRole'])}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Familia">Familia</option>
                      <option value="Estudiante">Estudiante / Atleta</option>
                      <option value="Entrenador">Entrenador</option>
                      <option value="Curiol Studio">Curiol Studio</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Institución Educativa
                    </label>
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    El video se procesa en formato vertical 9:16 optimizado en CDN Bunny Stream con visualización instantánea.
                  </span>
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
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                  >
                    Publicar Video
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
