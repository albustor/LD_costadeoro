'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { 
  Trophy, 
  MapPin, 
  Film, 
  Info,
  Camera,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react';

export default function HomePage() {
  const { tournament, schools } = useTournament();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'video' | 'info'>('video');

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-2 sm:pb-4">
      {/* 🌊 1. ENCABEZADO DE BIENVENIDA */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200/90 p-5 sm:p-7 md:p-8 shadow-xs space-y-5">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-950 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{t('hero.welcomeBadge')}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Sedes rotativas · Guanacaste</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 shadow-2xs">
              Festival Deportivo Intercolegial 2026
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50/80 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300/80 shadow-2xs">
              Octubre y Noviembre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-normal">
            {t('hero.tagline')}
          </p>
        </div>

        {/* 🏆📸 LLAMADO A LA ACCIÓN: SEGUIMIENTO DE TABLAS Y RECUERDOS DE LA 1.ª FECHA */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Tarjeta 1: Invitación a seguir las tablas de posiciones */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-amber-500/40 shadow-md flex flex-col justify-between gap-3.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Resultados oficiales · 1.ª fecha</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Actualizado</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  ¡Sigue de cerca las tablas de posiciones!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Consulta los marcadores oficiales y cómo marcha cada institución en fútbol, voleibol y baloncesto tras haberse disputado la primera jornada del Festival Deportivo.
                </p>
              </div>
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/marcadores"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Ver tablas de posiciones y marcadores</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Invitación a las familias a compartir fotos y videos */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/50 border-2 border-amber-300/90 shadow-xs flex flex-col justify-between gap-3.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-extrabold">
                    <Camera className="w-3.5 h-3.5 text-amber-800" />
                    <span>Comunidad y familias</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Muro abierto sin PIN</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  ¡Comparte tus fotografías y videos de la 1.ª fecha!
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Invitamos a todas las familias, estudiantes y docentes a inaugurar nuestro álbum comunitario subiendo sus mejores fotos, videos y porras de la primera fecha.
                </p>
              </div>
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/mural"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Subir fotos, videos y porras en el muro</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Cintillo informativo de la programación de noviembre y botones de acción */}
          <div className="p-3.5 sm:px-5 sm:py-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-black shrink-0 shadow-2xs">
                📅 Noviembre
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                <strong className="font-black text-slate-950">¡Programación oficial actualizada!</strong> · Jornada 2 (2 al 6 nov), Jornada 3 (16 al 20 nov) y Finales (23 al 27 nov).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/calendario"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver calendario de noviembre</span>
              </Link>
              <a
                href="https://wa.me/?text=%C2%A1Hola%20familias!%20%F0%9F%8F%86%20Ya%20est%C3%A1%20disponible%20la%20programaci%C3%B3n%20oficial%20de%20noviembre%20(Jornada%202,%20Jornada%203%20y%20Finales),%20las%20tablas%20de%20posiciones%20y%20el%20muro%20familiar%20de%20la%20Liga%20Costa%20de%20Oro%202026%20en:%20https://costadeoro.curiol.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir portal en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🗂️ 2. PESTAÑAS DE CONTENIDO SECCIONADO: VIDEO VS INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        {/* Selector de pestañas con mayor área táctil y textos grandes */}
        <div className="flex items-center gap-2 p-2 bg-slate-200/80 rounded-2xl border border-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                : 'text-slate-800 hover:text-slate-950 hover:bg-white/70 font-bold'
            }`}
          >
            <Film className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'video' ? 'text-amber-400' : 'text-amber-700'}`} />
            <span>Video del evento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                : 'text-slate-800 hover:text-slate-950 hover:bg-white/70 font-bold'
            }`}
          >
            <Info className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'info' ? 'text-amber-400' : 'text-amber-700'}`} />
            <span>Información general</span>
          </button>
        </div>

        {/* Pestaña 1: Video Oficial */}
        {activeTab === 'video' && (
          <div className="animate-fade-in">
            <EventIntroVideo />
          </div>
        )}

        {/* Pestaña 2: Información General detallada */}
        {activeTab === 'info' && (
          <div className="animate-fade-in">
            <EventGeneralInfoCards schools={schools} />
          </div>
        )}
      </section>

    </div>
  );
}

