'use client';

import React, { useState, useEffect } from 'react';
import { School, FamilyPost } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Heart, 
  Sparkles, 
  Camera, 
  Video, 
  Send, 
  MessageSquare, 
  Trophy, 
  Star, 
  CheckCircle2, 
  Flame, 
  Share2, 
  ThumbsUp, 
  Smile 
} from 'lucide-react';

const INITIAL_FAMILY_POSTS: FamilyPost[] = [
  {
    id: 'fp-1',
    schoolId: 'la-paz-cabo-velas',
    authorName: 'Familia Soto Brenes',
    authorRelation: 'Mamá',
    message: '¡Increíble partido de las chicas de Cabo Velas! Qué garra y qué compañerismo demostraron hoy en la cancha. ¡Con todo en la siguiente fecha! 🌊⚽',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    sportId: 'futbol',
    likesCount: 24,
    applauseCount: 18,
    featuredVotes: 9,
    isFeatured: true,
    createdAt: 'Hace 20 min',
  },
  {
    id: 'fp-2',
    schoolId: 'cria',
    authorName: 'Carlos Mendoza',
    authorRelation: 'Papá',
    message: '¡Excelente remontada en el 2.° set del voleibol! Orgullosos de cada punto disputado por los Sharks de CRIA. 🦈🏐',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80',
    sportId: 'voleibol',
    likesCount: 19,
    applauseCount: 15,
    featuredVotes: 7,
    isFeatured: true,
    createdAt: 'Hace 45 min',
  },
  {
    id: 'fp-3',
    schoolId: 'journey-school',
    authorName: 'Mariana & David',
    authorRelation: 'Familia',
    message: '¡Qué gran ambiente deportivo en Guanacaste! Ver a los chicos disfrutar y hacer amigos de otros colegios es lo más valioso. ¡Arriba The Journey! 🏀✨',
    mediaType: 'none',
    sportId: 'baloncesto',
    likesCount: 16,
    applauseCount: 12,
    featuredVotes: 4,
    isFeatured: false,
    createdAt: 'Hace 1 hora',
  },
  {
    id: 'fp-4',
    schoolId: 'educarte',
    authorName: 'Abuela Rosaura',
    authorRelation: 'Abuelo/a',
    message: '¡Felicidades a nuestro nieto Mateo y a todo el equipo de Educarte por ese partidazo! Los amamos.',
    mediaType: 'none',
    sportId: 'futbol',
    likesCount: 22,
    applauseCount: 20,
    featuredVotes: 6,
    isFeatured: true,
    createdAt: 'Hace 2 horas',
  },
  {
    id: 'fp-5',
    schoolId: 'vittorino',
    authorName: 'Profe Esteban',
    authorRelation: 'Entrenador',
    message: '¡Gran esfuerzo muchachos de Vittorino! La disciplina y el trabajo en equipo dan frutos día con día.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    sportId: 'baloncesto',
    likesCount: 14,
    applauseCount: 11,
    featuredVotes: 3,
    isFeatured: false,
    createdAt: 'Hace 3 horas',
  },
];

interface FamilyCheerWallProps {
  schools: School[];
  featuredOnly?: boolean;
}

