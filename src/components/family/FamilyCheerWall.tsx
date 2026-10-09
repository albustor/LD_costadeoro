'use client';

import React, { useState, useEffect } from 'react';
import { School, FamilyPost, PostComment } from '@/types/tournament';
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
  Smile,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  FileText,
  Info,
  X,
  Calendar,
  Clock,
  ShieldAlert,
  ChevronDown,
  UploadCloud,
  Filter,
  Download,
  Trash2
} from 'lucide-react';
import { uploadMediaToBunny } from '@/lib/bunnyMediaService';
import { processImageForUpload, downloadImageAsJpg } from '@/lib/imageProcessor';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { tournamentStorage } from '@/lib/storageAdapter';


// Días oficiales registrados para los festivales
const OFFICIAL_FESTIVAL_RANGES = [
  { name: '1.ª Jornada Oficial', start: '2026-10-05', end: '2026-10-09' },
  { name: '2.ª Jornada Oficial', start: '2026-11-02', end: '2026-11-06' },
  { name: '3.ª Jornada Oficial', start: '2026-11-16', end: '2026-11-20' },
  { name: 'Grandes Finales', start: '2026-11-23', end: '2026-11-27' },
];

const INITIAL_FAMILY_POSTS: FamilyPost[] = [];

interface FamilyCheerWallProps {
  schools: School[];
  featuredOnly?: boolean;
}

