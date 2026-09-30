'use client';

import React, { useState } from 'react';
import { Category, Match, School, Standing } from '@/types/tournament';
import { SchoolEmblem } from './SchoolEmblem';
import { SportIconRenderer } from './SportGraphicIcons';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Flame, 
  CheckCircle2, 
  Hourglass, 
  ChevronRight, 
  X,
  Sparkles,
  Lock,
  AlertCircle,
  Bell
} from 'lucide-react';

interface CustomSport {
  id: string;
  name: string;
  color: string;
  accent: string;
  lightBg: string;
  badgeText?: string;
  isLocked?: boolean;
  lockedMessage?: string;
  location?: string;
}

interface SportScheduleViewProps {
  categories: Category[];
  matches: Match[];
  schools: School[];
  getStandingsForCategory: (categoryId: string) => Standing[];
}

export function SportScheduleView({
  categories,
  matches,
  schools,
  getStandingsForCategory,
}: SportScheduleViewProps) {
  const [selectedSport, setSelectedSport] = useState<string>('futbol');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customSports, setCustomSports] = useState<CustomSport[]>([]);
  const [newSportName, setNewSportName] = useState<string>('');
  const [newSportColor, setNewSportColor] = useState<string>('#6366F1');

  // Base Sports Configuration (Activos)
  const baseSports: CustomSport[] = [
    {
      id: 'futbol',
      name: 'Fútbol',
      color: '#16A34A',
      accent: '#22C55E',
      lightBg: '#F0FDF4',
      badgeText: 'Fútbol 7 & 11',
      isLocked: false,
    },
    {
      id: 'voleibol',
      name: 'Voleibol',
      color: '#0284C7',
      accent: '#38BDF8',
      lightBg: '#F0F9FF',
      badgeText: 'Gimnasio techado',
      isLocked: false,
    },
    {
      id: 'baloncesto',
      name: 'Baloncesto',
      color: '#EA580C',
      accent: '#FB923C',
      lightBg: '#FFF7ED',
      badgeText: 'Cancha multiuso',
      isLocked: false,
    },
  ];

  // Locked Upcoming Sports (Surfing, Ajedrez, Atletismo, Natación)
  const upcomingLockedSports: CustomSport[] = [
    {
      id: 'surfing',
      name: 'Surfing',
      color: '#0284C7',
      accent: '#38BDF8',
      lightBg: '#F0F9FF',
      isLocked: true,
      lockedMessage: 'Esta modalidad deportiva se habilitará posteriormente para las fases especiales y exhibiciones de olas de la Liga Costa de Oro.',
      location: 'Playa Tamarindo / Playa Grande',
    },
    {
      id: 'ajedrez',
      name: 'Ajedrez',
      color: '#475569',
      accent: '#64748B',
      lightBg: '#F8FAFC',
      isLocked: true,
      lockedMessage: 'Torneo de ajedrez rápido y clásico intercolegial. Se habilitará en la siguiente fase del festival.',
      location: 'Salón multiuso campus Tempisque',
    },
    {
      id: 'atletismo',
      name: 'Atletismo de playa',
      color: '#CA8A04',
      accent: '#EAB308',
      lightBg: '#FEFCE8',
      isLocked: true,
      lockedMessage: 'Pruebas de velocidad, relevos y resistencia en arena. Calendario en fase de coordinación.',
      location: 'Playa Brasilito / Conchal',
    },
    {
      id: 'natacion',
      name: 'Natación en aguas abiertas',
      color: '#0D9488',
      accent: '#14B8A6',
      lightBg: '#F0FDFA',
      isLocked: true,
      lockedMessage: 'Circuito de travesía y natación costera formativa. Próximamente disponible.',
      location: 'Bahía Flamingo',
    },
  ];

  const allSports: CustomSport[] = [
    ...baseSports,
    ...upcomingLockedSports,
    ...customSports.map((cs) => ({
      id: cs.id,
      name: cs.name,
      color: cs.color,
      accent: cs.accent,
      lightBg: cs.lightBg,
      badgeText: 'Nueva modalidad',
      isLocked: cs.isLocked ?? false,
      lockedMessage: cs.lockedMessage,
      location: cs.location,
    })),
  ];

  const currentSportConfig = allSports.find((s) => s.id === selectedSport) || allSports[0];

  // Filtrar categorías del deporte actual
  const sportCategories = categories.filter(
    (c) => c.sport === selectedSport || c.name.toLowerCase().includes(selectedSport)
  );

  // Filtrar partidos del deporte actual
  const sportMatches = matches.filter(
    (m) => m.sport === selectedSport || sportCategories.some((c) => c.id === m.categoryId)
  );

  // Handler para agregar nueva modalidad deportiva
  const handleAddCustomSport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSportName.trim()) return;

    const id = newSportName.toLowerCase().replace(/\s+/g, '-');
    const newSport: CustomSport = {
      id,
      name: newSportName.trim(),
      color: newSportColor,
      accent: newSportColor,
      lightBg: '#F8FAFC',
      isLocked: false,
    };

    setCustomSports((prev) => [...prev, newSport]);
    setSelectedSport(id);
    setNewSportName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 🏅 SELECTOR DE DISCIPLINAS: ACTIVAS + PRÓXIMAS CON CANDADO (🔒) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Disciplinas y modalidades deportivas:
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Agregar deporte</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          {allSports.map((sport) => {
            const isSelected = selectedSport === sport.id;
            const isLocked = sport.isLocked;

            // Colores activos específicos por deporte
            const activeSportStyle = 
              sport.id === 'futbol'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                : sport.id === 'voleibol'
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                : sport.id === 'baloncesto'
                ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-300'
                : isLocked
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300';

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? activeSportStyle
                    : isLocked
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-white/50 bg-slate-200/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <SportIconRenderer sportId={sport.id} size={20} />
                <span>{sport.name}</span>
                {isLocked && (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-800/10 text-slate-600 text-[10px] font-black flex items-center gap-0.5">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔒 SI ES UN DEPORTE BLOQUEADO / PRÓXIMO A HABILITARSE */}
      {currentSportConfig.isLocked ? (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700 shadow-lg space-y-5 animate-fade-in relative overflow-hidden">
          {/* Gráfico deportivo grande semitransparente de fondo */}
          <div className="absolute right-4 -bottom-4 opacity-10 pointer-events-none">
            <SportIconRenderer sportId={currentSportConfig.id} size={200} />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Se habilitará posteriormente • Próxima fase</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <SportIconRenderer sportId={currentSportConfig.id} size={36} />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  Modalidad de {currentSportConfig.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {currentSportConfig.lockedMessage}
                </p>
              </div>
            </div>

            {currentSportConfig.location && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Sede prevista: <strong>{currentSportConfig.location}</strong></span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Aviso para familias y delegaciones:</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                El comité organizador de La Paz Community School y los colegios participantes publicarán las convocatorias, instructivos técnicos y horarios de competencia una vez concluida la primera fase de los 4 festivales base.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ⚽ SI ES UN DEPORTE ACTIVO (FÚTBOL, VOLEIBOL, BALONCESTO) */
        <div className="space-y-6 animate-fade-in">
          {/* 📅 PRESENTADO ARRIBA: CALENDARIO Y HORARIOS DEL DEPORTE CON ENFASIS CROMÁTICO */}
          {(() => {
            const isFutbol = selectedSport === 'futbol';
            const isVoleibol = selectedSport === 'voleibol';
            const isBaloncesto = selectedSport === 'baloncesto';

            const sportThemeClasses = isFutbol
              ? {
                  cardHeaderBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
                  iconText: 'text-emerald-700',
                  clockColor: 'text-emerald-600',
                  accentBorder: 'border-emerald-200 hover:border-emerald-400',
                  accentTopBorder: 'border-t-4 border-t-emerald-600',
                  badgeCategory: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  venueNoticeBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
                  vsPill: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200',
                  scoreBox: 'bg-emerald-900 text-white',
                }
              : isVoleibol
              ? {
                  cardHeaderBg: 'bg-sky-50/70 border-sky-200 text-sky-900',
                  iconText: 'text-sky-700',
                  clockColor: 'text-sky-600',
                  accentBorder: 'border-sky-200 hover:border-sky-400',
                  accentTopBorder: 'border-t-4 border-t-sky-600',
                  badgeCategory: 'bg-sky-50 text-sky-800 border-sky-200',
                  venueNoticeBg: 'bg-sky-50/80 border-sky-200 text-sky-950',
                  vsPill: 'bg-sky-100/70 text-sky-800 border border-sky-200',
                  scoreBox: 'bg-sky-900 text-white',
                }
              : isBaloncesto
              ? {
                  cardHeaderBg: 'bg-orange-50/70 border-orange-200 text-orange-900',
                  iconText: 'text-orange-700',
                  clockColor: 'text-orange-600',
                  accentBorder: 'border-orange-200 hover:border-orange-400',
                  accentTopBorder: 'border-t-4 border-t-orange-600',
                  badgeCategory: 'bg-orange-50 text-orange-800 border-orange-200',
                  venueNoticeBg: 'bg-orange-50/80 border-orange-200 text-orange-950',
                  vsPill: 'bg-orange-100/70 text-orange-800 border border-orange-200',
                  scoreBox: 'bg-orange-900 text-white',
                }
              : {
                  cardHeaderBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-900',
                  iconText: 'text-indigo-700',
                  clockColor: 'text-indigo-600',
                  accentBorder: 'border-indigo-200 hover:border-indigo-400',
                  accentTopBorder: 'border-t-4 border-t-indigo-600',
                  badgeCategory: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                  venueNoticeBg: 'bg-indigo-50/80 border-indigo-200 text-indigo-950',
                  vsPill: 'bg-indigo-100/70 text-indigo-800 border border-indigo-200',
                  scoreBox: 'bg-slate-900 text-white',
                };

            return (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
                {/* Encabezado Principal del Calendario */}
                <div className={`p-4 rounded-2xl border ${sportThemeClasses.cardHeaderBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                      <SportIconRenderer sportId={currentSportConfig.id} size={32} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight">
                        Horarios y calendario de {currentSportConfig.name}
                      </h3>
                      <p className="text-xs opacity-80 font-medium">
                        Horas de inicio, canchas asignadas y estado en tiempo real
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold border border-slate-200/90 shadow-2xs">
                      {sportMatches.length} partidos
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold border border-slate-200/90 shadow-2xs">
                      {currentSportConfig.badgeText}
                    </span>
                  </div>
                </div>

                {/* Aviso de asignación de sedes por sorteo con tono del deporte */}
                <div className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs ${sportThemeClasses.venueNoticeBg}`}>
                  <MapPin className={`w-4 h-4 shrink-0 ${sportThemeClasses.iconText}`} />
                  <div className="min-w-0">
                    <span className="font-bold">Asignación de sedes: </span>
                    <span className="opacity-90">
                      Las sedes se definen por rifa rotativa entre las instituciones con cancha disponible (CRIA, La Paz, Journey, Vittorino y Educarte). Cada festival diario se disputa en una sola sede anfitriona.
                    </span>
                  </div>
                </div>

                {/* ℹ️ Nota Oficial de Prueba y Calibración */}
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs">
                  <span className="font-black px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] uppercase shrink-0">
                    Modo de pruebas
                  </span>
                  <span className="font-medium text-[11.5px]">
                    Información de prueba de marcadores · Entorno de simulación previa al evento oficial. Todos los marcadores y puntos inician en 0.
                  </span>
                </div>

                {/* Lista de Partidos Limpia y Tematizada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sportMatches.length === 0 ? (
                    <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                      No hay partidos programados en este momento para {currentSportConfig.name}.
                    </div>
                  ) : (
                    sportMatches.map((match) => {
                      const homeSchool = schools.find((s) => s.id === match.homeTeamId) || schools[0];
                      const awaySchool = schools.find((s) => s.id === match.awayTeamId) || schools[1];
                      const category = categories.find((c) => c.id === match.categoryId);

                      const isLive = match.status === 'live';
                      const isCompleted = match.status === 'completed';

                      return (
                        <div
                          key={match.id}
                          className={`rounded-2xl p-4 border bg-white shadow-2xs transition-all ${sportThemeClasses.accentBorder} ${sportThemeClasses.accentTopBorder} ${
                            isLive ? 'ring-2 ring-amber-400/40' : ''
                          }`}
                        >
                          {/* Encabezado del Partido */}
                          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <Clock className={`w-4 h-4 ${sportThemeClasses.clockColor}`} />
                              <span className="font-mono text-sm text-slate-900 font-bold">{match.time}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 text-[11px] truncate max-w-[140px]">
                                {match.venue}
                              </span>
                            </div>

                            {isLive && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[10px] animate-pulse border border-red-200">
                                <span className="w-2 h-2 rounded-full bg-red-600" />
                                En vivo
                              </span>
                            )}

                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Finalizado
                              </span>
                            )}

                            {!isLive && !isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-200">
                                <Hourglass className="w-3 h-3" />
                                Programado
                              </span>
                            )}
                          </div>

                          {/* Enfrentamiento */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <SchoolEmblem schoolId={homeSchool.id} size="sm" />
                              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {homeSchool.shortName}
                              </span>
                            </div>

                            <div className="px-3 py-1 rounded-xl text-center shrink-0 min-w-[58px]">
                              {isCompleted || isLive ? (
                                <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg block ${sportThemeClasses.scoreBox}`}>
                                  {match.homeScore} - {match.awayScore}
                                </span>
                              ) : (
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg block ${sportThemeClasses.vsPill}`}>
                                  VS
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {awaySchool.shortName}
                              </span>
                              <SchoolEmblem schoolId={awaySchool.id} size="sm" />
                            </div>
                          </div>

                          {/* Desglose de Sets para Voleibol */}
                          {isVoleibol && isCompleted && match.setScores && match.setScores.length > 0 && (
                            <div className="mt-2.5 p-1.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center gap-2 text-[10.5px] font-mono font-semibold text-sky-800">
                              {match.setScores.map((s, sIdx) => (
                                <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-sky-200">
                                  S{sIdx + 1}: {s.home}-{s.away}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Pie del partido con categoría tematizada */}
                          {category && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                              <span className={`px-2 py-0.5 rounded-md font-semibold border ${sportThemeClasses.badgeCategory}`}>
                                {category.name} ({category.dayOfWeek})
                              </span>
                              {match.mvpPlayerName && (
                                <span className="font-medium text-amber-700 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>MVP: <strong>{match.mvpPlayerName}</strong></span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* 🪟 MODAL PARA AGREGAR NUEVA MODALIDAD */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Agregar modalidad deportiva</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Registra una nueva disciplina deportiva (ej: Pádel, Tenis de Mesa, etc.) para habilitar su calendario y barras de puntuación.
            </p>

            <form onSubmit={handleAddCustomSport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del deporte
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pádel Intercolegial..."
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color identificador
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newSportColor}
                    onChange={(e) => setNewSportColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs text-slate-500 font-mono">{newSportColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  Habilitar deporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
