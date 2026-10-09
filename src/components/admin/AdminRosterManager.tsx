'use client';

import React, { useState, useEffect } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { TeamRoster, Player, SportType, School } from '@/types/tournament';
import { rosterService, validateFullName } from '@/lib/rosterService';
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
  Edit3,
  Copy,
  Send,
  ExternalLink,
  Mail,
  FileCheck,
  KeyRound
} from 'lucide-react';
import Link from 'next/link';

const SCHOOL_PINS_MAP: Record<string, string> = {
  'la-paz-cabo-velas': '1001',
  'la-paz-tempisque': '1002',
  'cria': '2001',
  'journey-school': '3001',
  'vittorino': '4001',
  'educarte': '5001',
};

export function AdminRosterManager() {
  const { schools, categories } = useTournament();
  const [allRosters, setAllRosters] = useState<TeamRoster[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-fem-futbol');
  
  // Dispatcher State
  const [copiedSchoolId, setCopiedSchoolId] = useState<string | null>(null);

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

  // Obtener URL de registro universal (opcionalmente con parámetro de colegio)
  const getSchoolRegistrationUrl = (schoolId?: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://costadeoro.curiol.studio';
    if (schoolId) {
      return `${origin}/registro-nomina?school=${schoolId}`;
    }
    return `${origin}/registro-nomina`;
  };

  // Copiar Enlace Directo con PIN
  const handleCopyLink = (schoolId: string) => {
    const url = getSchoolRegistrationUrl();
    const pin = SCHOOL_PINS_MAP[schoolId] || '1001';
    const textToCopy = `Enlace de Registro Oficial: ${url}\nPIN de Acceso: ${pin}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedSchoolId(schoolId);
      setTimeout(() => setCopiedSchoolId(null), 3000);
    }
  };

  // Compartir por WhatsApp
  const handleShareWhatsApp = (school: School) => {
    const url = getSchoolRegistrationUrl();
    const pin = SCHOOL_PINS_MAP[school.id] || '1001';
    const message = `🏆 *FESTIVAL DEPORTIVO COSTA DE ORO 2026*\n\nEstimado/a Coordinador/a Deportivo de *${school.name}*:\n\nLe compartimos el enlace oficial único para el registro y carga de nóminas de atletas de su institución:\n🔗 *Enlace Universal:* ${url}\n🔑 *PIN Institucional de Acceso:* ${pin}\n\n📋 *Instrucciones:*\n1. Ingrese al enlace único y digite su PIN institucional (*${pin}*) para activar su panel exclusivo.\n2. Puede completar el formulario en línea por disciplina o descargar la *Plantilla Base Oficial en Excel (con pestañas para Fútbol, Voleibol y Baloncesto)*, completarla y subirla en el mismo portal.\n3. Los datos alimentan automáticamente la plataforma web oficial y las actas de juego del torneo.\n\n¡Muchos éxitos en la competición!`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Enviar por Correo Electrónico
  const handleShareEmail = (school: School) => {
    const url = getSchoolRegistrationUrl();
    const pin = SCHOOL_PINS_MAP[school.id] || '1001';
    const subject = `Enlace Oficial de Registro de Nóminas 2026 - ${school.shortName}`;
    const body = `Estimado/a Coordinador/a Deportivo de ${school.name},\n\nLe compartimos el enlace oficial único para el registro y acreditación de nóminas de atletas del Festival Deportivo Costa de Oro 2026.\n\nEnlace Universal: ${url}\nPIN de Acceso Institucional: ${pin}\n\nInstrucciones:\n1. Ingrese al enlace y digite su PIN institucional (${pin}) para desbloquear el registro de su institución.\n2. Inscriba a sus atletas en línea o descargue la Plantilla Base Oficial de Excel (con pestañas separadas por deporte) y cárguela directamente en el portal.\n\nSaludos cordiales,\nComité Organizador · Liga Costa de Oro 2026`;

    const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
  };

  // Descargar Plantilla Base Oficial
  const handleDownloadOfficialTemplate = (school?: School) => {
    const blob = rosterService.generateOfficialTemplateWorkbook(school);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `plantilla_base_oficial_nomina_${school?.id || '2026'}.xls`);
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
    // 1. Validar Entrenador Principal
    const trimmedCoach = coachName.trim();
    if (trimmedCoach.length > 0) {
      const coachVal = validateFullName(trimmedCoach);
      if (!coachVal.isValid) {
        setStatusMessage({
          type: 'error',
          text: `El Entrenador/a Principal ("${trimmedCoach}") debe registrar nombre y apellidos completos (ej. Carlos Santana Solano).`,
        });
        return;
      }
    }

    // 2. Validar Asistente si fue ingresado
    const trimmedAssistant = assistantCoachName.trim();
    if (trimmedAssistant.length > 0) {
      const assistantVal = validateFullName(trimmedAssistant);
      if (!assistantVal.isValid) {
        setStatusMessage({
          type: 'error',
          text: `El Asistente Técnico ("${trimmedAssistant}") debe registrar nombre y apellidos completos (ej. Diego Solano Solano).`,
        });
        return;
      }
    }

    // 3. Filtrar y validar atletas
    const filledPlayers = players.filter((p) => p.fullName && p.fullName.trim().length > 0);

    if (filledPlayers.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Debes registrar al menos un atleta con nombre y apellidos completos antes de guardar.',
      });
      return;
    }

    for (const p of filledPlayers) {
      const nameVal = validateFullName(p.fullName);
      if (!nameVal.isValid) {
        setStatusMessage({
          type: 'error',
          text: `El atleta en el dorsal #${p.jerseyNumber || '?'} ("${p.fullName}") debe incluir nombre y apellidos completos (ej. Sofía Morales Castro).`,
        });
        return;
      }
    }

    const validPlayers = filledPlayers.map((p, idx) => ({
      ...p,
      jerseyNumber: p.jerseyNumber || (idx + 1),
      fullName: p.fullName.trim(),
      position: p.position ? p.position.trim() : 'Jugador/a',
    }));

    const newRoster: TeamRoster = {
      schoolId: selectedSchoolId,
      sport: selectedSport,
      categoryId: selectedCategoryId,
      coachName: trimmedCoach || 'Entrenador Oficial',
      assistantCoachName: trimmedAssistant || undefined,
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
    }, 4000);
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

  // Eliminar Nómina de la Categoría Activa
  const handleDeleteCurrentRoster = () => {
    const targetSchool = schools.find((s) => s.id === selectedSchoolId);
    const targetCat = categories.find((c) => c.id === selectedCategoryId);
    const schoolName = targetSchool?.shortName || selectedSchoolId;
    const catName = targetCat?.name || selectedCategoryId;

    if (
      typeof window !== 'undefined' &&
      window.confirm(
        `¿Estás seguro de que deseas eliminar el equipo y la nómina de "${schoolName}" en la categoría "${catName}"?\n\nEsta acción borrará a todos los atletas y cuerpo técnico registrados en este equipo.`
      )
    ) {
      rosterService.deleteCategoryRoster(selectedSchoolId, selectedSport, selectedCategoryId);
      reloadRosters();
      setCoachName('');
      setAssistantCoachName('');
      setPlayers([]);
      setStatusMessage({
        type: 'info',
        text: `Equipo y nómina de "${schoolName}" (${catName}) eliminados exitosamente.`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Eliminar Nómina Específica del Directorio
  const handleDeleteSpecificRoster = (r: TeamRoster) => {
    const targetSchool = schools.find((s) => s.id === r.schoolId);
    const targetCat = categories.find((c) => c.id === r.categoryId);
    const schoolName = targetSchool?.shortName || r.schoolId;
    const catName = targetCat?.name || r.categoryId;

    if (
      typeof window !== 'undefined' &&
      window.confirm(
        `¿Eliminar definitivamente el equipo y la nómina de "${schoolName}" en "${catName}"?\n\nSe eliminarán los ${r.players.length} atletas inscritos.`
      )
    ) {
      rosterService.deleteCategoryRoster(r.schoolId, r.sport, r.categoryId);
      reloadRosters();
      if (
        r.schoolId === selectedSchoolId &&
        r.sport === selectedSport &&
        r.categoryId === selectedCategoryId
      ) {
        setCoachName('');
        setAssistantCoachName('');
        setPlayers([]);
      }
      setStatusMessage({
        type: 'info',
        text: `Equipo y nómina de "${schoolName}" eliminados del sistema.`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
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

      {/* 📨 SECCIÓN DE DESPACHO RÁPIDO DE ENLACES PARA INSTITUCIONES (WHATSAPP / CORREO) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-6 border border-amber-500/30 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Autogestión para Instituciones
            </span>
            <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>Despacho de Enlaces Directos de Inscripción (WhatsApp & Correo)</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Comparte el portal webapp directo a cada coordinador deportivo con su PIN de seguridad. La institución podrá ingresar atletas en línea o registrar la nómina oficial.
            </p>
          </div>
        </div>

        {/* Cuadrícula de Enlaces por Institución */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {schools.map((school) => {
            const isCopied = copiedSchoolId === school.id;
            const pin = SCHOOL_PINS_MAP[school.id] || '1001';
            const registrationUrl = getSchoolRegistrationUrl(school.id);

            return (
              <div
                key={school.id}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shrink-0">
                      <SchoolEmblem schoolId={school.id} size="xs" showBorder={false} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs sm:text-sm text-white block truncate">
                        {school.shortName}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                        <KeyRound className="w-3 h-3" />
                        <span>PIN: {pin}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/registro-nomina?school=${school.id}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors"
                    title="Abrir vista de inscripción en nueva pestaña"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Acciones de Despacho */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(school.id)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                    title="Copiar enlace directo al portapapeles"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-amber-400" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(school)}
                    className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    title="Enviar enlace formal pre-redactado por WhatsApp"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareEmail(school)}
                    className="py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    title="Enviar enlace formal pre-redactado por Correo Electrónico"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Correo</span>
                  </button>
                </div>
              </div>
            );
          })}
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

        {/* Aviso de Validación de Formato de Nombres */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium flex items-start gap-2.5">
          <span className="text-base">📋</span>
          <div>
            <strong className="font-extrabold text-amber-900 block">Requisito de acreditación oficial:</strong>
            <span>Cada atleta y entrenador debe registrarse con <strong>nombre y dos apellidos completos</strong> (ej. <em>Sofía Morales Castro</em>) para las actas arbitrales y certificados.</span>
          </div>
        </div>

        {/* Entrenadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Entrenador Principal:</label>
              {coachName.trim() && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    !validateFullName(coachName).isValid
                      ? 'bg-rose-100 text-rose-800'
                      : !validateFullName(coachName).hasTwoSurnames
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {!validateFullName(coachName).isValid
                    ? '⚠️ Falta apellido'
                    : !validateFullName(coachName).hasTwoSurnames
                    ? '💡 Falta 2.º apellido'
                    : '✓ Nombre completo'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="Nombre y dos apellidos (ej. Carlos Santana Solano)"
              className={`w-full p-2.5 rounded-xl bg-white border text-xs sm:text-sm font-semibold transition ${
                coachName.trim() && !validateFullName(coachName).isValid
                  ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                  : coachName.trim() && !validateFullName(coachName).hasTwoSurnames
                  ? 'border-amber-400 focus:ring-amber-400 bg-amber-50/10'
                  : 'border-slate-300 focus:ring-amber-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Asistente Técnico:</label>
              {assistantCoachName.trim() && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    !validateFullName(assistantCoachName).isValid
                      ? 'bg-rose-100 text-rose-800'
                      : !validateFullName(assistantCoachName).hasTwoSurnames
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {!validateFullName(assistantCoachName).isValid
                    ? '⚠️ Falta apellido'
                    : !validateFullName(assistantCoachName).hasTwoSurnames
                    ? '💡 Falta 2.º apellido'
                    : '✓ Nombre completo'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={assistantCoachName}
              onChange={(e) => setAssistantCoachName(e.target.value)}
              placeholder="Nombre y dos apellidos (ej. Diego Solano Solano)"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold"
            />
          </div>
        </div>

        {/* Tabla de Jugadores */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {players.map((p, idx) => {
            const nameVal = p.fullName.trim() ? validateFullName(p.fullName) : null;
            return (
              <div
                key={p.id || idx}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                  nameVal && !nameVal.isValid
                    ? 'bg-rose-50/40 border-rose-300'
                    : nameVal && !nameVal.hasTwoSurnames
                    ? 'bg-amber-50/30 border-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="w-16 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={p.jerseyNumber || ''}
                    onChange={(e) => handleUpdatePlayer(idx, 'jerseyNumber', parseInt(e.target.value, 10) || '')}
                    placeholder="N°"
                    title="Número de Jugador"
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-center font-mono font-black text-xs text-amber-950"
                  />
                </div>

                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    value={p.fullName}
                    onChange={(e) => handleUpdatePlayer(idx, 'fullName', e.target.value)}
                    placeholder="Nombre y dos apellidos (ej. Sofía Morales Castro)"
                    className={`w-full p-2 rounded-lg bg-white border font-bold text-xs text-slate-900 transition ${
                      nameVal && !nameVal.isValid
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 pr-24'
                        : nameVal && !nameVal.hasTwoSurnames
                        ? 'border-amber-400 focus:ring-2 focus:ring-amber-400 pr-28'
                        : 'border-slate-300 focus:ring-2 focus:ring-amber-500'
                    }`}
                  />
                  {nameVal && (
                    <span
                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md pointer-events-none hidden sm:inline-block ${
                        !nameVal.isValid
                          ? 'bg-rose-100 text-rose-800'
                          : !nameVal.hasTwoSurnames
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {!nameVal.isValid
                        ? '⚠️ Falta apellido'
                        : !nameVal.hasTwoSurnames
                        ? '💡 Falta 2.º apellido'
                        : '✓ Completo'}
                    </span>
                  )}
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
            );
          })}
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

        {/* Botones de Acción: Guardar y Eliminar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveRoster}
            className="flex-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Nómina y Sincronizar con Toda la Plataforma</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteCurrentRoster}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 hover:text-rose-950 border border-rose-300 font-extrabold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            title="Eliminar la nómina y los atletas de este equipo para la categoría activa"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Eliminar Equipo / Nómina</span>
          </button>
        </div>
      </div>

      {/* 📋 DIRECTORIO DE EQUIPOS Y NÓMINAS REGISTRADAS EN LA PLATAFORMA */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Directorio de Equipos y Nóminas Registradas ({allRosters.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Vista general de todos los equipos con nómina inscrita en el torneo. Puedes editar o eliminar cualquier equipo directamente.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por colegio o categoría..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {allRosters.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
            No hay nóminas registradas actualmente en el sistema.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allRosters
              .filter((r) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                const s = schools.find((sch) => sch.id === r.schoolId);
                const c = categories.find((cat) => cat.id === r.categoryId);
                return (
                  r.schoolId.toLowerCase().includes(q) ||
                  (s?.name || '').toLowerCase().includes(q) ||
                  (s?.shortName || '').toLowerCase().includes(q) ||
                  (c?.name || '').toLowerCase().includes(q) ||
                  r.sport.toLowerCase().includes(q) ||
                  (r.coachName || '').toLowerCase().includes(q)
                );
              })
              .map((r, idx) => {
                const s = schools.find((sch) => sch.id === r.schoolId);
                const c = categories.find((cat) => cat.id === r.categoryId);
                const isCurrentActive =
                  r.schoolId === selectedSchoolId &&
                  r.sport === selectedSport &&
                  r.categoryId === selectedCategoryId;

                return (
                  <div
                    key={`${r.schoolId}-${r.sport}-${r.categoryId}-${idx}`}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isCurrentActive
                        ? 'bg-amber-50/60 border-amber-400 shadow-2xs'
                        : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SchoolEmblem schoolId={r.schoolId} size="xs" />
                        <div className="min-w-0">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 block truncate">
                            {s?.shortName || r.schoolId}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold block truncate">
                            {c?.name || r.categoryId}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-extrabold text-amber-950 shrink-0">
                        {r.players.length} atletas
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                      {r.coachName && (
                        <div className="truncate">
                          <strong className="text-slate-700">DT:</strong> {r.coachName}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        Disciplina: <span className="uppercase font-bold text-slate-600">{r.sport}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSchoolId(r.schoolId);
                          setSelectedSport(r.sport);
                          setSelectedCategoryId(r.categoryId);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSpecificRoster(r)}
                        className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="Eliminar este equipo y su nómina de la plataforma"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
