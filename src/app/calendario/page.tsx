'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Camera,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Repeat,
  Sparkles,
} from 'lucide-react';

type JornadaFilter = 'all' | 'jornada2' | 'jornada3' | 'finales';
type SportFilter = 'all' | 'futbol' | 'voleibol' | 'baloncesto';

interface MatchupRow {
  label: string;
  homeSchoolId?: string;
  awaySchoolId?: string;
  subBlocks?: {
    time: string;
    venue: string;
    badge?: string;
  };
}

interface CategorySubgroup {
  categoryTitle?: string;
  matchups: MatchupRow[];
  time?: string;
  venue?: string;
  freeTeamsNote?: string;
}

interface ScheduleDayBlock {
  id: string;
  jornada: 'jornada2' | 'jornada3';
  sport: 'futbol' | 'voleibol' | 'baloncesto';
  sportIcon: string;
  isReposicion?: boolean;
  dayTitle: string;
  groups: CategorySubgroup[];
}

const NOVEMBER_SCHEDULE: ScheduleDayBlock[] = [
  // ==========================================
  // 📅 JORNADA 2 · 2 al 6 de noviembre
  // ==========================================
  {
    id: 'j2-lun-2',
    jornada: 'jornada2',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Lunes 2 · Fútbol femenino',
    groups: [
      {
        matchups: [
          {
            label: 'Triangular femenino',
          },
        ],
        time: '3:00 p. m.',
        venue: 'Cabo Velas',
      },
    ],
  },
  {
    id: 'j2-mar-3',
    jornada: 'jornada2',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Martes 3 · Fútbol categoría C',
    groups: [
      {
        matchups: [
          {
            label: 'CRIA vs. La Paz Tempisque',
            homeSchoolId: 'cria',
            awaySchoolId: 'la-paz-tempisque',
          },
          {
            label: 'La Paz Cabo Velas vs. Journey',
            homeSchoolId: 'la-paz-cabo-velas',
            awaySchoolId: 'journey-school',
          },
        ],
        time: '3:00 p. m.',
        venue: 'Brasilito',
      },
    ],
  },
  {
    id: 'j2-mie-4',
    jornada: 'jornada2',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Miércoles 4 · Fútbol categoría D',
    groups: [
      {
        matchups: [
          {
            label: 'CRIA vs. La Paz Tempisque',
            homeSchoolId: 'cria',
            awaySchoolId: 'la-paz-tempisque',
          },
        ],
        time: '1:00 p. m.',
        venue: 'CRIA',
      },
    ],
  },
  {
    id: 'j2-jue-5',
    jornada: 'jornada2',
    sport: 'voleibol',
    sportIcon: '🏐',
    dayTitle: 'Jueves 5 · Voleibol categoría C',
    groups: [
      {
        matchups: [
          {
            label: 'La Paz Tempisque vs. Educarte',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'educarte',
          },
        ],
        freeTeamsNote: 'Libre: Vittorino y La Paz Cabo Velas',
        time: '3:00 p. m.',
        venue: 'La Paz Tempisque o Educarte',
      },
    ],
  },
  {
    id: 'j2-vie-6',
    jornada: 'jornada2',
    sport: 'baloncesto',
    sportIcon: '🏀',
    dayTitle: 'Viernes 6 · Baloncesto',
    groups: [
      {
        categoryTitle: 'Categoría C',
        matchups: [
          {
            label: 'La Paz Cabo Velas vs. Educarte',
            homeSchoolId: 'la-paz-cabo-velas',
            awaySchoolId: 'educarte',
          },
        ],
        time: '2:00 p. m. o por definir',
        venue: 'La Arena, La Paz Cabo Velas o Educarte',
      },
      {
        categoryTitle: 'Categoría D',
        matchups: [
          {
            label: 'CRIA vs. Journey',
            homeSchoolId: 'cria',
            awaySchoolId: 'journey-school',
            subBlocks: {
              time: 'Por definir',
              venue: 'CRIA',
              badge: '✅ Ya reprogramado',
            },
          },
          {
            label: 'La Paz Cabo Velas vs. La Paz Tempisque',
            homeSchoolId: 'la-paz-cabo-velas',
            awaySchoolId: 'la-paz-tempisque',
            subBlocks: {
              time: '1:00 p. m.',
              venue: 'La Paz Tempisque',
            },
          },
        ],
      },
    ],
  },

  // ==========================================
  // 📅 JORNADA 3 · 16 al 20 de noviembre
  // ==========================================
  {
    id: 'j3-lun-16',
    jornada: 'jornada3',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Lunes 16 · Fútbol femenino',
    groups: [
      {
        matchups: [
          {
            label: 'Triangular femenino',
          },
        ],
        time: '3:00 p. m.',
        venue: 'La Paz Tempisque',
      },
    ],
  },
  {
    id: 'j3-mar-17',
    jornada: 'jornada3',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Martes 17 · Fútbol categoría C',
    groups: [
      {
        matchups: [
          {
            label: 'CRIA vs. Journey',
            homeSchoolId: 'cria',
            awaySchoolId: 'journey-school',
          },
          {
            label: 'CRIA vs. Vittorino',
            homeSchoolId: 'cria',
            awaySchoolId: 'vittorino',
          },
          {
            label: 'Journey vs. Vittorino',
            homeSchoolId: 'journey-school',
            awaySchoolId: 'vittorino',
          },
        ],
        time: '3:00 p. m.',
        venue: 'CRIA o Brasilito',
      },
    ],
  },
  {
    id: 'j3-mie-18',
    jornada: 'jornada3',
    sport: 'futbol',
    sportIcon: '⚽',
    dayTitle: 'Miércoles 18 · Fútbol categoría D',
    groups: [
      {
        matchups: [
          {
            label: 'La Paz Tempisque vs. La Paz Cabo Velas',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'la-paz-cabo-velas',
          },
        ],
        time: '1:00 p. m.',
        venue: 'La Paz Tempisque',
      },
    ],
  },
  {
    id: 'j3-jue-19-vol',
    jornada: 'jornada3',
    sport: 'voleibol',
    sportIcon: '🏐',
    dayTitle: 'Jueves 19 · Voleibol categoría C',
    groups: [
      {
        matchups: [
          {
            label: 'La Paz Tempisque vs. La Paz Cabo Velas',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'la-paz-cabo-velas',
          },
          {
            label: 'La Paz Tempisque vs. Vittorino',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'vittorino',
          },
          {
            label: 'Educarte vs. Vittorino',
            homeSchoolId: 'educarte',
            awaySchoolId: 'vittorino',
          },
        ],
        time: '3:00 p. m.',
        venue: 'La Arena, La Paz Cabo Velas',
      },
    ],
  },
  {
    id: 'j3-jue-19-rep',
    jornada: 'jornada3',
    sport: 'futbol',
    sportIcon: '🔁',
    isReposicion: true,
    dayTitle: 'Jueves 19 · REPOSICIÓN Fútbol categoría C',
    groups: [
      {
        matchups: [
          {
            label: 'La Paz Cabo Velas vs. Vittorino',
            homeSchoolId: 'la-paz-cabo-velas',
            awaySchoolId: 'vittorino',
          },
          {
            label: 'La Paz Tempisque vs. Vittorino',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'vittorino',
          },
        ],
        time: 'Por definir',
        venue: 'La Paz Tempisque',
      },
    ],
  },
  {
    id: 'j3-vie-20',
    jornada: 'jornada3',
    sport: 'baloncesto',
    sportIcon: '🏀',
    dayTitle: 'Viernes 20 · Baloncesto',
    groups: [
      {
        categoryTitle: 'Categoría C',
        matchups: [
          {
            label: 'La Paz Tempisque vs. Educarte',
            homeSchoolId: 'la-paz-tempisque',
            awaySchoolId: 'educarte',
          },
        ],
        time: 'Por definir',
        venue: 'La Paz Tempisque o Educarte',
      },
      {
        categoryTitle: 'Categoría D',
        matchups: [
          {
            label: 'CRIA vs. La Paz Tempisque (Reprogramar fecha)',
            homeSchoolId: 'cria',
            awaySchoolId: 'la-paz-tempisque',
            subBlocks: {
              time: 'Por definir',
              venue: 'CRIA',
            },
          },
          {
            label: 'La Paz Cabo Velas vs. Journey',
            homeSchoolId: 'la-paz-cabo-velas',
            awaySchoolId: 'journey-school',
            subBlocks: {
              time: '3:00 p. m.',
              venue: 'La Arena, La Paz Cabo Velas',
            },
          },
        ],
      },
    ],
  },
];

