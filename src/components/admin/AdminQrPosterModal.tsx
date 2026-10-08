'use client';

import React, { useState } from 'react';
import { School } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  X, 
  Printer, 
  QrCode, 
  Heart, 
  Sparkles, 
  Trophy, 
  Download, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  Share2, 
  Smartphone 
} from 'lucide-react';

interface AdminQrPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
}

export function AdminQrPosterModal({ isOpen, onClose, schools }: AdminQrPosterModalProps) {
  const [activeTab, setActiveTab] = useState<'poster' | 'whatsapp'>('poster');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const muralUrl = typeof window !== 'undefined' ? `${window.location.origin}/mural` : 'https://costadeoro.curiol.studio/mural';
  
  // Generador de QR SVG de alto contraste y resolución
  const qrCodeSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(muralUrl)}&format=svg&margin=12`;
  const qrCodePngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(muralUrl)}&format=png&margin=20`;

  // Plantilla oficial de bienvenida del comité organizador para difusión en WhatsApp
  const whatsAppTemplate = `🏆 *LIGA DE LA COSTA DE ORO 2026 · FESTIVAL DEPORTIVO*
¡El comité organizador les da la más cordial bienvenida! 🌟⚽🏐

Estimadas familias, estudiantes, delegaciones y cuerpo técnico:

A nombre del Comité Organizador, les damos una calurosa bienvenida a esta gran fiesta deportiva intercolegial. Queremos que cada momento en cancha y gradería se viva con alegría, respeto mutuo y compañerismo.

Les invitamos a ingresar al *Muro de la comunidad*, un espacio interactivo y abierto donde pueden:
💬 *Enviar sus mensajes de bienvenida y palabras de aliento* a los estudiantes.
📸 *Publicar fotografías* de las mejores jugadas, celebraciones y momentos de equipo.
🎥 *Subir videos cortos (10 a 30 segundos)* con la emoción y el ambiente de las barras familiares.

🌐 *Ingreso directo al mural oficial (sin descargas ni contraseñas):*
👉 ${muralUrl}

✨ *¿Cómo participar en 3 pasos sencillos?*
1️⃣ Entra al enlace desde tu celular.
2️⃣ Elige tu colegio o delegación deportiva.
3️⃣ Escribe tu mensaje de apoyo y adjunta tus fotos o videos cortos.

_¡Que gane el juego limpio, el compañerismo y la unión de nuestras instituciones!_ 💙🏆✨
*Comité Organizador · Liga de la Costa de Oro 2026*`;

  const handleCopyText = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(whatsAppTemplate);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadQrPng = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodePngUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'QR_Muro_Comunidad_Costa_De_Oro_2026.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(qrCodePngUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppTemplate)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:m-0">
        
        {/* Acciones de la Ventana (Ocultas en Impresión) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
              <QrCode className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Difusión QR y muro de la comunidad
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Cartel para canchas y plantilla de WhatsApp para Don Alejandro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Selector de Pestañas */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('poster')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'poster' 
                    ? 'bg-white text-slate-950 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Cartel para canchas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeTab === 'whatsapp' 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>2. Kit de WhatsApp</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------- PESTAÑA 1: CARTEL IMPRIMIBLE PARA CANCHAS ---------------- */}
        {activeTab === 'poster' && (
          <div className="space-y-4">
            {/* Barra de Acciones del Cartel */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 print:hidden">
              <span className="text-xs text-slate-600 font-medium">
                Imprime este afiche para colocar en mesas técnicas y graderías:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  disabled={isDownloading}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition active:scale-95"
                  title="Descargar imagen PNG en alta resolución"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isDownloading ? 'Descargando...' : 'Descargar QR (PNG)'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir cartel</span>
                </button>
              </div>
            </div>

            {/* 🖨️ LIENZO IMPRIMIBLE DE ALTO IMPACTO VISUAL */}
            <div id="printable-poster" className="p-6 sm:p-8 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 text-center space-y-5 print:border-4 print:border-black print:rounded-none print:p-6">
              
              {/* Logo y Encabezado */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-amber-300 text-xs font-black tracking-widest uppercase shadow-xs">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Liga Costa de Oro 2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  ¡Muro de saludos, fotos y videos cortos!
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-md mx-auto">
                  Festival Deportivo Intercolegial de Guanacaste · Cabo Velas & Tempisque
                </p>
              </div>

              {/* Código QR Central de Alta Definición */}
              <div className="p-4 bg-white rounded-3xl border-2 border-slate-950 inline-block shadow-lg mx-auto print:shadow-none">
                <img
                  src={qrCodeSvgUrl}
                  alt="Código QR del Muro Oficial"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                />
                <span className="text-[11px] font-mono font-bold text-slate-600 block mt-2">
                  costadeoro.curiol.studio/mural
                </span>
              </div>

              {/* 3 Pasos Rápidos para las Familias */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-left max-w-lg mx-auto pt-1">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 text-xs font-black flex items-center justify-center mb-1.5">
                    1
                  </span>
                  <h5 className="font-extrabold text-[11px] text-slate-900 leading-tight">
                    Escanea el QR
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Con la cámara de tu celular, sin descargas.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 text-xs font-black flex items-center justify-center mb-1.5">
                    2
                  </span>
                  <h5 className="font-extrabold text-[11px] text-slate-900 leading-tight">
                    Elige tu colegio
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Selecciona la delegación de tu hijo/a.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-300 text-xs font-black flex items-center justify-center mb-1.5">
                    3
                  </span>
                  <h5 className="font-extrabold text-[11px] text-slate-900 leading-tight">
                    Publica fotos o videos
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Sube tu saludo, fotos o clips sin contraseñas.
                  </p>
                </div>
              </div>

              {/* Escudos de las 6 Instituciones Participantes */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[10.5px] font-black text-slate-500 tracking-wider uppercase block">
                  Instituciones participantes:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {schools.map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                      <SchoolEmblem schoolId={s.id} size="xs" />
                      <span className="text-[10.5px] font-bold text-slate-800">{s.shortName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie del Cartel */}
              <div className="pt-1 text-[10px] text-slate-400 font-semibold italic">
                Espacio formativo y familiar oficial · Convivencia, respeto y juego limpio.
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PESTAÑA 2: KIT WHATSAPP PARA DON ALEJANDRO ---------------- */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 animate-fade-in">
            {/* Banner Informativo */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-black text-emerald-900 block">
                  Plantilla oficial para grupos de WhatsApp (Don Alejandro)
                </span>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Copia este mensaje listo con formato y enlaces, o descárgalo para enviarlo a los grupos de padres, profesores y entrenadores.
                </p>
              </div>
            </div>

            {/* Vista Previa del Mensaje Estilo WhatsApp */}
            <div className="p-4 bg-[#EFEAE2] rounded-2xl border border-slate-300 shadow-inner space-y-3 font-sans">
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-800 space-y-2 border border-slate-200/60 max-w-lg">
                <p className="font-bold text-slate-900">
                  🏆 <span className="underline">LIGA DE LA COSTA DE ORO 2026 · FESTIVAL DEPORTIVO</span><br />
                  ¡El comité organizador les da la más cordial bienvenida! 🌟⚽🏐
                </p>
                <p className="text-slate-700 leading-relaxed text-[11.5px]">
                  Estimadas familias, estudiantes, delegaciones y cuerpo técnico:<br /><br />
                  A nombre del Comité Organizador, les damos una calurosa bienvenida a esta gran fiesta deportiva intercolegial. Queremos que cada momento en cancha y gradería se viva con alegría, respeto mutuo y compañerismo.<br /><br />
                  Les invitamos a ingresar al <strong>Muro de la comunidad</strong>, un espacio interactivo y abierto donde pueden:
                </p>
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] space-y-1 text-slate-800">
                  <p>💬 <strong>Enviar palabras de aliento</strong> y mensajes de apoyo a los estudiantes.</p>
                  <p>📸 <strong>Publicar fotografías</strong> de las mejores jugadas y momentos de equipo.</p>
                  <p>🎥 <strong>Subir videos cortos (10–30 s)</strong> con la emoción y el ambiente de las barras.</p>
                </div>
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[11px]">
                  <span className="font-bold text-emerald-950 block mb-0.5">🌐 Ingreso directo al mural oficial (sin contraseñas):</span>
                  <a 
                    href={muralUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-700 font-bold underline break-all"
                  >
                    👉 {muralUrl}
                  </a>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <span className="font-bold text-slate-900 block">✨ ¿Cómo participar en 3 pasos sencillos?</span>
                  <p>1️⃣ Entra al enlace desde tu celular.</p>
                  <p>2️⃣ Elige tu colegio o delegación deportiva.</p>
                  <p>3️⃣ Escribe tu mensaje de apoyo y adjunta tus fotos o videos cortos.</p>
                </div>
                <p className="text-[10.5px] text-slate-500 italic pt-1 border-t border-slate-100">
                  ¡Que gane el juego limpio, el compañerismo y la unión de nuestras instituciones! 💙🏆✨<br />
                  <strong>Comité Organizador · Liga de la Costa de Oro 2026</strong>
                </p>
              </div>
            </div>

            {/* Botones de Acción Rápida para WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyText}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95 ${
                  copied 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-slate-950 hover:bg-slate-800 text-amber-300'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Mensaje copiado!' : 'Copiar mensaje'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQrPng}
                disabled={isDownloading}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                title="Descargar imagen QR para adjuntar en WhatsApp"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>{isDownloading ? 'Descargando...' : 'Descargar QR'}</span>
              </button>

              <a
                href="/infografia_mural_espanol.jpg"
                download="infografia_publicar_muro_costadeoro2026.jpg"
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                title="Descargar infografía ilustrada en español (3 pasos)"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Infografía (.jpg)</span>
              </a>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                title="Abrir WhatsApp con el mensaje cargado"
              >
                <Send className="w-4 h-4" />
                <span>Abrir en WhatsApp</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

