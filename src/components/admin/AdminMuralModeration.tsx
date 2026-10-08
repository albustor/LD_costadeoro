'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Heart, 
  Star, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Eye, 
  Search, 
  Filter, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { downloadImageAsJpg } from '@/lib/imageProcessor';

export function AdminMuralModeration() {
  const { 
    familyPosts, 
    schools, 
    deleteFamilyPost, 
    toggleFeatureFamilyPost 
  } = useTournament();

  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const posts = Array.isArray(familyPosts) ? familyPosts : [];

  const filteredPosts = posts.filter((p) => {
    const matchSchool = filterSchool === 'all' || p.schoolId === filterSchool;
    const matchSearch = 
      !searchTerm.trim() || 
      p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSchool && matchSearch;
  });

  const handleDelete = (postId: string) => {
    deleteFamilyPost(postId);
    setConfirmDeleteId(null);
    setActionFeedback('Publicación eliminada correctamente.');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleToggleFeature = (postId: string) => {
    toggleFeatureFamilyPost(postId);
    setActionFeedback('Estado destacado actualizado.');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera y Resumen */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 font-bold">
              <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Moderación y Curaduría del Muro Familiar
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Supervisa los mensajes de apoyo comunitarios, destaca las mejores publicaciones para pantallas y modera contenido.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            Total Mensajes: <strong className="text-slate-950 font-black">{posts.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            Destacadas: <strong className="text-amber-700 font-black">{posts.filter(p => p.isFeatured).length}</strong>
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por autor o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-hidden text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por Colegio */}
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer shadow-2xs"
        >
          <option value="all">Todos los Colegios ({posts.length})</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName} ({posts.filter(p => p.schoolId === s.id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Mensajes y Saludos */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-2">
          <Heart className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No se encontraron publicaciones con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const school = schools.find((s) => s.id === post.schoolId) || schools[0];
            const isConfirmingDelete = confirmDeleteId === post.id;

            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-2xs space-y-3 transition-all flex flex-col justify-between ${
                  post.isFeatured ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Cabecera del Post */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <SchoolEmblem schoolId={school.id} size="sm" />
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                          {post.authorName}
                        </h4>
                        <p className="text-[11px] text-amber-800 font-bold">
                          {post.authorRelation} · {school.shortName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {post.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 shadow-2xs">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                          <span>Destacado</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Foto o Video Adjunto */}
                  {post.mediaUrl && (
                    <div className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-100">
                      {post.mediaType === 'photo' ? (
                        <>
                          <img
                            src={post.mediaUrl}
                            alt="Foto adjunta"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => downloadImageAsJpg(post.mediaUrl!, `CostaDeOro_${school.shortName}_${post.id}`)}
                            className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[10.5px] font-bold flex items-center gap-1 backdrop-blur-xs transition cursor-pointer shadow-xs"
                          >
                            <Download className="w-3 h-3 text-amber-300" />
                            <span>Descargar JPG</span>
                          </button>
                        </>
                      ) : (
                        <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                  )}

                  {/* Mensaje */}
                  <p className="text-xs text-slate-800 leading-relaxed font-normal bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                    "{post.message}"
                  </p>

                  {/* Estadísticas de Interacción */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>❤️ <strong>{post.likesCount}</strong> apoyos</span>
                    <span>👏 <strong>{post.applauseCount}</strong> aplausos</span>
                    <span>⭐ <strong>{post.featuredVotes}</strong> votos</span>
                    <span>💬 <strong>{post.comments?.length || 0}</strong> comentarios</span>
                  </div>
                </div>

                {/* Acciones de Moderación */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(post.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      post.isFeatured
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${post.isFeatured ? 'fill-amber-500 text-amber-600' : 'text-slate-500'}`} />
                    <span>{post.isFeatured ? 'Quitar Destacado' : 'Marcar Destacado'}</span>
                  </button>

                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1.5 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(post.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
