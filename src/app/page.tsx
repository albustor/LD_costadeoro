'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { useLanguage } from '@/context/LanguageContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
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
  Share2,
  MessageCircleHeart
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
            {/* Tarjeta 1: Calendario actualizado y tablas de posiciones (resumida) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-amber-500/40 shadow-md flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Calendario actualizado</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Noviembre y Diciembre 2026</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  Calendario de finales y tablas de posiciones
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ¡Felicidades a <strong className="text-amber-300 font-bold">La Paz Cabo Velas (Campeón Fútbol Femenino)</strong>! Consulta las próximas finales confirmadas: <strong className="text-amber-300 font-bold">Voleibol C (Lunes 30 nov · 3:15 p. m.)</strong> y <strong className="text-amber-300 font-bold">Fútbol C (Miércoles 2 dic · 2:00 p. m.)</strong>.
                </p>
              </div>
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <Link
                  href="/calendario"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Ver calendario actualizado</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marcadores"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Tablas y marcadores</span>
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
                  ¡Comparte tus fotografías y videos de las grandes finales!
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Invitamos a todas las familias, estudiantes y docentes a celebrar esta fiesta deportiva compartiendo sus mejores fotos, videos y porras en el camino al campeonato.
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

          {/* Cintillo destacado de la Semana de Grandes Finales con Cuadro de Honor y Próximas Finales */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/70 border-2 border-amber-400/90 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black shrink-0 shadow-2xs border border-amber-400/40">
                  🏆 Grandes Finales
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Resultados de Finales y Próximas Finales · Liga La Costa de Oro 2026
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-950 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300">
                Fase de Campeonato Oficial
              </span>
            </div>

            {/* 🏆 FINAL FÚTBOL FEMENINO | CUADRO DE HONOR OFICIAL (SIN AFICHE DE FECHA PASADA) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-2 border-amber-400/80 shadow-md">
              <div className="space-y-3 w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wide">
                    🏆 Final Fútbol Femenino · Liga La Costa de Oro
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 rounded-md">
                    ✅ Cuadro de Honor Oficial · ¡Next Play!
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Este lunes disfrutamos de una gran final, llena de espíritu deportivo y sana competencia. 💪⚽
                </p>

                {/* Tarjetas de Podio 1°, 2° y 3° con emblemas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left">
                  <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-400/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                      <SchoolEmblem schoolId="la-paz-cabo-velas" size="xs" showBorder={false} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                        🥇 Campeón
                      </span>
                      <span className="text-sm sm:text-base font-black text-white block">
                        La Paz Cabo Velas
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                      <SchoolEmblem schoolId="cria" size="xs" showBorder={false} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block">
                        🥈 Subcampeón
                      </span>
                      <span className="text-sm sm:text-base font-black text-white block">
                        CRIA
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-700/20 border border-amber-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                      <SchoolEmblem schoolId="la-paz-tempisque" size="xs" showBorder={false} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-amber-200 uppercase tracking-wider block">
                        🥉 Tercer lugar
                      </span>
                      <span className="text-sm sm:text-base font-black text-white block">
                        La Paz Tempisque
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">
                  Seguimos preparando las próximas finales, promoviendo siempre la sana convivencia y el espíritu deportivo. ¡Next Play!
                </p>
              </div>
            </div>

            {/* 🏆 PRÓXIMAS FINALES | LIGA LA COSTA DE ORO */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>🏆 Próximas Finales · Liga La Costa de Oro</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {/* Final Voleibol Categoría C */}
                <div className="p-3.5 rounded-xl bg-white border-2 border-sky-300 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-sky-950 border-b border-slate-100 pb-1">
                    <span>🏐 Voleibol categoría C</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                      Confirmada
                    </span>
                  </div>
                  <p className="font-black text-slate-900 text-xs sm:text-sm pt-0.5">
                    Colegio Vittorino 🆚 La Paz Cabo Velas
                  </p>
                  <div className="text-[11px] text-slate-700 font-semibold space-y-0.5">
                    <p>📅 <strong>Lunes 30 de noviembre</strong> · 🕒 <strong>3:15 p. m.</strong></p>
                    <p>📍 Sede: <strong>Gimnasio Vittorino</strong></p>
                  </div>
                </div>

                {/* Final Fútbol Categoría C */}
                <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-300 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-1">
                    <span>⚽ Fútbol categoría C</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                      Confirmada
                    </span>
                  </div>
                  <p className="font-black text-slate-900 text-xs sm:text-sm pt-0.5">
                    La Paz Tempisque 🆚 Colegio Vittorino
                  </p>
                  <div className="text-[11px] text-slate-700 font-semibold space-y-0.5">
                    <p>📅 <strong>Miércoles 2 de diciembre</strong> · 🕑 <strong>2:00 p. m.</strong></p>
                    <p>📍 Sede: <strong>La Paz Tempisque</strong></p>
                  </div>
                </div>

                {/* Final Baloncesto Categoría C */}
                <div className="p-3.5 rounded-xl bg-white border border-amber-300/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-amber-950 border-b border-slate-100 pb-1">
                    <span>🏀 Baloncesto categoría C</span>
                    <span className="text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-extrabold">
                      ⏳ En coordinación
                    </span>
                  </div>
                  <p className="font-black text-slate-900 text-xs sm:text-sm pt-0.5">
                    Educarte 🆚 La Paz Cabo Velas
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Fecha y sede por definir.
                  </p>
                </div>

                {/* Final Baloncesto Categoría D */}
                <div className="p-3.5 rounded-xl bg-white border border-amber-300/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-amber-950 border-b border-slate-100 pb-1">
                    <span>🏀 Baloncesto categoría D</span>
                    <span className="text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-extrabold">
                      ⏳ En coordinación
                    </span>
                  </div>
                  <p className="font-black text-slate-900 text-xs sm:text-sm pt-0.5">
                    Lunes 7 de diciembre (proyectada)
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Fecha proyectada para el lunes 7 de diciembre, pendiente de confirmación.
                  </p>
                </div>
              </div>
            </div>

            {/* 💬📸 ELEMENTO DE COMUNICACIÓN ADICIONAL EN HERO: INVITACIÓN AL MURO EN LAS GRANDES FINALES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950/95 to-slate-950 text-white border-2 border-amber-400/90 shadow-lg flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              {/* Afiche Oficial Grandes Finales & Muro */}
              <Link
                href="/mural"
                className="w-full sm:w-48 md:w-56 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400/60 shadow-lg group cursor-pointer block"
              >
                <img
                  src="/images/afiche-grandes-finales-muro.jpg?v=2"
                  alt="Afiche Oficial Grandes Finales · Apoya al máximo a tu equipo en el Muro"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Contenido interactivo de invitación a escribir a los equipos y compartir fotos */}
              <div className="space-y-3 flex-1 text-center sm:text-left w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wide">
                    <MessageCircleHeart className="w-3.5 h-3.5" />
                    <span>¡Apoya al máximo a tu equipo!</span>
                  </span>
                  <span className="text-xs font-bold text-amber-200 bg-white/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
                    📸💬 Muro Familiar · Abierto sin PIN
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug">
                  ¡Escribe a tu equipo, comparte tus fotografías en el Muro y vive la emoción de las Grandes Finales!
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  En esta etapa de campeonato, invitamos a todas las familias, estudiantes y docentes a enviar mensajes de aliento a sus atletas, compartir fotografías desde la cancha y apoyar al máximo a sus equipos con espíritu <strong className="text-amber-300 font-extrabold">¡Next Play!</strong>
                </p>

                {/* Escudos interactivos de los 6 colegios para ir directo al Muro */}
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">
                    👇 Toca tu colegio para enviarle tu mensaje y subir fotos en el Muro:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {schools.map((sc) => (
                      <Link
                        key={sc.id}
                        href="/mural"
                        className="p-2 rounded-xl bg-white/10 hover:bg-amber-400/25 border border-white/15 hover:border-amber-400 transition-all flex items-center gap-2 text-left group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white p-0.5 shrink-0 flex items-center justify-center">
                          <SchoolEmblem schoolId={sc.id} size="xs" showBorder={false} />
                        </div>
                        <span className="text-[11px] font-extrabold text-white group-hover:text-amber-200 leading-tight line-clamp-2">
                          {sc.shortName}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Botones de acción directa al Muro y compartir invitación */}
                <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Link
                    href="/mural"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Escribir a mi equipo y subir fotos al Muro</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/?text=%F0%9F%8F%86%20%C2%A1Vivamos%20juntos%20las%20Grandes%20Finales%20de%20la%20Liga%20La%20Costa%20de%20Oro%202026!%20%E2%9A%BD%F0%9F%8F%90%F0%9F%8F%80%20Entra%20al%20Muro%20de%20la%20Comunidad%2C%20escribe%20un%20mensaje%20de%20aliento%20a%20tu%20equipo%20y%20comparte%20tus%20fotograf%C3%ADas%20en%3A%20https%3A%2F%2Fcostadeoro.curiol.studio%2Fmural"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Invitar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <p className="text-xs text-slate-700 font-medium">
                Continuamos coordinando los detalles para el desarrollo de las finales, procurando una excelente experiencia deportiva para todos.
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href="/calendario"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver calendario de finales</span>
                </Link>
                <Link
                  href="/marcadores"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Tablas de posiciones</span>
                </Link>
                <a
                  href="https://wa.me/?text=%F0%9F%8F%86%20%C2%A1Felicidades%20a%20La%20Paz%20Cabo%20Velas%20(Campe%C3%B3n)%2C%20CRIA%20(Subcampe%C3%B3n)%20y%20La%20Paz%20Tempisque%20(3.%C2%B0%20lugar)%20en%20la%20Final%20de%20F%C3%BAtbol%20Femenino!%20Consulta%20las%20pr%C3%B3ximas%20finales%20(Voleibol%20C%20lunes%2030%20nov%20y%20F%C3%BAtbol%20C%20mi%C3%A9rcoles%202%20dic)%20en:%20https://costadeoro.curiol.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir en WhatsApp</span>
                </a>
              </div>
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

