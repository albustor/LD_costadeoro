'use client';

import React, { useState, useMemo } from 'react';
import { Match, PhotoItem, ShortVideo } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useTier } from '@/context/TierContext';
import { formatDateCostaRica } from '@/lib/utils';
import { 
  X, 
  MapPin, 
  Clock, 
  Award, 
  Flame, 
  CheckCircle2, 
  Film, 
  Sparkles,
  Users,
  FileText,
  Camera,
  Download,
  Eye,
  Play,
  Heart,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { SchoolEmblem } from './SchoolEmblem';
import { OfficialMatchSheet } from './OfficialMatchSheet';
import { PinchZoomPhotoModal } from '@/components/media/PinchZoomPhotoModal';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
}

interface AiEmotionalAnalysis {
  badge: string;
  humanValue: string;
  summary: string;
  highlight: string;
  provider?: string;
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const { getSchoolById, getCategoryById, photos, videos } = useTournament();
  const { isFeatureEnabled } = useTier();
  const [showOfficialSheet, setShowOfficialSheet] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);

  // Estado del Curador Emocional IA
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiEmotionalAnalysis | null>(null);

  // Local state for MVP voting
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
    home: 42,
    away: 35,
  });

  if (!match) return null;

  const home = getSchoolById(match.homeTeamId);
  const away = getSchoolById(match.awayTeamId);
  const category = getCategoryById(match.categoryId);
  const isLive = match.status === 'live';

  // Filtrado de fotos asociadas al encuentro
  const matchPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchSchool = p.schoolId === match.homeTeamId || p.schoolId === match.awayTeamId;
      const matchTag = p.tags?.includes(match.id) || p.tags?.includes(match.sport);
      return matchSchool || matchTag;
    });
  }, [photos, match]);

  // Filtrado de videos asociados al encuentro
  const matchVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchSchool = v.schoolId === match.homeTeamId || v.schoolId === match.awayTeamId;
      const matchIdDirect = v.matchId === match.id;
      return matchSchool || matchIdDirect;
    });
  }, [videos, match]);

  // Generar curaduría de valor humano mediante IA
  const handleGenerateAiCuration = async () => {
    setIsAnalyzingAi(true);
    try {
      const res = await fetch('/api/ai/curador-emocional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: `${home?.name} vs ${away?.name}`,
          sport: `${match.sport.toUpperCase()} - ${category?.name || 'Festival'}`,
          author: 'Mesa Técnica Costa de Oro',
          moment: match.jornadaName,
          matchNotes: match.notes || `Partido disputado con gran entrega en ${match.venue}. Marcador ${match.homeScore}-${match.awayScore}.`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAiAnalysis(json.data);
        }
      }
    } catch (err) {
      console.warn('Error al invocar Curador Emocional IA:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleVote = (side: 'home' | 'away') => {
    if (votedPlayer) return;
    setVotedPlayer(side);
    setVoteCounts((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
  };

  const totalVotes = voteCounts.home + voteCounts.away;
  const homePct = Math.round((voteCounts.home / totalVotes) * 100);
  const awayPct = 100 - homePct;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {category?.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">{match.jornadaName}</span>
          </div>

          {/* Big Scoreboard Box */}
          <div className="grid grid-cols-7 items-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-200 p-4">
            {/* Home */}
            <div className="col-span-3 flex flex-col items-center text-center gap-2 min-w-0">
              <SchoolEmblem schoolId={home?.id || ''} size="lg" />
              <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {home?.name}
              </span>
              <span className="text-[11px] text-slate-500">{home?.city}</span>
            </div>

            {/* Score */}
            <div className="col-span-1 text-center">
              {match.status === 'scheduled' ? (
                <div className="text-xs font-bold text-slate-600 bg-white py-1.5 px-2 rounded-lg border border-slate-200 shadow-sm">
                  {match.time}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-wider block">
                    {match.homeScore} : {match.awayScore}
                  </span>
                  {isLive && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      {match.currentPeriod}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away */}
            <div className="col-span-3 flex flex-col items-center text-center gap-2 min-w-0">
              <SchoolEmblem schoolId={away?.id || ''} size="lg" />
              <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {away?.name}
              </span>
              <span className="text-[11px] text-slate-500">{away?.city}</span>
            </div>
          </div>

          {/* Volleyball Sets Breakdown */}
          {match.sport === 'voleibol' && match.setScores && (
            <div className="py-2 px-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2.5 text-xs text-slate-700 shadow-sm">
              <span className="font-semibold text-amber-700">Desglose de Sets:</span>
              {match.setScores.map((set, idx) => (
                <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200 text-[11px]">
                  Set {idx + 1}: {set.home} - {set.away}
                </span>
              ))}
            </div>
          )}

          {/* Venue & Date Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateCostaRica(match.date)} a las {match.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {match.venue}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* 🌟 SECCIÓN 1: CURADOR EMOCIONAL IA */}
          <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-4.5 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Curador Emocional IA del Partido
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Detección de valores formativos (Fair Play, Superación y Convivencia)
                  </p>
                </div>
              </div>

              {!aiAnalysis && (
                <button
                  type="button"
                  disabled={isAnalyzingAi}
                  onClick={handleGenerateAiCuration}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  {isAnalyzingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analizando con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analizar Momento Emotivo</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {aiAnalysis && (
              <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10.5px] border border-amber-300">
                    ⭐ {aiAnalysis.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Valor: {aiAnalysis.humanValue}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-snug font-medium">
                  &ldquo;{aiAnalysis.summary}&rdquo;
                </p>
                <div className="pt-1 text-[11px] text-amber-800 font-bold border-t border-amber-100 flex items-center gap-1">
                  <span>💡</span>
                  <span>{aiAnalysis.highlight}</span>
                </div>
              </div>
            )}
          </div>

          {/* 📸 SECCIÓN 2: GALERÍA ESPECÍFICA DEL ENCUENTRO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Galería & Momentos de este Encuentro ({matchPhotos.length + matchVideos.length})
                </h4>
              </div>
              <Link
                href="/galeria"
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Ver Galería Completa →
              </Link>
            </div>

            {matchPhotos.length === 0 && matchVideos.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <p className="text-xs text-slate-600 font-medium">
                  Aún no hay fotos o videos vinculados a este partido.
                </p>
                <p className="text-[11px] text-slate-400">
                  Las fotos tomadas por la mesa técnica y familias durante el juego se mostrarán aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Fotos vinculadas */}
                {matchPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-amber-500 cursor-pointer transition shadow-2xs"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition font-bold flex items-center justify-between">
                      <span className="truncate">{photo.title}</span>
                      <Eye className="w-3 h-3 shrink-0" />
                    </div>
                  </div>
                ))}

                {/* Videos vinculados */}
                {matchVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-slate-800 hover:border-amber-500 cursor-pointer transition shadow-2xs"
                  >
                    {vid.thumbnailUrl && !vid.thumbnailUrl.endsWith('.mp4') ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <video src={vid.videoUrl} muted playsInline className="w-full h-full object-cover opacity-70" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white text-[10px] truncate font-bold bg-black/60 px-1.5 py-0.5 rounded">
                      {vid.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Match Commentary / Notes */}
          {match.notes && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                Reseña Oficial del Encuentro
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{match.notes}</p>
            </div>
          )}

          {/* Official MVP Award */}
          {match.mvpPlayerName && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Jugador Más Valioso Oficial
                </span>
                <span className="text-sm font-extrabold text-slate-900">{match.mvpPlayerName}</span>
              </div>
            </div>
          )}

          {/* Community MVP Fan Voting */}
          {isFeatureEnabled('communityMVPVoting') && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Votación Popular en Vivo de la Afición
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {totalVotes} votos registrados
                </span>
              </div>

              {votedPlayer ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      {home?.logo} {home?.shortName} ({homePct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      ({awayPct}%) {away?.shortName} {away?.logo}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${homePct}%` }}
                      className="bg-amber-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${awayPct}%` }}
                      className="bg-sky-500 transition-all duration-500"
                    />
                  </div>

                  <p className="text-center text-[11px] text-emerald-700 font-medium">
                    ¡Gracias por apoyar a tu institución favorita!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVote('home')}
                    className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
                  >
                    <span className="text-xl block mb-1">{home?.logo}</span>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
                      Votar por {home?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-500">Rendimiento Destacado</span>
                  </button>

                  <button
                    onClick={() => handleVote('away')}
                    className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
                  >
                    <span className="text-xl block mb-1">{away?.logo}</span>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
                      Votar por {away?.shortName}
                    </span>
                    <span className="text-[10px] text-slate-500">Rendimiento Destacado</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 📄 Botón para Abrir el Acta Oficial */}
          <div className="pt-2 border-t border-slate-200 flex justify-center">
            <button
              onClick={() => setShowOfficialSheet(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Acta Oficial de Encuentro (PDF / Imprimir)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Acta Oficial */}
      {showOfficialSheet && (
        <OfficialMatchSheet match={match} onClose={() => setShowOfficialSheet(false)} />
      )}

      {/* Lightbox para Foto Seleccionada */}
      {selectedPhoto && (
        <PinchZoomPhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Player Modal para Video Seleccionado */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[9/16] bg-black">
              <video src={activeVideo.videoUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <h3 className="text-xs font-bold text-white">{activeVideo.title}</h3>
              <p className="text-[10px] text-amber-400 mt-0.5">{activeVideo.authorName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
