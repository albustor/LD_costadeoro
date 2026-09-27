'use client';

import React, { useState } from 'react';
import { Category, Match, School, Standing } from '@/types/tournament';
import { SchoolEmblem } from './SchoolEmblem';
import { VisualProgressBars, VisualBarItem } from './VisualProgressBars';
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
  Sparkles
} from 'lucide-react';

interface CustomSport {
  id: string;
  name: string;
  color: string;
  accent: string;
  lightBg: string;
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

  // Base Sports Configuration
  const baseSports = [
    {
      id: 'futbol',
      name: 'Fútbol',
      color: '#16A34A',
      accent: '#22C55E',
      lightBg: '#F0FDF4',
      badgeText: 'Fútbol 7 & 11',
    },
    {
      id: 'voleibol',
      name: 'Voleibol',
      color: '#0284C7',
      accent: '#38BDF8',
      lightBg: '#F0F9FF',
      badgeText: 'Gimnasio Techado',
    },
    {
      id: 'baloncesto',
      name: 'Baloncesto',
      color: '#EA580C',
      accent: '#FB923C',
      lightBg: '#FFF7ED',
      badgeText: 'Cancha Multiuso',
    },
  ];

  const allSports = [
    ...baseSports,
    ...customSports.map((cs) => ({
      id: cs.id,
      name: cs.name,
      color: cs.color,
      accent: cs.accent,
      lightBg: cs.lightBg,
      badgeText: 'Nueva Modalidad',
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

  // Calcular tabla acumulada para este deporte
  const schoolScoresMap = new Map<string, { points: number; played: number; won: number; drawn: number; lost: number; diff: number }>();

  schools.forEach((school) => {
    schoolScoresMap.set(school.id, { points: 0, played: 0, won: 0, drawn: 0, lost: 0, diff: 0 });
  });

  sportCategories.forEach((cat) => {
    const standings = getStandingsForCategory(cat.id);
    standings.forEach((st) => {
      const current = schoolScoresMap.get(st.teamId) || { points: 0, played: 0, won: 0, drawn: 0, lost: 0, diff: 0 };
      current.points += st.points;
      current.played += st.played;
      current.won += st.won;
      current.drawn += st.drawn;
      current.lost += st.lost;
      current.diff += st.diff;
      schoolScoresMap.set(st.teamId, current);
    });
  });

  const sortedSportStandings: VisualBarItem[] = Array.from(schoolScoresMap.entries())
    .map(([schoolId, stats]) => {
      const school = schools.find((s) => s.id === schoolId) || schools[0];
      return {
        school,
        points: stats.points,
        maxPoints: 1, // Se calculará después
        played: stats.played,
        won: stats.won,
        drawn: stats.drawn,
        lost: stats.lost,
        diff: stats.diff,
        rank: 1,
      };
    })
    .sort((a, b) => b.points - a.points || b.diff - a.diff);

  const maxPointsSport = Math.max(...sortedSportStandings.map((s) => s.points), 1);
  sortedSportStandings.forEach((item, index) => {
    item.rank = index + 1;
    item.maxPoints = maxPointsSport;
  });

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
    };

    setCustomSports((prev) => [...prev, newSport]);
    setSelectedSport(id);
    setNewSportName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 🏅 SELECTOR DE DEPORTE MINIMALISTA Y EXTENSIBLE */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
        {allSports.map((sport) => {
          const isSelected = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <SportIconRenderer sportId={sport.id} size={20} />
              <span>{sport.name}</span>
            </button>
          );
        })}

        {/* Botón "+ Modalidad" para agregar otra disciplina deportiva */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/80 border border-dashed border-slate-300 transition-all cursor-pointer ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Agregar Deporte</span>
        </button>
      </div>

      {/* 🎨 CABECERA VISUAL DEL DEPORTE SELECCIONADO */}
      <div
        style={{ backgroundColor: currentSportConfig.lightBg }}
        className="rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 text-left">
          <SportIconRenderer sportId={currentSportConfig.id} size={56} badge={true} />
          <div>
            <span
              style={{ color: currentSportConfig.color }}
              className="text-[11px] font-black uppercase tracking-wider block"
            >
              Disciplina Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Torneo de {currentSportConfig.name}
            </h2>
            <p className="text-xs text-slate-600">
              {sportCategories.length > 0
                ? `${sportCategories.length} categorías activas • ${sportMatches.length} partidos programados`
                : 'Configuración de partidos y categorías abierta.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs">
            {currentSportConfig.badgeText}
          </span>
        </div>
      </div>

      {/* 📊 BARRAS VISUALES DE PUNTUACIÓN DE ESTE DEPORTE */}
      <VisualProgressBars
        items={sortedSportStandings}
        title={`Avance y Puntos en ${currentSportConfig.name}`}
        subtitle="Barras de progreso de los colegios en esta disciplina específica"
        sportColor={currentSportConfig.color}
        sportAccent={currentSportConfig.accent}
        sportLightBg={currentSportConfig.lightBg}
      />

      {/* 📅 CALENDARIO Y HORARIOS CLAROS POR CANCHA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>Horarios y Calendario de {currentSportConfig.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Horas de inicio, canchas asignadas y estado en tiempo real
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {sportMatches.length} Partidos
          </span>
        </div>

        {/* Lista de Partidos Limpia */}
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

              // Estado y badge
              const isLive = match.status === 'live';
              const isCompleted = match.status === 'completed';

              return (
                <div
                  key={match.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    isLive
                      ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30'
                      : 'bg-white hover:bg-slate-50/70 border-slate-200'
                  }`}
                >
                  {/* Encabezado del Partido: Hora, Cancha y Estado */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="font-mono text-sm text-slate-900">{match.time}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px] truncate max-w-[140px]">
                        {match.venue}
                      </span>
                    </div>

                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[10px] animate-pulse border border-red-200">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        EN VIVO
                      </span>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        FINALIZADO
                      </span>
                    )}

                    {!isLive && !isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                        <Hourglass className="w-3 h-3" />
                        PROGRAMADO
                      </span>
                    )}
                  </div>

                  {/* Enfrentamiento de Colegios con Escudos */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Colegio Local */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <SchoolEmblem schoolId={homeSchool.id} size="sm" />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {homeSchool.shortName}
                      </span>
                    </div>

                    {/* Marcador o VS */}
                    <div className="px-3 py-1 bg-slate-100 rounded-xl text-center shrink-0 min-w-[54px]">
                      {isCompleted || isLive ? (
                        <span className="font-mono font-black text-sm text-slate-900">
                          {match.homeScore} - {match.awayScore}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">VS</span>
                      )}
                    </div>

                    {/* Colegio Visitante */}
                    <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {awaySchool.shortName}
                      </span>
                      <SchoolEmblem schoolId={awaySchool.id} size="sm" />
                    </div>
                  </div>

                  {/* Subtítulo de Categoría */}
                  {category && (
                    <div className="mt-2 text-right">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {category.name} ({category.dayOfWeek})
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🪟 MODAL PARA AGREGAR NUEVA MODALIDAD DEPORTIVA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Agregar Modalidad Deportiva</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Registra una nueva disciplina deportiva (ej: Atletismo, Natación, Ajedrez) para habilitar su calendario y barras de puntuación.
            </p>

            <form onSubmit={handleAddCustomSport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Deporte
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Atletismo de Playa, Natación..."
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color Identificador
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
                  Habilitar Deporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
