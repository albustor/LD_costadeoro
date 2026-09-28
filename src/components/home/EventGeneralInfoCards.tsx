'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School } from '@/types/tournament';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { SportIconRenderer } from '@/components/sports/SportGraphicIcons';
import { 
  Shield, 
  Trophy, 
  Calendar, 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2,
  Leaf
} from 'lucide-react';

interface EventGeneralInfoCardsProps {
  schools: School[];
}

export function EventGeneralInfoCards({ schools }: EventGeneralInfoCardsProps) {
  // Estados de acordeón para cada sección
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    schools: true, // Abierto por defecto
    sports: true,  // Abierto por defecto
    festivals: false,
    philosophy: false,
  });

  // Estado para desplegar detalles de un colegio individual
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 📊 TARJETAS MÉTRICAS RESUMIDAS SUPERIORES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">6</span>
          <span className="text-[11px] text-slate-500 font-semibold">Colegios Oficiales</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">3</span>
          <span className="text-[11px] text-slate-500 font-semibold">Disciplinas Base</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">4</span>
          <span className="text-[11px] text-slate-500 font-semibold">Festivales Oficiales</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono block">100%</span>
          <span className="text-[11px] text-slate-500 font-semibold">Formato Familiar</span>
        </div>
      </div>

      {/* 🏫 SECCIÓN 1: INSTITUCIONES EDUCATIVAS PARTICIPANTES (EXPANDIBLE / CONTRAÍBLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        {/* Cabecera Táctil del Acordeón */}
        <button
          type="button"
          onClick={() => toggleSection('schools')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Instituciones Educativas Participantes</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  6 Colegios
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Toca para ver o contraer las fichas de los 6 colegios de Guanacaste
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.schools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Contenido Desplegable: Tarjetas Resumidas e Interactivas de Colegios */}
        {openSections.schools && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {schools.map((school) => {
                const isExpanded = expandedSchoolId === school.id;
                return (
                  <div
                    key={school.id}
                    className={`rounded-2xl border transition-all p-3.5 space-y-2.5 ${
                      isExpanded
                        ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    {/* Fila Principal de la Tarjeta */}
                    <div
                      onClick={() => setExpandedSchoolId(isExpanded ? null : school.id)}
                      className="flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SchoolEmblem schoolId={school.id} size="sm" />
                        <div className="min-w-0">
                          <span className="block font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {school.name}
                          </span>
                          <span className="block text-[11px] text-slate-500 truncate">
                            {school.location}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Ver más información del colegio"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Despliegue de Información Resumida al Tocar la Tarjeta */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-2 animate-fade-in">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sede / Ciudad</span>
                            <span className="font-bold text-slate-800">{school.city}</span>
                          </div>
                          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Acrónimo</span>
                            <span className="font-bold text-slate-800">{school.acronym}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Inscrito en 3 Disciplinas
                          </span>
                          <Link
                            href="/colegios"
                            className="text-amber-700 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Ver perfil</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ⚽ SECCIÓN 2: DISCIPLINAS DEPORTIVAS Y SEDES (EXPANDIBLE / CONTRAÍBLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('sports')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Disciplinas Oficiales y Sedes de Juego</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[10px] font-bold">
                  3 Deportes
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Fútbol, Voleibol y Baloncesto con reglamentos formativos
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.sports ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.sports && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tarjeta Fútbol */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="futbol" size={32} />
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">Fútbol</span>
                      <span className="text-[10px] font-semibold text-emerald-800">Césped Natural</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Cabo Velas
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2 tiempos de 25 minutos con balón reglamentario. Canchas principales del Campus Cabo Velas.
                </p>
                <div className="text-[10.5px] font-semibold text-slate-500 pt-1 border-t border-emerald-200/60">
                  Categorías: Fem / Masc (C, D y Abierta)
                </div>
              </div>

              {/* Tarjeta Voleibol */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="voleibol" size={32} />
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">Voleibol</span>
                      <span className="text-[10px] font-semibold text-sky-800">Gimnasio Techado</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-sky-800 text-[10px] font-bold border border-sky-200">
                    Tempisque
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Partidos al mejor de 3 sets (25 pts cada uno, tie-break a 15 pts). Rotación técnica oficial.
                </p>
                <div className="text-[10.5px] font-semibold text-slate-500 pt-1 border-t border-sky-200/60">
                  Categorías: Fem / Masc / Mixto
                </div>
              </div>

              {/* Tarjeta Baloncesto */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="baloncesto" size={32} />
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">Baloncesto</span>
                      <span className="text-[10px] font-semibold text-orange-800">Cancha Multiuso</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-orange-800 text-[10px] font-bold border border-orange-200">
                    Tempisque
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  4 periodos de 10 minutos con reloj oficial FIBA y mesa de control arbitral.
                </p>
                <div className="text-[10.5px] font-semibold text-slate-500 pt-1 border-t border-orange-200/60">
                  Categorías: Categoría C y D
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📅 SECCIÓN 3: CRONOGRAMA DE FESTIVALES Y FECHAS (EXPANDIBLE / CONTRAÍBLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('festivals')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Cronograma de los 4 Festivales Deportivos</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Temporada 2026
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Fechas oficiales de inauguración, jornadas intermedias y finales
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.festivals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.festivals && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9.5px] font-bold">
                  Festival 1 • Octubre
                </span>
                <h4 className="font-bold text-xs text-slate-900">Inauguración y 1.ª Jornada</h4>
                <p className="text-[11px] text-slate-500">
                  Desfile de delegaciones y primeros partidos de clasificación.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[9.5px] font-bold">
                  Festival 2 • Octubre
                </span>
                <h4 className="font-bold text-xs text-slate-900">Cruces Inter-Sedes</h4>
                <p className="text-[11px] text-slate-500">
                  Rotación de partidos en Campus Cabo Velas y Tempisque.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[9.5px] font-bold">
                  Festival 3 • Noviembre
                </span>
                <h4 className="font-bold text-xs text-slate-900">Semifinales Deportivas</h4>
                <p className="text-[11px] text-slate-500">
                  Definición de posiciones y pases a la gran final.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[9.5px] font-bold">
                  Festival 4 • Noviembre
                </span>
                <h4 className="font-bold text-xs text-slate-900">Gran Clausura y Premiación</h4>
                <p className="text-[11px] text-slate-500">
                  Finales de todas las categorías y entrega del trofeo general.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🤝 SECCIÓN 4: FILOSOFÍA FORMATIVA Y CONVIVENCIA (EXPANDIBLE / CONTRAÍBLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('philosophy')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Filosofía Formativa y Normas de Convivencia</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
                  Juego Limpio
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Principios de respeto, apoyo positivo familiar y sostenibilidad
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.philosophy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.philosophy && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3 text-xs text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">1. Apoyo Positivo Familiar</span>
                <p className="text-[11px] text-slate-500">
                  Alentamos con respeto a todos los atletas y valoramos las decisiones arbitrales.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">2. Inclusión y Formación</span>
                <p className="text-[11px] text-slate-500">
                  La experiencia de los estudiantes y el aprendizaje están por encima del marcador.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Cero Plásticos de un Solo Uso</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Instalaciones con estaciones de hidratación para botellas reutilizables.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
