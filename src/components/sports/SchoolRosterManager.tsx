'use client';

import React, { useState, useEffect } from 'react';
import { School, Player, TeamRoster, SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { 
  Users, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Award,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { rosterService } from '@/lib/rosterService';

interface SchoolRosterManagerProps {
  activeSchool: School;
}

function isCategoryMatch(rosterCatId: string, targetCatId: string): boolean {
  if (!rosterCatId || !targetCatId) return false;
  if (rosterCatId === targetCatId) return true;
  if ((rosterCatId === 'cat-fem-c-voley' || rosterCatId === 'cat-c-voleibol') && (targetCatId === 'cat-fem-c-voley' || targetCatId === 'cat-c-voleibol')) return true;
  if ((rosterCatId === 'cat-fem-d-voley' || rosterCatId === 'cat-d-voleibol') && (targetCatId === 'cat-fem-d-voley' || targetCatId === 'cat-d-voleibol')) return true;
  if ((rosterCatId === 'cat-c-basket' || rosterCatId === 'cat-c-baloncesto') && (targetCatId === 'cat-c-basket' || targetCatId === 'cat-c-baloncesto')) return true;
  if ((rosterCatId === 'cat-d-basket' || rosterCatId === 'cat-d-baloncesto') && (targetCatId === 'cat-d-basket' || targetCatId === 'cat-d-baloncesto')) return true;
  return false;
}

export function SchoolRosterManager({ activeSchool }: SchoolRosterManagerProps) {
  const { categories } = useTournament();
  const [activeSport, setActiveSport] = useState<SportType>('futbol');
  const [rosters, setRosters] = useState<TeamRoster[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Cargar y sincronizar nóminas de la institución activa
  const loadSchoolRosters = () => {
    const loaded = rosterService.getRostersBySchool(activeSchool.id);
    setRosters(loaded);
  };

  useEffect(() => {
    loadSchoolRosters();

    // Sincronizar con la base de datos central en segundo plano
    rosterService.fetchRemoteRosters().then((remotes) => {
      if (remotes && remotes.length > 0) {
        setRosters(remotes.filter((r) => r.schoolId === activeSchool.id));
      }
    }).catch((err) => {
      console.warn('[SchoolRosterManager] Error al sincronizar con /api/rosters:', err);
    });

    const handleRosterUpdate = () => loadSchoolRosters();
    window.addEventListener('roster_updated', handleRosterUpdate);
    window.addEventListener('rosters_sync_updated', handleRosterUpdate);
    return () => {
      window.removeEventListener('roster_updated', handleRosterUpdate);
      window.removeEventListener('rosters_sync_updated', handleRosterUpdate);
    };
  }, [activeSchool.id]);

  // Categorías de la disciplina activa
  const sportCategories = categories.filter((c) => c.sport === activeSport);

  // Abrir la primera categoría del deporte activo por defecto
  useEffect(() => {
    if (sportCategories.length > 0) {
      // Buscar si alguna tiene jugadores inscritos primero
      const firstWithPlayers = sportCategories.find((cat) => {
        const r = rosters.find((item) => isCategoryMatch(item.categoryId, cat.id) && item.schoolId === activeSchool.id);
        return r && r.players && r.players.length > 0;
      });
      setExpandedCategoryId(firstWithPlayers ? firstWithPlayers.id : sportCategories[0].id);
    } else {
      setExpandedCategoryId(null);
    }
  }, [activeSport, activeSchool.id, rosters.length]);

  // Descargar archivo Excel oficial de la institución
  const handleDownloadExcel = () => {
    const blob = rosterService.generateExcelWorkbook(activeSchool);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nomina_oficial_${activeSchool.id}_2026.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Conteo de atletas por disciplina
  const countPlayersBySport = (sport: SportType) => {
    return rosters
      .filter((r) => r.sport === sport && r.schoolId === activeSchool.id)
      .reduce((sum, r) => sum + (r.players?.length || 0), 0);
  };

  const futbolCount = countPlayersBySport('futbol');
  const voleibolCount = countPlayersBySport('voleibol');
  const baloncestoCount = countPlayersBySport('baloncesto');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-5">
      {/* 🏷️ CABECERA LIGERA */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-amber-50/20 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
              Nómina Oficial 2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Plantel de Atletas</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Integrantes y Atletas de {activeSchool.shortName}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Consulta los deportistas y cuerpos técnicos acreditados por disciplina para el Festival Deportivo.
          </p>
        </div>

        {/* Botón de Descarga Excel */}
        <button
          type="button"
          onClick={handleDownloadExcel}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold shadow-2xs transition-all cursor-pointer hover:border-amber-400 self-start sm:self-center shrink-0"
          title="Descargar nómina oficial en formato Excel (.xls)"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Descargar Nómina (.xls)</span>
        </button>
      </div>

      <div className="px-4 sm:px-6 space-y-4 pb-6">
        {/* ⚽🏐🏀 PESTAÑAS DEPORTIVAS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSport('futbol')}
            className={`py-2 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
              activeSport === 'futbol'
                ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span>⚽ Fútbol</span>
            <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-black ${
              activeSport === 'futbol' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {futbolCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSport('voleibol')}
            className={`py-2 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
              activeSport === 'voleibol'
                ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span>🏐 Voleibol</span>
            <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-black ${
              activeSport === 'voleibol' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {voleibolCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSport('baloncesto')}
            className={`py-2 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
              activeSport === 'baloncesto'
                ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span>🏀 Baloncesto</span>
            <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-black ${
              activeSport === 'baloncesto' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {baloncestoCount}
            </span>
          </button>
        </div>

        {/* 📑 ACORDEÓN POR CATEGORÍAS */}
        <div className="space-y-3">
          {sportCategories.length > 0 ? (
            sportCategories.map((cat) => {
              const roster = rosters.find(
                (r) => r.schoolId === activeSchool.id && r.sport === activeSport && isCategoryMatch(r.categoryId, cat.id)
              );
              const playersList = roster?.players || [];
              const isExpanded = expandedCategoryId === cat.id;
              const coachName = roster?.coachName?.trim();

              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'border-amber-400/80 bg-white shadow-xs' 
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Encabezado del Acordeón (Botón Toggle) */}
                  <button
                    type="button"
                    onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                    className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-xs sm:text-sm md:text-base">
                          {cat.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                          {cat.division}
                        </span>
                      </div>

                      {coachName && coachName !== 'Por definir' && (
                        <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium mt-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Entrenador: <strong className="text-slate-800 font-bold">{coachName}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border ${
                        playersList.length > 0
                          ? 'bg-amber-50 text-amber-950 border-amber-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {playersList.length} {playersList.length === 1 ? 'Atleta' : 'Atletas'}
                      </span>

                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Cuerpo Desplegable de Atletas */}
                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-100 bg-white space-y-3 animate-fade-in">
                      {playersList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                          {playersList.map((player) => (
                            <div
                              key={player.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all shadow-2xs ${
                                player.isCaptain
                                  ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/30'
                                  : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {/* Número de Jugador */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                  player.isCaptain
                                    ? 'bg-amber-400 text-slate-950 shadow-2xs'
                                    : 'bg-white border border-slate-200 text-slate-900'
                                }`}>
                                  #{player.jerseyNumber || '—'}
                                </div>

                                {/* Nombre Completo */}
                                <div className="min-w-0">
                                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 block truncate leading-tight">
                                    {player.fullName}
                                  </span>
                                  {player.position && player.position !== 'Jugador/a' && (
                                    <span className="text-[10.5px] text-slate-500 font-medium block truncate">
                                      {player.position}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Distintivo de Capitán */}
                              {player.isCaptain && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950 font-black text-[10px] uppercase tracking-wider shrink-0 border border-amber-300">
                                  <Award className="w-3 h-3 text-amber-800" />
                                  <span>Capitán</span>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                          Nómina en fase de acreditación técnica oficial para esta categoría.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No hay categorías configuradas para esta disciplina.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
