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
  UploadCloud
} from 'lucide-react';
import { uploadMediaToBunny } from '@/lib/bunnyMediaService';
import { useLanguage } from '@/context/LanguageContext';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';

const VALID_PINS: Record<string, string | 'all'> = {
  '2026': 'all',
  'PAZ2026': 'all',
  'COSTA2026': 'all',
  '8421': 'all',
  '1001': 'la-paz-cabo-velas',
  '1002': 'la-paz-tempisque',
  '2001': 'cria',
  '3001': 'journey-school',
  '4001': 'vittorino',
  '5001': 'educarte',
};

// Días oficiales registrados para los festivales
const OFFICIAL_FESTIVAL_RANGES = [
  { name: '1.ª Jornada Oficial', start: '2026-10-05', end: '2026-10-09' },
  { name: '2.ª Jornada Oficial', start: '2026-11-02', end: '2026-11-06' },
  { name: '3.ª Jornada Oficial', start: '2026-11-16', end: '2026-11-20' },
  { name: 'Grandes Finales', start: '2026-11-23', end: '2026-11-27' },
];

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
    comments: [
      {
        id: 'c-1',
        authorName: 'Coach Diego',
        authorRelation: 'Entrenador',
        text: '¡Gran trabajo de las atletas! El respeto y la disciplina ante todo.',
        createdAt: 'Hace 10 min',
      },
    ],
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
    comments: [],
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
    comments: [
      {
        id: 'c-2',
        authorName: 'Laura V.',
        authorRelation: 'Mamá',
        text: '¡Totalmente de acuerdo! Qué hermosa fiesta deportiva familiar.',
        createdAt: 'Hace 30 min',
      },
    ],
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
    comments: [],
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
    comments: [],
  },
];

interface FamilyCheerWallProps {
  schools: School[];
  featuredOnly?: boolean;
}

