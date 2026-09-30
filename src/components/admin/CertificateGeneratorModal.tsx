'use client';

import React, { useState, useRef } from 'react';
import { School } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Award, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Shield, 
  Trophy,
  User,
  Share2
} from 'lucide-react';

interface CertificateGeneratorModalProps {
  schools: School[];
  onClose: () => void;
}

export type CertificateType = 'participacion' | 'fair_play' | 'mvp' | 'institucional';

export function CertificateGeneratorModal({ schools, onClose }: CertificateGeneratorModalProps) {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'la-paz-cabo-velas');
  const [recipientName, setRecipientName] = useState<string>('Mateo Hernández Brenes');
  const [sport, setSport] = useState<string>('Fútbol Categoría C');
  const [certificateType, setCertificateType] = useState<CertificateType>('participacion');
  const [customNotes, setCustomNotes] = useState<string>('Por su ejemplar entrega, disciplina y respeto deportivo.');

  const certRef = useRef<HTMLDivElement>(null);
  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const certTitles: Record<CertificateType, { title: string; subtitle: string; badge: string; border: string }> = {
    participacion: {
      title: 'DIPLOMA DE PARTICIPACIÓN OFICIAL',
      subtitle: 'Por haber formado parte activa de la fiesta deportiva intercolegial de Guanacaste',
      badge: 'Atleta Participante',
      border: 'border-amber-400',
    },
    fair_play: {
      title: 'RECONOCIMIENTO AL JUEGO LIMPIO',
      subtitle: 'Por demostrar los más altos valores de respeto arbitral, sana convivencia y deportividad',
      badge: 'Distinción Fair Play',
      border: 'border-emerald-500',
    },
    mvp: {
      title: 'DISTINCIÓN AL JUGADOR MÁS VALIOSO (MVP)',
      subtitle: 'Por su liderazgo, superación y destacado rendimiento en cancha',
      badge: 'Jugador Más Valioso',
      border: 'border-amber-500',
    },
    institucional: {
      title: 'RECONOCIMIENTO INSTITUCIONAL DE HONOR',
      subtitle: 'Por su invaluable compromiso con el deporte formativo y la hermandad escolar',
      badge: 'Institución de Honor',
      border: 'border-blue-500',
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const verificationCode = `CDO-2026-${selectedSchool.acronym}-${Math.abs(
    (recipientName.length * 7919) ^ (sport.length * 31)
  )
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static print:inset-auto">
      <div 
        className="relative bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between border-b border-amber-500/40 rounded-t-3xl gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-extrabold text-sm tracking-wide block leading-tight">
                Generador de Certificados y Diplomas Oficiales
              </span>
              <span className="text-[11px] text-slate-400">
                Liga Costa de Oro 2026 · Formato de Alta Resolución
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Panel (Hidden in print) */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-4 print:hidden">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Personalización del Diploma</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Colegio */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Institución Educativa:
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.shortName})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Diploma */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tipo de Reconocimiento:
              </label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value as CertificateType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="participacion">Participación Oficial</option>
                <option value="fair_play">Juego Limpio (Fair Play)</option>
                <option value="mvp">Jugador Más Valioso (MVP)</option>
                <option value="institucional">Institucional de Honor</option>
              </select>
            </div>

            {/* Nombre del Atleta / Estudiante */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nombre del Homenajeado:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Deporte / Modalidad */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Deporte o Disciplina:
              </label>
              <input
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="Ej: Fútbol Categoría C"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Printable Official Certificate Canvas */}
        <div className="p-4 sm:p-8 flex justify-center bg-slate-200/50 print:p-0 print:bg-white">
          <div
            ref={certRef}
            className="w-full max-w-3xl bg-white rounded-2xl border-8 border-double border-amber-500 p-6 sm:p-10 text-center space-y-6 shadow-xl relative overflow-hidden print:border-8 print:shadow-none print:max-w-none print:w-full"
            style={{ minHeight: '520px' }}
          >
            {/* Watermark Crest Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img
                src="/logos/liga_costa_de_oro_gold_black.jpg"
                alt="Watermark"
                className="w-96 h-96 object-contain"
              />
            </div>

            {/* Certificate Header */}
            <div className="flex items-center justify-between gap-4 border-b-2 border-amber-400/80 pb-4 relative z-10">
              {/* Logo Costa de Oro */}
              <div className="h-16 w-14 rounded-xl overflow-hidden bg-black border border-amber-500 p-0.5 shrink-0 shadow-sm flex items-center justify-center">
                <img
                  src="/logos/liga_costa_de_oro_gold_black.jpg"
                  alt="Liga Costa de Oro"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                  Festival Formativo Intercolegial · Guanacaste
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Liga Costa de Oro 2026
                </h2>
                <span className="text-xs text-slate-500 font-medium block">
                  La Paz Community School · Cabo Velas & Tempisque
                </span>
              </div>

              {/* Escudo del Colegio */}
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center shrink-0">
                <SchoolEmblem schoolId={selectedSchool.id} size="md" showBorder={false} />
              </div>
            </div>

            {/* Certificate Title & Badge */}
            <div className="space-y-2 relative z-10 pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-slate-950 text-amber-300 font-black text-xs uppercase tracking-widest border border-amber-500/40">
                {certTitles[certificateType].badge}
              </span>

              <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide">
                {certTitles[certificateType].title}
              </h1>

              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                {certTitles[certificateType].subtitle}
              </p>
            </div>

            {/* Recipient Name Area */}
            <div className="space-y-2 relative z-10 py-2">
              <span className="text-xs text-slate-400 font-serif italic block">
                Otorga el presente reconocimiento con orgullo a:
              </span>
              <div className="border-b-2 border-slate-900 max-w-md mx-auto pb-1">
                <span className="font-serif text-2xl sm:text-3xl font-black text-slate-900 block capitalize tracking-tight">
                  {recipientName || 'Atleta Destacado'}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700 block mt-1">
                Representando a: <strong className="text-amber-900 font-extrabold">{selectedSchool.name}</strong> en <strong className="text-slate-900">{sport}</strong>
              </span>
            </div>

            {/* Custom Formative Values Text */}
            <div className="max-w-lg mx-auto relative z-10 text-xs text-slate-600 italic leading-relaxed pt-1">
              "{customNotes}"
            </div>

            {/* Signatures and QR Code Row */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end gap-4 relative z-10 text-xs">
              {/* Firma 1: Dirección Deportiva */}
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif italic text-slate-800 text-xs">
                  Coach Dirección General
                </div>
                <span className="font-bold text-slate-900 block text-[11px]">Dirección Deportiva</span>
                <span className="text-[9.5px] text-slate-500 block">La Paz Community School</span>
              </div>

              {/* QR de Validación Digital */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="p-1.5 bg-white rounded-xl border border-slate-300 shadow-2xs">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <span className="font-mono text-[8.5px] text-slate-500 block font-bold">
                  {verificationCode}
                </span>
                <span className="text-[8px] text-emerald-700 font-bold uppercase block">
                  ✓ Verificado Oficial
                </span>
              </div>

              {/* Firma 2: Delegación Escolar */}
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif italic text-slate-800 text-xs">
                  Delegado {selectedSchool.shortName}
                </div>
                <span className="font-bold text-slate-900 block text-[11px]">Comité Institucional</span>
                <span className="text-[9.5px] text-slate-500 block">{selectedSchool.name}</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 relative z-10">
              <span>Festival Intercolegial Costa de Oro 2026 · Guanacaste, Costa Rica</span>
              <span>Emisión Digital Oficial · info@curiol.studio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
