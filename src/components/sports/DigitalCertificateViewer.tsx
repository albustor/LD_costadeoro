'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { SportsCertificate, generateAthleteCertificate } from '@/lib/certificatesEngine';
import { 
  Award, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

export function DigitalCertificateViewer() {
  const { schools, categories } = useTournament();
  const [athleteName, setAthleteName] = useState('');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [role, setRole] = useState<SportsCertificate['role']>('Atleta Oficial');
  const [certificate, setCertificate] = useState<SportsCertificate | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim()) return;

    const cert = generateAthleteCertificate({
      athleteName,
      schoolId,
      categoryId,
      role,
    });
    setCertificate(cert);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Generator Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto print:hidden">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Emisión de Certificados Deportivos Oficiales
            </h2>
            <p className="text-xs text-slate-500">
              Genera tu diploma digital de honor y participación con código de verificación único
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Completo del Atleta o Entrenador
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Sofía Brenes Morales / Mateo Jiménez"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Institución Educativa
              </label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Categoría / Deporte
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Distinción / Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as SportsCertificate['role'])}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="Atleta Oficial">Atleta Oficial</option>
                <option value="Jugador Más Valioso (MVP)">Jugador Más Valioso (MVP)</option>
                <option value="Capitán de Equipo">Capitán de Equipo</option>
                <option value="Entrenador Destacado">Entrenador Destacado</option>
                <option value="Institución de Honor">Institución de Honor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Certificado Digital Oficial</span>
          </button>
        </form>
      </div>

      {/* Rendered Certificate */}
      {certificate && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Certificado emitido y verificado correctamente
            </span>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>

          {/* Certificate Canvas Box */}
          <div className="relative bg-white border-4 border-amber-600/60 rounded-3xl p-8 sm:p-14 text-center shadow-lg overflow-hidden print:border-2 print:p-8 print:m-0 print:rounded-none">
            {/* Background Corner Decors */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-600/70 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-600/70 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-600/70 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-600/70 rounded-br-2xl pointer-events-none" />

            {/* Inner Border */}
            <div className="border border-amber-600/30 rounded-2xl p-6 sm:p-10 space-y-6 bg-amber-50/20">
              {/* Header Logos */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-600/20">
                <img
                  src="/logos/curiol_logo_oficial_transparente_hd.png"
                  alt="Curiol Studio"
                  className="h-10 w-auto object-contain"
                />
                <div className="text-center sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block">
                    {certificate.tournamentName}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">
                    Sede Oficial: {certificate.hostName}
                  </span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  Certificado Oficial de Reconocimiento
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-900 font-serif tracking-wide">
                  Diploma al Mérito Deportivo
                </h1>
                <p className="text-xs text-slate-500">
                  Por su destacada participación, disciplina y espíritu deportivo en la Edición 2026
                </p>
              </div>

              {/* Recipient Name */}
              <div className="py-4 border-y border-slate-200 my-4 space-y-1">
                <span className="text-xs text-slate-500 block">Se otorga con distinción a:</span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-wider font-serif">
                  {certificate.athleteName}
                </h2>
                <div className="flex items-center justify-center gap-2 pt-1 text-sm text-amber-800 font-semibold">
                  <span>{certificate.school.logo}</span>
                  <span>{certificate.school.name}</span>
                  <span>•</span>
                  <span>{certificate.category.name}</span>
                </div>
              </div>

              {/* Distinction Badge */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider border border-amber-300">
                  Distinción: {certificate.role}
                </span>
              </div>

              {/* Signatures & Verification Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-6 pt-8 border-t border-amber-600/20 text-xs">
                {/* School Authority Signature */}
                <div className="space-y-1 text-center">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic text-sm text-slate-700">Alejandro V. / Dirección</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1">
                    <span className="block font-bold text-slate-900">Comité Deportivo</span>
                    <span className="block text-[10px] text-slate-500">La Paz Community School</span>
                  </div>
                </div>

                {/* Verification QR / Code */}
                <div className="text-center space-y-1 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto" />
                  <span className="block text-[9px] font-mono text-slate-500">
                    CÓDIGO DE VERIFICACIÓN
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-amber-700">
                    {certificate.verificationCode}
                  </span>
                </div>

                {/* Curiol Studio Signature */}
                <div className="space-y-1 text-center">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic text-sm text-amber-700">Curiol Studio • Dirección</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1">
                    <span className="block font-bold text-slate-900">Curiol Studio</span>
                    <span className="block text-[10px] text-slate-500">Tecnología & Registro Oficial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

