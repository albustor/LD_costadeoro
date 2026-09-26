'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { SportsCertificate, generateAthleteCertificate } from '@/lib/certificatesEngine';
import { 
  Award, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  User,
  School as SchoolIcon
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
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto print:hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Emisión de Certificados Deportivos Oficiales
            </h2>
            <p className="text-xs text-slate-400">
              Genera tu diploma digital de honor y participación con código de verificación único
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre Completo del Atleta o Entrenador
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Sofía Brenes Morales / Mateo Jiménez"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institución Educativa
              </label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoría / Deporte
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Distinción / Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as SportsCertificate['role'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
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
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
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
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Certificado emitido y verificado correctamente
            </span>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>

          {/* Certificate Canvas Box */}
          <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/70 rounded-3xl p-8 sm:p-14 text-center shadow-2xl overflow-hidden print:border-2 print:p-8 print:m-0 print:rounded-none">
            {/* Background Corner Decors */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-400 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-400 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-400 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-400 rounded-br-2xl pointer-events-none" />

            {/* Inner Border */}
            <div className="border border-amber-500/30 rounded-2xl p-6 sm:p-10 space-y-6 bg-slate-950/60 backdrop-blur">
              {/* Header Logos */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/30">
                <img
                  src="/logos/curiol_logo_oficial_transparente_hd.png"
                  alt="Curiol Studio"
                  className="h-10 w-auto object-contain"
                />
                <div className="text-center sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    {certificate.tournamentName}
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    Sede Oficial: {certificate.hostName}
                  </span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-amber-300/80 font-bold">
                  Certificado Oficial de Reconocimiento
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-serif tracking-wide">
                  Diploma al Mérito Deportivo
                </h1>
                <p className="text-xs text-slate-400">
                  Por su destacada participación, disciplina y espíritu deportivo en la Edición 2026
                </p>
              </div>

              {/* Recipient Name */}
              <div className="py-4 border-y border-slate-800/80 my-4 space-y-1">
                <span className="text-xs text-slate-400 block">Se otorga con distinción a:</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider font-serif">
                  {certificate.athleteName}
                </h2>
                <div className="flex items-center justify-center gap-2 pt-1 text-sm text-amber-300 font-semibold">
                  <span>{certificate.school.logo}</span>
                  <span>{certificate.school.name}</span>
                  <span>•</span>
                  <span>{certificate.category.name}</span>
                </div>
              </div>

              {/* Distinction Badge */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                  Distinción: {certificate.role}
                </span>
              </div>

              {/* Signatures & Verification Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-6 pt-8 border-t border-amber-500/20 text-xs">
                {/* School Authority Signature */}
                <div className="space-y-1 text-center">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic text-sm text-slate-300">Alejandro V. / Dirección</span>
                  </div>
                  <div className="border-t border-slate-700 pt-1">
                    <span className="block font-bold text-white">Comité Deportivo</span>
                    <span className="block text-[10px] text-slate-400">La Paz Community School</span>
                  </div>
                </div>

                {/* Verification QR / Code */}
                <div className="text-center space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="block text-[9px] font-mono text-slate-400">
                    CÓDIGO DE VERIFICACIÓN
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-amber-300">
                    {certificate.verificationCode}
                  </span>
                </div>

                {/* Curiol Studio Signature */}
                <div className="space-y-1 text-center">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic text-sm text-amber-400">Curiol Studio • Dirección</span>
                  </div>
                  <div className="border-t border-slate-700 pt-1">
                    <span className="block font-bold text-white">Curiol Studio</span>
                    <span className="block text-[10px] text-slate-400">Tecnología & Registro Oficial</span>
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
