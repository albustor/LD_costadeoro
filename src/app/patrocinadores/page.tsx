'use client';

import React, { useState } from 'react';
import { SponsorsBanner } from '@/components/sponsors/SponsorsBanner';
import { useTier } from '@/context/TierContext';
import { useTournament } from '@/context/TournamentContext';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  CheckCircle2, 
  Send
} from 'lucide-react';

export default function PatrocinadoresPage() {
  const { isFeatureEnabled, tierConfig } = useTier();
  const { sponsors } = useTournament();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [categoryInterest, setCategoryInterest] = useState('Hotelería y Turismo');
  const [formSent, setFormSent] = useState(false);

  const totalClicks = sponsors.reduce((acc, s) => acc + s.currentClicks, 0);
  const totalImpressions = sponsors.reduce((acc, s) => acc + s.estimatedImpressions, 0);
  const avgCtr = ((totalClicks / totalImpressions) * 100).toFixed(1);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setCompanyName('');
      setContactName('');
      setWhatsapp('');
    }, 3000);
  };

  if (!isFeatureEnabled('sponsorBanners')) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8 max-w-2xl mx-auto space-y-4 shadow-sm">
        <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">
          Sección de Patrocinadores No Habilitada en este Paquete
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Actualmente está visualizando la plataforma bajo el modo <strong>{tierConfig.name}</strong>, el cual mantiene un diseño 100% libre de publicidad. Para habilitar los banners y cupones comerciales WhatsApp, seleccione la <strong>Opción 2 ($800 USD)</strong> o la <strong>Opción 3 ($1,300 USD)</strong> en la barra superior.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Alianzas Estratégicas Guanacaste
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Directorio de Patrocinadores y Convenios Oficiales
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Conectamos a las familias de la comunidad deportiva internacional de Guanacaste con los mejores comercios, servicios médicos, hotelería y actividades recreativas mediante cupones digitales interactivos.
        </p>

        {/* Live Commercial Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-1 font-semibold uppercase">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Alcance Estimado</span>
            </div>
            <span className="text-xl font-black text-slate-900 font-mono">{totalImpressions.toLocaleString()}</span>
            <span className="block text-[10px] text-slate-500">Visualizaciones</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-1 font-semibold uppercase">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clics Directos</span>
            </div>
            <span className="text-xl font-black text-emerald-600 font-mono">{totalClicks}</span>
            <span className="block text-[10px] text-slate-500">Aperturas WhatsApp</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-1 font-semibold uppercase">
              <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
              <span>Interacción CTR</span>
            </div>
            <span className="text-xl font-black text-sky-600 font-mono">{avgCtr}%</span>
            <span className="block text-[10px] text-slate-500">Conversión</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-1 font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Espacios Activos</span>
            </div>
            <span className="text-xl font-black text-amber-600 font-mono">4 Marcas</span>
            <span className="block text-[10px] text-slate-500">Convenio Oficial</span>
          </div>
        </div>
      </div>

      {/* Active Sponsors Cards */}
      <SponsorsBanner />

      {/* Partner Onboarding Form */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Oportunidad Comercial
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              ¿Deseas vincular tu empresa a la Liga Costa de Oro?
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Posiciona tu marca ante más de 600 familias bilingües y atletas en Guanacaste durante las jornadas de Noviembre y la Semana de Finales.
            </p>
          </div>

          {formSent ? (
            <div className="py-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">¡Solicitud Recibida con Éxito!</h3>
              <p className="text-xs text-slate-500">
                El equipo comercial de Curiol Studio se pondrá en contacto contigo en menos de 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Comercial de la Empresa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hotel / Restaurante / Clínica"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carolina Montero"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+506 8888-0000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sector / Rubro
                  </label>
                  <select
                    value={categoryInterest}
                    onChange={(e) => setCategoryInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hotelería y Turismo">Hotelería y Turismo</option>
                    <option value="Gastronomía y Cafetería">Gastronomía y Cafetería</option>
                    <option value="Salud y Fisioterapia">Salud y Fisioterapia</option>
                    <option value="Deportes y Aventura">Deportes y Aventura</option>
                    <option value="Comercio y Retail">Comercio y Retail</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Integración Comercial</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

