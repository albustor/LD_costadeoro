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
  Flame,
  Shield
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
      {/* 🌊 1. BIENVENIDA A LA LIGA DEPORTIVA COSTA DE ORO */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{tournament.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-medium text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sede: {tournament.host.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
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
      </section>

      {/* 🗂️ 2. PESTAÑAS DE SELECCIÓN: VIDEO INTRODUCTORIO VS INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        {/* Selector de Pestañas con Negro y Dorado */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Film className={`w-4 h-4 ${activeTab === 'video' ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>Video Introductorio del Evento</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-slate-950 text-amber-300 border border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Info className={`w-4 h-4 ${activeTab === 'info' ? 'text-amber-400' : 'text-amber-600'}`} />
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

      {/* 🏫 3. BOTONES OFICIALES DE INSTITUCIONES EDUCATIVAS (ESCUDO Y NOMBRE) */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Colegios e Instituciones Participantes</span>
          </h2>
          <Link
            href="/colegios"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>Ver detalles</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cuadrícula interactiva con los 6 colegios: Escudo + Nombre */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {schools.map((school) => (
            <Link
              key={school.id}
              href="/colegios"
              className="bg-white hover:bg-amber-50/60 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-200/80 group-hover:border-amber-300 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform">
                <SchoolEmblem schoolId={school.id} size="sm" showBorder={false} />
              </div>
              <div className="min-w-0 w-full space-y-0.5">
                <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-tight block truncate group-hover:text-amber-900 transition-colors">
                  {school.shortName || school.name}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {school.location || school.city}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🚀 4. ACCESOS DIRECTOS COMPACTOS (TIPO ICONOS / ACCIONES RÁPIDAS) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Acceso 1: Avance y Puntuación */}
        <Link
          href="/tabla"
          className="bg-white hover:bg-amber-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-100 transition-transform shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-amber-800 transition-colors">
            Avance y Puntuación
          </span>
        </Link>

        {/* Acceso 2: Deportes y Horarios */}
        <Link
          href="/calendario"
          className="bg-white hover:bg-sky-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-sky-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:bg-sky-100 transition-transform shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-sky-800 transition-colors">
            Deportes y Horarios
          </span>
        </Link>

        {/* Acceso 3: Muro Familiar */}
        <Link
          href="/mural"
          className="bg-white hover:bg-rose-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-rose-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:bg-rose-100 transition-transform shadow-2xs">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-rose-800 transition-colors">
            Muro Familiar
          </span>
        </Link>

        {/* Acceso 4: Panel Central de Control */}
        <Link
          href="/admin"
          className="bg-white hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/90 hover:border-slate-400 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:bg-slate-200 transition-transform shadow-2xs">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-slate-950 transition-colors">
            Panel de Control
          </span>
        </Link>
      </section>
    </div>
  );
}
