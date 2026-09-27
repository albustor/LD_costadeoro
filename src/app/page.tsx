'use client';

import React from 'react';
import Link from 'next/link';
import { useTournament } from '@/context/TournamentContext';
import { EventIntroVideo } from '@/components/home/EventIntroVideo';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { SportIconRenderer } from '@/components/sports/SportGraphicIcons';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Heart, 
  SlidersHorizontal, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Shield 
} from 'lucide-react';

export default function HomePage() {
  const { tournament, schools, categories } = useTournament();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 🎬 1. VIDEO INTRODUCTORIO DEL EVENTO */}
      <section className="space-y-3">
        <EventIntroVideo />
      </section>

      {/* 📌 2. INFORMACIÓN GENERAL BÁSICA DEL EVENTO */}
      <section className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Cabecera y Badges */}
        <div className="space-y-3 max-w-3xl">
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
            Un festival intercolegial formativo que reúne a estudiantes y familias de Guanacaste en torno al compañerismo, el juego limpio y la sana competencia en 3 disciplinas deportivas oficiales.
          </p>
        </div>

        {/* Datos Básicos en Cuadrícula Minimalista */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">6</span>
            <span className="text-[11px] text-slate-500 font-semibold">Colegios Participantes</span>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">3</span>
            <span className="text-[11px] text-slate-500 font-semibold">Disciplinas Base</span>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">4</span>
            <span className="text-[11px] text-slate-500 font-semibold">Festivales Oficiales</span>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono block">100%</span>
            <span className="text-[11px] text-slate-500 font-semibold">Familiar y Abierto</span>
          </div>
        </div>

        {/* Instituciones Educativas con Escudos Oficiales */}
        <div className="space-y-2 pt-2 border-t border-slate-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Instituciones Educativas Participantes:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {schools.map((school) => (
              <Link
                key={school.id}
                href="/colegios"
                className="bg-white hover:bg-slate-50 p-2.5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all flex items-center gap-2 shadow-2xs group"
              >
                <SchoolEmblem schoolId={school.id} size="sm" />
                <div className="min-w-0">
                  <span className="block font-bold text-slate-900 text-xs truncate group-hover:text-amber-700">
                    {school.shortName}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {school.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 3. ACCESOS DIRECTOS PRINCIPALES (Sencillo, Práctico y Minimalista) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
