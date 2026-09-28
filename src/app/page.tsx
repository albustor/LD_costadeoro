'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { EventGeneralInfoCards } from '@/components/home/EventGeneralInfoCards';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Heart, 
  SlidersHorizontal, 
  ChevronRight, 
  Film, 
  Info,
  Flame
} from 'lucide-react';

export default function HomePage() {
  const { tournament, schools, matches, getSchoolById, getCategoryById } = useTournament();
  const [activeTab, setActiveTab] = useState<'video' | 'info'>('video');

  // Encontrar el partido en vivo o el encuentro destacado del momento (Fútbol Femenino Abierto)
  const currentLiveMatch = matches.find((m) => m.status === 'live') || matches[0];
  const homeSchool = getSchoolById(currentLiveMatch?.homeTeamId);
  const awaySchool = getSchoolById(currentLiveMatch?.awayTeamId);
  const currentCategory = getCategoryById(currentLiveMatch?.categoryId);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 🌊 1. BIENVENIDA A LA LIGA DEPORTIVA COSTA DE ORO (ARRIBA DEL VIDEO) */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              <span>{tournament.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sede: {tournament.host.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium text-xs border border-emerald-200">
              Octubre - Noviembre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Bienvenidos a la Liga Deportiva Costa de Oro
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Festival formativo intercolegial de Guanacaste que une a 6 instituciones educativas en torno al compañerismo, el juego limpio y la sana competencia en Fútbol, Voleibol y Baloncesto.
          </p>
        </div>

        {/* ⚽ ENCUENTRO DEL MOMENTO / EN VIVO (FÚTBOL FEMENINO ABIERTO) */}
        {currentLiveMatch && (
          <div className="bg-white rounded-2xl p-4 border border-amber-300 shadow-sm relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Encuentro del Momento • {currentCategory?.name || 'Fútbol Femenino Abierto'}</span>
                </span>
              </div>

              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>{currentLiveMatch.venue}</span>
              </span>
            </div>

            {/* Marcador En Vivo */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <SchoolEmblem schoolId={homeSchool?.id || ''} size="sm" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {homeSchool?.name}
                </span>
              </div>

              <div className="px-3.5 py-1 bg-red-600 text-white rounded-xl text-center shrink-0 shadow-xs">
                <span className="font-mono font-black text-sm sm:text-base">
                  {currentLiveMatch.homeScore} : {currentLiveMatch.awayScore}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 flex-1 min-w-0 text-right">
                <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {awaySchool?.name}
                </span>
                <SchoolEmblem schoolId={awaySchool?.id || ''} size="sm" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🗂️ 2. PESTAÑAS DE SELECCIÓN: VIDEO INTRODUCTORIO VS INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        {/* Selector de Pestañas */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Film className="w-4 h-4 text-amber-600" />
            <span>Video Introductorio del Evento</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>Información General del Evento</span>
          </button>
        </div>

        {/* CONTENIDO PESTAÑA 1: VIDEO INTRODUCTORIO */}
        {activeTab === 'video' && (
          <div className="space-y-4 animate-fade-in">
            <EventIntroVideo />
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-slate-800">
                Video Oficial de la Liga Costa de Oro 2026
              </span>
              <p className="text-[11px] text-slate-500">
                Revive la emoción, el compañerismo y la inauguración de la temporada deportiva intercolegial.
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 2: INFORMACIÓN GENERAL CON TARJETAS INTERACTIVAS Y EXPANDIBLES */}
        {activeTab === 'info' && (
          <EventGeneralInfoCards schools={schools} />
        )}
      </section>

      {/* 🚀 3. ACCESOS DIRECTOS PRINCIPALES DE LA PLATAFORMA */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Acceso 1: Avance Global */}
        <Link
          href="/tabla"
          className="bg-white hover:bg-amber-50/40 p-5 rounded-3xl border border-slate-200 hover:border-amber-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Trophy className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-800">
              Avance y Puntuación
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Barras visuales interactivas y colegio líder de la temporada.
            </p>
          </div>
        </Link>

        {/* Acceso 2: Deportes y Calendario */}
        <Link
          href="/calendario"
          className="bg-white hover:bg-sky-50/40 p-5 rounded-3xl border border-slate-200 hover:border-sky-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Calendar className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-800">
              Deportes y Horarios
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fútbol, Voleibol, Baloncesto y partidos por cancha.
            </p>
          </div>
        </Link>

        {/* Acceso 3: Muro Familiar */}
        <Link
          href="/mural"
          className="bg-white hover:bg-rose-50/40 p-5 rounded-3xl border border-slate-200 hover:border-rose-300 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-rose-800">
              Muro Familiar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sube fotos, videos y porras para tu equipo en 2 toques.
            </p>
          </div>
        </Link>

        {/* Acceso 4: Panel Central de Control */}
        <Link
          href="/admin"
          className="bg-white hover:bg-slate-50 p-5 rounded-3xl border border-slate-200 hover:border-slate-400 transition-all shadow-2xs space-y-3 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-slate-950">
              Panel de Control
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formularios para ingresar resultados, partidos y calendario.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
