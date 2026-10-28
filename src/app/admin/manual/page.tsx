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
  ExternalLink, 
  HelpCircle, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  Users, 
  FileText,
  Sparkles,
  Layers,
  Award,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';

interface SchoolPinConfig {
  name: string;
  short: string;
  pin: string;
  contactRole: string;
  location: string;
  url: string;
  samplePlayers: Array<{
    dorsal: number;
    name: string;
    year: number;
    pos: string;
    cap: boolean;
  }>;
}

const SCHOOLS_MANUAL_DATA: Record<string, SchoolPinConfig> = {
  'la-paz-cabo-velas': {
    name: 'La Paz Community School Cabo Velas',
    short: 'La Paz Cabo Velas',
    pin: '1001',
    contactRole: 'Coordinación deportiva y entrenadores',
    location: 'Brasilito, Cabo Velas',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=la-paz-cabo-velas&pin=1001',
    samplePlayers: [
      { dorsal: 1, name: 'Sebastián Mora Quirós', year: 2011, pos: 'Portero / Titular', cap: false },
      { dorsal: 4, name: 'Felipe Cordero Brenes', year: 2011, pos: 'Defensa / Campo', cap: false },
      { dorsal: 10, name: 'Nicolás Vargas Arroyo', year: 2011, pos: 'Mediocampo / Armador', cap: true },
      { dorsal: 7, name: 'Ignacio Rojas Monge', year: 2012, pos: 'Delantero / Extremo', cap: false },
      { dorsal: 9, name: 'Emilio Salazar Fonseca', year: 2011, pos: 'Delantero Centro', cap: false },
    ]
  },
  'la-paz-tempisque': {
    name: 'La Paz Community School Tempisque',
    short: 'La Paz Tempisque',
    pin: '1002',
    contactRole: 'Coordinación deportiva y entrenadores',
    location: 'Comunidad, Carrillo',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=la-paz-tempisque&pin=1002',
    samplePlayers: [
      { dorsal: 1, name: 'Camila Navarro Salas', year: 2012, pos: 'Portera', cap: false },
      { dorsal: 7, name: 'Lucía Monge Solís', year: 2012, pos: 'Delantera / Capitana', cap: true },
      { dorsal: 5, name: 'Mariana Zúñiga Castillo', year: 2012, pos: 'Defensa', cap: false },
      { dorsal: 8, name: 'Valentina Soto Miranda', year: 2012, pos: 'Mediocampo', cap: false },
    ]
  },
  'cria': {
    name: 'Costa Rica International Academy',
    short: 'CRIA',
    pin: '2001',
    contactRole: 'Athletic Director & Coaches',
    location: 'Playa Flamingo, Santa Cruz',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=cria&pin=2001',
    samplePlayers: [
      { dorsal: 1, name: 'Alexander David Smith Mora', year: 2011, pos: 'Portero Titular', cap: false },
      { dorsal: 4, name: 'Santiago Miller Gutiérrez', year: 2011, pos: 'Defensa Central', cap: false },
      { dorsal: 8, name: 'Lucas Taylor Céspedes', year: 2012, pos: 'Volante Mixto', cap: false },
      { dorsal: 9, name: 'Mateo Johnson Cordero', year: 2011, pos: 'Delantero / Capitán', cap: true },
      { dorsal: 11, name: 'Oliver Wilson Carvajal', year: 2011, pos: 'Extremo Izquierdo', cap: false },
    ]
  },
  'journey-school': {
    name: 'The Journey School',
    short: 'Journey School',
    pin: '3001',
    contactRole: 'Coordinación deportiva y docentes',
    location: 'Tamarindo, Santa Cruz',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=journey-school&pin=3001',
    samplePlayers: [
      { dorsal: 1, name: 'Emma Rodríguez Villalobos', year: 2012, pos: 'Portera', cap: false },
      { dorsal: 4, name: 'Daniela Arias Umaña', year: 2012, pos: 'Defensa', cap: false },
      { dorsal: 10, name: 'Paula Jiménez Méndez', year: 2012, pos: 'Mediocampo', cap: false },
      { dorsal: 11, name: 'Sofía Davis Esquivel', year: 2012, pos: 'Delantera / Capitana', cap: true },
    ]
  },
  'vittorino': {
    name: 'Centro Educativo Católico Monseñor Vittorino Girardi Stellin',
    short: 'Monseñor Vittorino',
    pin: '4001',
    contactRole: 'Docentes de educación física y delegados',
    location: 'Huacas, Santa Cruz',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=vittorino&pin=4001',
    samplePlayers: [
      { dorsal: 4, name: 'Andrés Quesada Chinchilla', year: 2011, pos: 'Armador / Base', cap: true },
      { dorsal: 8, name: 'Gabriel Segura Pizarro', year: 2011, pos: 'Escolta', cap: false },
      { dorsal: 12, name: 'Esteban Vega Gutiérrez', year: 2011, pos: 'Pívot / Poste', cap: false },
      { dorsal: 15, name: 'Mauricio Cordero Campos', year: 2012, pos: 'Ala-Pívot', cap: false },
    ]
  },
  'educarte': {
    name: 'Educarte Bilingual High School',
    short: 'Educarte',
    pin: '5001',
    contactRole: 'Coordinación deportiva y entrenadores',
    location: 'Tamarindo / Villarreal',
    url: 'https://costadeoro.curiol.studio/registro-nomina?school=educarte&pin=5001',
    samplePlayers: [
      { dorsal: 3, name: 'Elena Castro Alvarado', year: 2012, pos: 'Armadora / Colocadora', cap: true },
      { dorsal: 6, name: 'Valeria Porras Solano', year: 2012, pos: 'Central / Bloqueo', cap: false },
      { dorsal: 8, name: 'Daniela Chaves Pizarro', year: 2012, pos: 'Rematadora / Opuesta', cap: false },
      { dorsal: 10, name: 'Ximena Valverde Gómez', year: 2012, pos: 'Líbero / Defensora', cap: false },
    ]
  },
};

