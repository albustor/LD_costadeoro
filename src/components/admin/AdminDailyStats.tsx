'use client';

import React, { useState, useEffect } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { 
  BarChart3, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Users, 
  Flame, 
  Clock, 
  Calendar, 
  Download, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Activity
} from 'lucide-react';
import { 
  generateDailyReportMessage, 
  DailyReportData, 
  getWhatsAppDirectUrl 
} from '@/lib/evolutionApi';
import { calculateStandings } from '@/lib/sportsEngine';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';

export function AdminDailyStats() {
  const { matches, familyPosts, schools } = useTournament();
  const [selectedJornada, setSelectedJornada] = useState<number>(1);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string; waUrl?: string } | null>(null);

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const scheduledMatches = matches.filter((m) => m.status === 'scheduled' || m.status === 'live');

  // Calcular líderes por deporte
  const standingsFutbol = calculateStandings('cat-fem-futbol', 'futbol', matches, schools);
  const standingsVoley = calculateStandings('cat-fem-c-voley', 'voleibol', matches, schools);
  const standingsBasket = calculateStandings('cat-c-basket', 'baloncesto', matches, schools);

  const totalGoals = matches.filter((m) => m.sport === 'futbol' && m.status === 'completed').reduce((sum: number, m) => sum + m.homeScore + m.awayScore, 0);
  const totalBasketPoints = matches.filter((m) => m.sport === 'baloncesto' && m.status === 'completed').reduce((sum: number, m) => sum + m.homeScore + m.awayScore, 0);
  const totalSets = matches.filter((m) => m.sport === 'voleibol' && m.status === 'completed').reduce((sum: number, m) => sum + (m.homeSetsWon || 0) + (m.awaySetsWon || 0), 0);
  const totalApplause = familyPosts.reduce((sum: number, p) => sum + (p.likesCount || 0) + (p.applauseCount || 0), 0);

  const nowCR = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

  const reportData: DailyReportData = {
    jornada: selectedJornada,
    completedMatches,
    upcomingMatches: scheduledMatches,
    standingsBySport: {
      futbol: standingsFutbol,
      voleibol: standingsVoley,
      baloncesto: standingsBasket,
    },
    totalPosts: familyPosts.length,
    totalApplause,
    dateStr: nowCR,
  };

  const previewMessage = generateDailyReportMessage(reportData);
  const donAlejandroPhone = '50660602617';
  const directWaUrl = getWhatsAppDirectUrl(donAlejandroPhone, previewMessage);

  const handleSendToDonAlejandro = async () => {
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/cron/reporte-diario-whatsapp', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.delivery?.evolutionApiSuccess) {
        setSendResult({
          success: true,
          message: '¡Reporte entregado exitosamente a Don Alejandro vía Evolution API (WhatsApp)!',
        });
      } else {
        // Fallback cuando no hay API key de servidor configurada en localhost
        setSendResult({
          success: true,
          message: 'Reporte generado listo. Puedes abrir WhatsApp Web para despacharlo directamente en 1 clic.',
          waUrl: directWaUrl,
        });
        window.open(directWaUrl, '_blank');
      }
    } catch (err: any) {
      setSendResult({
        success: false,
        message: `Error de conexión: ${err.message}. Abriendo WhatsApp Web de respaldo...`,
        waUrl: directWaUrl,
      });
      window.open(directWaUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 🏷️ CABECERA DE ESTADÍSTICAS DIARIAS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-extrabold text-xs uppercase tracking-wider">
                Control y Telemetría en Tiempo Real
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Sincronización en vivo</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-600" />
              <span>Estadísticas Diarias del Evento y Reporte Matutino</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
              Monitorea el avance de la jornada, marcadores en tiempo real y despacha el reporte de las 7:00 AM a Don Alejandro vía WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSendToDonAlejandro}
              disabled={isSending}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-emerald-500/30"
              title="Despachar reporte formal por WhatsApp a Don Alejandro"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Despachando...' : 'Enviar Reporte WhatsApp a Don Alejandro'}</span>
            </button>
          </div>
        </div>

        {/* 📊 TARJETAS DE MÉTRICAS GLOBALES DEL DÍA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Partidos Jugados</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{completedMatches.length}</span>
              <span className="text-xs text-slate-400 font-bold">/ {matches.length} totales</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-[11px] text-amber-800 font-bold uppercase block">⚽ Goles en Fútbol</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-950 font-mono block mt-0.5">{totalGoals}</span>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
            <span className="text-[11px] text-sky-800 font-bold uppercase block">🏐 Sets en Voleibol</span>
            <span className="text-2xl sm:text-3xl font-black text-sky-950 font-mono block mt-0.5">{totalSets}</span>
          </div>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <span className="text-[11px] text-orange-800 font-bold uppercase block">🏀 Puntos Baloncesto</span>
            <span className="text-2xl sm:text-3xl font-black text-orange-950 font-mono block mt-0.5">{totalBasketPoints}</span>
          </div>
        </div>
      </div>

      {/* 🥇 LÍDERES ACTUALES POR DISCIPLINA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
              <span>⚽</span> Líder Fútbol Femenino
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px]">
              {standingsFutbol[0]?.points || 0} pts
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900">
            {standingsFutbol[0]?.school?.name || 'Por definir'}
          </h3>
          <span className="text-xs text-slate-500 block">
            Diferencia de goles: {standingsFutbol[0]?.diff !== undefined && standingsFutbol[0].diff > 0 ? `+${standingsFutbol[0].diff}` : standingsFutbol[0]?.diff || 0}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-sky-800 flex items-center gap-1.5">
              <span>🏐</span> Líder Voleibol Femenino
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-mono font-bold text-[11px]">
              {standingsVoley[0]?.points || 0} pts
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900">
            {standingsVoley[0]?.school?.name || 'Por definir'}
          </h3>
          <span className="text-xs text-slate-500 block">
            Diferencial de sets: {standingsVoley[0]?.setsDiff !== undefined && standingsVoley[0].setsDiff > 0 ? `+${standingsVoley[0].setsDiff}` : standingsVoley[0]?.setsDiff || 0}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-orange-800 flex items-center gap-1.5">
              <span>🏀</span> Líder Baloncesto
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 font-mono font-bold text-[11px]">
              {standingsBasket[0]?.points || 0} pts
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900">
            {standingsBasket[0]?.school?.name || 'Por definir'}
          </h3>
          <span className="text-xs text-slate-500 block">
            Diferencial de puntos: {standingsBasket[0]?.diff !== undefined && standingsBasket[0].diff > 0 ? `+${standingsBasket[0].diff}` : standingsBasket[0]?.diff || 0}
          </span>
        </div>
      </div>

      {/* 📱 PREVISUALIZADOR DEL REPORTE EJECUTIVO PARA WHATSAPP (7:00 AM) */}
      <div className="bg-slate-950 rounded-3xl p-5 sm:p-7 border border-amber-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                Evolution API · WhatsApp Gateway
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Previsualización del Reporte Matutino (7:00 AM)
              </h3>
            </div>
          </div>

          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-all self-start sm:self-auto"
          >
            <span>Abrir en WhatsApp Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Feedback de Envío */}
        {sendResult && (
          <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
            sendResult.success ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border-rose-500 text-rose-200'
          }`}>
            {sendResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{sendResult.message}</span>
          </div>
        )}

        {/* Caja de Texto del Mensaje */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed select-all">
          {previewMessage}
        </div>
      </div>
    </div>
  );
}
