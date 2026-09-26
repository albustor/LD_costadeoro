'use client';

import React from 'react';
import { DigitalCertificateViewer } from '@/components/sports/DigitalCertificateViewer';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function CertificadosPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-800 print:hidden">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
          <Award className="w-6 h-6 text-amber-400" />
          <span>Certificados y Diplomas Oficiales</span>
        </h1>
        <p className="text-xs text-slate-400">
          Reconocimiento digital autenticado para atletas, capitanes, entrenadores e instituciones de la Liga Costa de Oro 2026
        </p>
      </div>

      <DigitalCertificateViewer />
    </div>
  );
}