export function FamilyCheerWall({ schools, featuredOnly = false }: FamilyCheerWallProps) {
  const [posts, setPosts] = useState<FamilyPost[]>(INITIAL_FAMILY_POSTS);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  
  // Formulario de apoyo en 2 toques
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRelation, setAuthorRelation] = useState<FamilyPost['authorRelation']>('Familia');
  const [message, setMessage] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'none'>('none');
  const [selectedSport, setSelectedSport] = useState<string>('futbol');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);

  // Reacciones locales
  const handleReaction = (postId: string, type: 'like' | 'applause' | 'feature') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedLikes = type === 'like' ? p.likesCount + 1 : p.likesCount;
          const updatedApplause = type === 'applause' ? p.applauseCount + 1 : p.applauseCount;
          const updatedVotes = type === 'feature' ? p.featuredVotes + 1 : p.featuredVotes;
          // Auto-promover a destacado si supera umbral
          const isFeatured = updatedLikes + updatedApplause >= 35 || updatedVotes >= 8 || p.isFeatured;
          return {
            ...p,
            likesCount: updatedLikes,
            applauseCount: updatedApplause,
            featuredVotes: updatedVotes,
            isFeatured,
          };
        }
        return p;
      })
    );
  };

  // Manejador de archivo de foto o video del celular
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'photo');

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Enviar mensaje / foto
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !mediaPreview) return;

    setIsPosting(true);

    setTimeout(() => {
      const newPost: FamilyPost = {
        id: `fp-${Date.now()}`,
        schoolId: selectedSchoolId,
        authorName: authorName.trim() || 'Familia Acompañante',
        authorRelation,
        message: message.trim(),
        mediaType,
        mediaUrl: mediaPreview || undefined,
        sportId: selectedSport,
        likesCount: 1,
        applauseCount: 1,
        featuredVotes: 1,
        isFeatured: false,
        createdAt: 'Justo ahora',
      };

      setPosts((prev) => [newPost, ...prev]);
      setMessage('');
      setMediaPreview(null);
      setMediaType('none');
      setIsPosting(false);
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 3000);
    }, 400);
  };

  // Filtro de posts
  const filteredPosts = posts.filter((p) => {
    if (featuredOnly) return p.isFeatured;
    if (selectedSchoolFilter === 'all') return true;
    return p.schoolId === selectedSchoolFilter;
  });

  const featuredPosts = posts.filter((p) => p.isFeatured);

  return (
    <div className="space-y-6">
      {/* 🌟 SECCIÓN PORTAL GENERAL: MOMENTOS DESTACADOS DEL TORNEO */}
      {featuredOnly && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Momentos y Porras Destacadas del Torneo</span>
            </h3>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Votado por las Familias
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPosts.slice(0, 3).map((post) => {
              const school = schools.find((s) => s.id === post.schoolId) || schools[0];
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SchoolEmblem schoolId={school.id} size="xs" />
                      <span className="font-bold text-xs text-slate-900">{school.shortName}</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Destacado
                    </span>
                  </div>

                  {post.mediaUrl && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                      {post.mediaType === 'photo' ? (
                        <img
                          src={post.mediaUrl}
                          alt="Foto del evento"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                    "{post.message}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-semibold">{post.authorName} ({post.authorRelation})</span>
                    <span className="text-amber-600 font-bold">❤️ {post.likesCount} apoyos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✍️ FORMULARIO DE APOYO EN 2 TOQUES (CERO LOGIN) */}
      {!featuredOnly && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Muro de Familias y Mensajes de Apoyo</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Envía una porra, foto o video de tu hijo en 2 toques sin registro ni contraseñas.
              </p>
            </div>

            {showSuccessBadge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs animate-bounce border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ¡Publicado con éxito!
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-4">
            {/* Paso 1: Selecciona a tu Colegio (1 Toque) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Selecciona a tu Colegio / Equipo:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {schools.map((school) => {
                  const isSelected = selectedSchoolId === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => setSelectedSchoolId(school.id)}
                      className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <SchoolEmblem schoolId={school.id} size="sm" />
                      <span className="text-[10.5px] font-bold text-slate-800 truncate w-full">
                        {school.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Mensaje y Foto / Video */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                2. Mensaje de Aliento y Foto/Video Opcional:
              </label>

              {/* Botones de Porras Rápidas */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  '¡Con todo equipo! 👏',
                  '¡Orgullo total! 💙',
                  '¡Vamos con garra! 🔥',
                  '¡Gran partido chicos! ⚽',
                  '¡Fuerza Sharks! 🦈',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setMessage((prev) => (prev ? `${prev} ${chip}` : chip))}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Área de Texto */}
              <textarea
                rows={2}
                placeholder="Escribe tu mensaje de apoyo para los chicos..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />

              {/* Vista previa de foto o video adjunto */}
              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden aspect-video max-h-48 bg-slate-900 border border-slate-200">
                  {mediaType === 'photo' ? (
                    <img
                      src={mediaPreview}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video src={mediaPreview} className="w-full h-full object-contain" controls />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPreview(null);
                      setMediaType('none');
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-bold hover:bg-black"
                  >
                    Eliminar
                  </button>
                </div>
              )}

              {/* Barra de Acciones y Botón de Publicar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* Datos del Autor */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tu Nombre (Ej: Familia Soto)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 sm:w-44 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={authorRelation}
                    onChange={(e) => setAuthorRelation(e.target.value as FamilyPost['authorRelation'])}
                    className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
                  >
                    <option value="Mamá">Mamá</option>
                    <option value="Papá">Papá</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Familia">Familia</option>
                    <option value="Compañero/a">Compañero/a</option>
                    <option value="Entrenador">Entrenador</option>
                  </select>
                </div>

                {/* Botón de Adjuntar Foto/Video + Publicar */}
                <div className="flex items-center gap-2 justify-end">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Foto / Video</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isPosting || (!message.trim() && !mediaPreview)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPosting ? 'Publicando...' : 'Publicar Porra'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 💬 FEED DE PORRAS Y MENSAJES DE LAS FAMILIAS */}
      {!featuredOnly && (
        <div className="space-y-4">
          {/* Filtro por Colegio */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Filtrar por Colegio:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedSchoolFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSchoolFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({posts.length})
              </button>
              {schools.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSchoolFilter(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedSchoolFilter === s.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas de Porras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const school = schools.find((s) => s.id === post.schoolId) || schools[0];
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-slate-300"
                >
                  {/* Encabezado: Escudo del Colegio y Autor */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <SchoolEmblem schoolId={school.id} size="sm" />
                      <div>
                        <span className="block font-bold text-xs sm:text-sm text-slate-900">
                          {post.authorName}
                        </span>
                        <span className="block text-[10.5px] text-slate-500 font-medium">
                          {post.authorRelation} de {school.shortName} • {post.createdAt}
                        </span>
                      </div>
                    </div>

                    {post.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Destacado
                      </span>
                    )}
                  </div>

                  {/* Foto o Video Adjunto */}
                  {post.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-100">
                      {post.mediaType === 'photo' ? (
                        <img
                          src={post.mediaUrl}
                          alt="Foto del partido"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                  )}

                  {/* Mensaje de Apoyo */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {post.message}
                  </p>

                  {/* Barra de Reacciones y Votos Familiares */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReaction(post.id, 'like')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span className="font-bold">{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => handleReaction(post.id, 'applause')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 transition-all cursor-pointer"
                      >
                        <span className="text-xs">👏</span>
                        <span className="font-bold">{post.applauseCount}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleReaction(post.id, 'feature')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition-all cursor-pointer"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                      <span>Votar Destacado ({post.featuredVotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
