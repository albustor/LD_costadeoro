'use client';

import React, { useState, useEffect } from 'react';
import { School, Player, TeamRoster, SportType } from '@/types/tournament';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Users, 
  Download, 
  Upload, 
  ShieldCheck, 
  Lock, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  UserCheck, 
  Award,
  Plus,
  Trash2,
  Save,
  FileText,
  Sparkles,
  Edit3
} from 'lucide-react';
import { TOURNAMENT_CONFIG } from '@/config/tournamentConfig';
import { rosterService } from '@/lib/rosterService';

interface SchoolRosterManagerProps {
  activeSchool: School;
}

const VALID_SCHOOL_PINS: Record<string, string> = {
  'la-paz-cabo-velas': '1001',
  'la-paz-tempisque': '1002',
  'cria': '2001',
  'journey-school': '3001',
  'vittorino': '4001',
  'educarte': '5001',
};

export function SchoolRosterManager({ activeSchool }: SchoolRosterManagerProps) {
  const { categories } = useTournament();
  const { t } = useLanguage();
  const [activeSport, setActiveSport] = useState<SportType>('futbol');
  const [rosters, setRosters] = useState<TeamRoster[]>([]);
  
  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'form' | 'excel'>('form');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Form Editing State
  const [formSport, setFormSport] = useState<SportType>('futbol');
  const [formCategoryId, setFormCategoryId] = useState<string>('cat-fem-futbol');
  const [formCoach, setFormCoach] = useState<string>('');
  const [formAssistant, setFormAssistant] = useState<string>('');
  const [formPlayers, setFormPlayers] = useState<Player[]>([]);

  // Cargar y sincronizar nóminas de la institución activa
  const loadSchoolRosters = () => {
    const loaded = rosterService.getRostersBySchool(activeSchool.id);
    setRosters(loaded);
  };

  useEffect(() => {
    loadSchoolRosters();

    // Sincronizar con la base de datos central en background
    rosterService.fetchRemoteRosters().then(() => {
      loadSchoolRosters();
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

  // Al cambiar deporte o categoría en el formulario, cargar los datos actuales si existen
  useEffect(() => {
    if (!isPinUnlocked) return;
    const existing = rosters.find(
      (r) => r.schoolId === activeSchool.id && r.sport === formSport && r.categoryId === formCategoryId
    );

    if (existing) {
      setFormCoach(existing.coachName || '');
      setFormAssistant(existing.assistantCoachName || '');
      setFormPlayers(JSON.parse(JSON.stringify(existing.players)));
    } else {
      setFormCoach('');
      setFormAssistant('');
      // Inicializar con 5 filas vacías para facilitar la digitación
      setFormPlayers([
        { id: `p-new-1`, jerseyNumber: 1, fullName: '', position: '', isCaptain: false, birthYear: 2011 },
        { id: `p-new-2`, jerseyNumber: 2, fullName: '', position: '', isCaptain: false, birthYear: 2011 },
        { id: `p-new-3`, jerseyNumber: 3, fullName: '', position: '', isCaptain: false, birthYear: 2011 },
        { id: `p-new-4`, jerseyNumber: 4, fullName: '', position: '', isCaptain: false, birthYear: 2011 },
        { id: `p-new-5`, jerseyNumber: 5, fullName: '', position: '', isCaptain: false, birthYear: 2011 },
      ]);
    }
  }, [formSport, formCategoryId, isPinUnlocked, activeSchool.id]);

  // Descargar archivo Excel nativo (.xls Spreadsheet XML 2003)
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

  // Validar PIN Institucional
  const handleValidatePin = () => {
    const cleanPin = enteredPin.trim().toUpperCase();
    const schoolPin = VALID_SCHOOL_PINS[activeSchool.id];

    if (
      cleanPin === schoolPin ||
      cleanPin === 'COSTA2026' ||
      cleanPin === '2026' ||
      TOURNAMENT_CONFIG.security?.validPins?.includes(cleanPin)
    ) {
      setIsPinUnlocked(true);
      setPinError(null);
    } else {
      setPinError(`PIN inválido. Ingresa el PIN institucional asignado a ${activeSchool.shortName} (ej: ${schoolPin || '2026'}).`);
    }
  };

  // Manejo de Jugadores en el Formulario Táctil
  const handleAddPlayerRow = () => {
    const nextJersey = formPlayers.length > 0 
      ? Math.max(...formPlayers.map((p) => p.jerseyNumber || 0)) + 1 
      : 1;

    setFormPlayers([
      ...formPlayers,
      {
        id: `p-${activeSchool.id}-${Date.now()}-${nextJersey}`,
        jerseyNumber: nextJersey,
        fullName: '',
        position: '',
        isCaptain: false,
        birthYear: 2011,
      },
    ]);
  };

  const handleUpdatePlayer = (index: number, field: keyof Player, value: any) => {
    const updated = [...formPlayers];
    if (field === 'isCaptain' && value === true) {
      // Si se marca como capitán, desmarcar a los demás de este equipo
      updated.forEach((p, idx) => {
        p.isCaptain = idx === index;
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormPlayers(updated);
  };

  const handleRemovePlayerRow = (index: number) => {
    const updated = formPlayers.filter((_, idx) => idx !== index);
    setFormPlayers(updated);
  };

  // Guardar nómina desde el Formulario Digital Directo
  const handleSaveFormRoster = () => {
    const validPlayers = formPlayers
      .filter((p) => p.fullName && p.fullName.trim().length > 0)
      .map((p, idx) => ({
        ...p,
        jerseyNumber: p.jerseyNumber || (idx + 1),
        fullName: p.fullName.trim(),
        position: p.position ? p.position.trim() : 'Jugador/a',
      }));

    if (validPlayers.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor ingresa al menos el nombre de un atleta para guardar la nómina.',
      });
      return;
    }

    const newRoster: TeamRoster = {
      schoolId: activeSchool.id,
      sport: formSport,
      categoryId: formCategoryId,
      coachName: formCoach.trim() || 'Entrenador Oficial',
      assistantCoachName: formAssistant.trim() || undefined,
      players: validPlayers,
      updatedAt: new Date().toISOString(),
    };

    rosterService.saveCategoryRoster(newRoster);
    setStatusMessage({
      type: 'success',
      text: `¡Nómina guardada exitosamente! Se registraron ${validPlayers.length} atletas para ${activeSchool.shortName}.`,
    });

    setTimeout(() => {
      setShowModal(false);
      setStatusMessage(null);
    }, 1800);
  };

  // Carga y procesamiento del archivo Excel / CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = rosterService.parseUploadedContent(content, activeSchool.id);

      if (parsed.rosters.length > 0) {
        rosterService.saveMultipleRosters(parsed.rosters);
        setStatusMessage({
          type: 'success',
          text: `¡Archivo procesado exitosamente! Se importaron ${parsed.count} atletas en ${parsed.rosters.length} categorías para ${activeSchool.shortName}.`,
        });
        setTimeout(() => {
          setShowModal(false);
          setStatusMessage(null);
        }, 2000);
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No se detectaron atletas válidos en el archivo. Asegúrate de usar la plantilla oficial.',
        });
      }
    };
    reader.readAsText(file);
  };

  const filteredRosters = rosters.filter((r) => r.sport === activeSport);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6">
      {/* 🏷️ CABECERA DE LA NÓMINA CON ACCIONES */}
      <div className="p-5 sm:p-7 bg-gradient-to-r from-slate-50 via-amber-50/30 to-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
              Nómina Oficial 2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">Inscripciones y Cuerpo Técnico</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight mt-0.5 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            <span>Integrantes y Atletas de {activeSchool.shortName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Consulta la lista de jugadores inscritos por disciplina, o abre el formulario digital protegido por PIN para inscribir o actualizar integrantes.
          </p>
        </div>

        {/* Botones de Acción Rápida (Descargar Excel y Abrir Formulario / Subir) */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer hover:border-amber-400"
            title="Descargar lista oficial en formato Excel (.xls) para actas o impresión"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Descargar Excel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowModal(true);
              setIsPinUnlocked(false);
              setEnteredPin('');
              setPinError(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer border border-amber-500/40"
            title="Inscribir o editar atletas mediante Formulario Digital o Archivo Excel"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Inscribir / Editar Nómina</span>
          </button>
        </div>
      </div>

      {/* ⚽🏐🏀 SELECTOR DE DISCIPLINA PARA NÓMINA */}
      <div className="px-5 sm:px-7 space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
            Filtrar Atletas por Deporte:
          </span>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <button
              onClick={() => setActiveSport('futbol')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSport === 'futbol'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <span>⚽ Fútbol</span>
            </button>

            <button
              onClick={() => setActiveSport('voleibol')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSport === 'voleibol'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-sky-900 hover:bg-sky-50'
              }`}
            >
              <span>🏐 Voleibol</span>
            </button>

            <button
              onClick={() => setActiveSport('baloncesto')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSport === 'baloncesto'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-orange-900 hover:bg-orange-50'
              }`}
            >
              <span>🏀 Baloncesto</span>
            </button>
          </div>
        </div>

        {/* 📋 TARJETAS DE CATEGORÍAS Y TABLA DE JUGADORES */}
        <div className="space-y-4 pb-6">
          {filteredRosters.length > 0 ? (
            filteredRosters.map((roster) => {
              const cat = categories.find((c) => c.id === roster.categoryId);
              return (
                <div
                  key={`${roster.sport}-${roster.categoryId}`}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs space-y-3 p-4 sm:p-5"
                >
                  {/* Fila Superior de la Categoría */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm sm:text-base md:text-lg">
                          {cat?.name || roster.categoryId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                          {cat?.division || 'Oficial'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>Entrenador: <strong className="text-slate-900 font-bold">{roster.coachName || 'Por definir'}</strong></span>
                        </span>
                        {roster.assistantCoachName && (
                          <span>• Asistente: <strong className="text-slate-900 font-medium">{roster.assistantCoachName}</strong></span>
                        )}
                      </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-950 font-extrabold text-xs sm:text-sm border border-amber-200 shrink-0 self-start sm:self-auto">
                      {roster.players.length} Atletas Inscritos
                    </span>
                  </div>

                  {/* Tabla de Jugadores */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11.5px] uppercase tracking-wider">
                          <th className="py-2.5 px-3 text-center w-12">#</th>
                          <th className="py-2.5 px-3">Nombre Completo</th>
                          <th className="py-2.5 px-3">Posición</th>
                          <th className="py-2.5 px-3 text-center">Año Nac.</th>
                          <th className="py-2.5 px-3 text-right">Rol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 text-slate-800">
                        {roster.players.map((p) => (
                          <tr key={p.id} className="hover:bg-white transition-colors">
                            <td className="py-2.5 px-3 text-center font-mono font-black text-amber-950 bg-amber-50/80 rounded-md">
                              {p.jerseyNumber}
                            </td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">
                              {p.fullName}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 font-medium">
                              {p.position || 'Jugador/a'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                              {p.birthYear || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {p.isCaptain ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 font-black text-[10.5px] uppercase border border-amber-300 shadow-2xs">
                                  <Award className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Capitán</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">Atleta</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3 bg-slate-50/50">
              <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Sin nómina registrada en {activeSport === 'futbol' ? 'Fútbol' : activeSport === 'voleibol' ? 'Voleibol' : 'Baloncesto'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-sm mx-auto">
                  La institución aún no ha registrado atletas para esta disciplina. Usa el botón superior para completar el formulario digital o subir un archivo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(true);
                  setIsPinUnlocked(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Inscribir Atletas de {activeSchool.shortName}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔐 MODAL HÍBRIDO (FORMULARIO DIGITAL + CARGA EXCEL) CON PROTECCIÓN POR PIN */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden space-y-4 p-5 sm:p-6 my-auto animate-scale-up max-h-[92vh] flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">
                    Inscripción de Nómina · {activeSchool.shortName}
                  </h3>
                  <span className="text-xs text-slate-500">Gestión oficial de atletas y cuerpo técnico</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PASO 1: BLOQUEO DE SEGURIDAD POR PIN INSTITUCIONAL */}
            {!isPinUnlocked ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Acceso Restringido a Coordinadores</span>
                    <span className="text-slate-700 block mt-0.5">
                      Ingresa el <strong>PIN Institucional</strong> asignado a <strong>{activeSchool.name}</strong> para habilitar el formulario digital o la carga de archivos.
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    PIN Institucional (4 dígitos):
                  </label>
                  <input
                    type="password"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Ej: 1001, 2001..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono text-center text-xl tracking-widest uppercase font-black bg-slate-50"
                  />
                  {pinError && (
                    <p className="text-xs sm:text-sm text-rose-600 font-semibold">{pinError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleValidatePin}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs sm:text-sm font-black shadow-md border border-amber-500/40 cursor-pointer"
                  >
                    Validar PIN y Entrar
                  </button>
                </div>
              </div>
            ) : (
              /* PASO 2: INTERFAZ DUAL (FORMULARIO TÁCTIL O EXCEL) */
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PIN Autenticado: <strong>{activeSchool.shortName}</strong></span>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">Modo Edición</span>
                </div>

                {/* Selector de Modo: Formulario Digital vs Archivo Excel */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setModalTab('form')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      modalTab === 'form'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>1. Formulario Digital Directo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab('excel')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      modalTab === 'excel'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>2. Cargar Archivo Excel / CSV</span>
                  </button>
                </div>

                {/* OPCIÓN 1: FORMULARIO DIGITAL PASO A PASO */}
                {modalTab === 'form' && (
                  <div className="space-y-4">
                    {/* Fila 1: Selección de Deporte y Categoría */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Disciplina:</label>
                        <select
                          value={formSport}
                          onChange={(e) => {
                            const newSport = e.target.value as SportType;
                            setFormSport(newSport);
                            const firstCat = categories.find((c) => c.sport === newSport);
                            if (firstCat) setFormCategoryId(firstCat.id);
                          }}
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-xs sm:text-sm text-slate-900"
                        >
                          <option value="futbol">⚽ Fútbol</option>
                          <option value="voleibol">🏐 Voleibol</option>
                          <option value="baloncesto">🏀 Baloncesto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Oficial:</label>
                        <select
                          value={formCategoryId}
                          onChange={(e) => setFormCategoryId(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-xs sm:text-sm text-slate-900"
                        >
                          {categories
                            .filter((c) => c.sport === formSport)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.division})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Fila 2: Cuerpo Técnico */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Entrenador Principal:</label>
                        <input
                          type="text"
                          value={formCoach}
                          onChange={(e) => setFormCoach(e.target.value)}
                          placeholder="Nombre del Profesor/a"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Asistente Técnico (Opcional):</label>
                        <input
                          type="text"
                          value={formAssistant}
                          onChange={(e) => setFormAssistant(e.target.value)}
                          placeholder="Nombre del Asistente"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Fila 3: Lista Dinámica de Atletas */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-amber-600" />
                          <span>Lista de Atletas Inscritos ({formPlayers.length})</span>
                        </label>

                        <button
                          type="button"
                          onClick={handleAddPlayerRow}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Agregar Jugador</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                        {formPlayers.map((player, idx) => (
                          <div
                            key={player.id || idx}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors"
                          >
                            {/* Dorsal */}
                            <div className="w-14 shrink-0">
                              <input
                                type="number"
                                min={1}
                                max={99}
                                value={player.jerseyNumber || ''}
                                onChange={(e) => handleUpdatePlayer(idx, 'jerseyNumber', parseInt(e.target.value, 10) || '')}
                                placeholder="#"
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-center font-mono font-black text-xs text-amber-950"
                              />
                            </div>

                            {/* Nombre Completo */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={player.fullName}
                                onChange={(e) => handleUpdatePlayer(idx, 'fullName', e.target.value)}
                                placeholder="Nombre y Apellidos del atleta..."
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 font-bold text-xs text-slate-900"
                              />
                            </div>

                            {/* Posición */}
                            <div className="w-28 shrink-0 hidden sm:block">
                              <input
                                type="text"
                                value={player.position || ''}
                                onChange={(e) => handleUpdatePlayer(idx, 'position', e.target.value)}
                                placeholder="Posición"
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 font-medium"
                              />
                            </div>

                            {/* Año Nacimiento */}
                            <div className="w-18 shrink-0 hidden sm:block">
                              <input
                                type="number"
                                value={player.birthYear || ''}
                                onChange={(e) => handleUpdatePlayer(idx, 'birthYear', parseInt(e.target.value, 10) || undefined)}
                                placeholder="Año"
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-center font-mono text-slate-700"
                              />
                            </div>

                            {/* Botón de Capitán */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePlayer(idx, 'isCaptain', !player.isCaptain)}
                              className={`p-2 rounded-lg text-xs font-black transition-colors shrink-0 cursor-pointer ${
                                player.isCaptain
                                  ? 'bg-amber-400 text-slate-950 shadow-2xs ring-1 ring-amber-500'
                                  : 'bg-slate-200 text-slate-400 hover:bg-slate-300 hover:text-slate-700'
                              }`}
                              title={player.isCaptain ? 'Es Capitán' : 'Marcar como Capitán'}
                            >
                              ©
                            </button>

                            {/* Eliminar Fila */}
                            <button
                              type="button"
                              onClick={() => handleRemovePlayerRow(idx)}
                              className="p-2 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-colors shrink-0 cursor-pointer"
                              title="Eliminar jugador"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botón de Guardado del Formulario */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveFormRoster}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Nómina Oficial en Base de Datos</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* OPCIÓN 2: CARGA DIRECTA DE ARCHIVO EXCEL / CSV */}
                {modalTab === 'excel' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-amber-400/80 rounded-3xl p-6 text-center space-y-3 bg-amber-50/40">
                      <FileSpreadsheet className="w-10 h-10 text-amber-600 mx-auto" />
                      <div>
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                          Selecciona o arrastra el archivo de Nómina
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 block mt-0.5">
                          Formatos aceptados: Microsoft Excel (.xls, .xlsx) o CSV (.csv, .txt)
                        </span>
                      </div>

                      <label className="inline-block px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs sm:text-sm font-black cursor-pointer shadow-md transition-all border border-amber-500/40">
                        <span>Examinar Archivo</span>
                        <input
                          type="file"
                          accept=".xls,.xlsx,.csv,.txt,application/vnd.ms-excel,text/csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                      <span className="text-slate-600">¿No tienes el archivo listo?</span>
                      <button
                        type="button"
                        onClick={handleDownloadExcel}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 text-xs shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Descargar Plantilla Oficial</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notificación de Estado */}
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
