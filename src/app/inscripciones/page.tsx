'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { rosterService } from '@/lib/rosterService';
import { School } from '@/types/tournament';
import { 
  Send, 
  Copy, 
  CheckCircle2, 
  KeyRound, 
  ExternalLink, 
  FileSpreadsheet, 
  Download, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  Info,
  Users
} from 'lucide-react';

const SCHOOL_PINS_MAP: Record<string, string> = {
  'la-paz-cabo-velas': '1001',
  'la-paz-tempisque': '1002',
  'cria': '2001',
  'journey-school': '3001',
  'vittorino': '4001',
  'educarte': '5001',
};

export default function InscripcionesPage() {
  const [copiedSchoolId, setCopiedSchoolId] = useState<string | null>(null);
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);

  // Obtener URL de registro con parámetros de colegio y PIN
  const getRegistrationUrl = (schoolId: string, pin: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://costadeoro.curiol.studio';
    return `${origin}/registro-nomina?school=${schoolId}&pin=${pin}`;
  };

  // Construir mensaje oficial estructurado para WhatsApp
  const buildWhatsAppMessage = (school: School, pin: string) => {
    const url = getRegistrationUrl(school.id, pin);
    return `🏆 *FESTIVAL DEPORTIVO LIGA COSTA DE ORO 2026*\n📋 *Acreditación Oficial de Atletas y Nóminas Institucionales*\n\nEstimado/a Coordinador/a Deportivo de *${school.name}*:\n\nLe compartimos el enlace oficial para el registro e inscripción de atletas de su institución:\n\n🔗 *Enlace directo:* ${url}\n🔑 *PIN institucional de acceso:* ${pin}\n\n📋 *Instrucciones para completar la inscripción:*\n1️⃣ Ingrese al enlace oficial. Al acceder mediante este enlace, su institución y el PIN (*${pin}*) se validan automáticamente.\n2️⃣ Puede inscribir a sus atletas directamente en línea por categoría (Fútbol, Voleibol y Baloncesto) o descargar la *Plantilla Oficial de Excel (.xls)*, completarla y subirla en el mismo portal.\n3️⃣ Toda la información registrada alimenta de forma inmediata las actas oficiales de juego y los perfiles de competencia de la liga.\n\n¡Muchos éxitos a toda la delegación deportiva!\n_Comité Organizador · Liga Costa de Oro 2026_`;
  };

  // Enviar por WhatsApp
  const handleShareWhatsApp = (school: School) => {
    const pin = SCHOOL_PINS_MAP[school.id] || '1001';
    const message = buildWhatsAppMessage(school, pin);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Copiar mensaje completo al portapapeles
  const handleCopyMessage = (school: School) => {
    const pin = SCHOOL_PINS_MAP[school.id] || '1001';
    const message = buildWhatsAppMessage(school, pin);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopiedSchoolId(school.id);
      setTimeout(() => setCopiedSchoolId(null), 3000);
    }
  };

  // Copiar solo el PIN
  const handleCopyPin = (schoolId: string, pin: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pin);
      setCopiedPinId(schoolId);
      setTimeout(() => setCopiedPinId(null), 2500);
    }
  };

  // Enviar por correo electrónico
  const handleShareEmail = (school: School) => {
    const pin = SCHOOL_PINS_MAP[school.id] || '1001';
    const url = getRegistrationUrl(school.id, pin);
    const subject = `Enlace oficial de registro de nóminas 2026 · ${school.shortName}`;
    const body = `Estimado/a Coordinador/a Deportivo de ${school.name},\n\nLe compartimos el enlace oficial para el registro y acreditación de nóminas de atletas del Festival Deportivo Liga Costa de Oro 2026.\n\nEnlace directo: ${url}\nPIN institucional de acceso: ${pin}\n\nInstrucciones:\n1. Ingrese al enlace directo; su colegio y PIN institucional (${pin}) quedarán verificados automáticamente.\n2. Inscriba a sus atletas en línea o descargue la Plantilla Oficial de Excel (con pestañas para Fútbol, Voleibol y Baloncesto) y cárguela directamente en el portal.\n\nSaludos cordiales,\nComité Organizador · Liga Costa de Oro 2026`;
    const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
  };

  // Descargar plantilla Excel oficial
  const handleDownloadTemplate = (school?: School) => {
    const blob = rosterService.generateOfficialTemplateWorkbook(school);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `plantilla_oficial_nomina_${school?.id || 'general'}_2026.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-slate-800 pb-20">
      {/* 🏅 CABECERA EDITORIAL Y GUÍA */}
      <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/60 pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Autogestión deportiva</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Festival Deportivo Liga Costa de Oro 2026
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 sm:w-10 h-10 text-amber-600" />
              <span>Inscripciones y nóminas oficiales</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Portal central de despacho y autogestión para coordinadores deportivos y delegados.
              Selecciona tu institución para enviar el mensaje oficial por WhatsApp con enlace directo,
              PIN institucional de seguridad y plantilla oficial en Excel.
            </p>
          </div>

          {/* Tarjeta de Guía Rápida en 3 Pasos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-sm text-slate-900">Selecciona tu colegio</h4>
              <p className="text-xs text-slate-500">Cada institución cuenta con su propio PIN de seguridad y enlace personalizado.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-sm text-slate-900">Despacha por WhatsApp</h4>
              <p className="text-xs text-slate-500">Un toque abre WhatsApp con el mensaje formal estructurado listo para enviar.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-900 font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-sm text-slate-900">Acreditación inmediata</h4>
              <p className="text-xs text-slate-500">Los datos ingresados alimentan las actas y perfiles oficiales en tiempo real.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏫 CUADRÍCULA DE INSTITUCIONES */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Instituciones participantes y accesos directos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              6 instituciones hermanadas de Guanacaste · Cobertura en fútbol, voleibol y baloncesto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadTemplate()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-300 shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            title="Descargar plantilla de Excel general con pestañas por disciplina"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Descargar plantilla base general (.xls)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCHOOLS_DATA.map((school) => {
            const pin = SCHOOL_PINS_MAP[school.id] || '1001';
            const isCopied = copiedSchoolId === school.id;
            const isPinCopied = copiedPinId === school.id;
            const isExpanded = expandedPreviewId === school.id;
            const registrationUrl = getRegistrationUrl(school.id, pin);

            return (
              <div
                key={school.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                        <SchoolEmblem schoolId={school.id} size="sm" showBorder={false} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                          {school.name}
                        </h3>
                        <span className="text-xs text-slate-500 block truncate">
                          {school.city || school.location || 'Guanacaste'} · Guanacaste
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bloque de PIN Institucional */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block leading-none">
                          PIN de seguridad
                        </span>
                        <span className="font-mono font-black text-base text-slate-900 tracking-widest">
                          {pin}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyPin(school.id, pin)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copiar únicamente el PIN de 4 dígitos"
                    >
                      {isPinCopied ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-amber-700" />
                          <span>Copiar PIN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Acciones Principales de Despacho */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {/* Botón Principal: WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(school)}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    title="Abrir WhatsApp con el mensaje oficial estructurado"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar mensaje por WhatsApp</span>
                  </button>

                  {/* Botones Secundarios */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(school)}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                      title="Copiar texto formal completo al portapapeles"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>¡Mensaje copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar mensaje</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareEmail(school)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Enviar por correo electrónico"
                    >
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span>Enviar correo</span>
                    </button>
                  </div>

                  {/* Acciones de Formulario y Plantilla Excel */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Link
                      href={registrationUrl}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-extrabold hover:underline"
                    >
                      <span>Abrir formulario directo</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDownloadTemplate(school)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                      <span>Plantilla Excel</span>
                    </button>
                  </div>

                  {/* Acordeón para Ver el Mensaje Exacto */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedPreviewId(isExpanded ? null : school.id)}
                      className="w-full text-left text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center justify-between py-1 cursor-pointer transition-colors"
                    >
                      <span>{isExpanded ? 'Ocultar vista previa del mensaje' : 'Ver mensaje de WhatsApp'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 whitespace-pre-line leading-relaxed font-sans select-all shadow-inner">
                        {buildWhatsAppMessage(school, pin)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ℹ️ NOTA DE SOPORTE TÉCNICO */}
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 mt-8">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-700">
            <h4 className="font-extrabold text-amber-950">
              Asistencia y soporte directo del comité organizador
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Si algún coordinador deportivo presenta dudas con la digitación del PIN o requiere asistencia técnica para la carga de atletas en el libro de Excel, puede comunicarse de inmediato con el soporte oficial vía WhatsApp al número institucional{' '}
              <a href="https://wa.me/50660602617" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 underline">
                +506 6060-2617
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
