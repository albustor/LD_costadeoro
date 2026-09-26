'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Match, MatchStatus } from '@/types/tournament';
import { 
  Lock, 
  Unlock, 
  Save, 
  RefreshCw, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';
import { tournamentStorage } from '@/lib/storageAdapter';

export function AdminControlPanel() {
  const { matches, updateMatch, getSchoolById, getCategoryById } = useTournament();
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Selected match for editing
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [homeSetsWon, setHomeSetsWon] = useState<number>(0);
  const [awaySetsWon, setAwaySetsWon] = useState<number>(0);
  const [status, setStatus] = useState<MatchStatus>('live');
  const [currentPeriod, setCurrentPeriod] = useState<string>('1.er Tiempo');
  const [minute, setMinute] = useState<number>(25);
  const [mvpPlayerName, setMvpPlayerName] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2026' || pin === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
      loadMatchData(selectedMatchId);
    } else {
      setAuthError(true);
    }
  };

  const loadMatchData = (mId: string) => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const original = matches.find((m) => m.id === selectedMatchId);
    if (!original) return;

    const updated: Match = {
      ...original,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      homeSetsWon: original.sport === 'voleibol' ? Number(homeSetsWon) : undefined,
      awaySetsWon: original.sport === 'voleibol' ? Number(awaySetsWon) : undefined,
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

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restaurar todos los datos iniciales de la temporada?')) {
      tournamentStorage.resetToInitial();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Mesa de Control y Actas</h2>
        <p className="text-xs text-slate-500 mb-6">
          Ingreso exclusivo para jueces de mesa y coordinadores deportivos de la Liga Costa de Oro.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Ingresa el PIN de acceso (2026)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {authError && (
            <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              PIN incorrecto. (PIN oficial: 2026)
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
          >
            Desbloquear Mesa de Control
          </button>
        </form>
      </div>
    );
  }

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const homeSchool = selectedMatch ? getSchoolById(selectedMatch.homeTeamId) : null;
  const awaySchool = selectedMatch ? getSchoolById(selectedMatch.awayTeamId) : null;
  const category = selectedMatch ? getCategoryById(selectedMatch.categoryId) : null;

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Mesa de Control Deportiva</h2>
            <span className="text-xs text-slate-500">Actualización en tiempo real sin hojas de cálculo</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5"
            title="Restaurar datos semilla"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Datos</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Match Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
          Seleccionar Encuentro para Carga o Modificación
        </label>
        <select
          value={selectedMatchId}
          onChange={(e) => loadMatchData(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
        >
          {matches.map((m) => {
            const h = getSchoolById(m.homeTeamId);
            const a = getSchoolById(m.awayTeamId);
            const cat = getCategoryById(m.categoryId);
            return (
              <option key={m.id} value={m.id}>
                [{cat?.sport.toUpperCase()}] {h?.shortName} vs {a?.shortName} ({m.jornadaName} - {m.time}) [{m.status.toUpperCase()}]
              </option>
            );
          })}
        </select>
      </div>

      {/* Form */}
      {selectedMatch && (
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          {/* Match Info Summary Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{homeSchool?.logo}</span>
              <span className="font-bold text-slate-900 text-sm">{homeSchool?.name}</span>
            </div>
            <div>
              <span className="text-xs text-amber-800 font-bold block">{category?.name}</span>
              <span className="text-[11px] text-slate-500">{selectedMatch.venue}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{awaySchool?.name}</span>
              <span className="text-2xl">{awaySchool?.logo}</span>
            </div>
          </div>

          {/* Score Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Puntos / Goles: {homeSchool?.shortName}
              </label>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                className="w-full text-center font-mono font-black text-2xl py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500"
              />
              {selectedMatch.sport === 'voleibol' && (
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Sets Ganados</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={homeSetsWon}
                    onChange={(e) => setHomeSetsWon(Number(e.target.value))}
                    className="w-full text-center font-mono text-sm py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Puntos / Goles: {awaySchool?.shortName}
              </label>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                className="w-full text-center font-mono font-black text-2xl py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500"
              />
              {selectedMatch.sport === 'voleibol' && (
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Sets Ganados</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={awaySetsWon}
                    onChange={(e) => setAwaySetsWon(Number(e.target.value))}
                    className="w-full text-center font-mono text-sm py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status, Period, Minute */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado del Encuentro
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MatchStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="live">🔴 En Vivo (Activo)</option>
                <option value="completed">🟢 Finalizado (Oficial)</option>
                <option value="scheduled">⚪ Programado / Por Iniciar</option>
                <option value="postponed">🟡 Pospuesto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiempo / Periodo Actual
              </label>
              <input
                type="text"
                placeholder="Ej. 1.er Tiempo, Set 2, Q3"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minuto de Juego (si aplica)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* MVP Player Award */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Jugador Más Valioso (MVP Oficial del Partido)</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Sofía Brenes (La Paz CV)"
              value={mvpPlayerName}
              onChange={(e) => setMvpPlayerName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                ¡Acta y marcadores actualizados instantáneamente!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                La tabla de posiciones se recalcula de inmediato.
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar y Publicar Acta</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
