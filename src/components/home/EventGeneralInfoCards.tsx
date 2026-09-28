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
  Leaf,
  Lock,
  Flame,
  Award
} from 'lucide-react';

interface EventGeneralInfoCardsProps {
  schools: School[];
}

export function EventGeneralInfoCards({ schools }: EventGeneralInfoCardsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    schools: true,
    venues: true,
    sports: true,
    upcomingSports: false,
    festivals: false,
    philosophy: false,
  });

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
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">3 + 4</span>
          <span className="text-[11px] text-slate-500 font-semibold">3 Base + 4 Próximas</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">4</span>
          <span className="text-[11px] text-slate-500 font-semibold">Festivales Oficiales</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono block">43+</span>
          <span className="text-[11px] text-slate-500 font-semibold">Partidos Programados</span>
        </div>
      </div>

      {/* 🏫 SECCIÓN 1: INSTITUCIONES EDUCATIVAS PARTICIPANTES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
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
                CRIA (Tiburones 🦈), Journey, Vittorino, Educarte, La Paz Cabo Velas y La Paz Tempisque (Pumas 🐾)
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.schools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.schools && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {schools.map((school) => {
                const isExpanded = expandedSchoolId === school.id;
                const mascot = school.id.includes('la-paz') ? 'Pumas 🐾' : school.id === 'cria' ? 'Tiburones / Sharks 🦈' : 'Atletas';

                return (
                  <div
                    key={school.id}
                    className={`rounded-2xl border transition-all p-3.5 space-y-2.5 ${
                      isExpanded
                        ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
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
                            {school.location} • {mascot}
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

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-2 animate-fade-in">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sede / Ciudad</span>
                            <span className="font-bold text-slate-800">{school.city}</span>
                          </div>
                          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mascota Oficial</span>
                            <span className="font-bold text-slate-800">{mascot}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Inscrito en Fútbol, Voley y Basket
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

      {/* 📍 SECCIÓN 2: SEDES OFICIALES Y ESTADO DE ASIGNACIÓN POR SORTEO / RIFA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('venues')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Sedes Deportivas y Estado de Asignación</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                  <span>🎲 Sorteo Oficial</span>
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Asignación por rifa rotativa entre instituciones con canchas disponibles (Reglamento PDF)
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.venues ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.venues && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-4">
            {/* Explicación resumida del mecanismo oficial */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Protocolo Oficial de Asignación de Sedes (Liga Costa de Oro 2026)</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-600">
                Cada <strong>festival diario</strong> se disputa en una <strong>sola sede central</strong>. Las sedes se sortean por rifa equitativa entre los colegios que ofrecen instalaciones. Una sede no repite hasta que todas las participantes con cancha hayan sido anfitrionas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-2 bg-white rounded-xl border border-amber-200/80 text-[11px]">
                  <strong className="text-slate-900 block mb-0.5">1. Registro de Canchas</strong>
                  <span className="text-slate-500">Cada institución confirma su disponibilidad de fútbol, baloncesto y voleibol.</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-amber-200/80 text-[11px]">
                  <strong className="text-slate-900 block mb-0.5">2. Rifa por Disciplina</strong>
                  <span className="text-slate-500">15 fechas de grupos sorteadas sin repetición de anfitrión.</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-amber-200/80 text-[11px]">
                  <strong className="text-slate-900 block mb-0.5">3. Gran Final</strong>
                  <span className="text-slate-500">Las 5 fechas finales se rifan al culminar la J3 o en sede neutral.</span>
                </div>
              </div>
            </div>

            {/* Matriz interactiva de oferta de canchas e instituciones */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Estado Actual de Sedes e Instalaciones Ofrecidas
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Institución</th>
                      <th className="py-2.5 px-3">Cancha Fútbol</th>
                      <th className="py-2.5 px-3">Cancha Baloncesto</th>
                      <th className="py-2.5 px-3">Cancha Voleibol</th>
                      <th className="py-2.5 px-3 text-right">Estado Rifa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <SchoolEmblem schoolId="cria" size="sm" />
                        <span>CRIA (Tiburones 🦈)</span>
                      </td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <SchoolEmblem schoolId="la-paz-cabo-velas" size="sm" />
                        <span>La Paz Cabo Velas & Tempisque (Pumas 🐾)</span>
                      </td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">Disponible</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">Disponible</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">Disponible</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <SchoolEmblem schoolId="journey-school" size="sm" />
                        <span>The Journey School</span>
                      </td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <SchoolEmblem schoolId="vittorino" size="sm" />
                        <span>Instituto Vittorino Prep</span>
                      </td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <SchoolEmblem schoolId="educarte" size="sm" />
                        <span>Educarte High School</span>
                      </td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">Por confirmar</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Asignación práctica por disciplina deportiva */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Traducción Práctica por Deporte e Instituciones
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Fútbol */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">⚽ Fútbol (Fem, C, D)</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Por rifar</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Participantes:</strong> CRIA, La Paz Cabo Velas, La Paz Tempisque, Vittorino, Journey.
                  </p>
                  <p className="text-[10.5px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200">
                    📍 <strong>Sedes elegibles:</strong> Campus Cabo Velas / Tempisque y colegios con cancha de fútbol habilitada.
                  </p>
                </div>

                {/* Voleibol */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">🏐 Voleibol (C y D Fem)</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Por rifar</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Participantes:</strong> Journey, Educarte, Vittorino, La Paz Cabo Velas.
                  </p>
                  <p className="text-[10.5px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200">
                    📍 <strong>Sedes elegibles:</strong> Gimnasios techados y canchas reglamentarias multiuso de los colegios inscritos.
                  </p>
                </div>

                {/* Baloncesto */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">🏀 Baloncesto (C y D)</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Por rifar</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Participantes:</strong> CRIA, La Paz Cabo Velas, La Paz Tempisque, Educarte, Journey.
                  </p>
                  <p className="text-[10.5px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200">
                    📍 <strong>Sedes elegibles:</strong> Canchas con tableros oficiales y mesa de control técnico de las sedes registradas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⚽ SECCIÓN 3: DISCIPLINAS OFICIALES Y DÍAS DE COMPETENCIA */}
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
                <span>Disciplinas Oficiales y Cronograma Semanal</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Lunes a Viernes
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Fútbol (Lun-Mié), Voleibol (Jue) y Baloncesto (Vie)
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
                      <span className="text-[10px] font-semibold text-emerald-800">Lunes, Martes y Miércoles</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Fase de Grupos
                  </span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li><strong>Lunes:</strong> Fútbol Femenino Abierto</li>
                  <li><strong>Martes:</strong> Fútbol Categoría C (2012-2014)</li>
                  <li><strong>Miércoles:</strong> Fútbol Categoría D (2009-2011)</li>
                </ul>
              </div>

              {/* Tarjeta Voleibol */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="voleibol" size={32} />
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">Voleibol</span>
                      <span className="text-[10px] font-semibold text-sky-800">Jueves</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-sky-800 text-[10px] font-bold border border-sky-200">
                    Gimnasio Techado
                  </span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li><strong>Jueves:</strong> Voleibol Femenino Categoría C</li>
                  <li><strong>Jueves:</strong> Voleibol Femenino Categoría D</li>
                  <li>Al mejor de 3 sets (25 pts cada uno)</li>
                </ul>
              </div>

              {/* Tarjeta Baloncesto */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="baloncesto" size={32} />
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">Baloncesto</span>
                      <span className="text-[10px] font-semibold text-orange-800">Viernes</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-orange-800 text-[10px] font-bold border border-orange-200">
                    Cancha Multiuso
                  </span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li><strong>Viernes:</strong> Baloncesto Categoría C</li>
                  <li><strong>Viernes:</strong> Baloncesto Categoría D</li>
                  <li>4 periodos con reloj oficial y mesa técnica</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🏄 SECCIÓN 3: PRÓXIMAS MODALIDADES EN PREPARACIÓN (CON CANDADO 🔒) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('upcomingSports')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Próximas Modalidades Deportivas</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>En Preparación</span>
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Surfing, Ajedrez, Atletismo de Playa y Natación en Aguas Abiertas (Se habilitarán posteriormente)
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            {openSections.upcomingSports ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.upcomingSports && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Surfing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="surfing" size={26} />
                    <span className="font-bold text-xs text-slate-900">Surfing</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Festival de olas y maniobras en Playa Tamarindo. Se habilitará posteriormente.
                </p>
              </div>

              {/* Ajedrez */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="ajedrez" size={26} />
                    <span className="font-bold text-xs text-slate-900">Ajedrez</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Torneo de ajedrez rápido y clásico. Se habilitará en la siguiente fase.
                </p>
              </div>

              {/* Atletismo */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="atletismo" size={26} />
                    <span className="font-bold text-xs text-slate-900">Atletismo</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pruebas de pista y arena en Playa Brasilito. En fase de coordinación.
                </p>
              </div>

              {/* Natación */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SportIconRenderer sportId="natacion" size={26} />
                    <span className="font-bold text-xs text-slate-900">Natación</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Travesía formativa en Bahía Flamingo. Próximamente disponible.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📅 SECCIÓN 4: FECHAS OFICIALES DE LOS 4 FESTIVALES */}
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
                <span>Fechas Oficiales de los 4 Festivales</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Octubre - Noviembre 2026
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cronograma exacto de las 3 jornadas clasificatorias y la gran final
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
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[9.5px] font-black">
                  🔹 1.ª Jornada
                </span>
                <h4 className="font-black text-xs text-slate-900">5 al 9 de Octubre</h4>
                <p className="text-[11px] text-slate-600">
                  15 partidos inaugurales en todas las disciplinas.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[9.5px] font-black">
                  🔹 2.ª Jornada
                </span>
                <h4 className="font-black text-xs text-slate-900">2 al 6 de Noviembre</h4>
                <p className="text-[11px] text-slate-600">
                  14 partidos de rotación inter-sedes.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 text-[9.5px] font-black">
                  🔹 3.ª Jornada
                </span>
                <h4 className="font-black text-xs text-slate-900">16 al 20 de Noviembre</h4>
                <p className="text-[11px] text-slate-600">
                  14 partidos de definición de grupos y clasificación.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-300 space-y-1 ring-1 ring-emerald-400/20">
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[9.5px] font-black flex items-center gap-1 w-fit">
                  <Award className="w-3 h-3 text-emerald-800" />
                  🏆 GRANDES FINALES
                </span>
                <h4 className="font-black text-xs text-slate-900">23 al 27 de Noviembre</h4>
                <p className="text-[11px] text-slate-700">
                  Finales por categoría, tercer puesto y ceremonia de premiación.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🤝 SECCIÓN 5: FILOSOFÍA FORMATIVA Y REGLAMENTO */}
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
                Respeto arbitral, apoyo familiar positivo y sostenibilidad
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
                  <span>3. Sostenibilidad en Cancha</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Estaciones de hidratación para botellas reutilizables y cero plásticos de un solo uso.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
