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
  AlertCircle
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
  
  // Pestañas principales
  const [activeTab, setActiveTab] = useState<'despacho' | 'registro_mesa'>('despacho');
  
  // Selector de Ficha PDF
  const [pdfSchoolKey, setPdfSchoolKey] = useState<string>('cria');
  const [pdfSport, setPdfSport] = useState<string>('Fútbol · Categoría C Masculino');
  
  // Estados de copiado
  const [copiedWaSchoolId, setCopiedWaSchoolId] = useState<string | null>(null);
  const [copiedPdfWa, setCopiedPdfWa] = useState<boolean>(false);

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

  // Generador de mensaje de WhatsApp para colegios (Pestaña 1)
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
2️⃣ Inscriba a sus atletas en línea por disciplina (fútbol, voleibol y baloncesto) con nombre y dos apellidos obligatorios, o descargue la *Plantilla oficial de Excel (.xls)*, llénela y cárguela en el mismo portal.
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

  // Generador de Ficha Oficial PDF y WhatsApp (Pestaña 2)
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
              Versión 2.0 · 2 Pestañas
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#28375E] tracking-tight leading-tight">
            Manual de administración: inscripciones y nóminas
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Protocolo oficial para despachar los accesos a los colegios participantes y gestionar el registro de atletas en la mesa técnica de la Liga Costa de Oro 2026.
          </p>

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 leading-relaxed">
            <span className="text-base shrink-0">🔒</span>
            <div>
              <strong>CONFIDENCIALIDAD ESTRICTA:</strong> Este manual, las claves de acceso y los enlaces con PIN son para uso exclusivo de Don Alejandro Rodríguez y Alberto Bustos. <strong>Queda terminantemente prohibido compartir este enlace o las credenciales con terceras personas.</strong> Cada colegio únicamente recibe su mensaje específico de WhatsApp.
            </div>
          </div>
        </header>

        {/* BANNER DE CREDENCIALES UNIFICADAS */}
        <div className="bg-[#28375E] text-white rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Portal de administración</span>
            <span className="text-xs font-mono font-bold text-white break-all">costadeoro.curiol.studio/admin</span>
            <span className="text-[10px] text-slate-400">Mesa central de control</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[#D9C16C] tracking-wider">Clave maestra oficial</span>
            <strong className="text-base font-mono font-black text-[#D9C16C]">2026ControlAdmin</strong>
            <span className="text-[10px] text-slate-300">Clave corta rápida: <strong>8421</strong></span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Clave este manual</span>
            <strong className="text-base font-mono font-black text-blue-200">2026ControlAdmin</strong>
            <span className="text-[10px] text-slate-300">Misma clave del panel admin</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">PIN maestro de mesa</span>
            <strong className="text-base font-mono font-black text-emerald-300">9999</strong>
            <span className="text-[10px] text-slate-300">Desbloqueo de emergencia</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PESTAÑAS PRINCIPALES DEL MANUAL (2 PESTAÑAS CLARAS)
            ═══════════════════════════════════════════════════════════════ */}
        <nav className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('despacho')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'despacho'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>📨 1. Despacho por WhatsApp a Colegios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registro_mesa')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'registro_mesa'
                ? 'bg-[#28375E] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>👥 2. Registro de Atletas en Mesa & PDF Oficial (Don Alejandro)</span>
          </button>
        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            PESTAÑA 1: DESPACHO POR WHATSAPP A COLEGIOS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'despacho' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* PASO 1: ACCESO AL PANEL */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#9A6B38] text-white font-black text-xs uppercase tracking-wider">
                  Paso 1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Ingresar a la mesa de administración
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Don Alejandro ingresa a{' '}
                <a 
                  href="https://costadeoro.curiol.studio/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-[#28375E] underline inline-flex items-center gap-1"
                >
                  <span>costadeoro.curiol.studio/admin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>{' '}
                desde su teléfono o computadora.
              </p>

              {/* TARJETA DESTACADA CLAVE MAESTRA */}
              <div className="bg-[#FAF6F0] border-2 border-[#D9C16C] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#9A6B38] block">
                    Clave Oficial Maestra de Administración
                  </span>
                  <strong className="text-xl font-mono text-[#28375E] tracking-wider block">
                    2026ControlAdmin
                  </strong>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Use esta contraseña en la pantalla de bienvenida (o la alternativa corta: <strong>8421</strong>).
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A6B38] hover:bg-[#83582A] text-white font-extrabold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar clave</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0F4FA] border-l-4 border-[#28375E] text-xs text-slate-700 leading-relaxed">
                📍 <strong>Ubicación de las inscripciones:</strong> En la barra superior del panel administrativo, hacer clic en la pestaña <strong>«6. Nóminas Oficiales e Inscripciones»</strong> para abrir la consola.
              </div>
            </section>

            {/* PASO 2: DESPACHO POR WHATSAPP */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#9A6B38] text-white font-black text-xs uppercase tracking-wider">
                  Paso 2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Despachar la invitación por WhatsApp a cada coordinador
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                En la lista de abajo, Don Alejandro solo debe pulsar el botón verde <strong>«📲 Enviar WhatsApp»</strong> del colegio correspondiente para abrir WhatsApp con el mensaje y enlace listos.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 text-xs text-emerald-950 space-y-1.5 leading-relaxed">
                <strong className="block font-black text-emerald-900">💡 Regla técnica importante:</strong>
                <p>
                  1. <strong>Entrada directa y automática:</strong> El profesor toca el enlace en WhatsApp y <strong>entra directamente al formulario</strong> sin digitar ningún código.
                </p>
                <p>
                  2. <strong>El PIN del mensaje es solo de respaldo:</strong> Sirve únicamente por si abren luego en otra computadora y requieren confirmarlo.
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
            </section>

            {/* PASO 3: SUPERVISIÓN EN LA MESA */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#9A6B38] text-white font-black text-xs uppercase tracking-wider">
                  Paso 3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  El colegio inscribe y Don Alejandro supervisa en la mesa
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Una vez enviado el enlace, el colegio completa la nómina y los datos se actualizan en vivo en la pantalla de Don Alejandro:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-slate-200 space-y-2">
                  <h3 className="font-extrabold text-sm text-[#28375E]">
                    A. Lo que hace el profesor del colegio:
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>Abre el enlace en su celular o PC (entra de una vez sin clave).</li>
                    <li>Agrega a sus atletas escribiendo su <strong>nombre con dos apellidos</strong>, dorsal, año y posición.</li>
                    <li>Si tiene muchos alumnos, puede subir la plantilla de Excel (.xls) con un clic.</li>
                    <li>Presiona <strong>«Guardar Nómina Oficial»</strong>.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0F4FA] border border-blue-200 space-y-2">
                  <h3 className="font-extrabold text-sm text-emerald-800">
                    B. Lo que ve Don Alejandro en la Mesa:
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>En la pestaña 6 del panel admin, ve reflejados los atletas en tiempo real.</li>
                    <li>Puede revisar capitanes, edades y corregir detalles si el profesor lo solicita.</li>
                    <li>Presiona <strong>«Exportar Todo en Excel (.xls)»</strong> para entregar las actas a los árbitros.</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PESTAÑA 2: REGISTRO DE ATLETAS EN MESA & GENERADOR DE PDF
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'registro_mesa' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* GUÍA PRÁCTICA PARA DON ALEJANDRO */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#28375E] text-white font-black text-xs uppercase tracking-wider">
                  Mesa Central
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  ¿Cómo inscribe Don Alejandro a los estudiantes directamente?
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Si un profesor le envía los atletas por WhatsApp, por correo o le dicta la lista en persona, Don Alejandro puede ingresarlos directamente en el sistema siguiendo estos pasos:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-[#9A6B38] space-y-1">
                  <strong className="text-sm font-extrabold text-slate-900 block">
                    1. En el panel admin (`/admin`), ir a la pestaña 6 y elegir el equipo:
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En los selectores superiores de la pestaña 6, seleccione la <strong>Institución</strong> (ej. <em>CRIA</em>), el <strong>Deporte</strong> (ej. <em>Fútbol</em>) y la <strong>Categoría</strong> (ej. <em>Cat C Masculino</em>). El sistema mostrará la nómina de ese equipo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-[#9A6B38] space-y-1">
                  <strong className="text-sm font-extrabold text-slate-900 block">
                    2. Completar los campos obligatorios del estudiante:
                  </strong>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    <li><strong>Nombre y dos apellidos obligatorios:</strong> Ej: <em>Mateo Johnson Cordero</em>. (El sistema exige los dos apellidos para cumplir con la normativa de arbitraje MEP).</li>
                    <li><strong>Número de camiseta / dorsal:</strong> Número único para el jugador en ese equipo.</li>
                    <li><strong>Año de nacimiento:</strong> Ej: <em>2011</em> o <em>2012</em> para Categoría C.</li>
                    <li><strong>Posición:</strong> Portero/a, Defensa, Mediocampo, Delantero/a, etc.</li>
                    <li><strong>Capitán:</strong> Marque la casilla si es el capitán de cancha.</li>
                    <li>Presione el botón <strong>«+ Agregar Jugador»</strong>.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6F0] border-l-4 border-[#9A6B38] space-y-1">
                  <strong className="text-sm font-extrabold text-slate-900 block">
                    3. Guardar la nómina en la base de datos:
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al terminar de ingresar a los atletas (o de subir el archivo Excel si se lo pasaron en digital), pulse el botón verde <strong>«💾 Guardar Nómina Oficial»</strong>. Los datos quedan persistidos al instante en la nube.
                  </p>
                </div>
              </div>
            </section>

            {/* GENERADOR DE FICHA OFICIAL EN PDF Y MENSAJE DE CONFIRMACIÓN */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-black text-xs uppercase tracking-wider">
                  Exportar PDF
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Generar Ficha Oficial en PDF y enviar por WhatsApp
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Utilice esta herramienta para generar la <strong>Ficha Oficial Imprimible de Nómina en PDF</strong> de cualquier colegio para enviársela como comprobante al coordinador por WhatsApp o tenerla en la mesa técnica:
              </p>

              {/* SELECTOR DE COLEGIO Y DEPORTE */}
              <div className="flex flex-wrap items-end gap-3 p-4 bg-[#FCFBF9] rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#28375E]">Colegio:</label>
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
                  <label className="text-xs font-bold text-[#28375E]">Deporte / Categoría:</label>
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
                
                {/* Membrete Oficial */}
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

                {/* Datos de sede y cuerpo técnico */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div><strong>Cuerpo Técnico:</strong> Entrenador Principal: <em>Registrado en Mesa</em></div>
                  <div><strong>Sede Oficial:</strong> Campus Brasilito / Tempisque</div>
                </div>

                {/* Tabla de Jugadores */}
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

                {/* Espacio para Firmas Oficiales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center">
                  <div className="pt-8 border-t border-slate-400 text-xs text-slate-600">
                    <strong>Firma Coordinador Deportivo</strong><br />
                    Institución Educativa
                  </div>
                  <div className="pt-8 border-t border-slate-400 text-xs text-slate-600">
                    <strong>Firma Mesa Técnica / Don Alejandro</strong><br />
                    Comité Organizador Costa de Oro 2026
                  </div>
                </div>

              </div>

              {/* GENERADOR DE MENSAJE DE CONFIRMACIÓN POR WHATSAPP */}
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

            </section>

          </div>
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
                No. Esta información está totalmente protegida por la clave <strong>2026ControlAdmin</strong>. El público general solo ve partidos y marcadores.
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