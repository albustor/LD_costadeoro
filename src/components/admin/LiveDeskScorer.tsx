'use client';

import React, { useState } from 'react';
import { Match, MatchStatus, MatchEvent, SetScore, QuarterScore } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { OfficialMatchSheet } from '@/components/sports/OfficialMatchSheet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Plus, 
  Minus, 
  Award, 
  FileText, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Flame, 
  Flag,
  UserCheck
} from 'lucide-react';

export function LiveDeskScorer() {
  const { matches, updateMatch, getSchoolById, getCategoryById } = useTournament();
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [showOfficialSheet, setShowOfficialSheet] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const currentMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  // Local working state for the active match
  const [homeScore, setHomeScore] = useState<number>(currentMatch?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState<number>(currentMatch?.awayScore ?? 0);
  const [status, setStatus] = useState<MatchStatus>(currentMatch?.status ?? 'scheduled');
  const [currentPeriod, setCurrentPeriod] = useState<string>(currentMatch?.currentPeriod ?? '1.er Tiempo');
  const [minute, setMinute] = useState<number>(currentMatch?.minute ?? 0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [mvpPlayerName, setMvpPlayerName] = useState<string>(currentMatch?.mvpPlayerName ?? '');
  const [notes, setNotes] = useState<string>(currentMatch?.notes ?? '');

  // Sets & Quarters
  const [sets, setSets] = useState<SetScore[]>(currentMatch?.setScores || [
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ]);
  const [quarters, setQuarters] = useState<QuarterScore[]>(currentMatch?.quarterScores || [
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ]);

  // Referee info
  const [refereeName, setRefereeName] = useState<string>(currentMatch?.officialReport?.refereeName || 'Lic. Árbitro Principal FCF');
  const [homeDelegate, setHomeDelegate] = useState<string>(currentMatch?.officialReport?.homeDelegate || '');
  const [awayDelegate, setAwayDelegate] = useState<string>(currentMatch?.officialReport?.awayDelegate || '');

  // Match switch handler
  const handleSelectMatch = (mId: string) => {
    const target = matches.find((m) => m.id === mId);
    if (target) {
      setSelectedMatchId(mId);
      setHomeScore(target.homeScore);
      setAwayScore(target.awayScore);
      setStatus(target.status);
      setCurrentPeriod(target.currentPeriod || '1.er Tiempo');
      setMinute(target.minute || 0);
      setMvpPlayerName(target.mvpPlayerName || '');
      setNotes(target.notes || '');
      if (target.setScores) setSets(target.setScores);
      if (target.quarterScores) setQuarters(target.quarterScores);
      if (target.officialReport) {
        setRefereeName(target.officialReport.refereeName || 'Lic. Árbitro Principal FCF');
        setHomeDelegate(target.officialReport.homeDelegate || '');
        setAwayDelegate(target.officialReport.awayDelegate || '');
      }
    }
  };

  const home = getSchoolById(currentMatch?.homeTeamId);
  const away = getSchoolById(currentMatch?.awayTeamId);
  const category = getCategoryById(currentMatch?.categoryId);

  // Quick Score adjust
  const adjustScore = (side: 'home' | 'away', delta: number) => {
    if (side === 'home') {
      setHomeScore((prev) => Math.max(0, prev + delta));
    } else {
      setAwayScore((prev) => Math.max(0, prev + delta));
    }
  };

  // Quick Save
  const handleSaveMatchData = () => {
    if (!currentMatch) return;

    const updated: Match = {
      ...currentMatch,
      homeScore,
      awayScore,
      status,
      currentPeriod,
      minute,
      mvpPlayerName,
      notes,
      setScores: currentMatch.sport === 'voleibol' ? sets : undefined,
      quarterScores: currentMatch.sport === 'baloncesto' ? quarters : undefined,
      officialReport: {
        refereeName,
        homeDelegate: homeDelegate || `Delegado ${home?.shortName}`,
        awayDelegate: awayDelegate || `Delegado ${away?.shortName}`,
        isSigned: true,
        signedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    updateMatch(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 🧭 SELECTOR RÁPIDO DE PARTIDO PARA MESA DE CONTROL */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-amber-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-xs sm:text-sm tracking-wide">
              Mesa Técnica · Consola de Marcador en Vivo
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            {matches.length} Encuentros Registrados
          </span>
        </div>

        <select
          value={selectedMatchId}
          onChange={(e) => handleSelectMatch(e.target.value)}
          className="w-full bg-slate-950 text-white text-xs sm:text-sm font-semibold rounded-2xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          {matches.map((m) => {
            const h = getSchoolById(m.homeTeamId);
            const a = getSchoolById(m.awayTeamId);
            const cat = getCategoryById(m.categoryId);
            return (
              <option key={m.id} value={m.id}>
                {m.jornadaName} | {m.sport.toUpperCase()} ({cat?.name || 'Cat'}) : {h?.shortName} vs {a?.shortName} [{m.status.toUpperCase()} - {m.homeScore}:{m.awayScore}]
              </option>
            );
          })}
        </select>
      </div>

      {/* 🏟️ TABLERO DE CONTROL TÁCTIL EN VIVO */}
      {currentMatch && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-6">
          
          {/* Header del Encuentro Activo */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs uppercase">
                  {currentMatch.sport} · {category?.name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-bold">{currentMatch.jornadaName}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentMatch.venue} | {currentMatch.date} a las {currentMatch.time}
              </p>
            </div>

            {/* Selector de Estado del Partido */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              {(['scheduled', 'live', 'completed'] as MatchStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    status === st
                      ? st === 'live'
                        ? 'bg-red-600 text-white shadow-sm'
                        : st === 'completed'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'scheduled' ? 'Programado' : st === 'live' ? '🔴 En Vivo' : '✓ Finalizado'}
                </button>
              ))}
            </div>
          </div>

          {/* Marcador Central Interactivo */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            
            {/* Equipo Local (Control de Puntuación) */}
            <div className="md:col-span-3 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-3xl border border-slate-200 flex flex-col items-center text-center gap-3">
              <SchoolEmblem schoolId={home?.id || ''} size="lg" />
              <div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight block">
                  {home?.name}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">(Local)</span>
              </div>

              {/* Número de Marcador */}
              <div className="font-mono text-5xl sm:text-6xl font-black text-slate-950 py-1 select-none">
                {homeScore}
              </div>

              {/* Botones de Ajuste Rápido */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
                <button
                  onClick={() => adjustScore('home', 1)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> +1
                </button>
                {currentMatch.sport === 'baloncesto' && (
                  <>
                    <button
                      onClick={() => adjustScore('home', 2)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
                    >
                      +2
                    </button>
                    <button
                      onClick={() => adjustScore('home', 3)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
                    >
                      +3
                    </button>
                  </>
                )}
                <button
                  onClick={() => adjustScore('home', -1)}
                  className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs active:scale-95 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Centro: Periodo y Tiempo */}
            <div className="md:col-span-1 flex flex-col items-center text-center gap-3 py-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Periodo Actual
                </span>
                <input
                  type="text"
                  value={currentPeriod}
                  onChange={(e) => setCurrentPeriod(e.target.value)}
                  placeholder="1.er Tiempo"
                  className="w-28 text-center text-xs font-extrabold bg-slate-100 border border-slate-300 rounded-xl py-1.5 px-2 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Botones de Periodo Rápido */}
              <div className="flex flex-wrap items-center justify-center gap-1 max-w-[140px]">
                {currentMatch.sport === 'futbol' && (
                  <>
                    <button
                      onClick={() => setCurrentPeriod('1.er Tiempo')}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      1T
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('2.° Tiempo')}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      2T
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPeriod('Final');
                        setStatus('completed');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[10px] font-bold text-emerald-800"
                    >
                      Fin
                    </button>
                  </>
                )}
                {currentMatch.sport === 'voleibol' && (
                  <>
                    <button
                      onClick={() => setCurrentPeriod('Set 1')}
                      className="px-2 py-0.5 rounded-lg bg-sky-100 text-[10px] font-bold text-sky-800"
                    >
                      S1
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('Set 2')}
                      className="px-2 py-0.5 rounded-lg bg-sky-100 text-[10px] font-bold text-sky-800"
                    >
                      S2
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('Set 3')}
                      className="px-2 py-0.5 rounded-lg bg-sky-100 text-[10px] font-bold text-sky-800"
                    >
                      S3
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPeriod('Final');
                        setStatus('completed');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 text-[10px] font-bold text-emerald-800"
                    >
                      Fin
                    </button>
                  </>
                )}
                {currentMatch.sport === 'baloncesto' && (
                  <>
                    <button
                      onClick={() => setCurrentPeriod('Q1')}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-800"
                    >
                      Q1
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('Q2')}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-800"
                    >
                      Q2
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('Q3')}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-800"
                    >
                      Q3
                    </button>
                    <button
                      onClick={() => setCurrentPeriod('Q4')}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-800"
                    >
                      Q4
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Equipo Visitante (Control de Puntuación) */}
            <div className="md:col-span-3 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-sky-50/40 rounded-3xl border border-slate-200 flex flex-col items-center text-center gap-3">
              <SchoolEmblem schoolId={away?.id || ''} size="lg" />
              <div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight block">
                  {away?.name}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">(Visitante)</span>
              </div>

              {/* Número de Marcador */}
              <div className="font-mono text-5xl sm:text-6xl font-black text-slate-950 py-1 select-none">
                {awayScore}
              </div>

              {/* Botones de Ajuste Rápido */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
                <button
                  onClick={() => adjustScore('away', 1)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> +1
                </button>
                {currentMatch.sport === 'baloncesto' && (
                  <>
                    <button
                      onClick={() => adjustScore('away', 2)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
                    >
                      +2
                    </button>
                    <button
                      onClick={() => adjustScore('away', 3)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
                    >
                      +3
                    </button>
                  </>
                )}
                <button
                  onClick={() => adjustScore('away', -1)}
                  className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs active:scale-95 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 DATOS ADICIONALES DEL ACTA: MVP, ÁRBITRO Y NOTAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Jugador MVP del Partido:</span>
              </label>
              <input
                type="text"
                value={mvpPlayerName}
                onChange={(e) => setMvpPlayerName(e.target.value)}
                placeholder="Nombre del atleta destacado..."
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Árbitro Principal:</span>
              </label>
              <input
                type="text"
                value={refereeName}
                onChange={(e) => setRefereeName(e.target.value)}
                placeholder="Nombre del árbitro..."
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-slate-600" />
                <span>Observaciones / Reseña:</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reseña o incidencias técnicas..."
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 🔘 BARRA DE ACCIÓN: GUARDAR EN VIVO & ABRIR ACTA OFICIAL */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveMatchData}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar y Publicar en Vivo</span>
              </button>

              {savedFeedback && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Marcador y Acta Actualizados!
                </span>
              )}
            </div>

            <button
              onClick={() => setShowOfficialSheet(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Acta Oficial para Impresión</span>
            </button>
          </div>
        </div>
      )}

      {/* 📄 MODAL DE ACTA OFICIAL */}
      {showOfficialSheet && currentMatch && (
        <OfficialMatchSheet
          match={{
            ...currentMatch,
            homeScore,
            awayScore,
            status,
            currentPeriod,
            minute,
            mvpPlayerName,
            notes,
            officialReport: {
              refereeName,
              homeDelegate: homeDelegate || `Delegado ${home?.shortName}`,
              awayDelegate: awayDelegate || `Delegado ${away?.shortName}`,
              isSigned: true,
              signedAt: new Date().toISOString(),
            },
          }}
          onClose={() => setShowOfficialSheet(false)}
        />
      )}
    </div>
  );
}