export function FamilyCheerWall({ schools, featuredOnly = false }: FamilyCheerWallProps) {
  const [posts, setPosts] = useState<FamilyPost[]>(INITIAL_FAMILY_POSTS);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  
  // PIN de Seguridad y Verificación Familiar
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Términos y Normas de Convivencia Familiar (Se guarda 1 sola vez por celular)
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [termsCheckbox, setTermsCheckbox] = useState<boolean>(false);

  // Estado de fecha activa para multimedia
  // Fuera de las fechas oficiales del evento, la carga de fotos/videos se bloquea
  const [isFestivalActiveDay, setIsFestivalActiveDay] = useState<boolean>(false);

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

  // Cargar estado inicial desde localStorage (PIN y Términos aceptados una sola vez)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Verificar si ya aceptó las normas en este dispositivo
      const acceptedTerms = localStorage.getItem('costa_de_oro_terms_accepted');
      if (acceptedTerms === 'true') {
        setIsTermsAccepted(true);
        setTermsCheckbox(true);
      }

      // 2. Verificar PIN en localStorage
      const storedPin = localStorage.getItem('costa_de_oro_family_pin_verified');
      if (storedPin === 'true') {
        setIsPinVerified(true);
      }

      // 3. Comprobar parámetros de URL para acceso por QR (?pin=COSTA2026 o ?pass=2026)
      const params = new URLSearchParams(window.location.search);
      const urlPin = params.get('pass') || params.get('pin') || params.get('code');
      const customPin = localStorage.getItem('costa_de_oro_event_pin');
      
      if (urlPin) {
        const cleanUrlPin = urlPin.toUpperCase();
        if (
          VALID_PINS[cleanUrlPin] || 
          TOURNAMENT_CONFIG.security.validPins.includes(cleanUrlPin) ||
          (customPin && customPin.toUpperCase() === cleanUrlPin)
        ) {
          setIsPinVerified(true);
          localStorage.setItem('costa_de_oro_family_pin_verified', 'true');
          const matchedSchool = VALID_PINS[cleanUrlPin];
          if (matchedSchool && matchedSchool !== 'all') {
            setSelectedSchoolId(matchedSchool);
          }
        }
      }

      // 4. Todas las fechas del evento están habilitadas para familias con PIN
      setIsFestivalActiveDay(true);
    }
  }, []);

  // Guardar aceptación formal de términos en este dispositivo
  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setTermsCheckbox(true);
    setShowTermsModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_terms_accepted', 'true');
    }
  };

  // Validar PIN ingresado a nivel de todo el evento
  const handleValidatePin = (pinToTest: string) => {
    const cleanPin = pinToTest.trim().toUpperCase();
    const customEventPin = typeof window !== 'undefined' ? localStorage.getItem('costa_de_oro_event_pin') : null;

    if (
      VALID_PINS[cleanPin] ||
      TOURNAMENT_CONFIG.security.validPins.includes(cleanPin) ||
      (customEventPin && customEventPin.toUpperCase() === cleanPin)
    ) {
      setIsPinVerified(true);
      setPinError(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('costa_de_oro_family_pin_verified', 'true');
      }
      const matchedSchool = VALID_PINS[cleanPin];
      if (matchedSchool && matchedSchool !== 'all') {
        setSelectedSchoolId(matchedSchool);
      }
    } else {
      setPinError('PIN no reconocido. Ingresa el PIN oficial del evento (ej: COSTA2026 o 2026).');
    }
  };

  // Reacciones locales
  const handleReaction = (postId: string, type: 'like' | 'applause' | 'feature') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedLikes = type === 'like' ? p.likesCount + 1 : p.likesCount;
          const updatedApplause = type === 'applause' ? p.applauseCount + 1 : p.applauseCount;
          const updatedVotes = type === 'feature' ? p.featuredVotes + 1 : p.featuredVotes;
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

  // Agregar comentario a una publicación existente (siempre habilitado)
  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      authorName: commentAuthor.trim() || 'Familiar Acompañante',
      text: commentText.trim(),
      createdAt: 'Justo ahora',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );

    setCommentText('');
  };

  // Manejador de archivo de foto o video del celular
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si no es día oficial de festival, la carga está bloqueada
    if (!isFestivalActiveDay) {
      alert('La subida de fotos y videos se habilita exclusivamente durante las fechas oficiales de festival en cancha.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'photo');

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Enviar mensaje / foto
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Exigir aceptación de términos si es primera vez
    if (!isTermsAccepted && !termsCheckbox) {
      setShowTermsModal(true);
      return;
    }

    // Si marcó la casilla en el formulario pero no estaba guardado
    if (!isTermsAccepted && termsCheckbox) {
      handleAcceptTerms();
    }

    // 2. Validar PIN
    if (!isPinVerified) {
      handleValidatePin(enteredPin);
      return;
    }

    if (!message.trim() && !mediaPreview && !selectedFile) return;

    setIsPosting(true);
    setUploadProgress(10);

    let finalMediaUrl: string | undefined = mediaPreview || undefined;

    // Si hay archivo seleccionado y es día activo, procesar carga en Bunny.net (Stream o Storage)
    if (selectedFile && isFestivalActiveDay) {
      try {
        const bunnyResult = await uploadMediaToBunny(
          selectedFile,
          { folder: 'costa_de_oro_2026/mural_familiar' },
          (percent) => setUploadProgress(percent)
        );
        if (bunnyResult.success && bunnyResult.secureUrl) {
          finalMediaUrl = bunnyResult.secureUrl;
        }
      } catch (uploadErr) {
        console.warn('Fallback a vista previa local:', uploadErr);
      }
    }

    const newPost: FamilyPost = {
      id: `fp-${Date.now()}`,
      schoolId: selectedSchoolId,
      authorName: authorName.trim() || 'Familia Acompañante',
      authorRelation,
      message: message.trim(),
      mediaType: isFestivalActiveDay ? mediaType : 'none',
      mediaUrl: isFestivalActiveDay ? finalMediaUrl : undefined,
      sportId: selectedSport,
      likesCount: 1,
      applauseCount: 1,
      featuredVotes: 1,
      isFeatured: false,
      createdAt: 'Justo ahora',
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setMessage('');
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType('none');
    setUploadProgress(0);
    setIsPosting(false);
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 3000);
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

      {/* ✍️ FORMULARIO DE APOYO CON SEGURIDAD PIN, NORMAS Y BLOQUEO MULTIMEDIA */}
      {!featuredOnly && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Muro de Familias y Mensajes de Apoyo
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Envía porras y comentarios a los deportistas. Protegido con normas de respeto y PIN del festival.
              </p>
            </div>

            {/* Badges de Estado */}
            <div className="flex items-center gap-2 flex-wrap">
              {isPinVerified ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>PIN de Familias Activo</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPinVerified(false);
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('costa_de_oro_family_pin_verified');
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    Cambiar PIN
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Requiere PIN del Evento</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Normas de Publicación</span>
              </button>
            </div>
          </div>

          {/* Aviso sobre Carga Multimedia (Fotos/Videos) y PIN General */}
          <div className="p-3 rounded-2xl border text-xs flex items-start sm:items-center gap-2.5 bg-amber-50/70 border-amber-200 text-amber-950">
            <Info className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-amber-700" />
            <div className="min-w-0">
              <span>
                <strong>PIN de Evento Habilitado para Todas las Fechas:</strong> Las familias y padres con el PIN oficial pueden compartir mensajes, fotografías y videos durante todas las fechas de la Liga Costa de Oro. <em>(PIN predeterminado: <strong>COSTA2026</strong> o <strong>2026</strong>)</em>.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-4">
            {/* Paso 1: Selecciona a tu Colegio */}
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

            {/* Paso 2: Mensaje y Porras */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                2. Mensaje de Aliento y Felicitaciones:
              </label>

              {/* Botones de Porras Rápidas */}
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
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />

              {/* Vista previa de foto o video si está habilitado y seleccionado */}
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

              {/* Fila de PIN de Seguridad si no está verificado */}
              {!isPinVerified && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 text-xs font-bold">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    <span>PIN Oficial del Evento Requerido para Publicar:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="PIN del Evento (Ej: COSTA2026 o 2026)"
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setPinError(null);
                      }}
                      className="px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900 w-64 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleValidatePin(enteredPin)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
                    >
                      Validar PIN
                    </button>
                    <span className="text-[11px] text-amber-900/80 font-medium">
                      (Válido para todas las fechas)
                    </span>
                  </div>
                  {pinError && (
                    <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pinError}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Casilla de Normas de Responsabilidad (Si es primera vez en el celular) */}
              {!isTermsAccepted && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsCheckbox}
                      onChange={(e) => setTermsCheckbox(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span className="text-slate-700">
                      He leído y acepto las{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="text-amber-700 font-bold underline hover:text-amber-800"
                      >
                        Normas de Publicación, Convivencia y Responsabilidad Familiar
                      </button>{' '}
                      de la Liga Costa de Oro. *(Se aplica una sola vez por celular)*
                    </span>
                  </label>
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
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Familia">Familia</option>
                    <option value="Compañero/a">Compañero/a</option>
                    <option value="Entrenador">Entrenador</option>
                  </select>
                </div>

                {/* Botón de Adjuntar Foto/Video (con bloqueo inteligente) + Publicar */}
                <div className="flex items-center gap-2 justify-end">
                  {isFestivalActiveDay ? (
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
                  ) : (
                    <div
                      title="La carga de fotos y videos se activa exclusivamente en días oficiales de festival en cancha."
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Fotos/Videos en Pausa</span>
                      <span className="sm:hidden">Multimedia 🔒</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPosting || (!message.trim() && !mediaPreview) || (!isTermsAccepted && !termsCheckbox)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPosting ? 'Publicando...' : 'Publicar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 💬 FEED DE PORRAS Y MENSAJES DE LAS FAMILIAS CON COMENTARIOS */}
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
              const isCommentsOpen = openCommentsPostId === post.id;
              const postComments = post.comments || [];

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

                    <div className="flex items-center gap-1.5 shrink-0">
                      {post.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Destacado</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Valor Humano IA</span>
                      </span>
                    </div>
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

                    <button
                      onClick={() => handleReaction(post.id, 'feature')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition-all cursor-pointer"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                      <span>Votar Destacado ({post.featuredVotes})</span>
                    </button>
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
        </div>
      )}

      {/* 🪟 MODAL DE NORMAS DE PUBLICACIÓN Y RESPONSABILIDAD FAMILIAR */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <h3 className="font-extrabold text-base sm:text-lg">
                  Normas de Convivencia y Publicación
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
                  <span>1. Espíritu Deportivo y Apoyo Positivo</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Las publicaciones deben celebrar el esfuerzo, compañerismo y respeto entre todas las 6 delegaciones escolares participantes.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <h5 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <span>2. Protección de la Niñez y Privacidad</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Las fotos y videos deben ser estrictamente del ámbito deportivo en cancha. Queda prohibida cualquier imagen o dato que vulnere la intimidad de los estudiantes menores de edad.
                </p>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <h5 className="font-bold text-rose-950 flex items-center gap-1.5 mb-1">
                  <span>3. Cero Tolerancia a la Agresividad</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Se prohíben descalificaciones, reclamos arbitrales ofensivos, lenguaje vulgar o agresiones entre barras. El comité organizador se reserva el derecho de retirar cualquier contenido inapropiado.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>4. Responsabilidad del Usuario</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  Cada usuario es responsable del contenido transmitido desde su dispositivo mediante el PIN de seguridad del festival.
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
                Comprendo y Acepto las Normas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