export default function CalendarioPage() {
  const [jornadaFilter, setJornadaFilter] = useState<JornadaFilter>('all');
  const [sportFilter, setSportFilter] = useState<SportFilter>('all');

  const filterBlock = (block: ScheduleDayBlock) => {
    if (sportFilter !== 'all' && block.sport !== sportFilter) return false;
    return true;
  };

  const jornada2Blocks = NOVEMBER_SCHEDULE.filter(
    (b) => b.jornada === 'jornada2' && filterBlock(b)
  );
  const jornada3Blocks = NOVEMBER_SCHEDULE.filter(
    (b) => b.jornada === 'jornada3' && filterBlock(b)
  );

  const renderDayCard = (block: ScheduleDayBlock) => {
    const isFutbol = block.sport === 'futbol';
    const isVoleibol = block.sport === 'voleibol';
    const isBaloncesto = block.sport === 'baloncesto';

    const borderAccent = block.isReposicion
      ? 'border-amber-300 border-t-4 border-t-amber-500'
      : isFutbol
      ? 'border-emerald-200 border-t-4 border-t-emerald-600'
      : isVoleibol
      ? 'border-sky-200 border-t-4 border-t-sky-600'
      : 'border-orange-200 border-t-4 border-t-orange-600';

    const headerBg = block.isReposicion
      ? 'bg-amber-50/90 text-amber-950 border-amber-200'
      : isFutbol
      ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200/80'
      : isVoleibol
      ? 'bg-sky-50/80 text-sky-950 border-sky-200/80'
      : 'bg-orange-50/80 text-orange-950 border-orange-200/80';

    return (
      <div
        key={block.id}
        className={`bg-white rounded-3xl border shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${borderAccent}`}
      >
        <div className="space-y-3.5">
          {/* Título del día y deporte */}
          <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${headerBg}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl leading-none select-none">{block.sportIcon}</span>
              <h3 className="font-black text-sm sm:text-base tracking-tight">
                {block.dayTitle}
              </h3>
            </div>
            {block.isReposicion && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10.5px] font-black shrink-0">
                <Repeat className="w-3 h-3" />
                Reposición
              </span>
            )}
          </div>

          {/* Grupos / Categorías dentro del día */}
          <div className="space-y-4">
            {block.groups.map((grp, gIdx) => (
              <div
                key={gIdx}
                className={`${
                  grp.categoryTitle
                    ? 'p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3'
                    : 'space-y-2.5'
                }`}
              >
                {grp.categoryTitle && (
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/80">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-300 font-black text-xs">
                      {grp.categoryTitle}
                    </span>
                  </div>
                )}

                {/* Lista de encuentros */}
                <div className="space-y-2">
                  {grp.matchups.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate-400 font-bold text-xs shrink-0">▫️</span>
                          {m.homeSchoolId && (
                            <SchoolEmblem schoolId={m.homeSchoolId} size="xs" showBorder={false} />
                          )}
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                            {m.label}
                          </span>
                        </div>
                        {m.awaySchoolId && (
                          <SchoolEmblem schoolId={m.awaySchoolId} size="xs" showBorder={false} />
                        )}
                      </div>

                      {/* Si el partido individual tiene su propio horario/sede (ej. Baloncesto Categoría D) */}
                      {m.subBlocks && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold ${
                              m.subBlocks.time.toLowerCase().includes('definir')
                                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                : 'bg-slate-900 text-white font-mono'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{m.subBlocks.time}</span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200/80">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{m.subBlocks.venue}</span>
                          </span>

                          {m.subBlocks.badge && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{m.subBlocks.badge.replace('✅ ', '')}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Equipos libres si aplica */}
                {grp.freeTeamsNote && (
                  <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs font-bold text-amber-950 flex items-center gap-2">
                    <span>🔸</span>
                    <span>{grp.freeTeamsNote}</span>
                  </div>
                )}

                {/* Hora y sede del grupo */}
                {(grp.time || grp.venue) && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    {grp.time && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold shadow-2xs ${
                          grp.time.toLowerCase().includes('definir')
                            ? 'bg-amber-50 text-amber-950 border border-amber-300'
                            : 'bg-slate-950 text-white font-mono'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{grp.time}</span>
                      </span>
                    )}

                    {grp.venue && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200/90">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{grp.venue}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 🏆 ENCABEZADO OFICIAL · PROGRAMACIÓN DEPORTIVA NOVIEMBRE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-950 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>🏆 LIGA DE LA COSTA DE ORO 2026 🏆</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 shrink-0" />
              <span>📋 PROGRAMACIÓN DEPORTIVA · NOVIEMBRE</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Calendario oficial de encuentros para la Jornada 2 (2 al 6 de noviembre), Jornada 3 (16 al 20 de noviembre) y Semana de Finales (23 al 27 de noviembre).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/marcadores"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs sm:text-sm font-extrabold transition-all shadow-2xs cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Tablas de posiciones</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mural"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs sm:text-sm font-bold border border-amber-300 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-700" />
              <span>Muro familiar</span>
            </Link>
          </div>
        </div>

        {/* Filtros rápidos de Jornada y Deporte */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Selector de Jornada */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '📅 Todo noviembre' },
              { id: 'jornada2', label: 'Jornada 2 (2 al 6 nov)' },
              { id: 'jornada3', label: 'Jornada 3 (16 al 20 nov)' },
              { id: 'finales', label: '🏆 Finales (23 al 27 nov)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setJornadaFilter(tab.id as JornadaFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  jornadaFilter === tab.id
                    ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Selector de Deporte */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Todos los deportes' },
              { id: 'futbol', label: '⚽ Fútbol' },
              { id: 'voleibol', label: '🏐 Voleibol' },
              { id: 'baloncesto', label: '🏀 Baloncesto' },
            ].map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSportFilter(sp.id as SportFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  sportFilter === sp.id
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📅 JORNADA 2 · 2 al 6 de noviembre */}
      {/* ========================================================= */}
      {(jornadaFilter === 'all' || jornadaFilter === 'jornada2') && (
        <section className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-amber-50/40 to-white border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-2xs">
                JORNADA 2
              </span>
              <div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  📅 JORNADA 2 · 2 al 6 de noviembre
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-white px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              Lunes 2 al Viernes 6 de noviembre
            </span>
          </div>

          {jornada2Blocks.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              No hay encuentros de este deporte en la Jornada 2.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jornada2Blocks.map(renderDayCard)}
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* 📅 JORNADA 3 · 16 al 20 de noviembre */}
      {/* ========================================================= */}
      {(jornadaFilter === 'all' || jornadaFilter === 'jornada3') && (
        <section className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-amber-50/40 to-white border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-purple-700 text-white font-black text-xs sm:text-sm shadow-2xs">
                JORNADA 3
              </span>
              <div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  📅 JORNADA 3 · 16 al 20 de noviembre
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-900 bg-white px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
              Lunes 16 al Viernes 20 de noviembre
            </span>
          </div>

          {jornada3Blocks.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              No hay encuentros de este deporte en la Jornada 3.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jornada3Blocks.map(renderDayCard)}
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* 🏆 FINALES · 23 al 27 de noviembre */}
      {/* ========================================================= */}
      {(jornadaFilter === 'all' || jornadaFilter === 'finales') && (
        <section className="space-y-4">
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50/60 to-emerald-50/50 border-2 border-amber-300 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xs shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[11px] font-black">
                    SEMANA DE CIERRE Y CAMPEONATO
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                    🏆 FINALES · 23 al 27 de noviembre
                  </h2>
                </div>
              </div>
            </div>

            {/* Nota oficial de confirmación */}
            <div className="p-4 rounded-2xl bg-white/95 border border-amber-300/90 flex items-start gap-3 text-xs sm:text-sm text-slate-800 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="font-bold text-slate-900">
                  ⚠️ Pendiente de confirmar: horarios y sedes indicados como &ldquo;por definir&rdquo;, así como las canchas alternativas de algunas jornadas.
                </p>
                <p className="font-black text-amber-900 text-sm sm:text-base">
                  ¡Nos vemos en la cancha! 💪
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


