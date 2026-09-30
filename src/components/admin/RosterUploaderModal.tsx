'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Player, TeamRoster, SportType } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Users, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Shield, 
  Save,
  ChevronDown
} from 'lucide-react';
import { rosterService } from '@/lib/rosterService';

interface RosterUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RosterUploaderModal({ isOpen, onClose }: RosterUploaderModalProps) {
  const { schools, categories } = useTournament();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'preview'>('upload');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-fem-futbol');
  const [coachName, setCoachName] = useState<string>('');
  const [csvText, setCsvText] = useState<string>('');
  const [parsedPlayers, setParsedPlayers] = useState<Player[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  // Manejador de carga de archivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsvContent(content);
    };
    reader.readAsText(file);
  };

  // Parser inteligente de texto / CSV
  const parseCsvContent = (content: string) => {
    try {
      const lines = content.split('\n');
      const players: Player[] = [];
      let header: string[] | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));

        if (!header) {
          header = parts.map((h) => h.toLowerCase());
          continue;
        }

        // Si tiene formato estándar de plantilla
        if (parts.length >= 6) {
          const rowObj: Record<string, string> = {};
          header.forEach((h, idx) => {
            rowObj[h] = parts[idx] || '';
          });

          const jerseyNum = parseInt(rowObj['dorsal'] || parts[5] || '0', 10) || (players.length + 1);
          const fullName = rowObj['nombre_completo'] || parts[6] || parts[1] || `Jugador #${jerseyNum}`;
          const pos = rowObj['posicion'] || parts[7] || '';
          const capStr = (rowObj['capitan'] || parts[8] || '').toUpperCase();
          const isCap = capStr === 'SI' || capStr === 'S' || capStr === 'YES' || capStr === 'TRUE';
          const birthYear = parseInt(rowObj['ano_nacimiento'] || parts[9] || '0', 10) || undefined;

          players.push({
            id: `p-${Date.now()}-${jerseyNum}-${i}`,
            jerseyNumber: jerseyNum,
            fullName,
            position: pos,
            isCaptain: isCap,
            birthYear,
          });
        } else {
          // Formato simple: "10, Valentina Soto, Delantera"
          const jerseyNum = parseInt(parts[0], 10) || (players.length + 1);
          const fullName = parts[1] || `Jugador #${jerseyNum}`;
          const pos = parts[2] || '';

          players.push({
            id: `p-${Date.now()}-${jerseyNum}-${i}`,
            jerseyNumber: jerseyNum,
            fullName,
            position: pos,
            isCaptain: false,
          });
        }
      }

      if (players.length > 0) {
        setParsedPlayers(players);
        setActiveTab('preview');
        setStatusMessage({
          type: 'success',
          text: `Se extrajeron ${players.length} jugadores exitosamente. Revisa la lista y confirma.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No se encontraron datos válidos en el archivo. Usa la plantilla estándar.',
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Error al interpretar el archivo CSV. Verifica el formato.',
      });
    }
  };

  // Guardar en almacenamiento local y sincronizar
  const handleSaveRoster = () => {
    if (parsedPlayers.length === 0) {
      setStatusMessage({ type: 'error', text: 'No hay jugadores en la lista para guardar.' });
      return;
    }

    const newRoster: TeamRoster = {
      schoolId: selectedSchoolId,
      sport: selectedSport,
      categoryId: selectedCategoryId,
      coachName: coachName || 'Entrenador Oficial',
      players: parsedPlayers,
      updatedAt: new Date().toISOString(),
    };

    try {
      rosterService.saveCategoryRoster(newRoster);
      setStatusMessage({
        type: 'success',
        text: `¡Nómina de ${parsedPlayers.length} jugadores guardada con éxito para la categoría!`,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error al guardar en almacenamiento local.' });
    }
  };

  // Generar nómina genérica de emergencia (Dorsales #1 a #15)
  const handleGenerateEmergencyRoster = () => {
    const defaultPositions = ['Portero/a', 'Defensa', 'Defensa', 'Mediocampista', 'Mediocampista', 'Delantero/a'];
    const emergencyList: Player[] = Array.from({ length: 12 }, (_, i) => ({
      id: `p-emerg-${i + 1}`,
      jerseyNumber: i + 1,
      fullName: `Dorsal #${i + 1}`,
      position: defaultPositions[i % defaultPositions.length],
      isCaptain: i === 0,
    }));

    setParsedPlayers(emergencyList);
    setActiveTab('preview');
    setStatusMessage({
      type: 'info',
      text: 'Se generó una nómina provisional de emergencia (Dorsales #1 al #12) para habilitar el marcador sin demoras.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Carga Masiva de Nóminas (Rosters)</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                  Oficial
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Estandarización de atletas, dorsales y cuerpos técnicos por colegio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Pestañas */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Subir Archivo CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'manual'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pegar Texto Directo</span>
          </button>

          {parsedPlayers.length > 0 && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-amber-600 text-amber-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Vista Previa ({parsedPlayers.length})</span>
            </button>
          )}
        </div>

        {/* Mensaje de Estado */}
        {statusMessage && (
          <div
            className={`mx-5 mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Selectores de Colegio y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institución Educativa:</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Disciplina Deportiva:</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value as SportType)}
                className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900"
              >
                <option value="futbol">⚽ Fútbol</option>
                <option value="voleibol">🏐 Voleibol</option>
                <option value="baloncesto">🏀 Baloncesto</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoría Oficial:</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900"
              >
                {categories
                  .filter((c) => c.sport === selectedSport)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.division})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* PESTAÑA 1: SUBIR ARCHIVO CSV */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Arrastra tu archivo CSV aquí o haz clic para examinar
                  </h4>
                  <p className="text-xs text-slate-500">
                    Soporta archivos generados desde Excel, Google Sheets o texto delimitado por comas.
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-input"
                />
                <label
                  htmlFor="csv-file-input"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Seleccionar Archivo CSV
                </label>
              </div>

              {/* Botones de Soporte y Plantilla */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const sch = schools.find((s) => s.id === selectedSchoolId);
                    const blob = rosterService.generateExcelWorkbook(sch);
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `plantilla_roster_${selectedSchoolId}_2026.xls`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-amber-300 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Descargar Plantilla Excel (.xls)</span>
                </button>

                <button
                  onClick={handleGenerateEmergencyRoster}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>Generar Nómina de Emergencia (#1 al #12)</span>
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: PEGAR TEXTO */}
          {activeTab === 'manual' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Pega la lista de jugadores (ejemplo: <code>10, Valentina Soto, Delantera</code>):
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="1, Sofía Morales, Portera&#10;10, Valentina Soto, Delantera&#10;7, Mariana Vargas, Mediocampista"
                rows={6}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                onClick={() => parseCsvContent(csvText)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Interpretar y Validar Lista
              </button>
            </div>
          )}

          {/* PESTAÑA 3: VISTA PREVIA Y CONFIRMACIÓN */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Total de Atletas Listos: <strong>{parsedPlayers.length}</strong>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Validado</span>
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 text-center w-12">#</th>
                      <th className="p-2.5">Nombre Completo</th>
                      <th className="p-2.5">Posición</th>
                      <th className="p-2.5 text-center">Capitán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedPlayers.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-mono font-bold text-amber-800 bg-amber-50/40">
                          {p.jerseyNumber}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900">{p.fullName}</td>
                        <td className="p-2.5 text-slate-600">{p.position || 'Jugador/a'}</td>
                        <td className="p-2.5 text-center">
                          {p.isCaptain ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                              © Capitán
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal con Acciones */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {parsedPlayers.length > 0 && (
            <button
              onClick={handleSaveRoster}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Roster Oficial</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
