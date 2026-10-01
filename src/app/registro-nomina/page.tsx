'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { School, Player, TeamRoster, SportType } from '@/types/tournament';
import { SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Users, 
  Download, 
  Upload, 
  ShieldCheck, 
  Lock, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  UserCheck, 
  Sparkles,
  ArrowLeft,
  KeyRound,
  FileCheck,
  Award,
  ChevronRight,
  Send,
  HelpCircle,
  Copy,
  ExternalLink,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { PIN_TO_SCHOOL_MAP, getSchoolByPin, rosterService } from '@/lib/rosterService';

function RegistroNominaContent() {
  const searchParams = useSearchParams();
  const schoolParam = searchParams.get('school');

  // Escuela Activa
  const [selectedSchool, setSelectedSchool] = useState<School | null>(() => {
    if (schoolParam) {
      return SCHOOLS_DATA.find((s) => s.id === schoolParam) || null;
    }
    return null;
  });

  // Seguridad por PIN
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Modalidad (Formulario interactivo o Carga de Excel)
  const [activeTab, setActiveTab] = useState<'form' | 'excel'>('form');

  // Formulario Digital
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-fem-futbol');
  const [coachName, setCoachName] = useState<string>('');
  const [assistantCoachName, setAssistantCoachName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);

  // Estados de interfaz y feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [allSchoolRosters, setAllSchoolRosters] = useState<TeamRoster[]>([]);

  // Si cambia el parámetro de URL, actualizar la escuela seleccionada
  useEffect(() => {
    if (schoolParam) {
      const match = SCHOOLS_DATA.find((s) => s.id === schoolParam);
      if (match) {
        setSelectedSchool(match);
      }
    }
  }, [schoolParam]);

  // Cargar nóminas guardadas de la institución
  const loadRosters = () => {
    if (!selectedSchool) return;
    const list = rosterService.getRostersBySchool(selectedSchool.id);
    setAllSchoolRosters(list);
  };

  useEffect(() => {
    if (!selectedSchool) return;
    loadRosters();
    rosterService.fetchRemoteRosters().then(() => {
      loadRosters();
    }).catch((e) => console.warn('Sync error:', e));

    const handleUpdate = () => loadRosters();
    window.addEventListener('roster_updated', handleUpdate);
    window.addEventListener('rosters_sync_updated', handleUpdate);
    return () => {
      window.removeEventListener('roster_updated', handleUpdate);
      window.removeEventListener('rosters_sync_updated', handleUpdate);
    };
  }, [selectedSchool?.id]);

  // Cargar datos del formulario al cambiar deporte o categoría
  useEffect(() => {
    if (!selectedSchool) return;
    const existing = allSchoolRosters.find(
      (r) => r.schoolId === selectedSchool.id && r.sport === selectedSport && r.categoryId === selectedCategoryId
    );

    if (existing) {
      setCoachName(existing.coachName || '');
      setAssistantCoachName(existing.assistantCoachName || '');
      setPlayers(JSON.parse(JSON.stringify(existing.players)));
    } else {
      setCoachName('');
      setAssistantCoachName('');
      setPlayers([
        { id: `p-reg-1`, jerseyNumber: 1, fullName: '', position: 'Portero/a / Titular', isCaptain: false, birthYear: 2011 },
        { id: `p-reg-2`, jerseyNumber: 2, fullName: '', position: 'Defensa / Campo', isCaptain: false, birthYear: 2011 },
        { id: `p-reg-3`, jerseyNumber: 3, fullName: '', position: 'Mediocampo / Armador', isCaptain: false, birthYear: 2011 },
        { id: `p-reg-4`, jerseyNumber: 4, fullName: '', position: 'Delantero/a / Alero', isCaptain: true, birthYear: 2011 },
      ]);
    }
  }, [selectedSchool?.id, selectedSport, selectedCategoryId, allSchoolRosters]);

  // Manejo de PIN Universal
  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = enteredPin.trim();

    if (pin === '9999') {
      const defaultSc = selectedSchool || SCHOOLS_DATA[0];
      setSelectedSchool(defaultSc);
      setIsPinUnlocked(true);
      setPinError(null);
      return;
    }

    const schoolFound = getSchoolByPin(pin);
    if (schoolFound) {
      setSelectedSchool(schoolFound);
      setIsPinUnlocked(true);
      setPinError(null);
    } else {
      setPinError('El PIN institucional ingresado no coincide con ningún colegio participante. Por favor verifica los 4 dígitos o contacta al Comité Organizador.');
    }
  };

  // Descargar Plantilla Oficial Base Excel Multi-Hoja
  const handleDownloadBaseTemplate = () => {
    if (!selectedSchool) return;
    const blob = rosterService.generateOfficialTemplateWorkbook(selectedSchool);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `plantilla_oficial_nomina_${selectedSchool.id}_2026.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Carga Masiva de Archivo Excel/CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSchool) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = rosterService.parseUploadedContent(content, selectedSchool.id);

      if (parsed.rosters.length > 0) {
        rosterService.saveMultipleRosters(parsed.rosters);
        loadRosters();
        setSaveSuccess(true);
        setStatusMessage({
          type: 'success',
          text: `¡Importación completada con éxito! Se cargaron ${parsed.count} atletas en ${parsed.rosters.length} categorías para ${selectedSchool.name}.`,
        });
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No se detectaron filas válidas en el archivo. Asegúrate de utilizar la plantilla base oficial entregada.',
        });
      }
    };
    reader.readAsText(file);
  };

  // Guardar Formulario Digital
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;
    setIsSaving(true);

    const validPlayers = players
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
        text: 'Debes registrar al menos un atleta con nombre completo antes de guardar.',
      });
      setIsSaving(false);
      return;
    }

    const updatedRoster: TeamRoster = {
      schoolId: selectedSchool.id,
      sport: selectedSport,
      categoryId: selectedCategoryId,
      coachName: coachName.trim() || 'Entrenador Oficial',
      assistantCoachName: assistantCoachName.trim() || undefined,
      players: validPlayers,
      updatedAt: new Date().toISOString(),
    };

    rosterService.saveCategoryRoster(updatedRoster);
    loadRosters();
    setIsSaving(false);
    setSaveSuccess(true);
    setStatusMessage({
      type: 'success',
      text: `¡Nómina de ${validPlayers.length} atletas guardada y sincronizada exitosamente con la plataforma oficial!`,
    });

    setTimeout(() => {
      setStatusMessage(null);
      setSaveSuccess(false);
    }, 5000);
  };

  // Manejo de Filas de Atletas
  const handleAddPlayer = () => {
    const nextJersey = players.length > 0 ? Math.max(...players.map((p) => p.jerseyNumber || 0)) + 1 : 1;
    setPlayers([
      ...players,
      {
        id: `p-new-${Date.now()}-${nextJersey}`,
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

  const availableCategories = CATEGORIES_DATA.filter((c) => c.sport === selectedSport);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in px-4 sm:px-6">
      {/* 🧭 ENLACE DE REGRESO Y ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            href="/colegios"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Instituciones</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase tracking-wider">
              Portal Oficial de Acreditación 2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-semibold">Liga Deportiva Costa de Oro</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">
            Registro Oficial de Nóminas y Atletas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plataforma centralizada para coordinadores deportivos y entrenadores de cada institución educativa.
          </p>
        </div>

        {/* Insignia de Seguridad */}
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold shrink-0 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Acceso Protegido por PIN</span>
        </div>
      </div>

      {/* 🔒 PASO DE AUTENTICACIÓN POR PIN O PANEL PRINCIPAL DESBLOQUEADO */}
      {!isPinUnlocked || !selectedSchool ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs text-center max-w-lg mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-800 shadow-sm">
            <KeyRound className="w-10 h-10 text-amber-600" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
              Acceso Institucional Seccionado
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-2">
              Ingresa tu PIN Institucional
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Cada coordinador deportivo cuenta con un código único de 4 dígitos. Al ingresarlo, el sistema activará y seccionará automáticamente el registro de su colegio.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4 max-w-xs mx-auto">
            <input
              type="password"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => {
                const val = e.target.value;
                setEnteredPin(val);
                setPinError(null);
                if (val.length === 4) {
                  const found = getSchoolByPin(val);
                  if (found) {
                    setSelectedSchool(found);
                    setIsPinUnlocked(true);
                  }
                }
              }}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[0.6em] text-3xl font-mono font-black py-3.5 px-4 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all shadow-inner text-slate-900 placeholder:tracking-normal placeholder:text-slate-300"
            />

            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-1.5 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={enteredPin.length < 4}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 disabled:opacity-40 text-amber-300 font-black text-sm shadow-md transition-all cursor-pointer border border-amber-500/40 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Desbloquear y Acceder</span>
            </button>
          </form>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>¿Olvidaste tu PIN? Solicítalo al Comité Organizador vía WhatsApp.</span>
          </div>
        </div>
      ) : (
        /* ✅ PANEL PRINCIPAL DESBLOQUEADO CON INSTITUCIÓN IDENTIFICADA */
        <div className="space-y-6 animate-fade-in">
          {/* BANNER DE INSTITUCIÓN ACTIVA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs">
                <SchoolEmblem schoolId={selectedSchool.id} size="sm" showBorder={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase">
                    Acreditación Activa
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    PIN: {enteredPin || 'Verificado'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                  {selectedSchool.name}
                </h2>
                <span className="text-xs text-slate-500 font-semibold">{selectedSchool.location}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPinUnlocked(false);
                setEnteredPin('');
                setSelectedSchool(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer self-start sm:self-center"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Cambiar PIN / Salir</span>
            </button>
          </div>

          {/* Mensaje de Estado / Toast */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TARJETA DE OPCIONES (DESCARGA DE PLANTILLA BASE Y MODALIDADES) */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase tracking-wider">
                Plantilla Base Oficial Obligatoria
              </span>
              <h3 className="text-lg sm:text-xl font-black">
                ¿Prefieres completar la nómina en Microsoft Excel?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                Descarga la plantilla oficial formateada con las columnas requeridas (Número de Jugador, Posición, Año Nacimiento) y súbela completa en 1 solo paso.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBaseTemplate}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 hover:bg-amber-50 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Descargar Plantilla Base Excel (.xls)</span>
            </button>
          </div>

          {/* SELECTOR DE MODALIDAD (FORMULARIO DIGITAL VS CARGA EXCEL) */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Modalidad A: Formulario Digital Interactivo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('excel')}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'excel'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Modalidad B: Subir Archivo Excel / CSV</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* 📋 MODALIDAD A: FORMULARIO DIGITAL */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveForm} className="space-y-6">
                  {/* Selectores de Deporte y Categoría */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Disciplina Deportiva:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['futbol', 'voleibol', 'baloncesto'] as SportType[]).map((sp) => (
                          <button
                            key={sp}
                            type="button"
                            onClick={() => {
                              setSelectedSport(sp);
                              const firstCat = CATEGORIES_DATA.find((c) => c.sport === sp);
                              if (firstCat) setSelectedCategoryId(firstCat.id);
                            }}
                            className={`py-2 px-3 rounded-xl font-bold text-xs capitalize transition-all cursor-pointer border ${
                              selectedSport === sp
                                ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sp === 'futbol' ? '⚽ Fútbol' : sp === 'voleibol' ? '🏐 Voleibol' : '🏀 Baloncesto'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Categoría Oficial:
                      </label>
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {availableCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.division})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cuerpos Técnicos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Entrenador/a Principal:
                      </label>
                      <input
                        type="text"
                        value={coachName}
                        onChange={(e) => setCoachName(e.target.value)}
                        placeholder="Nombre y Apellidos del Entrenador..."
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Asistente Técnico / Delegado (Opcional):
                      </label>
                      <input
                        type="text"
                        value={assistantCoachName}
                        onChange={(e) => setAssistantCoachName(e.target.value)}
                        placeholder="Nombre del Asistente..."
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Tabla de Atletas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>Lista de Atletas ({players.length} registrados)</span>
                      </span>

                      <button
                        type="button"
                        onClick={handleAddPlayer}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Agregar Atleta</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {players.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors"
                        >
                          {/* Número de Jugador */}
                          <div className="w-16 shrink-0">
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={p.jerseyNumber || ''}
                              onChange={(e) => handleUpdatePlayer(idx, 'jerseyNumber', parseInt(e.target.value, 10) || '')}
                              placeholder="N°"
                              title="Número de Jugador"
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-center font-mono font-black text-xs sm:text-sm text-amber-950"
                            />
                          </div>

                          {/* Nombre Completo */}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={p.fullName}
                              onChange={(e) => handleUpdatePlayer(idx, 'fullName', e.target.value)}
                              placeholder="Nombre y Apellidos del atleta..."
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                            />
                          </div>

                          {/* Posición */}
                          <div className="w-32 shrink-0 hidden sm:block">
                            <input
                              type="text"
                              value={p.position || ''}
                              onChange={(e) => handleUpdatePlayer(idx, 'position', e.target.value)}
                              placeholder="Posición"
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 font-medium"
                            />
                          </div>

                          {/* Año Nacimiento */}
                          <div className="w-20 shrink-0 hidden sm:block">
                            <input
                              type="number"
                              value={p.birthYear || ''}
                              onChange={(e) => handleUpdatePlayer(idx, 'birthYear', parseInt(e.target.value, 10) || undefined)}
                              placeholder="Año"
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-center font-mono text-slate-700"
                            />
                          </div>

                          {/* Capitán */}
                          <button
                            type="button"
                            onClick={() => handleUpdatePlayer(idx, 'isCaptain', !p.isCaptain)}
                            className={`p-2.5 rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer ${
                              p.isCaptain
                                ? 'bg-amber-400 text-slate-950 shadow-2xs ring-1 ring-amber-500'
                                : 'bg-slate-200 text-slate-400 hover:bg-slate-300 hover:text-slate-700'
                            }`}
                            title={p.isCaptain ? 'Es Capitán de Equipo' : 'Marcar como Capitán'}
                          >
                            ©
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(idx)}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                            title="Eliminar atleta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Guardado con Feedback Visual Inmediato */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    {saveSuccess ? (
                      <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>¡Nómina sincronizada en la base de datos central!</span>
                      </div>
                    ) : (
                      <span className="text-[11.5px] text-slate-500 font-medium">
                        Se registrarán <strong>{players.filter(p => p.fullName.trim()).length}</strong> atletas para esta categoría.
                      </span>
                    )}

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href="/colegios"
                        target="_self"
                        className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer border border-slate-300 flex items-center gap-1.5"
                        title="Ver cómo quedó publicada la nómina en la sección oficial de colegios"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                        <span>Ver Nómina en Colegios</span>
                      </a>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                          saveSuccess
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-700/30 ring-2 ring-emerald-400'
                            : 'bg-slate-950 hover:bg-slate-900 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {saveSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            <span>¡Nómina Guardada y Publicada!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 text-amber-400" />
                            <span>{isSaving ? 'Guardando Nómina...' : 'Guardar y Publicar Nómina Oficial'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* 📂 MODALIDAD B: CARGA DE ARCHIVO EXCEL */}
              {activeTab === 'excel' && (
                <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100/80 transition-all flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Selecciona o arrastra tu archivo de nómina
                      </h4>
                      <p className="text-xs text-slate-500">
                        Formatos soportados: Microsoft Excel (.xls, .xlsx) o Archivo delimitado (.csv).
                      </p>
                    </div>

                    <label className="mt-2 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Examinar Archivo Excel en tu Equipo</span>
                      <input
                        type="file"
                        accept=".xls,.xlsx,.csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-950 space-y-1.5">
                    <span className="font-bold block text-amber-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      <span>Reglas de Validación y Carga:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11.5px]">
                      <li>Usa exclusivamente la <strong>Plantilla Base Oficial</strong> provista por el torneo.</li>
                      <li>La columna de número de atleta debe denominarse <strong>Número de Jugador</strong> (del 1 al 99).</li>
                      <li>La importación guarda y sincroniza automáticamente las nóminas en la base de datos de la webapp.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistroNominaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400 font-bold">Cargando portal de registro...</div>}>
      <RegistroNominaContent />
    </Suspense>
  );
}