export function FamilyCheerWall({ schools, featuredOnly = false }: FamilyCheerWallProps) {
  const { 
    familyPosts, 
    addFamilyPost, 
    reactToFamilyPost, 
    addCommentToFamilyPost, 
    deleteFamilyPost,
    addPhoto, 
    addVideo 
  } = useTournament();

  const posts = Array.isArray(familyPosts) ? familyPosts : [];
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');

  // Términos y Normas de Convivencia Familiar (Se guarda 1 sola vez por celular)
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(true);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [termsCheckbox, setTermsCheckbox] = useState<boolean>(true);

  // Estado de fecha activa para multimedia
  const [isFestivalActiveDay, setIsFestivalActiveDay] = useState<boolean>(true);

  // Formulario de apoyo
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRelation, setAuthorRelation] = useState<FamilyPost['authorRelation']>('Familia');
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'none'>('none');
  const [selectedSport, setSelectedSport] = useState<string>('futbol');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);

  // Comentarios en publicaciones existentes
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [commentAuthor, setCommentAuthor] = useState<string>('');

  // 🛡️ Estado de Administrador / Moderador para borrado directo desde el muro
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string>('');
  const [deletedSuccessToast, setDeletedSuccessToast] = useState<string | null>(null);

  // Cargar estado inicial desde localStorage y Live Polling cada 20 segundos
  useEffect(() => {
    const checkAdminAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuthSession = sessionStorage.getItem('costa_de_oro_admin_auth') === 'true';
        const isAuthLocal = localStorage.getItem('costa_de_oro_admin_auth') === 'true';
        setIsAdmin(isAuthSession || isAuthLocal);
      }
    };
    checkAdminAuth();

    if (typeof window !== 'undefined') {
      const acceptedTerms = localStorage.getItem('costa_de_oro_terms_accepted');
      if (acceptedTerms === 'true') {
        setIsTermsAccepted(true);
        setTermsCheckbox(true);
      }
      setIsFestivalActiveDay(true);

      // Sincronización periódica silenciosa en segundo plano
      const interval = setInterval(() => {
        tournamentStorage.fetchRemoteFamilyPosts();
      }, 20000);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          tournamentStorage.fetchRemoteFamilyPosts();
          checkAdminAuth();
        }
      };

      window.addEventListener('storage', checkAdminAuth);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', checkAdminAuth);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  const handleAdminPinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPinInput.trim();
    const cleanLower = clean.toLowerCase();
    const validPins: string[] = ((TOURNAMENT_CONFIG.security as any)?.validAdminPins || [
      '2026ControlAdmin',
      '2026controladmin',
      'ORO2026',
      'COSTA2026',
      'admin2026',
      '8421',
    ]).map((p: string) => p.toLowerCase());

    if (
      clean === '2026ControlAdmin' ||
      cleanLower === '2026controladmin' ||
      validPins.includes(cleanLower) ||
      cleanLower === 'oro2026' ||
      cleanLower === 'costa2026' ||
      cleanLower === 'admin2026' ||
      clean === '8421'
    ) {
      setIsAdmin(true);
      setAdminPinError('');
      setShowAdminLoginModal(false);
      setAdminPinInput('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('costa_de_oro_admin_auth', 'true');
        localStorage.setItem('costa_de_oro_admin_auth', 'true');
      }
    } else {
      setAdminPinError('Clave de administración incorrecta');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('costa_de_oro_admin_auth');
      localStorage.removeItem('costa_de_oro_admin_auth');
    }
  };

  const handleDeletePost = (postId: string, author: string) => {
    const confirmed = window.confirm(`¿Confirmas que deseas eliminar permanentemente la publicación de "${author}" del muro?`);
    if (!confirmed) return;

    deleteFamilyPost(postId);
    setDeletedSuccessToast(`Publicación de "${author}" eliminada con éxito.`);
    setTimeout(() => setDeletedSuccessToast(null), 3000);
  };

  // Compartir mensaje de apoyo en WhatsApp / Redes Sociales
  const handleSharePost = (post: FamilyPost, schoolName: string) => {
    const shareText = `🏆 *Liga Costa de Oro 2026*\n"${post.message}"\n— Por: ${post.authorName} (${schoolName})\n\n¡Sube tus saludos, fotos y videos cortos al Muro Oficial aquí!: ${typeof window !== 'undefined' ? window.location.origin : ''}/mural`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Saludo Costa de Oro - ${schoolName}`,
        text: shareText,
        url: `${window.location.origin}/mural`,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // Guardar aceptación formal de términos en este dispositivo
  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setTermsCheckbox(true);
    setShowTermsModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_terms_accepted', 'true');
    }
  };

  // Reacciones persistentes
  const handleReaction = (postId: string, type: 'like' | 'applause' | 'feature') => {
    reactToFamilyPost(postId, type);
  };

  // Agregar comentario persistente a una publicación
  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    addCommentToFamilyPost(postId, {
      authorName: commentAuthor.trim() || 'Familiar Acompañante',
      text: commentText.trim(),
    });

    setCommentText('');
  };

  // Manejador de archivo de foto o video del celular con compresión Canvas
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'photo');

    if (!isVid) {
      try {
        const processed = await processImageForUpload(file, { maxWidth: 1920, quality: 0.85 });
        setSelectedFile(processed.file);
        setMediaPreview(processed.previewUrl);
      } catch (procErr) {
        console.warn('Fallback imagen directa:', procErr);
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setMediaPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    } else {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Enviar mensaje / foto con persistencia garantizada
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !mediaPreview && !selectedFile) return;

    setIsPosting(true);
    setUploadProgress(15);

    let finalMediaUrl: string | undefined = mediaPreview || undefined;

    // Si hay archivo seleccionado, procesar carga en Bunny.net / Almacenamiento local
    if (selectedFile) {
      try {
        const isVid = selectedFile.type.startsWith('video/');
        const bunnyResult = await uploadMediaToBunny(
          selectedFile,
          { 
            title: `Mural Costa de Oro - ${authorName || 'Familia'}`,
            folder: 'costa_de_oro_2026/mural_familiar' 
          },
          (percent) => setUploadProgress(percent)
        );
        
        if (bunnyResult.success && (bunnyResult.secureUrl || bunnyResult.url)) {
          const resUrl = bunnyResult.secureUrl || bunnyResult.url;
          if (!resUrl.startsWith('blob:')) {
            finalMediaUrl = resUrl;
          } else if (mediaPreview && !mediaPreview.startsWith('blob:')) {
            finalMediaUrl = mediaPreview;
          }
        } else if (mediaPreview && !mediaPreview.startsWith('blob:')) {
          finalMediaUrl = mediaPreview;
        }

        // Registrar en la Galería General si es fotografía
        if (!isVid && finalMediaUrl) {
          addPhoto({
            title: `Saludo & Momento Familiar: ${authorName || 'Comunidad'}`,
            categoryId: selectedSport,
            schoolId: selectedSchoolId,
            jornada: 1,
            date: new Date().toISOString().split('T')[0],
            moment: 'durante',
            momentLabel: '2. Momento Durante el Encuentro (Acción Pura)',
            imageUrl: finalMediaUrl,
            photographer: authorName || 'Familia Acompañante',
            viewsCount: 1,
            downloadUrl: finalMediaUrl,
          });
        } else if (isVid && finalMediaUrl) {
          // Registrar en videos si es clip
          addVideo({
            title: `Clip de Apoyo: ${authorName || 'Familia'}`,
            authorName: authorName.trim() || 'Familia Acompañante',
            authorRole: (authorRelation === 'Entrenador' ? 'Entrenador' : 'Familia'),
            categoryId: selectedSport,
            schoolId: selectedSchoolId,
            videoUrl: finalMediaUrl,
            thumbnailUrl: bunnyResult.thumbnailUrl || finalMediaUrl,
            durationSeconds: 15,
          });
        }
      } catch (uploadErr) {
        console.warn('Error en subida multimedia, usando respaldo:', uploadErr);
      }
    }

    // Guardar publicación de forma persistente en localStorage y contexto
    addFamilyPost({
      schoolId: selectedSchoolId,
      authorName: authorName.trim() || 'Familia Acompañante',
      authorRelation,
      message: message.trim(),
      mediaType: selectedFile || finalMediaUrl ? mediaType : 'none',
      mediaUrl: finalMediaUrl,
      sportId: selectedSport,
      isFeatured: false,
    });

    // Conmutar de inmediato el filtro visual hacia la delegación donde se publicó
    setSelectedSchoolFilter(selectedSchoolId);

    // Limpiar formulario y dar feedback
    setMessage('');
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType('none');
    setUploadProgress(0);
    setIsPosting(false);
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 5000);
  };

  // Filtro de posts reactivo
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
              <span>Momentos y mensajes destacados del torneo</span>
            </h3>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Votado por las familias
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
                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                      {post.mediaType === 'photo' ? (
                        <>
                          <img
                            src={post.mediaUrl}
                            alt="Foto del evento"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => downloadImageAsJpg(post.mediaUrl!, `CostaDeOro_${school.shortName}_${post.id}`)}
                            className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[10.5px] font-bold flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer shadow-xs active:scale-95"
                            title="Descargar fotografía en formato JPG"
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

      {/* ✍️ FORMULARIO DE APOYO CON ALTA FUERZA VISUAL EN 3 PASOS Y NORMAS DE CONVIVENCIA */}
      {!featuredOnly && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5">
          {/* Encabezado del Muro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Muro de familias y mensajes de apoyo
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Envía tus saludos, felicitaciones, fotos y videos cortos a los atletas de todas las delegaciones.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-amber-200 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>¿Cómo publicar?</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Normas de publicación</span>
              </button>
            </div>
          </div>

          {/* 🤝 AVISO OFICIAL SOBRE EL CORRECTO Y RESPETUOSO USO DEL ESPACIO */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 rounded-2xl border border-amber-300/70 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-extrabold text-slate-900 block">
                Espacio comunitario de convivencia y respeto deportivo
              </span>
              <p className="text-slate-600 leading-relaxed font-medium">
                Este mural es un punto de encuentro familiar abierto a toda la comunidad. Comparte tus saludos, fotos, videos cortos y mensajes de apoyo siempre bajo principios de respeto mutuo, juego limpio y compañerismo hacia todos los estudiantes e instituciones.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-5">
            {/* 🏷️ PASO 1: SELECCIONA TU COLEGIO / EQUIPO */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                  1
                </span>
                <label className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Selecciona a tu colegio o delegación:
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
                {schools.map((school) => {
                  const isSelected = selectedSchoolId === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => setSelectedSchoolId(school.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-2 border-amber-500 ring-2 ring-amber-400/30 text-slate-950 font-black shadow-xs scale-[1.02]'
                          : 'bg-slate-50/70 hover:bg-white border-slate-200 text-slate-700 font-bold'
                      }`}
                    >
                      <SchoolEmblem schoolId={school.id} size="md" />
                      <span className="text-[11px] leading-tight truncate w-full">
                        {school.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 💬 PASO 2: MENSAJE Y SALUDOS RÁPIDOS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                    2
                  </span>
                  <label className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Escribe tu mensaje de apoyo o saludo:
                  </label>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Toca un saludo o escribe tu propio texto
                </span>
              </div>

              {/* Botones de Saludos Rápidos */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  '¡Con todo equipo! 👏',
                  '¡Orgullo total! 💙',
                  '¡Vamos con garra! 🔥',
                  '¡Gran partido chicos! ⚽',
                  '¡A darlo todo en la cancha! 🏆',
                  '¡Juego limpio y pasión! ✨'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setMessage((prev) => (prev ? `${prev} ${chip}` : chip))}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100/70 hover:text-amber-900 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-200/70"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Área de Texto */}
              <textarea
                rows={2}
                placeholder="Escribe tu mensaje de apoyo para los chicos y familias..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
              />

              {/* Adjuntar Foto / Video */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-2">
                  {isFestivalActiveDay ? (
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all border border-slate-200 shadow-2xs">
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span>{selectedFile ? 'Cambiar foto o video' : 'Adjuntar foto o video corto (hasta 15 s)'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div
                      title="La carga de fotos y videos se activa exclusivamente en días oficiales de festival."
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Multimedia en pausa</span>
                    </div>
                  )}

                  {selectedFile && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-[200px]">
                      ✓ {selectedFile.name}
                    </span>
                  )}
                </div>

                {mediaPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPreview(null);
                      setSelectedFile(null);
                      setMediaType('none');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                  >
                    Quitar archivo
                  </button>
                )}
              </div>

              {/* Vista previa de foto o video */}
              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden aspect-video max-h-48 bg-slate-900 border border-slate-200 shadow-xs">
                  {mediaType === 'photo' ? (
                    <img
                      src={mediaPreview}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video src={mediaPreview} className="w-full h-full object-contain" controls />
                  )}
                </div>
              )}
            </div>

            {/* 👤 PASO 3: IDENTIFÍCATE Y PUBLICA */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                  3
                </span>
                <label className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Identifícate y publica en el muro:
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Datos del Autor */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Tu nombre o familia (ej. Familia Soto)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <select
                    value={authorRelation}
                    onChange={(e) => setAuthorRelation(e.target.value as FamilyPost['authorRelation'])}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="Familia">Familia</option>
                    <option value="Mamá">Mamá</option>
                    <option value="Papá">Papá</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Compañero/a">Compañero/a</option>
                    <option value="Entrenador">Entrenador</option>
                  </select>
                </div>

                {/* Botón de Publicar Destacado */}
                <button
                  type="submit"
                  disabled={isPosting || (!message.trim() && !mediaPreview)}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isPosting ? 'Publicando en el muro...' : 'Publicar mensaje ahora'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 💬 FEED DE SALUDOS Y MENSAJES DE LAS FAMILIAS CON COMENTARIOS */}
      {!featuredOnly && (
        <div className="space-y-4">
          {/* 🌟 BANNER DE CONFIRMACIÓN DE PUBLICACIÓN EXITOSA */}
          {showSuccessBadge && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-black text-emerald-900">
                    ¡Tu mensaje de apoyo ha sido publicado con éxito en el muro!
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Visible inmediatamente para todas las familias y sincronizado en tiempo real.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSchoolFilter('all')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Ver todos los mensajes
              </button>
            </div>
          )}

          {/* 🛡️ BARRA DE ESTADO DE MODERACIÓN / ADMINISTRADOR */}
          {isAdmin ? (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950 font-bold shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                  🛡️
                </span>
                <span>
                  <strong>Modo Administrador Activo:</strong> Tienes permisos de moderación para eliminar cualquier publicación directamente en el botón <strong>🗑️ Borrar</strong> de cada tarjeta.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shrink-0 transition cursor-pointer"
              >
                Cerrar sesión moderador
              </button>
            </div>
          ) : (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAdminLoginModal(true)}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Acceso para moderadores del comité"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Acceso Moderador</span>
              </button>
            </div>
          )}

          {/* Toast de confirmación de borrado */}
          {deletedSuccessToast && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-950 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm animate-fade-in">
              <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{deletedSuccessToast}</span>
            </div>
          )}

          {/* 🔍 SELECTOR RÁPIDO DE DELEGACIÓN (MINIMALISTA Y ÁGIL) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
              <button
                type="button"
                onClick={() => setSelectedSchoolFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  selectedSchoolFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>Todos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedSchoolFilter === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {posts.length}
                </span>
              </button>

              {schools.map((s) => {
                const isSelected = selectedSchoolFilter === s.id;
                const countForSchool = posts.filter((p) => p.schoolId === s.id).length;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSchoolFilter(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-black ring-2 ring-amber-400/40'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <SchoolEmblem schoolId={s.id} size="xs" />
                    <span>{s.shortName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {countForSchool}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSchoolFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSchoolFilter('all')}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline shrink-0 cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>

          {/* Tarjetas de Mensajes o Estado Vacío */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Aún no hay mensajes de apoyo registrados para esta delegación
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {selectedSchoolFilter !== 'all'
                    ? `¡Sé la primera familia en enviar un mensaje de aliento a los atletas de ${schools.find((s) => s.id === selectedSchoolFilter)?.shortName || 'este colegio'}!`
                    : 'Sé el primero en enviar apoyo a los deportistas.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSchoolFilter !== 'all') {
                      setSelectedSchoolId(selectedSchoolFilter);
                    }
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer"
                >
                  Escribir mensaje de apoyo
                </button>
                {selectedSchoolFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedSchoolFilter('all')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Ver otros colegios
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const school = schools.find((s) => s.id === post.schoolId) || schools[0];
              const isCommentsOpen = openCommentsPostId === post.id;
              const postComments = post.comments || [];

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-slate-300"
                >
                  {/* Encabezado: Escudo + Autor en ancho completo para Reflow perfecto */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <SchoolEmblem schoolId={school.id} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug flex items-center gap-1.5 flex-wrap">
                            <span>{post.authorName}</span>
                            {post.authorName.includes('Comité') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-2xs">
                                Oficial
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {post.createdAt}
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.authorName)}
                                className="px-2 py-0.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10.5px] font-black border border-rose-300 transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                                title="Eliminar esta publicación del muro"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>Borrar</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-800 font-bold leading-tight mt-0.5">
                          {post.authorName.includes('Comité') ? 'Comité Organizador' : post.authorRelation} · {school.name}
                        </p>
                      </div>
                    </div>

                    {/* Badges de Valor e IA en su propia fila */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200 shadow-2xs">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{post.authorName.includes('Comité') ? 'Bienvenida Oficial' : 'Destacado'}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9.5px] font-bold border border-emerald-200 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Valor Humano IA</span>
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
                            alt="Foto del partido"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => downloadImageAsJpg(post.mediaUrl!, `CostaDeOro_${school.shortName}_${post.id}`)}
                            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer shadow-sm active:scale-95"
                            title="Descargar fotografía en formato JPG"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-300" />
                            <span>Descargar JPG</span>
                          </button>
                        </>
                      ) : (
                        <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                  )}

                  {/* Mensaje de Apoyo */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {post.message}
                  </p>

                  {/* Barra de Reacciones, Votos y Comentarios */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReaction(post.id, 'like')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                        title="Enviar corazón de apoyo"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span className="font-bold">{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => handleReaction(post.id, 'applause')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 transition-all cursor-pointer"
                        title="Aplausos al juego limpio"
                      >
                        <span className="text-xs">👏</span>
                        <span className="font-bold">{post.applauseCount}</span>
                      </button>

                      <button
                        onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isCommentsOpen 
                            ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title="Comentar esta publicación"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>{postComments.length > 0 ? postComments.length : 'Comentar'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSharePost(post, school.shortName)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Compartir mensaje de apoyo en WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Compartir</span>
                      </button>

                      <button
                        onClick={() => handleReaction(post.id, 'feature')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition-all cursor-pointer"
                      >
                        <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                        <span>Votar Destacado ({post.featuredVotes})</span>
                      </button>
                    </div>
                  </div>

                  {/* Sección Desplegable de Comentarios (Siempre activa) */}
                  {isCommentsOpen && (
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5 animate-fade-in">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Comentarios Familiares ({postComments.length}):
                      </span>

                      {/* Lista de comentarios existentes */}
                      {postComments.length > 0 ? (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {postComments.map((comm) => (
                            <div key={comm.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                                <span className="font-bold text-slate-700">{comm.authorName}</span>
                                <span>{comm.createdAt}</span>
                              </div>
                              <p className="text-slate-800 text-[11px]">{comm.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          Aún no hay comentarios. ¡Sé el primero en dejar unas palabras de aliento!
                        </p>
                      )}

                      {/* Campo para responder / comentar */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="Tu nombre..."
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] w-28 focus:outline-hidden"
                        />
                        <input
                          type="text"
                          placeholder="Escribe un comentario..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold cursor-pointer"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* 🪟 MODAL DE NORMAS DE CONVIVENCIA Y PUBLICACIÓN */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <h3 className="font-extrabold text-base sm:text-lg">
                  Normas de convivencia y publicación
                </h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              La <strong>Liga Costa de Oro 2026</strong> es un espacio formativo, escolar y familiar. Al publicar mensajes, fotos o videos, cada padre, madre o familiar acepta las siguientes directrices:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <h5 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <span>1. Espíritu deportivo y apoyo positivo</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Las publicaciones deben celebrar el esfuerzo, compañerismo y respeto entre todas las 6 delegaciones escolares participantes.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <h5 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <span>2. Protección de la niñez y privacidad</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Las fotos y videos deben ser estrictamente del ámbito deportivo en cancha. Queda prohibida cualquier imagen o dato que vulnere la intimidad de los estudiantes menores de edad.
                </p>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <h5 className="font-bold text-rose-950 flex items-center gap-1.5 mb-1">
                  <span>3. Cero tolerancia a la agresividad</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Se prohíben descalificaciones, reclamos arbitrales ofensivos, lenguaje vulgar o agresiones entre barras. El comité organizador se reserva el derecho de retirar cualquier contenido inapropiado.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>4. Responsabilidad del usuario</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Cada familiar es responsable del contenido transmitido desde su dispositivo, manteniendo siempre el respeto, el compañerismo y la convivencia deportiva.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[10.5px] text-slate-400 italic">
                *Aplica una sola vez por celular en todo el torneo.
              </span>
              <button
                type="button"
                onClick={handleAcceptTerms}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Comprendo y acepto las normas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 MODAL DE INFOGRAFÍA Y GUÍA PASO A PASO */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                    ¿Cómo publicar en el muro?
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Guía rápida en 3 pasos sencillos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Paso 1 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shrink-0 shadow-2xs">
                  1
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Ingresa al mural de la comunidad
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Escanea el código QR oficial en canchas o entra a <strong>costadeoro.curiol.studio/mural</strong> desde cualquier celular.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shrink-0 shadow-2xs">
                  2
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Elige tu colegio y escribe tu saludo
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Toca el escudo de la delegación de tu hijo/a y redacta tu mensaje de aliento (o usa los botones rápidos).
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-amber-300 font-black text-xs inline-flex items-center justify-center shrink-0 shadow-2xs">
                  3
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Adjunta tu foto o video corto y publica
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Sube fotos de jugadas o videos cortos (hasta 15 seg), escribe tu nombre o parentesco y toca <strong>«Publicar mensaje ahora»</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Aviso de Convivencia */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 text-[11px] font-medium leading-relaxed">
              ✨ <strong>Sin contraseñas:</strong> El mural es un espacio abierto para todas las familias con moderación comunitaria y respeto deportivo.
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Entendido, ¡quiero publicar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 MODAL DE ACCESO MODERADOR */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base">Acceso Moderador</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminPinError('');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminPinLogin} className="space-y-3">
              <p className="text-xs text-slate-600">
                Introduce la clave maestra de administración para habilitar el borrado directo de publicaciones en el muro.
              </p>
              <input
                type="password"
                placeholder="Clave de administración..."
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
              {adminPinError && (
                <p className="text-[11px] text-rose-600 font-bold">{adminPinError}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminPinError('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
