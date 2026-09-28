'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Match, MatchStatus, SportType } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Lock, 
  Unlock, 
  Save, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  SlidersHorizontal, 
  Flame, 
  Trophy, 
  RefreshCw,
  Edit3,
  UploadCloud,
  FileCheck,
  ImageIcon,
  Video
} from 'lucide-react';
import { tournamentStorage } from '@/lib/storageAdapter';
import { uploadMediaToBunny, validateMediaFile, BUNNY_MEDIA_CONFIG, BunnyUploadResult } from '@/lib/bunnyMediaService';

export function AdminControlPanel() {
  const { matches, updateMatch, schools, categories, getSchoolById, getCategoryById } = useTournament();

  // Authentication Pin (Simple PIN for quick field access)
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Open access by default for convenience

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'results' | 'new_match' | 'schedule' | 'bunny_media'>('results');

  // Bunny.net & Firebase Media Upload State
  const [bunnyFile, setBunnyFile] = useState<File | null>(null);
  const [bunnyPreview, setBunnyPreview] = useState<string | null>(null);
  const [bunnyUploading, setBunnyUploading] = useState<boolean>(false);
  const [bunnyProgress, setBunnyProgress] = useState<number>(0);
  const [bunnyResult, setBunnyResult] = useState<BunnyUploadResult | null>(null);
  const [uploadedList, setUploadedList] = useState<BunnyUploadResult[]>([]);

  // Form 1: Result Editing State
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const [homeScore, setHomeScore] = useState<number>(selectedMatch?.homeScore || 0);
  const [awayScore, setAwayScore] = useState<number>(selectedMatch?.awayScore || 0);
  const [homeSetsWon, setHomeSetsWon] = useState<number>(selectedMatch?.homeSetsWon || 0);
  const [awaySetsWon, setAwaySetsWon] = useState<number>(selectedMatch?.awaySetsWon || 0);
  const [status, setStatus] = useState<MatchStatus>(selectedMatch?.status || 'live');
  const [currentPeriod, setCurrentPeriod] = useState<string>(selectedMatch?.currentPeriod || '1.er Tiempo');
  const [minute, setMinute] = useState<number>(selectedMatch?.minute || 25);
  const [mvpPlayerName, setMvpPlayerName] = useState<string>(selectedMatch?.mvpPlayerName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form 2: New Match State
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newTime, setNewTime] = useState('09:00');
  const [newVenue, setNewVenue] = useState('Cancha Principal, Campus Cabo Velas');
  const [newSport, setNewSport] = useState<SportType>('futbol');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || '');
  const [newHomeTeamId, setNewHomeTeamId] = useState(schools[0]?.id || 'la-paz-cabo-velas');
  const [newAwayTeamId, setNewAwayTeamId] = useState(schools[1]?.id || 'cria');
  const [newJornada, setNewJornada] = useState(2);
  const [newCreatedSuccess, setNewCreatedSuccess] = useState(false);

  // When changing selected match for result editing
  const handleSelectMatchToEdit = (mId: string) => {
    const match = matches.find((m) => m.id === mId);
    if (match) {
      setSelectedMatchId(mId);
      setHomeScore(match.homeScore);
      setAwayScore(match.awayScore);
      setHomeSetsWon(match.homeSetsWon ?? 0);
      setAwaySetsWon(match.awaySetsWon ?? 0);
      setStatus(match.status);
      setCurrentPeriod(match.currentPeriod || '1.er Tiempo');
      setMinute(match.minute || 20);
      setMvpPlayerName(match.mvpPlayerName || '');
    }
  };

  // Submit Form 1: Save Results
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const updated: Match = {
      ...selectedMatch,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      homeSetsWon: selectedMatch.sport === 'voleibol' ? Number(homeSetsWon) : undefined,
      awaySetsWon: selectedMatch.sport === 'voleibol' ? Number(awaySetsWon) : undefined,
      status,
      currentPeriod,
      minute: Number(minute),
      mvpPlayerName: mvpPlayerName.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    updateMatch(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Submit Form 2: Create New Match
  const handleCreateNewMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHomeTeamId === newAwayTeamId) {
      alert('El colegio local y visitante deben ser distintos.');
      return;
    }

    const newMatch: Match = {
      id: `m-custom-${Date.now()}`,
      tournamentId: 'costa-de-oro-2026',
      jornada: Number(newJornada),
      jornadaName: `Jornada ${newJornada} - Festival Deportivo`,
      categoryId: newCategoryId,
      sport: newSport,
      date: newDate,
      time: newTime,
      venue: newVenue,
      homeTeamId: newHomeTeamId,
      awayTeamId: newAwayTeamId,
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
      currentPeriod: 'Programado',
      updatedAt: new Date().toISOString(),
    };

    updateMatch(newMatch);
    setNewCreatedSuccess(true);
    setTimeout(() => setNewCreatedSuccess(false), 3000);
  };

  // Quick Time Adjuster for Retrasos (+15 min)
  const handleShiftMatchTime = (matchId: string, minutesToAdd: number) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const [hoursStr, minsStr] = match.time.split(':');
    let totalMins = parseInt(hoursStr, 10) * 60 + parseInt(minsStr, 10) + minutesToAdd;
    if (totalMins >= 24 * 60) totalMins -= 24 * 60;
    const newH = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const newM = String(totalMins % 60).padStart(2, '0');

    const updated: Match = {
      ...match,
      time: `${newH}:${newM}`,
      updatedAt: new Date().toISOString(),
    };

    updateMatch(updated);
  };

  const homeSchool = getSchoolById(selectedMatch?.homeTeamId);
  const awaySchool = getSchoolById(selectedMatch?.awayTeamId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Cabecera del Panel de Control */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/50 border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Mesa Técnica y Control de Datos</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Panel Central de Resultados y Calendario
          </h1>
          <p className="text-xs text-slate-600">
            Formularios prácticos para registrar marcadores en tiempo real, programar nuevos partidos y ajustar horarios.
          </p>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'results'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Resultados y Marcadores
          </button>
          <button
            onClick={() => setActiveTab('new_match')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new_match'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. + Programar Partido
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Ajustes de Horario
          </button>
          <button
            onClick={() => setActiveTab('bunny_media')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bunny_media'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>4. Multimedia Bunny.net & Firebase</span>
          </button>
        </div>
      </div>

      {/* 🏆 PESTAÑA 1: FORMULARIO DE RESULTADOS Y MARCADORES EN VIVO */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <span>Actualizar Marcador y Resultado Oficial</span>
              </h2>
              <p className="text-xs text-slate-500">
                Selecciona el partido que deseas editar o transmitir en vivo.
              </p>
            </div>

            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                ¡Marcador guardado con éxito!
              </span>
            )}
          </div>

          {/* Selector de Partido a Editar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Seleccionar Partido:
            </label>
            <select
              value={selectedMatchId}
              onChange={(e) => handleSelectMatchToEdit(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              {matches.map((m) => {
                const h = getSchoolById(m.homeTeamId);
                const a = getSchoolById(m.awayTeamId);
                return (
                  <option key={m.id} value={m.id}>
                    [{m.sport.toUpperCase()}] {m.time} - {h?.shortName} vs {a?.shortName} ({m.status.toUpperCase()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Tarjeta Visual de Enfrentamiento y Marcador */}
          {selectedMatch && (
            <form onSubmit={handleSaveResult} className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                {/* Enfrentamiento de Equipos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Local */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <SchoolEmblem schoolId={selectedMatch.homeTeamId} size="sm" />
                      <span className="font-bold text-sm text-slate-900">{homeSchool?.name}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setHomeScore((prev) => Math.max(0, prev - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-20 py-2 text-center text-3xl font-black font-mono bg-amber-50 border border-amber-300 rounded-xl text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setHomeScore((prev) => prev + 1)}
                        className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg"
                      >
                        +1
                      </button>
                    </div>

                    {selectedMatch.sport === 'voleibol' && (
                      <div className="flex items-center justify-center gap-2 text-xs pt-1">
                        <span className="text-slate-500">Sets Ganados:</span>
                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={homeSetsWon}
                          onChange={(e) => setHomeSetsWon(parseInt(e.target.value, 10) || 0)}
                          className="w-12 py-1 text-center font-bold font-mono bg-slate-100 rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <SchoolEmblem schoolId={selectedMatch.awayTeamId} size="sm" />
                      <span className="font-bold text-sm text-slate-900">{awaySchool?.name}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAwayScore((prev) => Math.max(0, prev - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-20 py-2 text-center text-3xl font-black font-mono bg-amber-50 border border-amber-300 rounded-xl text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setAwayScore((prev) => prev + 1)}
                        className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg"
                      >
                        +1
                      </button>
                    </div>

                    {selectedMatch.sport === 'voleibol' && (
                      <div className="flex items-center justify-center gap-2 text-xs pt-1">
                        <span className="text-slate-500">Sets Ganados:</span>
                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={awaySetsWon}
                          onChange={(e) => setAwaySetsWon(parseInt(e.target.value, 10) || 0)}
                          className="w-12 py-1 text-center font-bold font-mono bg-slate-100 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado del Partido y Periodo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estado del Partido:
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MatchStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="scheduled">Programado</option>
                      <option value="live">● EN VIVO</option>
                      <option value="completed">Finalizado</option>
                      <option value="postponed">Pospuesto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Periodo / Fase:
                    </label>
                    <input
                      type="text"
                      value={currentPeriod}
                      onChange={(e) => setCurrentPeriod(e.target.value)}
                      placeholder="Ej: 1.er Tiempo, Set 2, Final"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jugador Destacado (MVP):
                    </label>
                    <input
                      type="text"
                      value={mvpPlayerName}
                      onChange={(e) => setMvpPlayerName(e.target.value)}
                      placeholder="Ej: Sofía Mora (LPCV)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Guardar Resultado */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Resultado Oficial</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ➕ PESTAÑA 2: PROGRAMAR NUEVO PARTIDO EN EL CALENDARIO */}
      {activeTab === 'new_match' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Programar Nuevo Partido en el Calendario</span>
              </h2>
              <p className="text-xs text-slate-500">
                Registra un nuevo encuentro con fecha, hora, cancha y colegios asignados.
              </p>
            </div>

            {newCreatedSuccess && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                ¡Partido agregado al calendario!
              </span>
            )}
          </div>

          <form onSubmit={handleCreateNewMatch} className="space-y-4">
            {/* Fila 1: Deporte y Categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Disciplina Deportiva:
                </label>
                <select
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value as SportType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="futbol">Fútbol</option>
                  <option value="voleibol">Voleibol</option>
                  <option value="baloncesto">Baloncesto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoría Oficial:
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.division})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila 2: Colegios Enfrentados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Colegio Local:
                </label>
                <select
                  value={newHomeTeamId}
                  onChange={(e) => setNewHomeTeamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Colegio Visitante:
                </label>
                <select
                  value={newAwayTeamId}
                  onChange={(e) => setNewAwayTeamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila 3: Fecha, Hora, Cancha y Jornada */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fecha del Encuentro:
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hora Programada:
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jornada / Festival:
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={newJornada}
                  onChange={(e) => setNewJornada(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cancha Asignada:
                </label>
                <select
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Cancha Principal, Campus Cabo Velas">Cancha Principal (Cabo Velas)</option>
                  <option value="Cancha 2, Campus Cabo Velas">Cancha 2 (Cabo Velas)</option>
                  <option value="Gimnasio Techado, Campus Tempisque">Gimnasio Techado (Tempisque)</option>
                  <option value="Cancha Multiuso, Campus Tempisque">Cancha Multiuso</option>
                </select>
              </div>
            </div>

            {/* Botón de Enviar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Partido en el Calendario</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📅 PESTAÑA 3: GESTIÓN RÁPIDA DE HORARIOS Y RETRASOS */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Ajustes Rápidos de Horarios y Retrasos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Si un partido de voleibol o fútbol se extiende, añade 15 o 30 minutos a los partidos siguientes con un solo clic.
            </p>
          </div>

          <div className="space-y-3">
            {matches.map((m) => {
              const h = getSchoolById(m.homeTeamId);
              const a = getSchoolById(m.awayTeamId);

              return (
                <div
                  key={m.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-900 shrink-0">
                      {m.time}
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        {h?.shortName} vs {a?.shortName} ({m.sport.toUpperCase()})
                      </span>
                      <span className="text-[11px] text-slate-500">{m.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleShiftMatchTime(m.id, -15)}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                      title="Adelantar 15 min"
                    >
                      -15m
                    </button>
                    <button
                      onClick={() => handleShiftMatchTime(m.id, 15)}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200"
                      title="Retrasar 15 min"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => handleShiftMatchTime(m.id, 30)}
                      className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300"
                      title="Retrasar 30 min"
                    >
                      +30m
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🐰 PESTAÑA 4: GESTIÓN MULTIMEDIA Y ALMACENAMIENTO BUNNY.NET & FIREBASE */}
      {activeTab === 'bunny_media' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-600" />
                <span>Gestor de Medios Bunny.net & Firebase CDN</span>
              </h2>
              <p className="text-xs text-slate-500">
                Transcodificación de videos con Bunny Stream (Biblioteca 629005) y almacenamiento de fotos con Bunny Edge Storage & Firebase.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Bunny.net (629005) Activo • Lectura / Escritura OK</span>
            </div>
          </div>

          {/* Zona de Carga / Drag and Drop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-3xl p-6 bg-slate-50/70 hover:bg-amber-50/20 transition-all text-center flex flex-col items-center justify-center min-h-[220px]">
                <UploadCloud className="w-12 h-12 text-slate-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Selecciona una Foto o Video para Bunny.net
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  Videos: Bunny Stream HLS (hasta 100MB) | Fotos: Bunny Edge Storage (hasta 15MB).
                </p>

                <input
                  type="file"
                  id="adminBunnyInput"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const validation = validateMediaFile(file);
                      if (!validation.valid) {
                        alert(validation.error);
                        return;
                      }
                      setBunnyFile(file);
                      setBunnyPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />

                <label
                  htmlFor="adminBunnyInput"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition"
                >
                  Examinar Archivo Local
                </label>
              </div>

              {/* Botón de Carga */}
              {bunnyFile && (
                <div className="bg-slate-100 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">
                      {bunnyFile.name}
                    </span>
                    <span className="font-mono text-slate-500">
                      {(bunnyFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  {bunnyUploading && (
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 transition-all duration-200"
                          style={{ width: `${bunnyProgress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right font-mono text-slate-500">
                        {bunnyProgress}%
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={bunnyUploading}
                    onClick={async () => {
                      if (!bunnyFile) return;
                      setBunnyUploading(true);
                      setBunnyProgress(15);
                      const res = await uploadMediaToBunny(
                        bunnyFile,
                        { folder: 'costa_de_oro_2026/oficial' },
                        (p) => setBunnyProgress(p)
                      );
                      setBunnyUploading(false);
                      setBunnyResult(res);
                      if (res.success) {
                        setUploadedList((prev) => [res, ...prev]);
                        setBunnyFile(null);
                        setBunnyPreview(null);
                      }
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition shadow"
                  >
                    {bunnyUploading ? 'Cargando a Bunny.net CDN...' : 'Iniciar Carga a Bunny.net'}
                  </button>
                </div>
              )}
            </div>

            {/* Vista Previa y Metadatos */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Vista Previa & CDN Bunny.net
              </h4>

              {bunnyPreview ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[220px]">
                  {bunnyFile?.type.startsWith('video') ? (
                    <video src={bunnyPreview} controls className="max-h-[220px] w-full" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bunnyPreview} alt="Previa" className="max-h-[220px] object-contain" />
                  )}
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-center text-xs text-slate-400">
                  Selecciona una foto o video para previsualizar antes de procesar en Bunny.net.
                </div>
              )}

              {/* Lista de archivos subidos en Bunny.net */}
              <div className="space-y-2 pt-2">
                <h5 className="text-[11px] font-bold text-slate-600">
                  Archivos Almacenados en Bunny.net ({uploadedList.length}):
                </h5>

                {uploadedList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No hay archivos subidos a Bunny.net en esta sesión aún.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {uploadedList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.resourceType === 'video' ? (
                            <Video className="w-4 h-4 text-sky-600 shrink-0" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-mono text-[11px] text-slate-700 truncate">
                            {item.publicId} ({item.provider})
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.secureUrl);
                            alert('URL CDN de Bunny.net copiada al portapapeles.');
                          }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-bold shrink-0"
                        >
                          Copiar URL
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
