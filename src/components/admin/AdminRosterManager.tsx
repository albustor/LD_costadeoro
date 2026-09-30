'use client';

import React, { useState, useEffect } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { TeamRoster, Player, SportType, School } from '@/types/tournament';
import { rosterService } from '@/lib/rosterService';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Users, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Filter, 
  Award, 
  UserCheck, 
  RefreshCw,
  Edit3
} from 'lucide-react';

export function AdminRosterManager() {
  const { schools, categories } = useTournament();
  const [allRosters, setAllRosters] = useState<TeamRoster[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-fem-futbol');
  
  // Editor State
  const [coachName, setCoachName] = useState<string>('');
  const [assistantCoachName, setAssistantCoachName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cargar nóminas
  const reloadRosters = () => {
    const list = rosterService.getAllRosters();
    setAllRosters(list);
  };

  useEffect(() => {
    reloadRosters();

    const handleSync = () => reloadRosters();
    window.addEventListener('rosters_sync_updated', handleSync);
    window.addEventListener('roster_updated', handleSync);
    return () => {
      window.removeEventListener('rosters_sync_updated', handleSync);
      window.removeEventListener('roster_updated', handleSync);
    };
  }, []);

  // Cargar datos en el formulario cuando cambian los selectores
  useEffect(() => {
    const found = allRosters.find(
      (r) =>
        r.schoolId === selectedSchoolId &&
        r.sport === selectedSport &&
        r.categoryId === selectedCategoryId
    );

    if (found) {
      setCoachName(found.coachName || '');
      setAssistantCoachName(found.assistantCoachName || '');
      setPlayers(JSON.parse(JSON.stringify(found.players)));
    } else {
      setCoachName('');
      setAssistantCoachName('');
      setPlayers([
        { id: `p-admin-1`, jerseyNumber: 1, fullName: '', position: 'Portero/a', isCaptain: false, birthYear: 2011 },
        { id: `p-admin-2`, jerseyNumber: 2, fullName: '', position: 'Defensa', isCaptain: false, birthYear: 2011 },
        { id: `p-admin-3`, jerseyNumber: 3, fullName: '', position: 'Mediocampista', isCaptain: false, birthYear: 2011 },
        { id: `p-admin-4`, jerseyNumber: 4, fullName: '', position: 'Delantero/a', isCaptain: true, birthYear: 2011 },
      ]);
    }
  }, [selectedSchoolId, selectedSport, selectedCategoryId, allRosters]);

  // Exportar Excel Consolidado Maestro (todas las escuelas o escuela seleccionada)
  const handleExportMasterExcel = () => {
    const blob = rosterService.generateExcelWorkbook();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nomina_maestra_consolidada_costa_de_oro_2026.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Exportar Excel de la escuela seleccionada
  const handleExportSelectedSchoolExcel = () => {
    const currentSchool = schools.find((s) => s.id === selectedSchoolId);
    if (!currentSchool) return;

    const blob = rosterService.generateExcelWorkbook(currentSchool);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nomina_oficial_${currentSchool.id}_2026.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Carga Masiva desde Archivo Excel / CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = rosterService.parseUploadedContent(content, selectedSchoolId);

      if (parsed.rosters.length > 0) {
        rosterService.saveMultipleRosters(parsed.rosters);
        reloadRosters();
        setStatusMessage({
          type: 'success',
          text: `¡Importación exitosa! Se guardaron ${parsed.count} atletas en ${parsed.rosters.length} categorías.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No se detectaron atletas válidos en el archivo. Verifica el formato.',
        });
      }
    };
    reader.readAsText(file);
  };

  // Guardar Roster Actual
  const handleSaveRoster = () => {
    const validPlayers = players
      .filter((p) => p.fullName && p.fullName.trim().length > 0)
      .map((p, idx) => ({
        ...p,
        jerseyNumber: p.jerseyNumber || (idx + 1),
        fullName: p.fullName.trim(),
        position: p.position ? p.position.trim() : 'Jugador/a',
      }));

    const newRoster: TeamRoster = {
      schoolId: selectedSchoolId,
      sport: selectedSport,
      categoryId: selectedCategoryId,
      coachName: coachName.trim() || 'Entrenador Oficial',
      assistantCoachName: assistantCoachName.trim() || undefined,
      players: validPlayers,
      updatedAt: new Date().toISOString(),
    };

    rosterService.saveCategoryRoster(newRoster);
    reloadRosters();
    setStatusMessage({
      type: 'success',
      text: `¡Nómina guardada exitosamente! Se actualizaron ${validPlayers.length} atletas para la categoría.`,
    });

    setTimeout(() => {
      setStatusMessage(null);
    }, 2500);
  };

  // Manejo de Filas de Jugadores
  const handleAddPlayer = () => {
    const nextJersey = players.length > 0 ? Math.max(...players.map((p) => p.jerseyNumber || 0)) + 1 : 1;
    setPlayers([
      ...players,
      {
        id: `p-adm-${Date.now()}-${nextJersey}`,
        jerseyNumber: nextJersey,
        fullName: '',
        position: 'Jugador/a',
        isCaptain: false,
        birthYear: 2011,
      },
    ]);
  };

  const handleUpdatePlayer = (index: number, field: keyof Player, value: any) => {
    const updated = [...players];
    if (field === 'isCaptain' && value === true) {
      updated.forEach((p, idx) => {
        p.isCaptain = idx === index;
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setPlayers(updated);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, idx) => idx !== index));
  };

  // Estadísticas Globales
  const totalPlayersAll = allRosters.reduce((sum, r) => sum + r.players.length, 0);
  const totalCaptains = allRosters.reduce((sum, r) => sum + r.players.filter((p) => p.isCaptain).length, 0);

  const currentSchool = schools.find((s) => s.id === selectedSchoolId);
  const availableCategories = categories.filter((c) => c.sport === selectedSport);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
      {/* 🏷️ CABECERA Y BOTONES DE EXPORTACIÓN MAESTRA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-extrabold text-xs uppercase tracking-wider">
              Control de Nóminas y Planillas
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Sincronización en tiempo real</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-600" />
            <span>Gestor Central de Nóminas Oficiales</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Edita participantes por institución, exporta el libro consolidado en Excel o importa planillas masivas.
          </p>
        </div>

        {/* Botones de Exportación e Importación */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleExportMasterExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            title="Descargar libro de Excel (.xls) con todas las instituciones y categorías del torneo"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Todo en Excel (.xls)</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer border border-amber-500/30">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Importar Archivo Excel/CSV</span>
            <input
              type="file"
              accept=".xls,.xlsx,.csv,.txt,application/vnd.ms-excel,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 📊 TARJETAS DE MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold uppercase block">Total Atletas Inscritos</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{totalPlayersAll}</span>
        </div>
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
          <span className="text-[11px] text-amber-800 font-bold uppercase block">Equipos Registrados</span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 font-mono">{allRosters.length}</span>
        </div>
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
          <span className="text-[11px] text-emerald-800 font-bold uppercase block">Capitanes Designados</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">{totalCaptains}</span>
        </div>
        <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
          <span className="text-[11px] text-sky-800 font-bold uppercase block">Instituciones Activas</span>
          <span className="text-xl sm:text-2xl font-black text-sky-900 font-mono">{schools.length}</span>
        </div>
      </div>

      {/* 🏫 FILTROS Y SELECTORES DE EDICIÓN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Institución Educativa:</label>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.acronym})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Deporte:</label>
          <select
            value={selectedSport}
            onChange={(e) => {
              const sp = e.target.value as SportType;
              setSelectedSport(sp);
              const firstCat = categories.find((c) => c.sport === sp);
              if (firstCat) setSelectedCategoryId(firstCat.id);
            }}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
          >
            <option value="futbol">⚽ Fútbol</option>
            <option value="voleibol">🏐 Voleibol</option>
            <option value="baloncesto">🏀 Baloncesto</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Categoría:</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.division})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 👥 FORMULARIO DE CUERPO TÉCNICO Y ATLETAS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <SchoolEmblem schoolId={selectedSchoolId} size="sm" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Nómina: {currentSchool?.shortName} · {availableCategories.find((c) => c.id === selectedCategoryId)?.name}
              </h3>
              <span className="text-xs text-slate-500">
                {players.length} atletas registrados en este equipo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSelectedSchoolExcel}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel de este Colegio</span>
            </button>

            <button
              type="button"
              onClick={handleAddPlayer}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-extrabold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Agregar Atleta</span>
            </button>
          </div>
        </div>

        {/* Entrenadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Entrenador Principal:</label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="Profesor/a Principal"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Asistente Técnico:</label>
            <input
              type="text"
              value={assistantCoachName}
              onChange={(e) => setAssistantCoachName(e.target.value)}
              placeholder="Asistente o Delegado"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold"
            />
          </div>
        </div>

        {/* Tabla de Jugadores */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {players.map((p, idx) => (
            <div
              key={p.id || idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors"
            >
              <div className="w-14 shrink-0">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={p.jerseyNumber || ''}
                  onChange={(e) => handleUpdatePlayer(idx, 'jerseyNumber', parseInt(e.target.value, 10) || '')}
                  placeholder="#"
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-center font-mono font-black text-xs text-amber-950"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={p.fullName}
                  onChange={(e) => handleUpdatePlayer(idx, 'fullName', e.target.value)}
                  placeholder="Nombre y Apellidos del atleta..."
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 font-bold text-xs text-slate-900"
                />
              </div>

              <div className="w-28 shrink-0 hidden sm:block">
                <input
                  type="text"
                  value={p.position || ''}
                  onChange={(e) => handleUpdatePlayer(idx, 'position', e.target.value)}
                  placeholder="Posición"
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 font-medium"
                />
              </div>

              <div className="w-20 shrink-0 hidden sm:block">
                <input
                  type="number"
                  value={p.birthYear || ''}
                  onChange={(e) => handleUpdatePlayer(idx, 'birthYear', parseInt(e.target.value, 10) || undefined)}
                  placeholder="Año"
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-center font-mono text-slate-700"
                />
              </div>

              <button
                type="button"
                onClick={() => handleUpdatePlayer(idx, 'isCaptain', !p.isCaptain)}
                className={`p-2 rounded-lg text-xs font-black transition-colors shrink-0 cursor-pointer ${
                  p.isCaptain
                    ? 'bg-amber-400 text-slate-950 shadow-2xs ring-1 ring-amber-500'
                    : 'bg-slate-200 text-slate-400 hover:bg-slate-300 hover:text-slate-700'
                }`}
                title={p.isCaptain ? 'Es Capitán' : 'Marcar como Capitán'}
              >
                ©
              </button>

              <button
                type="button"
                onClick={() => handleRemovePlayer(idx)}
                className="p-2 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-colors shrink-0 cursor-pointer"
                title="Eliminar jugador"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Mensaje de Estado */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                : 'bg-rose-100 border-rose-300 text-rose-950'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Botón de Guardado */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveRoster}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Nómina y Sincronizar con Toda la Plataforma</span>
          </button>
        </div>
      </div>
    </div>
  );
}