export default function AdminManualPage() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  
  // Navegación por pasos
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Selector de Ficha PDF
  const [pdfSchoolKey, setPdfSchoolKey] = useState<string>('cria');
  const [pdfSport, setPdfSport] = useState<string>('Fútbol · Categoría C Masculino');
  
  // Estados de copiado y visualización
  const [copiedWaSchoolId, setCopiedWaSchoolId] = useState<string | null>(null);
  const [copiedPdfWa, setCopiedPdfWa] = useState<boolean>(false);
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);

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
      setPinError('Contraseña no válida. Por favor verifique e intente nuevamente.');
    }
  };

  // Generador de mensaje de WhatsApp para colegios (Paso 2)
  const getSchoolWaMessage = (schoolKey: string) => {
    const school = SCHOOLS_MANUAL_DATA[schoolKey] || SCHOOLS_MANUAL_DATA['cria'];
    return `🏆 *FESTIVAL DEPORTIVO LIGA COSTA DE ORO 2026*
📋 *Acreditación oficial de atletas y nóminas institucionales*

Estimado/a coordinador/a deportivo de *${school.name}*:

Le compartimos el enlace oficial para el registro e inscripción de atletas de su institución:

🔗 *Enlace directo:* ${school.url}
🔑 *PIN institucional de acceso:* ${school.pin}
*(Al abrir el enlace, el formulario se activa y desbloquea automáticamente)*

📋 *Instrucciones para completar la inscripción:*
1️⃣ Ingrese al enlace directo en su teléfono o computadora.
2️⃣ Inscriba a sus atletas en línea por disciplina con nombre y dos apellidos obligatorios, o descargue la *Plantilla oficial de Excel (.xls)*, llénela y cárguela en el mismo portal.
3️⃣ Toda la información registrada alimenta de forma inmediata las actas de juego del torneo.

¡Muchos éxitos a toda la delegación en la competencia!
_Comité Organizador · Liga Costa de Oro 2026_`;
  };

  const handleCopySchoolWa = (schoolKey: string) => {
    const text = getSchoolWaMessage(schoolKey);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedWaSchoolId(schoolKey);
      setTimeout(() => setCopiedWaSchoolId(null), 2500);
    }
  };

  const handleSendSchoolWa = (schoolKey: string) => {
    const text = encodeURIComponent(getSchoolWaMessage(schoolKey));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Generador de Ficha Oficial PDF y WhatsApp (Paso 4)
  const selectedPdfSchool = SCHOOLS_MANUAL_DATA[pdfSchoolKey] || SCHOOLS_MANUAL_DATA['cria'];

  const getPdfConfirmationWaText = () => {
    const playersList = selectedPdfSchool.samplePlayers
      .map((p, i) => `${i + 1}. #${p.dorsal} ${p.name} (${p.pos})${p.cap ? ' [CAPITÁN]' : ''}`)
      .join('\n');

    return `🏆 *LIGA COSTA DE ORO 2026 · COMPROBANTE OFICIAL DE NÓMINA*
📋 *Acreditación de Atletas · ${selectedPdfSchool.name}*
🏅 *Deporte:* ${pdfSport}
📍 *Sede:* Campus Brasilito / Tempisque

Estimado/a coordinador/a deportivo:
Le confirmamos que la nómina de atletas de su institución para *${pdfSport}* ha sido registrada y validada exitosamente en el sistema de cómputo del torneo:

*Atletas registrados (${selectedPdfSchool.samplePlayers.length}):*
${playersList}

✅ Los carnés y actas de arbitraje para mesa técnica han sido acreditados.

_Comité Organizador · Don Alejandro Rodríguez_
_Liga Costa de Oro 2026 · Curiol Studio_`;
  };

  const handleCopyPdfWa = () => {
    const text = getPdfConfirmationWaText();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPdfWa(true);
      setTimeout(() => setCopiedPdfWa(false), 2500);
    }
  };

  const handleSendPdfWa = () => {
    const text = encodeURIComponent(getPdfConfirmationWaText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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
              Acceso Administrativo
            </span>
            <h1 className="text-xl font-black text-slate-900">
              Manual de Operaciones
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingrese su contraseña maestra de administración provista por el Comité Organizador para acceder a los protocolos oficiales.
            </p>
          </div>

          <form onSubmit={handleUnlockManual} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••••••"
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
            Uso exclusivo para la Dirección y Coordinación General del Torneo
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
          .print-hidden {
            display: none !important;
          }
          .pdf-preview-card {
            box-shadow: none !important;
            border: 1px solid #94a3b8 !important;
          }
        }
      `}} />

      {/* 🖨️ BARRA SUPERIOR DE ASISTENCIA Y ACCIONES (NO IMPRIMIBLE) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden print-hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
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
              Edición 2026 · Modo Visual
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#28375E] tracking-tight leading-tight">
            Manual de administración: inscripciones y nóminas
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Protocolo oficial de cuatro pasos para despachar las invitaciones a los colegios, supervisar e inscribir visualmente a los atletas y emitir la Ficha Oficial en PDF para la Liga Costa de Oro 2026.
          </p>

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 leading-relaxed">
            <span className="text-base shrink-0">🔒</span>
            <div>
              <strong>INFORMACIÓN CONFIDENCIAL:</strong> Este manual y los enlaces directos de administración son de uso exclusivo para la Dirección del Torneo (Don Alejandro Rodríguez y Alberto Bustos). <strong>No comparta este documento con terceros.</strong> Cada colegio únicamente debe recibir su invitación individual de WhatsApp.
            </div>
          </div>
        </header>

        {/* BANNER DE CREDENCIALES UNIFICADAS (PROTEGIDAS) */}
        <div className="bg-[#28375E] text-white rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Portal de administración</span>
            <span className="text-xs font-mono font-bold text-white break-all">costadeoro.curiol.studio/admin</span>
            <span className="text-[10px] text-slate-400">Mesa central de control</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[#D9C16C] tracking-wider">Clave maestra oficial</span>
            <div className="flex items-center gap-2">
              <strong className="text-base font-mono font-black text-[#D9C16C]">
                {isKeyVisible ? '2026ControlAdmin' : '••••••••••••'}
              </strong>
              <button
                type="button"
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white font-bold transition cursor-pointer"
              >
                {isKeyVisible ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            <span className="text-[10px] text-slate-300">Su contraseña personal de administrador</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">PIN maestro de mesa</span>
            <strong className="text-base font-mono font-black text-emerald-300">9999</strong>
            <span className="text-[10px] text-slate-300">Desbloqueo de emergencia en mesa</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PESTAÑAS DE NAVEGACIÓN POR PASOS (1, 2, 3, 4)
            ═══════════════════════════════════════════════════════════════ */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs print:hidden">
          
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
              activeStep === 1
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeStep === 1 ? 'text-[#D9C16C]' : 'text-[#9A6B38]'}`}>
              1️⃣ Paso 1
            </span>
            <strong className="text-xs sm:text-sm font-extrabold leading-tight">
              Ingreso a Mesa Admin
            </strong>
            <span className={`text-[11px] ${activeStep === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
              Login y Pestaña 6
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
              activeStep === 2
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeStep === 2 ? 'text-[#D9C16C]' : 'text-[#9A6B38]'}`}>
              2️⃣ Paso 2
            </span>
            <strong className="text-xs sm:text-sm font-extrabold leading-tight">
              Despacho por WhatsApp
            </strong>
            <span className={`text-[11px] ${activeStep === 2 ? 'text-slate-300' : 'text-slate-500'}`}>
              Invitaciones a colegios
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
              activeStep === 3
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeStep === 3 ? 'text-[#D9C16C]' : 'text-[#9A6B38]'}`}>
              3️⃣ Paso 3 · Visual
            </span>
            <strong className="text-xs sm:text-sm font-extrabold leading-tight">
              Registro Visual Atletas
            </strong>
            <span className={`text-[11px] ${activeStep === 3 ? 'text-slate-300' : 'text-slate-500'}`}>
              Consola & 2 apellidos
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
              activeStep === 4
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeStep === 4 ? 'text-[#D9C16C]' : 'text-[#9A6B38]'}`}>
              4️⃣ Paso 4
            </span>
            <strong className="text-xs sm:text-sm font-extrabold leading-tight">
              Ficha PDF & WhatsApp
            </strong>
            <span className={`text-[11px] ${activeStep === 4 ? 'text-slate-300' : 'text-slate-500'}`}>
              Acreditación oficial
            </span>
          </button>

        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            PASO 1: INGRESO A LA MESA DE ADMINISTRACIÓN
            ═══════════════════════════════════════════════════════════════ */}
        {activeStep === 1 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#9A6B38] text-white font-black text-xs uppercase tracking-wider">
                Paso 1
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Ingreso a la mesa de administración (Pestaña 6)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Don Alejandro ingresa a la plataforma oficial desde cualquier teléfono o computadora:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-[#28375E] text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-slate-900 font-extrabold block">1. Abrir la dirección web oficial:</strong>
                <p>
                  Ingrese a{' '}
                  <a 
                    href="https://costadeoro.curiol.studio/admin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-[#28375E] underline inline-flex items-center gap-1"
                  >
                    <span>costadeoro.curiol.studio/admin</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>{' '}
                  en Google Chrome, Safari o Microsoft Edge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-[#9A6B38] text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-slate-900 font-extrabold block">2. Desbloquear con su clave de administrador:</strong>
                <p>
                  Escriba su contraseña maestra personal enviada por WhatsApp privado y presione <strong>«Desbloquear Acceso»</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-emerald-600 text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-slate-900 font-extrabold block">3. Ubicar la pestaña 6:</strong>
                <p>
                  En la barra superior de pestañas del panel admin, toque <strong>«6. Nóminas Oficiales e Inscripciones»</strong>. Allí se concentran todas las herramientas de gestión.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28375E] hover:bg-[#1a2540] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Continuar al Paso 2: Despacho por WhatsApp</span>
                <span>➔</span>
              </button>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 2: DESPACHO POR WHATSAPP A COLEGIOS
            ═══════════════════════════════════════════════════════════════ */}
        {activeStep === 2 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#9A6B38] text-white font-black text-xs uppercase tracking-wider">
                Paso 2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Despacho de invitaciones por WhatsApp a los coordinadores
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cada colegio tiene asignado un enlace oficial individual. Con solo pulsar el botón verde <strong>«📲 Enviar WhatsApp»</strong>, el sistema abre WhatsApp con el mensaje estructurado listo para despacho:
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 text-xs text-emerald-950 space-y-1.5 leading-relaxed">
              <strong className="block font-black text-emerald-900">💡 Regla técnica de acceso seguro:</strong>
              <p>
                • <strong>Auto-desbloqueo inmediato:</strong> Cuando el profesor toca el enlace en WhatsApp, <strong>entra directamente al formulario</strong> sin tener que digitar claves.
              </p>
              <p>
                • <strong>PIN de respaldo:</strong> El PIN de 4 dígitos indicado en el mensaje es un respaldo por si abren luego en otra computadora y requieren confirmarlo.
              </p>
            </div>

            {/* LISTA CONSOLIDADA DE COLEGIOS */}
            <div className="space-y-3 pt-2">
              {Object.entries(SCHOOLS_MANUAL_DATA).map(([key, item]) => (
                <div 
                  key={key} 
                  className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#e5dccf] hover:border-[#9A6B38] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                      <SchoolEmblem schoolId={key} size="xs" showBorder={false} />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.location} · {item.contactRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <div className="text-center px-3 py-1 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">PIN Respaldo</span>
                      <span className="font-mono font-black text-emerald-700 text-sm">{item.pin}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendSchoolWa(key)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>📲 Enviar WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySchoolWa(key)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {copiedWaSchoolId === key ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-black">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#9A6B38]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Ver formulario</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                ← Volver al Paso 1
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28375E] hover:bg-[#1a2540] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Continuar al Paso 3: Registro Visual</span>
                <span>➔</span>
              </button>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 3: REGISTRO VISUAL DE ATLETAS (UI MOCKUP ILUSTRADO)
            ═══════════════════════════════════════════════════════════════ */}
        {activeStep === 3 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#28375E] text-white font-black text-xs uppercase tracking-wider">
                Paso 3 · Módulo Visual
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                ¿Cómo registrar y revisar a los atletas? (Paso a paso visual)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Esta sección ilustra de forma gráfica cómo se ve la consola interactiva de nóminas cuando Don Alejandro inscribe a los estudiantes en la mesa o cuando supervisa las listas recibidas:
            </p>

            {/* MOCKUP VISUAL DE LA CONSOLA DE REGISTRO */}
            <div className="bg-[#F8FAFC] border-2 border-slate-300 rounded-2xl p-5 sm:p-6 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <strong className="text-xs font-black text-[#28375E]">
                    📋 Pantalla de Inscripción y Nómina Oficial · Vista en Vivo
                  </strong>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200">
                  ● Conectado a Firestore
                </span>
              </div>

              {/* 1. SELECTORES */}
              <div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                  1️⃣ Selección de Equipo a Gestionar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 rounded-xl p-3.5 relative">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">Institución Educativa:</span>
                    <div className="px-3 py-2 bg-[#FAF6F0] rounded-lg border border-slate-200 text-xs font-bold text-[#28375E] flex justify-between items-center">
                      <span>🦅 CRIA</span>
                      <span className="text-slate-400">▼</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">Disciplina Deportiva:</span>
                    <div className="px-3 py-2 bg-[#FAF6F0] rounded-lg border border-slate-200 text-xs font-bold text-[#28375E] flex justify-between items-center">
                      <span>⚽ Fútbol</span>
                      <span className="text-slate-400">▼</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">Categoría:</span>
                    <div className="px-3 py-2 bg-[#FAF6F0] rounded-lg border border-slate-200 text-xs font-bold text-[#28375E] flex justify-between items-center">
                      <span>Cat C Masculino</span>
                      <span className="text-slate-400">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FORMULARIO ILUSTRADO */}
              <div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                  2️⃣ Captura Individual de Jugadores:
                </span>
                <div className="bg-white border-2 border-dashed border-slate-400 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-[#28375E]">👤 Nombre y dos apellidos completos</label>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                          ✓ REGLA MEP OBLIGATORIA
                        </span>
                      </div>
                      <div className="px-3.5 py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Alexander David Smith Mora</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-emerald-800 font-bold">
                        Se deben incluir siempre ambos apellidos para prevenir descalificación de actas arbitrales.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#28375E]">👕 Dorsal / Camiseta</label>
                      <div className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                        <span className="w-7 h-7 rounded bg-[#28375E] text-white font-mono font-black text-xs flex items-center justify-center">
                          # 1
                        </span>
                        <span className="text-xs text-slate-500 font-bold">Portero</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Número único por equipo</p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700">Año de Nacimiento:</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800">
                        2011 (Categoría C)
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700">Condición de Capitán:</label>
                      <div className="px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-900 flex justify-between items-center">
                        <span>¿Es el capitán de cancha?</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-black">SÍ (C)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#28375E] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>➕ Agregar Jugador a la Nómina Oficial</span>
                  </button>
                </div>
              </div>

              {/* 3. ZONA EXCEL */}
              <div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Opción B: Carga Masiva desde Hoja de Excel (.xls):
                </span>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-emerald-300 text-2xl flex items-center justify-center shrink-0">
                      📊
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-extrabold text-emerald-950 block">
                        ¿El colegio le envió una lista de muchos alumnos?
                      </strong>
                      <span className="text-[11px] text-emerald-800 block">
                        Descargue la plantilla, pegue los nombres y cárguela con un solo clic.
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-extrabold cursor-pointer">
                      📥 Plantilla
                    </button>
                    <button type="button" className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-extrabold cursor-pointer shadow-xs">
                      📤 Subir Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. TABLA DE NÓMINA ACTIVA */}
              <div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                  3️⃣ Jugadores Inscritos en este Equipo (5 Atletas Registrados):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                        <th className="py-2.5 px-3 text-center w-12">N.°</th>
                        <th className="py-2.5 px-3 text-center w-16">Dorsal</th>
                        <th className="py-2.5 px-3">Nombre Completo del Atleta</th>
                        <th className="py-2.5 px-3 text-center w-20">Año</th>
                        <th className="py-2.5 px-3">Posición Táctica</th>
                        <th className="py-2.5 px-3 text-center w-24">Condición</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">1</td>
                        <td className="py-2.5 px-3 text-center"><span className="w-6 h-6 rounded bg-[#28375E] text-white font-mono font-black text-xs inline-flex items-center justify-center"># 1</span></td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Alexander David Smith Mora</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">2011</td>
                        <td className="py-2.5 px-3 text-slate-600">Portero Titular</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">2</td>
                        <td className="py-2.5 px-3 text-center"><span className="w-6 h-6 rounded bg-[#28375E] text-white font-mono font-black text-xs inline-flex items-center justify-center"># 4</span></td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Santiago Miller Gutiérrez</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">2011</td>
                        <td className="py-2.5 px-3 text-slate-600">Defensa Central</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">3</td>
                        <td className="py-2.5 px-3 text-center"><span className="w-6 h-6 rounded bg-[#28375E] text-white font-mono font-black text-xs inline-flex items-center justify-center"># 8</span></td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Lucas Taylor Céspedes</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">2012</td>
                        <td className="py-2.5 px-3 text-slate-600">Volante Mixto</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">4</td>
                        <td className="py-2.5 px-3 text-center"><span className="w-6 h-6 rounded bg-[#28375E] text-white font-mono font-black text-xs inline-flex items-center justify-center"># 9</span></td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Mateo Johnson Cordero</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">2011</td>
                        <td className="py-2.5 px-3 text-slate-600">Delantero Centro</td>
                        <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">👑 Capitán</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">5</td>
                        <td className="py-2.5 px-3 text-center"><span className="w-6 h-6 rounded bg-[#28375E] text-white font-mono font-black text-xs inline-flex items-center justify-center"># 11</span></td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Oliver Wilson Carvajal</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">2011</td>
                        <td className="py-2.5 px-3 text-slate-600">Extremo Izquierdo</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. GUARDADO EN NUBE */}
              <div className="p-4 rounded-xl bg-white border-2 border-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="text-xs sm:text-sm font-extrabold text-emerald-950 block">
                    ¡Paso final indispensable!
                  </strong>
                  <span className="text-[11px] text-emerald-800 block">
                    Al terminar de agregar atletas, pulse el botón verde para guardar en la base de datos de la nube.
                  </span>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>💾 Guardar Nómina Oficial</span>
                </button>
              </div>

            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                ← Volver al Paso 2
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28375E] hover:bg-[#1a2540] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Continuar al Paso 4: Ficha PDF & Comprobante</span>
                <span>➔</span>
              </button>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 4: FICHA OFICIAL EN PDF Y COMPROBANTE WHATSAPP
            ═══════════════════════════════════════════════════════════════ */}
        {activeStep === 4 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-black text-xs uppercase tracking-wider">
                Paso 4
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Generar Ficha Oficial en PDF y enviar comprobante por WhatsApp
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Emita la acreditación oficial de cualquier colegio en formato imprimible de una página para la mesa técnica de arbitraje y envíe el comprobante de confirmación al coordinador:
            </p>

            {/* SELECTOR DE COLEGIO Y DEPORTE */}
            <div className="flex flex-wrap items-end gap-3 p-4 bg-[#FCFBF9] rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#28375E]">Colegio a exportar:</label>
                <select
                  value={pdfSchoolKey}
                  onChange={(e) => setPdfSchoolKey(e.target.value)}
                  className="block text-xs font-bold py-2 px-3 rounded-xl bg-white border border-slate-300 text-slate-900 cursor-pointer"
                >
                  {Object.entries(SCHOOLS_MANUAL_DATA).map(([k, s]) => (
                    <option key={k} value={k}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#28375E]">Deporte y Categoría:</label>
                <select
                  value={pdfSport}
                  onChange={(e) => setPdfSport(e.target.value)}
                  className="block text-xs font-bold py-2 px-3 rounded-xl bg-white border border-slate-300 text-slate-900 cursor-pointer"
                >
                  <option value="Fútbol · Categoría C Masculino">Fútbol · Categoría C Masculino</option>
                  <option value="Fútbol · Categoría Femenina">Fútbol · Categoría Femenina</option>
                  <option value="Voleibol · Categoría C">Voleibol · Categoría C</option>
                  <option value="Baloncesto · Categoría C">Baloncesto · Categoría C</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#28375E] hover:bg-[#1f2b4a] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir o guardar Ficha en PDF</span>
              </button>
            </div>

            {/* VISTA PREVIA DE LA FICHA OFICIAL IMPRIMIBLE */}
            <div className="pdf-preview-card bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-200 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#9A6B38]">
                    Comité Organizador · Liga Costa de Oro 2026
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedPdfSchool.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-600">
                    Nómina Oficial · {pdfSport}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                    ✓ Acreditación Oficial
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">Edición 2026 · Guanacaste</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div><strong>Cuerpo Técnico:</strong> Entrenador Principal: <em>Registrado en Mesa</em></div>
                <div><strong>Sedes Oficiales:</strong> Campus Brasilito / Campus Tempisque</div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                      <th className="py-2 px-3 text-center w-12">N.°</th>
                      <th className="py-2 px-3 text-center w-16">Dorsal</th>
                      <th className="py-2 px-3">Nombre Completo del Atleta (Dos Apellidos)</th>
                      <th className="py-2 px-3 text-center w-20">Año Nac.</th>
                      <th className="py-2 px-3">Posición Táctica</th>
                      <th className="py-2 px-3 text-center w-20">Capitán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPdfSchool.samplePlayers.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-[#28375E]">{p.dorsal}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">{p.year}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.pos}</td>
                        <td className="py-2.5 px-3 text-center">
                          {p.cap ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                              Sí (C)
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center">
                <div className="pt-8 border-t border-slate-400 text-xs text-slate-600">
                  <strong>Firma Coordinador Deportivo</strong><br />
                  Institución Educativa Participante
                </div>
                <div className="pt-8 border-t border-slate-400 text-xs text-slate-600">
                  <strong>Firma Mesa Técnica / Don Alejandro</strong><br />
                  Comité Organizador Liga Costa de Oro 2026
                </div>
              </div>

            </div>

            {/* COMPROBANTE WHATSAPP */}
            <div className="p-5 rounded-2xl bg-[#F0F4FA] border border-blue-200 space-y-3">
              <strong className="text-xs font-black text-[#28375E] uppercase block">
                📲 Mensaje para confirmar la nómina al profesor por WhatsApp:
              </strong>
              
              <div className="p-4 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {getPdfConfirmationWaText()}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyPdfWa}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A6B38] hover:bg-[#83582A] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {copiedPdfWa ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPdfWa ? '¡Texto copiado!' : 'Copiar texto para WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendPdfWa}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Abrir WhatsApp con esta confirmación</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                ← Volver al Paso 3: Registro Visual
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Reiniciar al Paso 1 ↺
              </button>
            </div>
          </section>
        )}

        {/* PREGUNTAS FRECUENTES Y CONTINGENCIAS EN MESA */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#9A6B38]">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs uppercase font-black tracking-wider">Respuestas rápidas para emergencias en mesa</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Resolución inmediata de contingencias
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900">¿Qué pasa si un profesor no tiene internet?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Don Alejandro puede inscribir a los jugadores directamente desde la pestaña 6 del panel admin, o abrir el formulario del colegio con el <strong>PIN Maestro 9999</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900">¿Un colegio puede cambiar un jugador lesionado?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sí. El coordinador vuelve a tocar su mismo enlace de WhatsApp en cualquier momento, cambia el nombre del alumno y guarda. Se actualiza de inmediato.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900">¿Los padres de familia ven estas contraseñas?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Esta información está totalmente protegida por la clave maestra privada. El público general solo ve partidos, marcadores y galerías.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* PIE INSTITUCIONAL CURIOL STUDIO */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 text-center text-xs text-slate-500 space-y-1">
        <p><strong>Festival Deportivo Liga Costa de Oro 2026</strong> · Plataforma Oficial desarrollada por <strong>Curiol Studio</strong></p>
        <p>Guanacaste, Costa Rica · Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}