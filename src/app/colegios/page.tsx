'use client';

import React, { useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { MatchCard } from '@/components/sports/MatchCard';
import { SchoolEmblem } from '@/components/sports/SchoolEmblem';
import { Shield, MapPin, Calendar } from 'lucide-react';

export default function ColegiosPage() {
  const { schools, matches } = useTournament();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');

  const activeSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const schoolMatches = matches.filter(
    (m) => m.homeTeamId === activeSchool.id || m.awayTeamId === activeSchool.id
  );

  const completedMatches = schoolMatches.filter((m) => m.status === 'completed');
  const wins = completedMatches.filter((m) => {
    if (m.homeTeamId === activeSchool.id && m.homeScore > m.awayScore) return true;
    if (m.awayTeamId === activeSchool.id && m.awayScore > m.homeScore) return true;
    return false;
  }).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-amber-600" />
          <span>Instituciones Educativas Participantes</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perfiles deportivos, sedes y seguimiento de los 6 colegios de la Liga Costa de Oro 2026
        </p>
      </div>

      {/* School Selector Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {schools.map((s) => {
          const isSelected = s.id === activeSchool.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSchoolId(s.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 shadow-sm ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <SchoolEmblem schoolId={s.id} size="md" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 font-bold text-amber-700">
                  {s.acronym}
                </span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-xs truncate">{s.shortName}</span>
                <span className="block text-[10px] text-slate-500 truncate">{s.city}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active School Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner with school identity */}
        <div className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SchoolEmblem schoolId={activeSchool.id} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {activeSchool.acronym}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Fundado en {activeSchool.founded || 2010}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {activeSchool.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{activeSchool.location}, {activeSchool.city}</span>
              </p>
            </div>
          </div>


          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="block text-lg font-black text-amber-600 font-mono">{schoolMatches.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Partidos</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="block text-lg font-black text-emerald-600 font-mono">{wins}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Victorias</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="block text-lg font-black text-slate-800 font-mono">7</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Disciplinas</span>
            </div>
          </div>
        </div>

        {/* Matches of this School */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Historial y Próximos Encuentros de {activeSchool.shortName}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {schoolMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

