'use client';

import React, { useState, useMemo } from 'react';
import { SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const { matches } = useTournament();
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

  // Curaduría de 2 fotos + 1 video por fecha seleccionada
  const curatedMedia: EmotionalMediaItem[] = useMemo(() => {
    if (sport === 'futbol') {
      return [
        {
          id: 'fut-p1',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          pillar: 'esfuerzo',
          pillarLabel: 'Esfuerzo y Superación',
          pillarEmoji: '💪',
          caption: 'Entrega total en la recuperación del balón. Cada jugada se defiende con el corazón.',
          author: 'Familia Ramírez (La Paz Community School Cabo Velas)',
          schoolName: 'La Paz Community School Cabo Velas',
        },
        {
          id: 'fut-p2',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=1200&q=80',
          pillar: 'companerismo',
          pillarLabel: 'Compañerismo y Respeto',
          pillarEmoji: '🤝',
          caption: 'Mano amiga para levantar al compañero tras una barrida limpia. El valor del juego limpio.',
          author: 'Familia Monge (CRIA)',
          schoolName: 'CRIA',
        },
        {
          id: 'fut-v1',
          type: 'video',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-boys-playing-soccer-in-a-field-41674-large.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
          pillar: 'resiliencia',
          pillarLabel: 'Momento Inspirador del Día',
          pillarEmoji: '✨',
          caption: 'Abrazo fraternal de ambos equipos al silbatazo final. La verdadera victoria es crecer juntos.',
          author: 'Comité de Convivencia Costa de Oro',
          schoolName: 'Liga Costa de Oro',
        },
      ];
    } else if (sport === 'voleibol') {
      return [
        {
          id: 'vol-p1',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
          pillar: 'companerismo',
          pillarLabel: 'Unión y Comunicación',
          pillarEmoji: '🙌',
          caption: 'Celebración sincronizada punto a punto. La confianza mutua construye la victoria.',
          author: 'Familia Alvarado (Educarte)',
          schoolName: 'Educarte',
        },
        {
          id: 'vol-p2',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80',
          pillar: 'esfuerzo',
          pillarLabel: 'Persistencia Defensiva',
          pillarEmoji: '🔥',
          caption: 'Salvada milagrosa al límite de la red. No dar ningún balón por perdido jamás.',
          author: 'Familia Salazar (Journey)',
          schoolName: 'The Journey School',
        },
        {
          id: 'vol-v1',
          type: 'video',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-volleyball-players-celebrating-a-point-41712-large.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80',
          pillar: 'resiliencia',
          pillarLabel: 'Momento Inspirador del Día',
          pillarEmoji: '⭐',
          caption: 'Reacción emotiva de toda la banca apoyando en el punto decisivo del 3.er set.',
          author: 'Comité Audiovisual',
          schoolName: 'Liga Costa de Oro',
        },
      ];
    } else {
      // Baloncesto
      return [
        {
          id: 'bas-p1',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
          pillar: 'fairplay',
          pillarLabel: 'Juego Limpio y Disciplina',
          pillarEmoji: '🏀',
          caption: 'Respeto mutuo y choque de puños entre capitanes antes del salto inicial.',
          author: 'Familia Cordero (Vittorino)',
          schoolName: 'Vittorino Prep',
        },
        {
          id: 'bas-p2',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          pillar: 'esfuerzo',
          pillarLabel: 'Dedicación y Concentración',
          pillarEmoji: '🎯',
          caption: 'Máxima concentración en el tiro libre en los segundos finales del 4.º cuarto.',
          author: 'Familia Vargas (La Paz Community School Tempisque)',
          schoolName: 'La Paz Community School Tempisque',
        },
        {
          id: 'bas-v1',
          type: 'video',
          url: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-scoring-a-basket-41708-large.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
          pillar: 'resiliencia',
          pillarLabel: 'Momento Inspirador del Día',
          pillarEmoji: '🏆',
          caption: 'Canasta compartida con aplauso unánime de las familias en las graderías.',
          author: 'Comunidad Costa de Oro',
          schoolName: 'Liga Costa de Oro',
        },
      ];
    }
  }, [sport]);

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

      {/* ✨ ESTADO 3: CÁPSULA DESBLOQUEADA (2 FOTOS + 1 VIDEO) */}
      {!isCanceledOrEmpty && isUnlockedByTime && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 sm:gap-5 animate-fade-in">
          {/* Foto 1 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col group hover:shadow-md transition-shadow">
            <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={curatedMedia[0].url}
                alt={curatedMedia[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-300 font-extrabold text-[10px] flex items-center gap-1 border border-amber-500/30 shadow-xs">
                <span>{curatedMedia[0].pillarEmoji}</span>
                <span>{curatedMedia[0].pillarLabel}</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-700 font-medium leading-snug">
                &ldquo;{curatedMedia[0].caption}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[10.5px] text-slate-500 border-t border-slate-200/60">
                <span className="font-semibold text-slate-800">{curatedMedia[0].schoolName}</span>
                <span>{curatedMedia[0].author}</span>
              </div>
            </div>
          </div>

          {/* Foto 2 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col group hover:shadow-md transition-shadow">
            <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={curatedMedia[1].url}
                alt={curatedMedia[1].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-300 font-extrabold text-[10px] flex items-center gap-1 border border-amber-500/30 shadow-xs">
                <span>{curatedMedia[1].pillarEmoji}</span>
                <span>{curatedMedia[1].pillarLabel}</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-700 font-medium leading-snug">
                &ldquo;{curatedMedia[1].caption}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[10.5px] text-slate-500 border-t border-slate-200/60">
                <span className="font-semibold text-slate-800">{curatedMedia[1].schoolName}</span>
                <span>{curatedMedia[1].author}</span>
              </div>
            </div>
          </div>

          {/* Video Destacado */}
          <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-md flex flex-col group">
            <div className="relative aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
              <video
                src={curatedMedia[2].url}
                poster={curatedMedia[2].posterUrl}
                playsInline
                webkit-playsinline="true"
                muted
                autoPlay
                loop
                crossOrigin="anonymous"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-xs">
                <Film className="w-3 h-3" />
                <span>{curatedMedia[2].pillarLabel}</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-200 font-medium leading-snug">
                &ldquo;{curatedMedia[2].caption}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[10.5px] text-slate-400 border-t border-slate-800">
                <span className="font-semibold text-amber-300">{curatedMedia[2].schoolName}</span>
                <span>{curatedMedia[2].author}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
