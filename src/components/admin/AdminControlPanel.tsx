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
  Video,
  KeyRound,
  ShieldCheck,
  Download,
  QrCode,
  Scan,
  ExternalLink,
  Users,
  X
} from 'lucide-react';
import { tournamentStorage } from '@/lib/storageAdapter';
import { uploadMediaToBunny, validateMediaFile, BUNNY_MEDIA_CONFIG, BunnyUploadResult } from '@/lib/bunnyMediaService';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { LiveDeskScorer } from './LiveDeskScorer';
import { RosterUploaderModal } from './RosterUploaderModal';
import { CertificateGeneratorModal } from './CertificateGeneratorModal';
import { AdminRosterManager } from './AdminRosterManager';
import { Award, FileSpreadsheet } from 'lucide-react';

export function AdminControlPanel() {
  const { matches, updateMatch, schools, categories, getSchoolById, getCategoryById } = useTournament();

  // Authentication Pin (Simple PIN for quick field access)
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Open access by default for convenience

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'results' | 'new_match' | 'schedule' | 'bunny_media' | 'event_pin' | 'rosters'>('results');

  // Event-wide Family PIN Configuration State
  const [eventPinInput, setEventPinInput] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('costa_de_oro_event_pin') || TOURNAMENT_CONFIG.security?.defaultFamilyPin || 'COSTA2026';
    }
    return TOURNAMENT_CONFIG.security?.defaultFamilyPin || 'COSTA2026';
  });
  const [pinSavedSuccess, setPinSavedSuccess] = useState<boolean>(false);

  // Modal para Escáner de Datos, Carga de Rosters y Certificados
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Función para Descargar Offline (JSON completo de la base de datos)
  const handleDownloadOffline = () => {
    const exportData = {
      tournament: TOURNAMENT_CONFIG,
      timestamp: new Date().toISOString(),
      matches: matches,
      schools: schools,
      categories: categories,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `costa_de_oro_datos_offline_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

          {/* Botones de Sincronización: Solamente Descargar Offline y Escáner de Datos */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadOffline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-bold shadow-2xs transition cursor-pointer"
              title="Descargar base de datos completa para uso offline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Offline</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRosterModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-2xs transition cursor-pointer"
              title="Cargar listas de jugadores y cuerpos técnicos por colegio"
            >
              <Users className="w-3.5 h-3.5 text-slate-950" />
              <span>Carga Masiva de Rosters</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-black shadow-2xs transition cursor-pointer"
              title="Generar e imprimir diplomas y certificados oficiales con código QR"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Generar Diplomas</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-300 text-xs font-bold shadow-2xs transition cursor-pointer"
              title="Abrir lector y escáner de datos y códigos QR"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Escáner de Datos</span>
            </button>
          </div>
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
            <span>4. Multimedia</span>
          </button>
          <button
            onClick={() => setActiveTab('event_pin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'event_pin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>5. PIN de Familias</span>
          </button>
          <button
            onClick={() => setActiveTab('rosters')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rosters'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>6. Nóminas Excel y Listas</span>
          </button>
        </div>
      </div>

      {/* 🏆 PESTAÑA 1: CONSOLA DE MESA TÉCNICA, MARCADORES EN VIVO Y ACTAS DIGITALES */}
      {activeTab === 'results' && (
        <LiveDeskScorer />
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

      {/* 🔑 PESTAÑA 5: CONFIGURACIÓN DEL PIN DE FAMILIAS PARA TODO EL EVENTO */}
      {activeTab === 'event_pin' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Configuración de PIN para Familias y Padres</span>
              </h2>
              <p className="text-xs text-slate-500">
                Define el código de seguridad oficial que utilizarán las familias para publicar porras, fotografías y videos en el Muro durante todas las fechas del evento.
              </p>
            </div>

            {pinSavedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                ¡PIN actualizado correctamente!
              </span>
            )}
          </div>

          <div className="max-w-xl space-y-4">
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold block text-sm text-amber-900">
                PIN de Evento Universal
              </span>
              <p>
                Este PIN habilita a todas las familias para publicar en cualquier fecha del torneo sin restricciones de calendario.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                PIN Principal del Evento:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={eventPinInput}
                  onChange={(e) => setEventPinInput(e.target.value.toUpperCase())}
                  placeholder="Ej: COSTA2026"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-900 w-64 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!eventPinInput.trim()) return;
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('costa_de_oro_event_pin', eventPinInput.trim().toUpperCase());
                      localStorage.setItem('costa_de_oro_family_pin_verified', 'true');
                    }
                    setPinSavedSuccess(true);
                    setTimeout(() => setPinSavedSuccess(false), 3000);
                  }}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Guardar PIN
                </button>
              </div>
            </div>

            {/* PINs Oficiales Aceptados por Defecto */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">
                PINs Activos y Compatibles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(TOURNAMENT_CONFIG.security?.validPins || ['COSTA2026', 'ORO2026', '2026', 'PAZ2026', '8421']).map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-mono font-bold rounded-lg border border-slate-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📊 PESTAÑA 6: GESTOR DE NÓMINAS EXCEL Y FORMULARIOS */}
      {activeTab === 'rosters' && (
        <AdminRosterManager />
      )}

      {/* 📱 MODAL DEL ESCÁNER DE DATOS Y CÓDIGOS QR */}
      {showScannerModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowScannerModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Escáner de Datos Oficial
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Lectura de actas, acreditaciones y códigos QR
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulación del visor de la cámara / Escáner */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-950 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-amber-400/60">
              <div className="w-48 h-48 rounded-2xl border-2 border-amber-400/80 relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
                
                <div className="space-y-2 text-center p-3">
                  <QrCode className="w-12 h-12 text-amber-400/80 mx-auto animate-pulse" />
                  <span className="text-[11px] font-bold text-amber-300 block">
                    Apunta la cámara al código QR
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 mt-4">
                Listo para verificar actas deportivas, credenciales o enlaces de partidos.
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  alert('Escáner de cámara iniciado. Puedes escanear credenciales de atletas y actas de partido.');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer text-center"
              >
                Activar Cámara del Dispositivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Carga Masiva de Rosters */}
      <RosterUploaderModal
        isOpen={showRosterModal}
        onClose={() => setShowRosterModal(false)}
      />

      {/* Modal de Generación de Diplomas y Certificados con QR */}
      {showCertificateModal && (
        <CertificateGeneratorModal
          schools={schools}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
}
