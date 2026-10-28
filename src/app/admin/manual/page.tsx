'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Lock, 
  KeyRound, 
  Send, 
  Copy, 
  CheckCircle2, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  ExternalLink, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  AlertCircle,
  Users,
  Award,
  Calendar,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';

const SCHOOL_PINS: Record<string, { pin: string; contactRole: string }> = {
  'la-paz-cabo-velas': { pin: '1001', contactRole: 'Coordinación deportiva y entrenadores' },
  'la-paz-tempisque': { pin: '1002', contactRole: 'Coordinación deportiva y entrenadores' },
  'cria': { pin: '2001', contactRole: 'Athletic Director & Coaches' },
  'journey-school': { pin: '3001', contactRole: 'Coordinación deportiva y docentes' },
  'vittorino': { pin: '4001', contactRole: 'Docentes de educación física y delegados' },
  'educarte': { pin: '5001', contactRole: 'Coordinación deportiva y entrenadores' },
};

export default function AdminManualPage() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<'inscripciones' | 'marcadores' | 'mural' | 'calendario'>('inscripciones');
  const [selectedSchoolPreview, setSelectedSchoolPreview] = useState<string>('cria');
  const [testPasswordInput, setTestPasswordInput] = useState<string>('');
  const [testPasswordResult, setTestPasswordResult] = useState<boolean | null>(null);
  const [copiedSimulation, setCopiedSimulation] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramPin = urlParams.get('pin') || urlParams.get('key');
      const savedPin = sessionStorage.getItem('costadeoro_manual_pin');
      const isAdmin = sessionStorage.getItem('costadeoro_admin_auth');
      const isValid = (val: string | null) => {
        if (!val) return false;
        const clean = val.trim().toLowerCase();
        return clean === '2026controladmin' || clean === '8421';
      };
      if (isValid(paramPin) || isValid(savedPin) || isAdmin === 'true') {
        sessionStorage.setItem('costadeoro_manual_pin', '2026ControlAdmin');
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlockManual = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    if (clean === '2026controladmin' || clean === '8421') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('costadeoro_manual_pin', '2026ControlAdmin');
      }
      setIsUnlocked(true);
      setPinError(null);
    } else {
      setPinError('Clave incorrecta. Utilice su clave maestra 2026ControlAdmin (o 8421).');
    }
  };

  // Generador de mensaje simulado de WhatsApp
  const selectedSchool = SCHOOLS_DATA.find((s) => s.id === selectedSchoolPreview) || SCHOOLS_DATA[0];
  const schoolPin = SCHOOL_PINS[selectedSchool.id]?.pin || '1001';
  const simulatedUrl = `https://costadeoro.curiol.studio/registro-nomina?school=${selectedSchool.id}&pin=${schoolPin}`;

  const simulatedWhatsAppText = `🏆 *FESTIVAL DEPORTIVO LIGA COSTA DE ORO 2026*
📋 *Acreditación oficial de atletas y nóminas institucionales*

Estimado/a coordinador/a deportivo de *${selectedSchool.name}*:

Le compartimos el enlace oficial para el registro e inscripción de atletas de su institución:

🔗 *Enlace directo:* ${simulatedUrl}
🔑 *PIN institucional de acceso:* ${schoolPin}
*(Al abrir el enlace, el formulario se activa y desbloquea automáticamente)*

📋 *Instrucciones para completar la inscripción:*
1️⃣ Ingrese al enlace directo en su teléfono o computadora.
2️⃣ Inscriba a sus atletas en línea por disciplina (fútbol, voleibol y baloncesto) o descargue la *Plantilla oficial de Excel (.xls)*, llénela y cárguela en el mismo portal.
3️⃣ Toda la información registrada alimenta de forma inmediata las actas de juego del torneo.

¡Muchos éxitos a toda la delegación en la competencia!
_Comité Organizador · Liga Costa de Oro 2026_`;

  const handleCopySimulatedMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(simulatedWhatsAppText);
      setCopiedSimulation(true);
      setTimeout(() => setCopiedSimulation(false), 2500);
    }
  };

  const handleTestPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testPasswordInput.trim().toLowerCase();
    const valid = ['2026controladmin', 'admin2026', 'oro2026', 'costa2026', '8421'];
    if (valid.includes(clean)) {
      setTestPasswordResult(true);
    } else {
      setTestPasswordResult(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1a2540] to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-amber-500/30 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF8E7] border border-[#D9C16C] text-[#9A6B38] flex items-center justify-center mx-auto text-2xl font-bold">
            <Lock className="w-8 h-8 text-[#9A6B38]" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              Acceso Protegido
            </span>
            <h1 className="text-xl font-black text-slate-900">
              Manual Administrativo de Inscripciones
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingrese su clave maestra de administrador (<strong>2026ControlAdmin</strong>) para acceder a los procedimientos oficiales.
            </p>
          </div>

          <form onSubmit={handleUnlockManual} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                maxLength={24}
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-center text-xl font-mono font-bold tracking-widest text-[#28375E] bg-[#FAF6F0] focus:border-[#9A6B38] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#9A6B38] hover:bg-[#83582A] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Desbloquear manual</span>
              <KeyRound className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Liga Costa de Oro 2026 · Curiol Studio<br />
            Información confidencial para la Dirección del Torneo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-slate-800 pb-20 font-sans print:bg-white print:p-0">
      
      {/* 🖨️ ESTILO ESTRICTO DE IMPRESIÓN Y PDF LIMPIO (SIN CABECERAS NI FILE:/// DEL NAVEGADOR) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: letter portrait;
          margin: 0mm;
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .page-container {
            padding: 12mm 12mm !important;
          }
        }
      `}} />

      {/* 🖨️ BARRA SUPERIOR DE ASISTENCIA Y ACCIONES (NO IMPRIMIBLE) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden print-btn-bar">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Mesa de Admin</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs text-[#9A6B38] font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Manual de procesos administrativos · Curiol Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] text-slate-500 italic">
              Asegúrese de desmarcar &laquo;Encabezados y pies de página&raquo; y marcar &laquo;Gráficos de fondo&raquo; en la ventana de impresión
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9A6B38] hover:bg-[#83582A] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir o guardar en PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📄 CONTENEDOR PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <header className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FDF8E7] text-[#9A6B38] border border-[#D9C16C] text-xs font-black uppercase tracking-wider">
              Guía oficial de operaciones
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              Comité Organizador & Soporte Técnico
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Versión interactiva 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#28375E] tracking-tight leading-tight">
            Manual paso a paso del panel administrativo
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Protocolo oficial de despacho, operación de inscripciones por institución, registro de actas y contingencias deportivas para la Liga Costa de Oro 2026.
          </p>

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 leading-relaxed">
            <span className="text-base">🔒</span>
            <div>
              <strong>CONFIDENCIALIDAD ESTRICTA:</strong> Este manual, las claves de acceso y los enlaces con PIN son para uso exclusivo de Don Alejandro Rodríguez y Alberto Bustos. <strong>Queda terminantemente prohibido compartir este enlace o las credenciales con terceras personas.</strong> Cada colegio únicamente recibe su mensaje específico de WhatsApp.
            </div>
          </div>
        </header>

        {/* SELECTOR DE MÓDULOS DE PROCESOS */}
        <nav className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs print:hidden">
          <button
            type="button"
            onClick={() => setActiveModule('inscripciones')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeModule === 'inscripciones'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>1. Despacho e inscripciones por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('marcadores')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeModule === 'marcadores'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Marcadores y mesa técnica (próximo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('mural')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeModule === 'mural'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>3. Moderación del muro familiar (próximo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('calendario')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeModule === 'calendario'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4. Calendario y reprogramaciones (próximo)</span>
          </button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
            MÓDULO 1: DESPACHO E INSCRIPCIÓN DE DELEGACIONES POR WHATSAPP
            ══════════════════════════════════════════════════════════════════ */}
        {activeModule === 'inscripciones' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* INTRODUCCIÓN AL PROCESO */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#9A6B38]">
                <Layers className="w-5 h-5" />
                <span className="text-xs uppercase font-black tracking-wider">Flujo operacional seguro</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                ¿Cómo funciona el sistema de inscripciones por institución?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Para proteger la privacidad de los estudiantes y evitar accesos públicos no autorizados, el portal de inscripciones <strong>no está visible en el menú general</strong>. La distribución se realiza de forma descentralizada mediante WhatsApp desde el panel administrativo:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#28375E] text-white text-xs font-black flex items-center justify-center">1</span>
                  <h3 className="font-extrabold text-sm text-slate-900">Aislamiento por institución</h3>
                  <p className="text-xs text-slate-600">Cada colegio tiene un PIN único de 4 dígitos. Ninguna delegación puede ver ni modificar las listas de otra.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#9A6B38] text-white text-xs font-black flex items-center justify-center">2</span>
                  <h3 className="font-extrabold text-sm text-slate-900">Auto-desbloqueo seguro</h3>
                  <p className="text-xs text-slate-600">El enlace enviado por WhatsApp incluye los parámetros seguros para que el formulario se active sin requerir digitación manual.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">3</span>
                  <h3 className="font-extrabold text-sm text-slate-900">Sincronización en la nube</h3>
                  <p className="text-xs text-slate-600">Los datos ingresados alimentan en tiempo real la base de datos de Firebase Firestore y las actas de mesa técnica.</p>
                </div>
              </div>
            </section>

            {/* PASO 1: ACCESO AL PANEL DE ADMINISTRACIÓN Y PESTAÑA 6 */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0">
                  PASO 1
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Ingreso a la mesa de administración (Pestaña 6: Nóminas)
                  </h2>
                  <p className="text-xs text-slate-500">Acceso seguro con contraseña y consola central de control</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  1. Abre el navegador en cualquier teléfono o computadora e ingresa a:
                  <a 
                    href="https://costadeoro.curiol.studio/admin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#28375E] underline ml-1.5"
                  >
                    <span>costadeoro.curiol.studio/admin</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
                <p>
                  2. En la pantalla de bienvenida, digita la clave <code>2026ControlAdmin</code> (o la corta <code>8421</code>) y presiona <strong>«Desbloquear Acceso»</strong>.
                </p>

                {/* TARJETA DESTACADA CLAVE MAESTRA */}
                <div className="p-4 rounded-2xl bg-[#FDF8E7] border-2 border-[#D9C16C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#9A6B38] font-black uppercase tracking-wider block">
                      Clave Oficial Maestra de Administración
                    </span>
                    <strong className="font-mono text-lg text-[#28375E] tracking-wider block">
                      2026ControlAdmin
                    </strong>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      Contraseña principal de Don Alejandro para desbloquear la consola y gestionar resultados, actas y nóminas.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText('2026ControlAdmin');
                        alert('¡Clave 2026ControlAdmin copiada al portapapeles!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A6B38] hover:bg-[#83582A] text-white font-extrabold text-xs shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-center"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar clave</span>
                  </button>
                </div>

                <p>
                  3. En la barra superior de pestañas, haz clic en <strong>«6. Nóminas Oficiales e Inscripciones»</strong> para entrar al gestor central.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Clave principal</span>
                    <strong className="font-mono text-xs sm:text-sm text-slate-900">2026ControlAdmin</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Clave corta</span>
                    <strong className="font-mono text-xs sm:text-sm text-slate-900">8421</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">PIN este manual</span>
                    <strong className="font-mono text-xs sm:text-sm text-blue-900">26172918</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">PIN maestro mesa</span>
                    <strong className="font-mono text-xs sm:text-sm text-emerald-800">9999</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* PASO 2: DESPACHO POR WHATSAPP Y PIN INSTITUCIONAL */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0">
                  PASO 2
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Despachar la invitación por WhatsApp a cada colegio
                  </h2>
                  <p className="text-xs text-slate-500">Un toque abre WhatsApp con el mensaje estructurado listo para despacho</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed space-y-1">
                <div className="font-black flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Regla técnica: Ingreso directo vs. PIN de respaldo</span>
                </div>
                <p>
                  Cuando el coordinador deportivo toca el enlace recibido en WhatsApp, <strong>el formulario se activa y desbloquea de forma directa y automática</strong> sin solicitarle digitar el PIN, ya que el parámetro va incluido en la dirección web.
                </p>
                <p className="text-emerald-800">
                  <strong>El PIN de 4 dígitos es un elemento de respaldo</strong> por si el profesor ingresa posteriormente desde otra computadora o requiere reactivar su sesión manualmente.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                En la cuadrícula de despacho aparecen las 6 instituciones con su PIN asignado. Cada tarjeta dispone de 3 botones de acción:
              </p>

              {/* TABLA DE INSTITUCIONES Y PINS */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200">
                      <th className="py-2.5 px-3">Institución educativa</th>
                      <th className="py-2.5 px-3">Sede</th>
                      <th className="py-2.5 px-3 text-center">PIN oficial</th>
                      <th className="py-2.5 px-3">Destinatario habitual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SCHOOLS_DATA.map((sch) => {
                      const pinData = SCHOOL_PINS[sch.id];
                      return (
                        <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
                              <SchoolEmblem schoolId={sch.id} size="xs" showBorder={false} />
                            </div>
                            <span>{sch.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{sch.location}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-mono font-black text-[#9A6B38] bg-[#FDF8E7] px-2 py-0.5 rounded-md border border-[#D9C16C]">
                              {pinData?.pin || '1001'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{pinData?.contactRole}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* EXPLICACIÓN DE LOS 3 BOTONES DE ACCIÓN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Botón verde «WhatsApp»</span>
                  </div>
                  <p className="text-[11px] text-emerald-950/80 leading-relaxed">
                    Abre WhatsApp en el navegador o teléfono con el mensaje formal estructurado, listo para elegir el contacto del coordinador y enviar.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                    <Copy className="w-3.5 h-3.5 text-[#9A6B38]" />
                    <span>Botón «Copiar»</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Copia al portapapeles el enlace con PIN para pegarlo en un chat o grupo de WhatsApp que ya tengas abierto.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                    <span>Botón «Correo»</span>
                  </div>
                  <p className="text-[11px] text-blue-950/80 leading-relaxed">
                    Abre el cliente de correo predeterminado con el asunto oficial y el texto estructurado listo para despacho por email.
                  </p>
                </div>
              </div>

              {/* SIMULADOR EN VIVO DEL MENSAJE DE WHATSAPP */}
              <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#9A6B38] uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Vista previa del mensaje generado para WhatsApp</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-600 font-bold">Ver colegio:</label>
                    <select
                      value={selectedSchoolPreview}
                      onChange={(e) => setSelectedSchoolPreview(e.target.value)}
                      className="text-xs font-bold py-1 px-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 cursor-pointer"
                    >
                      {SCHOOLS_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shortName} (PIN: {SCHOOL_PINS[s.id]?.pin})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Globo de WhatsApp */}
                <div className="bg-[#DCF8C6] border border-emerald-200/80 p-4 rounded-2xl text-xs text-slate-900 font-sans shadow-2xs whitespace-pre-wrap leading-relaxed">
                  {simulatedWhatsAppText}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySimulatedMessage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    {copiedSimulation ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#9A6B38]" />}
                    <span>{copiedSimulation ? '¡Copiado!' : 'Copiar texto del mensaje'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* PASO 3: EL COLEGIO INSCRIBE Y DON ALEJANDRO SUPERVISA */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0">
                  PASO 3
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    El colegio inscribe y Don Alejandro supervisa en la mesa central
                  </h2>
                  <p className="text-xs text-slate-500">Todo el proceso se actualiza en tiempo real sin recargar la pantalla</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-slate-200 space-y-2.5">
                  <h3 className="font-extrabold text-sm text-[#28375E] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#28375E] text-white text-xs font-black flex items-center justify-center">A</span>
                    <span>Lo que hace el profesor del colegio:</span>
                  </h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                    <li>Abre el enlace de WhatsApp (ingresa de inmediato sin digitar el PIN).</li>
                    <li>Registra a sus atletas en línea con <strong>dos apellidos obligatorios</strong>, dorsal, año de nacimiento y posición.</li>
                    <li>Opcionalmente, puede descargar la plantilla oficial en Excel, llenarla y subirla en 1 solo paso.</li>
                    <li>Pulsa <strong>«Guardar Nómina Oficial»</strong> para consolidar su equipo.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0F4FA] border border-blue-200 space-y-2.5">
                  <h3 className="font-extrabold text-sm text-emerald-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">B</span>
                    <span>Lo que ve Don Alejandro en la Mesa Central:</span>
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
                    <li>En la pestaña 6 del panel admin, ve reflejados los atletas de cada colegio al instante.</li>
                    <li>Puede verificar capitanes, corroborar edades y realizar cambios de emergencia si el profesor se lo pide.</li>
                    <li>Pulsando <strong>«Exportar Todo en Excel (.xls)»</strong> descarga el listado consolidado para los árbitros y anotadores en cancha.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PREGUNTAS FRECUENTES Y CONTINGENCIAS */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#9A6B38]">
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs uppercase font-black tracking-wider">Preguntas frecuentes y contingencias</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Resolución de dudas en campo
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 divide-y divide-slate-100">
                <div className="pt-2">
                  <h3 className="font-extrabold text-slate-900">¿Qué hacer si un delegado olvidó su PIN o extravió el mensaje?</h3>
                  <p className="text-slate-600 mt-1">
                    Don Alejandro o Alberto pueden ingresar a <code>/admin</code>, ir a la pestaña 6 y volver a tocar el botón «WhatsApp» de ese colegio para re-enviarle la credencial de inmediato.
                  </p>
                </div>

                <div className="pt-3">
                  <h3 className="font-extrabold text-slate-900">¿Existe un PIN maestro de emergencia para la mesa técnica?</h3>
                  <p className="text-slate-600 mt-1">
                    Sí. El código <strong>9999</strong> es el PIN maestro de contingencia. Permite abrir y editar cualquier institución en caso de que el delegado no cuente con señal o requiera asistencia directa en la mesa.
                  </p>
                </div>

                <div className="pt-3">
                  <h3 className="font-extrabold text-slate-900">¿Qué pasa si un colegio necesita corregir un dorsal o cambiar a un jugador lesionado?</h3>
                  <p className="text-slate-600 mt-1">
                    El coordinador puede ingresar nuevamente a su mismo enlace en cualquier momento antes del partido, ajustar el nombre o dorsal y pulsar <strong>«Guardar Nómina Oficial»</strong>. Los cambios se actualizan al instante en el servidor.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MÓDULOS EN PREPARACIÓN (2, 3 Y 4)
            ══════════════════════════════════════════════════════════════════ */}
        {activeModule !== 'inscripciones' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#FDF8E7] border border-[#D9C16C] text-[#9A6B38] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Módulo en preparación
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Esta sección del manual interactivo se habilitará en la siguiente fase de capacitación administrativa. Actualmente el <strong>Módulo 1: Despacho e Inscripción de Delegaciones</strong> se encuentra 100 % activo.
            </p>
            <button
              type="button"
              onClick={() => setActiveModule('inscripciones')}
              className="px-4 py-2 rounded-xl bg-[#28375E] text-white font-extrabold text-xs transition cursor-pointer"
            >
              ← Volver al Módulo 1: Inscripciones
            </button>
          </div>
        )}

      </main>

      {/* PIE INSTITUCIONAL CURIOL STUDIO */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 text-center text-xs text-slate-500 space-y-1">
        <p>Liga Costa de Oro 2026 · Plataforma Oficial desarrollada por <strong>Curiol Studio</strong></p>
        <p>Guanacaste, Costa Rica · Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
