'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Award,
  FileText,
  Activity,
  BarChart2
} from 'lucide-react';
import { Match, Standing } from '@/types/tournament';
import { SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';
import { useTournament } from '@/context/TournamentContext';
import { calculateStandings } from '@/lib/sportsEngine';
import { tournamentStorage } from '@/lib/storageAdapter';

interface QuickMatchScorerProps {
  initialMatches?: Match[];
}

export function QuickMatchScorer({ initialMatches }: QuickMatchScorerProps) {
  const { matches: contextMatches, updateMatch } = useTournament();
  const [matches, setMatches] = useState<Match[]>(initialMatches || contextMatches || []);

  // Determinar día por defecto según la fecha actual
  const todayKey = useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
    const matchDates = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
    return matchDates.includes(today) ? today : '2026-10-05';
  }, []);

  const [selectedDay, setSelectedDay] = useState<string>(todayKey);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStandingsCatId, setSelectedStandingsCatId] = useState<string>('cat-fem-futbol');
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [showLiveStandings, setShowLiveStandings] = useState<boolean>(true);

  // Estados locales de edición de partidos
  const [matchForms, setMatchForms] = useState<Record<string, {
    homeScore: number;
    awayScore: number;
    homeSetsWon?: number;
    awaySetsWon?: number;
    status: Match['status'];
    walkover: 'none' | 'home_forfeit' | 'away_forfeit';
    mvpPlayerName?: string;
    notes?: string;
  }>>({});

  // Cargar estado inicial de partidos
  useEffect(() => {
    if (contextMatches && contextMatches.length > 0) {
      setMatches(contextMatches);
    }
  }, [contextMatches]);

  // Inicializar formularios de edición para cada partido
  useEffect(() => {
    const forms: Record<string, any> = {};
    matches.forEach((m) => {
      forms[m.id] = {
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        homeSetsWon: m.homeSetsWon ?? 0,
        awaySetsWon: m.awaySetsWon ?? 0,
        status: m.status || 'scheduled',
        walkover: m.walkover || 'none',
        mvpPlayerName: m.mvpPlayerName || '',
        notes: m.notes || '',
      };
    });
    setMatchForms(forms);
  }, [matches]);

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/mesa-control`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/mesa-control`;
    const msg = `📋 *LIGA COSTA DE ORO 2026 · CONSOLA DE MESA DE CONTROL*\n\nEstimado Don Alejandro, aquí tiene el enlace directo para registrar los marcadores diarios y ausencias:\n🔗 ${url}\n\n_Curiol Studio · Fotografía, Tecnología, Legado_`;
    window.open(`https://wa.me/50688445486?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleScoreChange = (matchId: string, side: 'home' | 'away', delta: number) => {
    setMatchForms((prev) => {
      const current = prev[matchId] || { homeScore: 0, awayScore: 0, status: 'scheduled', walkover: 'none' };
      const currentVal = side === 'home' ? current.homeScore : current.awayScore;
      const newVal = Math.max(0, currentVal + delta);
      return {
        ...prev,
        [matchId]: {
          ...current,
          [side === 'home' ? 'homeScore' : 'awayScore']: newVal,
          status: current.status === 'scheduled' ? 'completed' : current.status,
          walkover: 'none',
        },
      };
    });
  };

  const handleSetsChange = (matchId: string, side: 'home' | 'away', delta: number) => {
    setMatchForms((prev) => {
      const current = prev[matchId] || { homeScore: 0, awayScore: 0, homeSetsWon: 0, awaySetsWon: 0, status: 'scheduled', walkover: 'none' };
      const currentVal = side === 'home' ? (current.homeSetsWon ?? 0) : (current.awaySetsWon ?? 0);
      const newVal = Math.max(0, Math.min(3, currentVal + delta));
      return {
        ...prev,
        [matchId]: {
          ...current,
          [side === 'home' ? 'homeSetsWon' : 'awaySetsWon']: newVal,
          status: current.status === 'scheduled' ? 'completed' : current.status,
          walkover: 'none',
        },
      };
    });
  };

  // ⚠️ APLICACIÓN DE LA REGLA DE AUSENCIA / W.O. (FEDEFUTBOL / LIGA MENOR COSTA RICA)
  const handleWalkoverApply = (matchId: string, type: 'none' | 'home_forfeit' | 'away_forfeit') => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const homeSchool = SCHOOLS_DATA.find((s) => s.id === targetMatch.homeTeamId)?.shortName || 'Local';
    const awaySchool = SCHOOLS_DATA.find((s) => s.id === targetMatch.awayTeamId)?.shortName || 'Visitante';
    const isSoccer = targetMatch.sport === 'futbol';
    const winPts = isSoccer ? 3 : 2;
    const defaultGoals = isSoccer ? 3 : 0;

    setMatchForms((prev) => {
      const current = prev[matchId] || { homeScore: 0, awayScore: 0, status: 'scheduled', walkover: 'none' };

      if (type === 'home_forfeit') {
        return {
          ...prev,
          [matchId]: {
            ...current,
            walkover: 'home_forfeit',
            homeScore: 0,
            awayScore: isSoccer ? defaultGoals : 0,
            homeSetsWon: 0,
            awaySetsWon: targetMatch.sport === 'voleibol' ? 2 : 0,
            status: 'completed',
            notes: `⚠️ No se presentó ${homeSchool} (W.O.). Victoria oficial (${winPts} pts${isSoccer ? ' · 3-0' : ''}) a ${awaySchool} y 0 pts a ${homeSchool}.`,
          },
        };
      } else if (type === 'away_forfeit') {
        return {
          ...prev,
          [matchId]: {
            ...current,
            walkover: 'away_forfeit',
            homeScore: isSoccer ? defaultGoals : 0,
            awayScore: 0,
            homeSetsWon: targetMatch.sport === 'voleibol' ? 2 : 0,
            awaySetsWon: 0,
            status: 'completed',
            notes: `⚠️ No se presentó ${awaySchool} (W.O.). Victoria oficial (${winPts} pts${isSoccer ? ' · 3-0' : ''}) a ${homeSchool} y 0 pts a ${awaySchool}.`,
          },
        };
      } else {
        return {
          ...prev,
          [matchId]: {
            ...current,
            walkover: 'none',
            status: 'completed',
            notes: '',
          },
        };
      }
    });
  };

  // Guardar en base de datos centralizada
  const handleSaveMatch = async (matchId: string) => {
    const originalMatch = matches.find((m) => m.id === matchId);
    const form = matchForms[matchId];
    if (!originalMatch || !form) return;

    setSavingMatchId(matchId);
    setSavedSuccessId(null);

    const updatedMatch: Match = {
      ...originalMatch,
      homeScore: form.homeScore,
      awayScore: form.awayScore,
      homeSetsWon: originalMatch.sport === 'voleibol' ? form.homeSetsWon : undefined,
      awaySetsWon: originalMatch.sport === 'voleibol' ? form.awaySetsWon : undefined,
      status: form.status,
      walkover: form.walkover,
      mvpPlayerName: form.mvpPlayerName || undefined,
      notes: form.notes || undefined,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Actualizar estado local inmediatamente
      setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));

      // 2. Actualizar contexto reactivo y persistencia local/remota
      updateMatch(updatedMatch);

      // 3. Persistir en servidor vía API central
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: updatedMatch }),
      });

      if (res.ok) {
        setSavedSuccessId(matchId);
        // Notificar en tiempo real a todo el navegador y componentes con array completo
        if (typeof window !== 'undefined') {
          const currentAll = tournamentStorage.getMatches();
          window.dispatchEvent(new CustomEvent('matches_updated', { detail: currentAll }));
          window.dispatchEvent(new Event('storage'));
        }
        setTimeout(() => setSavedSuccessId(null), 3500);
      } else {
        alert('Error al guardar en el servidor. El cambio quedó guardado en memoria local.');
      }
    } catch (err) {
      console.error('Error guardando partido:', err);
      alert('Error de conexión con la base de datos.');
    } finally {
      setSavingMatchId(null);
    }
  };

  const daysList = [
    { key: '2026-10-05', dayName: 'Lunes 05 Oct', detail: 'Fútbol Femenino', icon: '⚽' },
    { key: '2026-10-06', dayName: 'Martes 06 Oct', detail: 'Fútbol Cat C', icon: '⚽' },
    { key: '2026-10-07', dayName: 'Miércoles 07 Oct', detail: 'Fútbol Cat D', icon: '⚽' },
    { key: '2026-10-08', dayName: 'Jueves 08 Oct', detail: 'Voleibol C y D', icon: '🏐' },
    { key: '2026-10-09', dayName: 'Viernes 09 Oct', detail: 'Baloncesto C y D', icon: '🏀' },
    { key: 'all', dayName: 'Ver Todos', detail: '15 Partidos', icon: '🏆' },
  ];

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (selectedDay !== 'all' && m.date !== selectedDay) return false;
      if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
      return true;
    });
  }, [matches, selectedDay, selectedSport]);

  // Cálculo en vivo de la tabla de posiciones según los partidos actuales
  const activeCategoryObj = useMemo(() => {
    return CATEGORIES_DATA.find((c) => c.id === selectedStandingsCatId) || CATEGORIES_DATA[0];
  }, [selectedStandingsCatId]);

  const liveStandings = useMemo(() => {
    return calculateStandings(activeCategoryObj.id, activeCategoryObj.sport, matches, SCHOOLS_DATA);
  }, [activeCategoryObj, matches]);

  return (
    <div className="space-y-5 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* 🏷️ CABECERA ULTRA-SIMPLIFICADA */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-amber-400/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Acceso Directo Sin Clave · Enlace Oficial</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-amber-300 font-bold">Don Alejandro (Coordinador)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2 text-white">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Mesa de Control · Registro Rápido</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Registre marcadores o ausencias. Cada cambio actualiza <strong>al instante</strong> toda la plataforma y sus bases de datos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              title="Compartir por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Copiar enlace directo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{copyFeedback ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* ℹ️ RESUMEN DE LA REGLA OFICIAL DE PUNTOS Y NO PRESENTACIÓN */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Formato Oficial Fútbol (Costa Rica / Liga Menor):</strong> Victoria = <strong>3 pts</strong> (incluye W.O. 3-0 administrativo) • Empate = <strong>1 pt</strong> • Derrota / Ausente = <strong>0 pts</strong>.
          </span>
        </div>
      </div>

      {/* 📅 SELECTOR DE DÍAS EN 1 TOQUE (CARRUSEL TÁCTIL DESLIZABLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-xs">
        <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-2 px-1">
          Paso 1: Seleccione el día de juego:
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar snap-x touch-pan-x">
          {daysList.map((d) => {
            const isSelected = selectedDay === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDay(d.key)}
                className={`flex-1 min-w-[105px] sm:min-w-[120px] p-2.5 rounded-2xl text-center transition cursor-pointer border shrink-0 snap-start ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black scale-102'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-bold'
                }`}
              >
                <div className="text-base">{d.icon}</div>
                <div className="text-xs font-black whitespace-nowrap mt-0.5">{d.dayName}</div>
                <div className="text-[10px] text-slate-600 opacity-90 whitespace-nowrap mt-0.5">{d.detail}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📋 LISTA TÁCTIL DE PARTIDOS PROGRAMADOS */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
            <span className="text-2xl">📅</span>
            <h3 className="text-sm font-bold text-slate-800">No hay partidos para el día seleccionado</h3>
            <button
              type="button"
              onClick={() => setSelectedDay('all')}
              className="px-4 py-2 bg-slate-900 text-amber-300 rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              Ver todos los partidos de la semana
            </button>
          </div>
        ) : (
          filteredMatches.map((m) => {
            const form = matchForms[m.id] || {
              homeScore: m.homeScore ?? 0,
              awayScore: m.awayScore ?? 0,
              homeSetsWon: m.homeSetsWon ?? 0,
              awaySetsWon: m.awaySetsWon ?? 0,
              status: m.status || 'scheduled',
              walkover: m.walkover || 'none',
              mvpPlayerName: m.mvpPlayerName || '',
              notes: m.notes || '',
            };

            const homeSchool = SCHOOLS_DATA.find((s) => s.id === m.homeTeamId);
            const awaySchool = SCHOOLS_DATA.find((s) => s.id === m.awayTeamId);
            const category = CATEGORIES_DATA.find((c) => c.id === m.categoryId);
            const isSaving = savingMatchId === m.id;
            const isSavedSuccess = savedSuccessId === m.id;
            const isExpanded = expandedMatchId === m.id;
            const isVolleyball = m.sport === 'voleibol';

            return (
              <div
                key={m.id}
                className={`bg-white rounded-3xl border transition shadow-xs overflow-hidden ${
                  form.walkover !== 'none'
                    ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400'
                    : isSavedSuccess
                    ? 'border-emerald-500 ring-2 ring-emerald-400'
                    : 'border-slate-200'
                }`}
              >
                {/* Cabecera del Partido */}
                <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 font-black text-[10px] uppercase shrink-0">
                      {m.sport === 'futbol' ? '⚽ Fútbol' : m.sport === 'voleibol' ? '🏐 Voleibol' : '🏀 Baloncesto'}
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">
                      {category?.name || m.categoryId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-semibold shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.time}</span>
                    <span className="hidden sm:inline">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                    <span className="hidden sm:inline">{m.venue || 'Sede Principal'}</span>
                  </div>
                </div>

                {/* Banner de Éxito al Guardar */}
                {isSavedSuccess && (
                  <div className="bg-emerald-600 text-white px-3 sm:px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>¡Marcador guardado con éxito! Tablas y estadísticas actualizadas en vivo.</span>
                  </div>
                )}

                {/* Alerta de Walkover activo */}
                {form.walkover === 'home_forfeit' && (
                  <div className="bg-rose-100 text-rose-900 px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-2 border-b border-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>⚠️ AUSENCIA: No se presentó {homeSchool?.shortName}. Victoria (2 pts) a {awaySchool?.shortName}.</span>
                  </div>
                )}

                {form.walkover === 'away_forfeit' && (
                  <div className="bg-rose-100 text-rose-900 px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-2 border-b border-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>⚠️ AUSENCIA: No se presentó {awaySchool?.shortName}. Victoria (2 pts) a {homeSchool?.shortName}.</span>
                  </div>
                )}

                {/* Enfrentamiento y Marcador Táctil (100% Vertical Centrado) */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* EQUIPO LOCAL (BLOQUE CENTRADO COMPLETO) */}
                  <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-2.5">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl sm:text-3xl shrink-0">{homeSchool?.logo || '🏫'}</span>
                      <div className="text-left">
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-wider block w-fit">
                          Equipo Local
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                          {homeSchool?.name || homeSchool?.shortName}
                        </h3>
                      </div>
                    </div>

                    {/* Stepper Tanteo Local Grande Centrado */}
                    <div className="flex items-center justify-center gap-2 pt-1 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={() => handleScoreChange(m.id, 'home', -1)}
                        className="w-12 h-11 sm:w-14 sm:h-12 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-90 text-slate-900 font-black text-2xl flex items-center justify-center transition cursor-pointer shadow-xs"
                        aria-label="Restar gol o punto local"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={form.homeScore}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setMatchForms((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], homeScore: Math.max(0, val), walkover: 'none' },
                          }));
                        }}
                        className="flex-1 h-11 sm:h-12 text-center font-mono font-black text-2xl sm:text-3xl bg-white border-2 border-slate-300 rounded-2xl text-slate-950 focus:border-amber-500 focus:ring-2 focus:ring-amber-400 focus:outline-hidden shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleScoreChange(m.id, 'home', 1)}
                        className="w-12 h-11 sm:w-14 sm:h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-90 text-slate-950 font-black text-2xl flex items-center justify-center transition cursor-pointer shadow-md"
                        aria-label="Sumar gol o punto local"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SEPARADOR VS Y CONTROL DE SETS */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                    {isVolleyball ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-sky-100/80 rounded-full border border-sky-200 text-xs font-bold">
                        <span className="text-[10px] font-black uppercase text-sky-900">🏐 Sets:</span>
                        <button
                          type="button"
                          onClick={() => handleSetsChange(m.id, 'home', 1)}
                          className="px-2.5 py-0.5 bg-sky-300 hover:bg-sky-400 text-sky-950 rounded-lg font-black text-xs transition cursor-pointer"
                        >
                          L: {form.homeSetsWon || 0}
                        </button>
                        <span className="text-slate-400 font-bold">-</span>
                        <button
                          type="button"
                          onClick={() => handleSetsChange(m.id, 'away', 1)}
                          className="px-2.5 py-0.5 bg-sky-300 hover:bg-sky-400 text-sky-950 rounded-lg font-black text-xs transition cursor-pointer"
                        >
                          V: {form.awaySetsWon || 0}
                        </button>
                      </div>
                    ) : (
                      <div className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-wider border border-slate-200">
                        VS
                      </div>
                    )}
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                  </div>

                  {/* EQUIPO VISITANTE (BLOQUE CENTRADO COMPLETO) */}
                  <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-2.5">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl sm:text-3xl shrink-0">{awaySchool?.logo || '🏫'}</span>
                      <div className="text-left">
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-wider block w-fit">
                          Equipo Visitante
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                          {awaySchool?.name || awaySchool?.shortName}
                        </h3>
                      </div>
                    </div>

                    {/* Stepper Tanteo Visita Grande Centrado */}
                    <div className="flex items-center justify-center gap-2 pt-1 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={() => handleScoreChange(m.id, 'away', -1)}
                        className="w-12 h-11 sm:w-14 sm:h-12 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-90 text-slate-900 font-black text-2xl flex items-center justify-center transition cursor-pointer shadow-xs"
                        aria-label="Restar gol o punto visita"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={form.awayScore}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setMatchForms((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], awayScore: Math.max(0, val), walkover: 'none' },
                          }));
                        }}
                        className="flex-1 h-11 sm:h-12 text-center font-mono font-black text-2xl sm:text-3xl bg-white border-2 border-slate-300 rounded-2xl text-slate-950 focus:border-amber-500 focus:ring-2 focus:ring-amber-400 focus:outline-hidden shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleScoreChange(m.id, 'away', 1)}
                        className="w-12 h-11 sm:w-14 sm:h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-90 text-slate-950 font-black text-2xl flex items-center justify-center transition cursor-pointer shadow-md"
                        aria-label="Sumar gol o punto visita"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ⚡ BOTONES RÁPIDOS DE CONDICIÓN / AUSENCIA Y GUARDADO */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-black uppercase text-slate-500 px-0.5">
                      <span>Condición del partido:</span>
                      {form.walkover !== 'none' && (
                        <span className="text-rose-600 font-black">⚠️ W.O. Aplicado</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => handleWalkoverApply(m.id, 'none')}
                        className={`py-2.5 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer ${
                          form.walkover === 'none' && form.status === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ✓ Jugado
                      </button>

                      <button
                        type="button"
                        onClick={() => handleWalkoverApply(m.id, 'home_forfeit')}
                        className={`py-2.5 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer truncate ${
                          form.walkover === 'home_forfeit'
                            ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title={`No se presentó ${homeSchool?.shortName} (W.O.). Queda en 0 pts y la visita gana 2 pts.`}
                      >
                        ⚠️ Aus. Local
                      </button>

                      <button
                        type="button"
                        onClick={() => handleWalkoverApply(m.id, 'away_forfeit')}
                        className={`py-2.5 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer truncate ${
                          form.walkover === 'away_forfeit'
                            ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title={`No se presentó ${awaySchool?.shortName} (W.O.). Queda en 0 pts y el local gana 2 pts.`}
                      >
                        ⚠️ Aus. Visita
                      </button>
                    </div>

                    {/* BOTÓN GUARDAR Y EXPANDIR */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                        className="p-3 text-slate-500 hover:text-slate-800 rounded-2xl bg-slate-100 hover:bg-slate-200 transition shrink-0 cursor-pointer"
                        title="Opcional: Goleador / MVP / Observaciones"
                        aria-label="Detalles adicionales"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveMatch(m.id)}
                        disabled={isSaving}
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-black text-sm transition shadow-md cursor-pointer disabled:opacity-50 ${
                          isSavedSuccess
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : 'bg-slate-950 hover:bg-slate-800 text-amber-300'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : isSavedSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>¡Marcador Guardado Oficial!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Guardar Marcador</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 📝 CAMPOS OPCIONALES COLAPSABLES */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-fade-in text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Goleador / Jugador Destacado (Opcional):</span>
                          </label>
                          <input
                            type="text"
                            value={form.mvpPlayerName || ''}
                            onChange={(e) => {
                              setMatchForms((prev) => ({
                                ...prev,
                                [m.id]: { ...prev[m.id], mvpPlayerName: e.target.value },
                              }));
                            }}
                            placeholder="Nombre del atleta"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 mb-1 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Observaciones del Árbitro / Cancha (Opcional):</span>
                          </label>
                          <input
                            type="text"
                            value={form.notes || ''}
                            onChange={(e) => {
                              setMatchForms((prev) => ({
                                ...prev,
                                [m.id]: { ...prev[m.id], notes: e.target.value },
                              }));
                            }}
                            placeholder="Observaciones de la mesa técnica"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📊 SECCIÓN DE ESTADÍSTICAS Y TABLAS DE POSICIONES EN TIEMPO REAL */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Tablas de Posiciones Oficiales (En Tiempo Real)
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedStandingsCatId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedStandingsCatId === cat.id
                    ? 'bg-slate-900 text-amber-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.sport === 'futbol' ? '⚽' : cat.sport === 'voleibol' ? '🏐' : '🏀'} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla compacta de posiciones */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] tracking-wider border-b border-slate-200 font-black">
              <tr>
                <th className="py-2.5 px-3 text-center w-10">Pos</th>
                <th className="py-2.5 px-3">Colegio</th>
                <th className="py-2.5 px-2 text-center" title="Partidos Jugados">PJ</th>
                <th className="py-2.5 px-2 text-center" title="Partidos Ganados">PG</th>
                {activeCategoryObj.sport === 'futbol' && (
                  <th className="py-2.5 px-2 text-center" title="Partidos Empatados">PE</th>
                )}
                <th className="py-2.5 px-2 text-center" title="Partidos Perdidos">PP</th>
                {activeCategoryObj.sport === 'voleibol' ? (
                  <>
                    <th className="py-2.5 px-2 text-center" title="Sets Ganados">SG</th>
                    <th className="py-2.5 px-2 text-center" title="Sets Perdidos">SP</th>
                    <th className="py-2.5 px-2 text-center" title="Diferencia de Sets">DS</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 px-2 text-center" title="Puntos/Goles a Favor">
                      {activeCategoryObj.sport === 'futbol' ? 'GF' : 'PF'}
                    </th>
                    <th className="py-2.5 px-2 text-center" title="Puntos/Goles en Contra">
                      {activeCategoryObj.sport === 'futbol' ? 'GC' : 'PC'}
                    </th>
                    <th className="py-2.5 px-2 text-center" title="Diferencia">
                      {activeCategoryObj.sport === 'futbol' ? 'DG' : 'DIF'}
                    </th>
                  </>
                )}
                <th className="py-2.5 px-3 text-center font-black text-slate-900 bg-amber-50 rounded-lg">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liveStandings.map((st, idx) => (
                <tr key={st.teamId} className={idx === 0 ? 'bg-amber-50/40 font-semibold' : 'hover:bg-slate-50/60'}>
                  <td className="py-2.5 px-3 text-center font-black text-slate-700">
                    {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">{st.school.logo || '🏫'}</span>
                    <span>{st.school.shortName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{st.played}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-emerald-700 font-bold">{st.won}</td>
                  {activeCategoryObj.sport === 'futbol' && (
                    <td className="py-2.5 px-2 text-center font-mono text-slate-500">{st.drawn}</td>
                  )}
                  <td className="py-2.5 px-2 text-center font-mono text-rose-600">{st.lost}</td>
                  {activeCategoryObj.sport === 'voleibol' ? (
                    <>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-700">{st.setsWon || 0}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-700">{st.setsLost || 0}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                        {(st.setsDiff || 0) > 0 ? `+${st.setsDiff}` : st.setsDiff || 0}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-700">{st.pointsFor}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-700">{st.pointsAgainst}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                        {st.diff > 0 ? `+${st.diff}` : st.diff}
                      </td>
                    </>
                  )}
                  <td className="py-2.5 px-3 text-center font-black text-slate-950 font-mono text-sm bg-amber-100/60 rounded-lg">
                    {st.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
