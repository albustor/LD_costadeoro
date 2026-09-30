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
  CheckCircle2,
  Leaf,
  Award
} from 'lucide-react';

interface EventGeneralInfoCardsProps {
  schools: School[];
}

export function EventGeneralInfoCards({ schools }: EventGeneralInfoCardsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    schools: false,
    venues: false,
    sports: false,
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
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* 📊 TARJETAS MÉTRICAS RESUMIDAS SUPERIORES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">6</span>
          <span className="text-xs sm:text-sm text-slate-700 font-bold">Instituciones oficiales</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">3</span>
          <span className="text-xs sm:text-sm text-slate-600 font-bold">Disciplinas base</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">4</span>
          <span className="text-xs sm:text-sm text-slate-600 font-bold">Festivales oficiales</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono block">43+</span>
          <span className="text-xs sm:text-sm text-slate-600 font-bold">Partidos programados</span>
        </div>
      </div>

      {/* 🏫 SECCIÓN 1: INSTITUCIONES PARTICIPANTES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('schools')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>Instituciones participantes</span>
              </h3>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
            {openSections.schools ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openSections.schools && (
          <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {schools.map((school) => {
                const isSelected = expandedSchoolId === school.id;
                const mascot = 
                  school.id === 'la-paz-cabo-velas'
                    ? 'Tiburones (Sharks) 🦈 (Fundado 2007)'
                    : school.id === 'la-paz-tempisque'
                    ? 'Pumas 🐾 (Fundado 2021)'
                    : school.id === 'cria'
                    ? 'CRIA Oficial (Fundado 2000)'
                    : school.id === 'journey-school'
                    ? 'The Journey School (Fundado 2015)'
                    : school.id === 'vittorino'
                    ? 'Centro Educativo Vittorino Girardi (Fundado 2012)'
                    : 'Educarte High (Fundado 2008)';

                const sportParticipation = 
                  school.id === 'la-paz-cabo-velas'
                    ? 'Fútbol (Fem, C, D) • Voleibol (C, D) • Baloncesto (C, D)'
                    : school.id === 'la-paz-tempisque'
                    ? 'Fútbol (Fem, C, D) • Baloncesto (C, D)'
                    : school.id === 'cria'
                    ? 'Fútbol (Fem, C, D) • Baloncesto (D)'
                    : school.id === 'journey-school'
                    ? 'Fútbol (C) • Voleibol (C, D) • Baloncesto (D)'
                    : school.id === 'vittorino'
                    ? 'Fútbol (Fem, C, D) • Voleibol (C, D)'
                    : 'Voleibol (C, D) • Baloncesto (C)';

                return (
                  <div
                    key={school.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                        : 'bg-white hover:bg-amber-50/30 border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSchoolId(isSelected ? null : school.id)}
                      className="w-full flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer"
                      aria-expanded={isSelected}
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 group-hover:border-amber-400 flex items-center justify-center p-2.5 shadow-2xs group-hover:scale-105 transition-all">
                        <SchoolEmblem schoolId={school.id} size="md" showBorder={false} />
                      </div>

                      <span className="font-black text-sm sm:text-base text-slate-900 group-hover:text-amber-900 transition-colors leading-snug">
                        {school.shortName || school.name}
                      </span>

                      <span className="text-xs sm:text-sm text-slate-600 font-semibold line-clamp-1">
                        {school.city} • {mascot}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mt-1">
                        <span>{isSelected ? 'Contraer información' : 'Ver detalles completos'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isSelected && (
                      <div className="w-full pt-3 mt-3 border-t border-amber-200/80 text-left text-xs sm:text-sm text-slate-700 space-y-2.5 animate-fade-in">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-extrabold uppercase block tracking-wider">Ubicación y Mascota</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{school.location}, {school.city} • {mascot}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-extrabold uppercase block tracking-wider">Modalidades Inscritas</span>
                          <span className="font-bold text-slate-900 block mt-0.5 leading-snug">{sportParticipation}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Inscripción confirmada</span>
                          </span>
                          <Link
                            href="/colegios"
                            className="px-3 py-1.5 bg-slate-950 text-amber-300 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1 hover:bg-slate-900 shadow-2xs"
                          >
                            <span>Ver perfil</span>
                            <ChevronRight className="w-3.5 h-3.5" />
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

      {/* 📍 SECCIÓN 2: SEDES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('venues')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Sedes
              </h3>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
            {openSections.venues ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openSections.venues && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-4">
            {/* Explicación del mecanismo oficial de rifas */}
            <div className="p-4 sm:p-5 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Reglamento oficial de asignación de sedes (Liga Costa de Oro 2026)</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Cada <strong>festival diario</strong> se disputa en una <strong>sola sede central</strong>. Las sedes se asignan por rifa rotativa entre los colegios que ofrecen instalaciones. Una sede no repite hasta que todas las instituciones con cancha hayan sido anfitrionas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs sm:text-sm space-y-1">
                  <strong className="text-slate-900 block font-bold">1. Oferta de canchas</strong>
                  <span className="text-slate-600">Cada institución confirma su disponibilidad de fútbol, baloncesto y voleibol.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs sm:text-sm space-y-1">
                  <strong className="text-slate-900 block font-bold">2. Rifa de grupos (15 fechas)</strong>
                  <span className="text-slate-600">Se rifan las fechas de J1, J2 y J3 sin repetir sede hasta completar la rotación.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs sm:text-sm space-y-1">
                  <strong className="text-slate-900 block font-bold">3. Grandes finales (5 fechas)</strong>
                  <span className="text-slate-600">Se rifan al finalizar la J3 o se celebran en sede neutral acordada.</span>
                </div>
              </div>
            </div>

            {/* Matriz detallada de canchas por colegio */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
                Estado de instalaciones por institución
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-extrabold">
                      <th className="py-3 px-3.5">Institución</th>
                      <th className="py-3 px-3.5">Cancha de fútbol</th>
                      <th className="py-3 px-3.5">Cancha de baloncesto</th>
                      <th className="py-3 px-3.5">Cancha de voleibol</th>
                      <th className="py-3 px-3.5 text-right">Estado de rifa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="cria" size="sm" />
                        <div>
                          <span className="block font-extrabold">Costa Rica International Academy</span>
                          <span className="block text-xs text-slate-500 font-normal">Playa Flamingo</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">No aplica</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="la-paz-cabo-velas" size="sm" />
                        <div>
                          <span className="block font-extrabold">La Paz Community School - Cabo Velas</span>
                          <span className="block text-xs text-slate-500 font-normal">Brasilito • Tiburones (Sharks) 🦈 (2007)</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">Disponible</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">Disponible</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">Disponible</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="la-paz-tempisque" size="sm" />
                        <div>
                          <span className="block font-extrabold">La Paz Community School - Tempisque</span>
                          <span className="block text-xs text-slate-500 font-normal">Comunidad, Carrillo • Pumas 🐾 (2021)</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">Disponible</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">Disponible</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">No aplica</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="journey-school" size="sm" />
                        <div>
                          <span className="block font-extrabold">The Journey School</span>
                          <span className="block text-xs text-slate-500 font-normal">Tamarindo</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="vittorino" size="sm" />
                        <div>
                          <span className="block font-extrabold">Centro Educativo Vittorino Girardi</span>
                          <span className="block text-xs text-slate-500 font-normal">Huacas</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">No aplica</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <SchoolEmblem schoolId="educarte" size="sm" />
                        <div>
                          <span className="block font-extrabold">Educarte Bilingual High School</span>
                          <span className="block text-xs text-slate-500 font-normal">Tamarindo</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">No aplica</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Por confirmar</span></td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                          🎲 Pendiente de rifa
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Asignación por jornada */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
                Estado por jornada
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">1.ª jornada</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900">5 al 9 oct</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">15 partidos en todas las disciplinas. Sede pendiente de rifa.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">2.ª jornada</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900">2 al 6 nov</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">14 partidos de rotación. Sede pendiente de rifa.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">3.ª jornada</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-100 text-purple-900">16 al 20 nov</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">14 partidos de definición. Sede pendiente de rifa.</p>
                </div>

                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-emerald-950">🏆 Finales</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-200 text-emerald-950">23 al 27 nov</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold">Grandes finales en sede neutral o rifa post J3.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⚽ SECCIÓN 3: DISCIPLINAS Y CRONOGRAMA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('sports')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 shadow-2xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Disciplinas y cronograma
              </h3>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
            {openSections.sports ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openSections.sports && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Fútbol */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SportIconRenderer sportId="futbol" size={36} />
                    <div>
                      <span className="font-black text-sm sm:text-base text-slate-900 block">Fútbol</span>
                      <span className="text-xs font-bold text-emerald-800">Lunes, martes y miércoles</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                    Fase de grupos
                  </span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium">
                  <li><strong>Lunes:</strong> Fútbol femenino abierto</li>
                  <li><strong>Martes:</strong> Fútbol categoría C (2012-2014)</li>
                  <li><strong>Miércoles:</strong> Fútbol categoría D (2009-2011)</li>
                </ul>
              </div>

              {/* Voleibol */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SportIconRenderer sportId="voleibol" size={36} />
                    <div>
                      <span className="font-black text-sm sm:text-base text-slate-900 block">Voleibol</span>
                      <span className="text-xs font-bold text-sky-800">Jueves</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-sky-800 text-xs font-bold border border-sky-200 shadow-2xs">
                    Gimnasio techado
                  </span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium">
                  <li><strong>Jueves:</strong> Voleibol femenino categoría C</li>
                  <li><strong>Jueves:</strong> Voleibol femenino categoría D</li>
                  <li>Al mejor de 3 sets (25 pts cada uno)</li>
                </ul>
              </div>

              {/* Baloncesto */}
              <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SportIconRenderer sportId="baloncesto" size={36} />
                    <div>
                      <span className="font-black text-sm sm:text-base text-slate-900 block">Baloncesto</span>
                      <span className="text-xs font-bold text-orange-800">Viernes</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
                    Cancha multiuso
                  </span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium">
                  <li><strong>Viernes:</strong> Baloncesto categoría C</li>
                  <li><strong>Viernes:</strong> Baloncesto categoría D</li>
                  <li>4 periodos con reloj oficial y mesa técnica</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📅 SECCIÓN 4: FECHAS OFICIALES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('festivals')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Fechas oficiales
              </h3>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
            {openSections.festivals ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openSections.festivals && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-xs font-black">
                  🔹 1.ª jornada
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900">5 al 9 de octubre</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  15 partidos inaugurales en todas las disciplinas.
                </p>
              </div>

              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-200/90 text-blue-950 text-xs font-black">
                  🔹 2.ª jornada
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900">2 al 6 de noviembre</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  14 partidos de rotación inter-sedes.
                </p>
              </div>

              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-200/90 text-purple-950 text-xs font-black">
                  🔹 3.ª jornada
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900">16 al 20 de noviembre</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  14 partidos de definición de grupos y clasificación.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-1.5 ring-1 ring-emerald-400/30">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-xs font-black flex items-center gap-1.5 w-fit">
                  <Award className="w-3.5 h-3.5 text-emerald-800" />
                  🏆 GRANDES FINALES
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900">23 al 27 de noviembre</h4>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  Finales por categoría, tercer puesto y ceremonia de premiación.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🤝 SECCIÓN 5: NORMAS DE CONVIVENCIA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection('philosophy')}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 shadow-2xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Normas de convivencia
              </h3>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
            {openSections.philosophy ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openSections.philosophy && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-sm text-slate-900 block">1. Apoyo positivo familiar</span>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Alentamos con respeto a todos los atletas y valoramos las decisiones arbitrales.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-sm text-slate-900 block">2. Inclusión y formación</span>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  La experiencia de los estudiantes y el aprendizaje están por encima del marcador.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>3. Sostenibilidad en cancha</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
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
