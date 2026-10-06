'use client';

import React, { useState, useMemo } from 'react';
import { SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
  Sparkles, 
  Clock, 
  Film, 
  Heart, 
  Calendar, 
  ShieldAlert, 
  EyeOff, 
  Award, 
  Smile, 
  Flame, 
  Play,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatDateCostaRica } from '@/lib/utils';

interface DailyEmotionalMediaCapsuleProps {
  sport: SportType;
}

interface EmotionalMediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  posterUrl?: string;
  pillar: 'esfuerzo' | 'companerismo' | 'resiliencia' | 'fairplay';
  pillarLabel: string;
  pillarEmoji: string;
  caption: string;
  author: string;
  schoolId?: string;
  schoolName?: string;
}

export function DailyEmotionalMediaCapsule({ sport }: DailyEmotionalMediaCapsuleProps) {
  const { matches, photos, videos, getSchoolById } = useTournament();
  const { t } = useLanguage();

  // Fechas oficiales de la disciplina
  const sportMatches = useMemo(() => {
    return matches.filter((m) => m.sport === sport);
  }, [matches, sport]);

  // Lista de fechas únicas disponibles para este deporte
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(sportMatches.map((m) => m.date)));
    return dates.sort();
  }, [sportMatches]);

  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || '2026-10-05');

  // Partidos de la fecha seleccionada
  const matchesOnDate = useMemo(() => {
    return sportMatches.filter((m) => m.date === selectedDate);
  }, [sportMatches, selectedDate]);

  // Verificación del estado de la jornada:
  // 1. ¿Está cancelada o no se disputó?
  const isCanceledOrEmpty = useMemo(() => {
    if (matchesOnDate.length === 0) return true;
    const allCanceled = matchesOnDate.every((m) => (m as any).status === 'canceled');
    return allCanceled;
  }, [matchesOnDate]);

  // 2. Control horario: Se visualiza a partir de las 10:00 PM (22:00) de la fecha de la jornada
  const isUnlockedByTime = useMemo(() => {
    if (isCanceledOrEmpty) return false;
    
    // Validar fecha y hora actual en Costa Rica
    const now = new Date();
    // Parsear fecha seleccionada YYYY-MM-DD
    const [year, month, day] = selectedDate.split('-').map(Number);
    if (!year || !month || !day) return true;

    const unlockTime = new Date(year, month - 1, day, 22, 0, 0); // 10:00 PM de la fecha de la jornada
    
    // Si la fecha actual es posterior al día del torneo o ya pasaron las 10:00 PM de ese día:
    return now >= unlockTime;
  }, [selectedDate, isCanceledOrEmpty]);

  // Curaduría dinámica de 2 fotos + 1 video por fecha seleccionada
  const curatedMedia: EmotionalMediaItem[] = useMemo(() => {
    // Buscar fotos reales del torneo para este deporte o fecha
    const sportPhotos = photos.filter((p) => {
      const matchDate = p.date === selectedDate;
      const matchSport = p.tags?.includes(sport) || p.tags?.includes('festival2026');
      return matchDate || matchSport;
    });

    // Buscar videos reales para este deporte o fecha
    const sportVideos = videos.filter((v) => {
      return v.schoolId || v.matchId;
    });

    const fallbackPillars: { pillar: EmotionalMediaItem['pillar']; label: string; emoji: string }[] = [
      { pillar: 'esfuerzo', label: 'Esfuerzo y Superación', emoji: '💪' },
      { pillar: 'companerismo', label: 'Compañerismo y Respeto', emoji: '🤝' },
      { pillar: 'fairplay', label: 'Juego Limpio y Fair Play', emoji: '🏆' },
    ];

    const result: EmotionalMediaItem[] = [];

    // Solo incorporar fotos reales cargadas en el sistema
    sportPhotos.slice(0, 2).forEach((p, idx) => {
      const school = getSchoolById(p.schoolId || '');
      result.push({
        id: p.id,
        type: 'photo',
        url: p.imageUrl,
        pillar: idx === 0 ? 'esfuerzo' : 'companerismo',
        pillarLabel: idx === 0 ? 'Esfuerzo y Superación' : 'Compañerismo y Respeto',
        pillarEmoji: idx === 0 ? '💪' : '🤝',
        caption: p.title || 'Entrega total en la cancha. Cada jugada se defiende con el corazón.',
        author: p.photographer || 'Comunidad Costa de Oro',
        schoolName: school?.name || 'Comunidad Escolar',
      });
    });

    // Solo incorporar videos reales cargados en el sistema
    sportVideos.slice(0, 1).forEach((v) => {
      const school = getSchoolById(v.schoolId || '');
      result.push({
        id: v.id,
        type: 'video',
        url: v.videoUrl,
        posterUrl: v.thumbnailUrl,
        pillar: 'resiliencia',
        pillarLabel: 'Momento Inspirador del Día',
        pillarEmoji: '✨',
        caption: v.title || 'Celebración fraternal de ambos equipos al silbatazo final.',
        author: v.authorName || 'Comunidad Costa de Oro',
        schoolName: school?.name || 'Liga Costa de Oro',
      });
    });

    return result;
  }, [sport, photos, videos, selectedDate, getSchoolById]);

  const sportName = sport === 'futbol' ? 'Fútbol' : sport === 'voleibol' ? 'Voleibol' : 'Baloncesto';
  const sportEmoji = sport === 'futbol' ? '⚽' : sport === 'voleibol' ? '🏐' : '🏀';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
      
      {/* 🏷️ CABECERA DE LA CÁPSULA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/30 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('capsule.badge')}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <span>{sportEmoji}</span>
              <span>{sportName}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t('capsule.title')}
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl">
            {t('capsule.subtitle')}
          </p>
        </div>

        {/* 📅 SELECTOR DE FECHAS DE LA JORNADA */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('capsule.dateLabel')}:</span>
          </span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
          >
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {formatDateCostaRica(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ⚠️ ESTADO 1: JORNADA CANCELADA O SIN ENCUENTROS */}
      {isCanceledOrEmpty && (
        <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-600">
            <EyeOff className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
              {t('capsule.unavailableTitle')}
            </h4>
            <p className="text-xs text-slate-500">
              {t('capsule.unavailableMessage')}
            </p>
          </div>
        </div>
      )}

      {/* ⏳ ESTADO 2: BLOQUEO HORARIO (ANTES DE LAS 10:00 PM) */}
      {!isCanceledOrEmpty && !isUnlockedByTime && (
        <div className="py-12 px-6 rounded-2xl bg-gradient-to-br from-amber-50/50 via-slate-50 to-white border border-amber-200/80 text-center flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-bold text-[10.5px]">
              {t('capsule.lockedBadge')}
            </span>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {t('capsule.lockedTitle')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('capsule.lockedMessage')}
            </p>
          </div>
        </div>
      )}

      {/* ✨ ESTADO 3: CÁPSULA DESBLOQUEADA (SI HAY FOTOS O VIDEOS REALES) */}
      {!isCanceledOrEmpty && isUnlockedByTime && (
        <>
          {curatedMedia.length === 0 ? (
            <div className="py-10 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-amber-50/60 via-slate-50 to-white border-2 border-dashed border-amber-300 text-center flex flex-col items-center justify-center gap-4 animate-fade-in shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-xs">
                📸
              </div>
              <div className="space-y-1.5 max-w-lg">
                <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 font-extrabold text-[11px] uppercase tracking-wider">
                  ¡Sé parte de la memoria del evento!
                </span>
                <h4 className="font-black text-slate-900 text-base sm:text-lg">
                  Aún no hay fotos o videos compartidos para esta jornada
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Te invitamos a capturar y publicar en el <strong>Muro Familiar</strong> los momentos de emoción, esfuerzo y compañerismo de nuestros atletas. ¡Comparte tus fotos, videos y mensajes de aliento!
                </p>
              </div>
              <Link
                href="/mural"
                className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Compartir fotos, videos y textos en el Muro</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 sm:gap-5 animate-fade-in">
              {curatedMedia.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border overflow-hidden shadow-2xs flex flex-col group hover:shadow-md transition-shadow ${
                    item.type === 'video' ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="relative aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
                    {item.type === 'photo' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={item.url}
                        poster={item.posterUrl}
                        playsInline
                        webkit-playsinline="true"
                        muted
                        autoPlay
                        loop
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-300 font-extrabold text-[10px] flex items-center gap-1 border border-amber-500/30 shadow-xs">
                      {item.type === 'video' ? <Film className="w-3 h-3" /> : <span>{item.pillarEmoji}</span>}
                      <span>{item.pillarLabel}</span>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                    <p className={`text-xs font-medium leading-snug ${item.type === 'video' ? 'text-slate-200' : 'text-slate-700'}`}>
                      &ldquo;{item.caption}&rdquo;
                    </p>
                    <div className={`pt-2 flex items-center justify-between text-[10.5px] border-t ${
                      item.type === 'video' ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200/60'
                    }`}>
                      <span className={`font-semibold ${item.type === 'video' ? 'text-amber-300' : 'text-slate-800'}`}>
                        {item.schoolName}
                      </span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
