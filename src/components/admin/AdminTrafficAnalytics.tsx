'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Clock, 
  TrendingUp, 
  RefreshCw, 
  Activity, 
  Compass, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitorsCount: number;
  todayViews: number;
  todayVisitors: number;
  deviceDistribution: {
    mobile_ios: number;
    mobile_android: number;
    tablet: number;
    desktop: number;
  };
  viewsByRoute: Record<string, number>;
  dailyHistory: Array<{ date: string; views: number; visitors: number }>;
  hourlyToday: Record<string, number>;
  recentEvents: Array<{
    path: string;
    device: string;
    timestamp: string;
    referrer?: string;
  }>;
  updatedAt?: string;
}

const ROUTE_LABELS: Record<string, { name: string; category: string; icon: string }> = {
  '/': { name: 'Portada & Video Oficial', category: 'General', icon: '🏠' },
  '/calendario': { name: 'Calendario y Horarios', category: 'Deportes', icon: '📅' },
  '/colegios': { name: 'Ficha de Instituciones', category: 'Delegaciones', icon: '🏫' },
  '/deportes': { name: 'Disciplinas y Reglamento', category: 'Deportes', icon: '⚽' },
  '/mural': { name: 'Muro Familiar Comunitario', category: 'Comunidad', icon: '📸' },
  '/galeria': { name: 'Galería de Fotos y Videos', category: 'Multimedia', icon: '🖼️' },
  '/registro-nomina': { name: 'Portal de Acreditación PIN', category: 'Institucional', icon: '📋' },
  '/admin': { name: 'Panel de Administración', category: 'Mesa Técnica', icon: '⚙️' },
  '/tabla': { name: 'Tablas de Posiciones', category: 'Deportes', icon: '🏆' },
};

export function AdminTrafficAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dispatchingReport, setDispatchingReport] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<{
    success?: boolean;
    message?: string;
    deliveries?: Array<{ recipient: string; phone: string; success: boolean; directWhatsAppWebUrl?: string }>;
  } | null>(null);

  const handleSendDailyReportNow = async () => {
    setDispatchingReport(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/cron/reporte-diario-whatsapp', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setDispatchResult({
          success: true,
          message: 'Reporte diario matutino despachado con éxito al Comité de Soporte.',
          deliveries: json.deliveries,
        });
      } else {
        setDispatchResult({
          success: false,
          message: json.error || 'No se pudo completar el envío.',
          deliveries: json.deliveries,
        });
      }
    } catch (err: any) {
      setDispatchResult({
        success: false,
        message: err.message || 'Error de conexión con el servidor.',
      });
    } finally {
      setDispatchingReport(false);
    }
  };

  const handleSendWeeklyReportNow = async () => {
    setDispatchingReport(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/cron/reporte-semanal-whatsapp', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setDispatchResult({
          success: true,
          message: 'Reporte semanal ejecutivo despachado con éxito a Don Alejandro y soporte.',
          deliveries: json.deliveries,
        });
      } else {
        setDispatchResult({
          success: false,
          message: json.error || 'No se pudo completar el envío.',
          deliveries: json.deliveries,
        });
      }
    } catch (err: any) {
      setDispatchResult({
        success: false,
        message: err.message || 'Error de conexión con el servidor.',
      });
    } finally {
      setDispatchingReport(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.analytics) {
        setData(json.analytics);
      } else {
        throw new Error('Formato de datos no válido');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor de telemetría.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresco cada 30 segundos
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Cargando métricas de tráfico y flujo...</h3>
        <p className="text-xs text-slate-500">Consultando la telemetría en tiempo real del servidor.</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-3xl border border-rose-200 text-rose-800 space-y-3">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-sm font-bold">{error}</h3>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  const totalViews = data?.totalViews || 0;
  const uniqueVisitors = data?.uniqueVisitorsCount || 0;
  const todayViews = data?.todayViews || 0;
  const todayVisitors = data?.todayVisitors || 0;

  const devices = data?.deviceDistribution || { mobile_ios: 0, mobile_android: 0, tablet: 0, desktop: 0 };
  const totalDeviceHits = devices.mobile_ios + devices.mobile_android + devices.tablet + devices.desktop || 1;
  const mobileShare = Math.round(((devices.mobile_ios + devices.mobile_android) / totalDeviceHits) * 100);

  // Ordenar rutas por vistas
  const sortedRoutes = Object.entries(data?.viewsByRoute || {}).sort((a, b) => b[1] - a[1]);
  const maxRouteViews = sortedRoutes.length > 0 ? sortedRoutes[0][1] : 1;

  // Formatear horas de hoy (00:00 a 23:00)
  const hoursKeys = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const maxHourlyViews = Math.max(...hoursKeys.map((h) => data?.hourlyToday[h] || 0), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 🏷️ CABECERA DE TELEMETRÍA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Telemetría en Vivo</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Medición de impacto y audiencia</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              <span>Flujo de Usuarios e Impacto de la Plataforma</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
              Estadísticas exactas de visitas, usuarios únicos diarios, dispositivos móviles y secciones con mayor interés.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar datos</span>
            </button>
          </div>
        </div>

        {/* 📲 CONTROL DE DESPACHO MATUTINO WHATSAPP */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-400/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Canal Oficial de WhatsApp (Evolution API & Cron)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Despacho diario automático a las <strong>7:00 a.m.</strong> para <strong>Don Alejandro (Coordinador de Eventos · +506 8844-5486)</strong> y <strong>Comité de Soporte · Curiol Studio Admin (+506 6060-2617)</strong>.
            </p>
            {dispatchResult && (
              <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                dispatchResult.success ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
              }`}>
                {dispatchResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{dispatchResult.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSendDailyReportNow}
              disabled={dispatchingReport}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs border border-slate-700 transition shadow-xs cursor-pointer disabled:opacity-50"
              title="Despachar reporte diario con métricas del día al Comité de Soporte"
            >
              <Send className={`w-3.5 h-3.5 ${dispatchingReport ? 'animate-bounce' : ''}`} />
              <span>{dispatchingReport ? 'Despachando...' : 'Reporte Diario (Soporte)'}</span>
            </button>
            <button
              type="button"
              onClick={handleSendWeeklyReportNow}
              disabled={dispatchingReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md cursor-pointer disabled:opacity-50"
              title="Despachar informe ejecutivo resumido de los viernes para Don Alejandro"
            >
              <Sparkles className={`w-3.5 h-3.5 ${dispatchingReport ? 'animate-bounce' : ''}`} />
              <span>{dispatchingReport ? 'Despachando...' : 'Reporte Semanal (Don Alejandro)'}</span>
            </button>
            <a
              href="https://wa.me/50688445486"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition"
              title="Abrir chat directo con Don Alejandro (Coordinador de Eventos)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Don Alejandro</span>
            </a>
          </div>
        </div>

        {/* 📊 4 TARJETAS PRINCIPALES DE IMPACTO */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase">
              <span>Visitas Hoy</span>
              <Eye className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-4xl font-black text-emerald-950 font-mono">{todayViews}</span>
              <span className="text-[11px] text-emerald-700 font-bold">páginas</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
              {todayVisitors} usuarios únicos hoy
            </span>
          </div>

          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200">
            <div className="flex items-center justify-between text-sky-800 text-xs font-bold uppercase">
              <span>Visitas Totales</span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-4xl font-black text-sky-950 font-mono">{totalViews}</span>
              <span className="text-[11px] text-sky-700 font-bold">totales</span>
            </div>
            <span className="text-[10px] text-sky-800 font-semibold block mt-1">
              Acumulado en el torneo
            </span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase">
              <span>Usuarios Únicos</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-4xl font-black text-amber-950 font-mono">{uniqueVisitors}</span>
              <span className="text-[11px] text-amber-700 font-bold">personas</span>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold block mt-1">
              Sesiones diferenciadas
            </span>
          </div>

          <div className="p-4 bg-violet-50/70 rounded-2xl border border-violet-200">
            <div className="flex items-center justify-between text-violet-800 text-xs font-bold uppercase">
              <span>Audiencia Móvil</span>
              <Smartphone className="w-4 h-4 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-4xl font-black text-violet-950 font-mono">{mobileShare}%</span>
              <span className="text-[11px] text-violet-700 font-bold">smartphones</span>
            </div>
            <span className="text-[10px] text-violet-800 font-semibold block mt-1">
              iOS y Android prioritarios
            </span>
          </div>
        </div>
      </div>

      {/* 📱 DISTRIBUCIÓN POR DISPOSITIVO Y PÁGINAS MÁS POPULARES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarjeta 1: Ranking de Secciones Más Visitadas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Secciones con Mayor Tráfico
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">Páginas Vistas</span>
          </div>

          <div className="space-y-3">
            {sortedRoutes.map(([route, count]) => {
              const meta = ROUTE_LABELS[route] || { name: route, category: 'Sección', icon: '📄' };
              const percent = maxRouteViews > 0 ? Math.round((count / maxRouteViews) * 100) : 0;

              return (
                <div key={route} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm">{meta.icon}</span>
                      <span className="font-bold text-slate-900 truncate">{meta.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({route})</span>
                    </div>
                    <span className="font-mono font-black text-slate-900 shrink-0">{count}</span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarjeta 2: Distribución por Dispositivo y Plataforma */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Dispositivos y Plataformas
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">Distribución</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">iPhone / iOS</span>
                <Smartphone className="w-4 h-4 text-slate-700" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900 font-mono">{devices.mobile_ios}</div>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {Math.round((devices.mobile_ios / totalDeviceHits) * 100)}% del total
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Android</span>
                <Smartphone className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-emerald-950 font-mono">{devices.mobile_android}</div>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {Math.round((devices.mobile_android / totalDeviceHits) * 100)}% del total
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800">Escritorio / PC</span>
                <Monitor className="w-4 h-4 text-sky-700" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-sky-950 font-mono">{devices.desktop}</div>
                <span className="text-[10px] text-sky-700 font-semibold">
                  {Math.round((devices.desktop / totalDeviceHits) * 100)}% del total
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-800">Tablets / iPads</span>
                <Tablet className="w-4 h-4 text-violet-700" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-violet-950 font-mono">{devices.tablet}</div>
                <span className="text-[10px] text-violet-700 font-semibold">
                  {Math.round((devices.tablet / totalDeviceHits) * 100)}% del total
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Telemetría anónima y privada sin rastreo invasivo ni cookies de terceros.</span>
          </div>
        </div>
      </div>

      {/* ⏱️ MAPA DE ACTIVIDAD POR HORA (HOY) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Actividad e Ingresos por Hora (Costa Rica)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">24 Horas</span>
        </div>

        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 items-end h-28 pt-4 pb-2">
          {hoursKeys.map((hour) => {
            const count = data?.hourlyToday[hour] || 0;
            const heightPercent = maxHourlyViews > 0 ? Math.round((count / maxHourlyViews) * 100) : 0;

            return (
              <div key={hour} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip con valor */}
                <div className="absolute -top-7 hidden group-hover:flex px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-mono rounded-md shadow-md whitespace-nowrap z-10">
                  {hour}: {count}
                </div>

                {/* Barra vertical */}
                <div
                  className={`w-full rounded-t-md transition-all ${
                    count > 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-100'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                />

                <span className="text-[8px] text-slate-400 font-mono mt-1 hidden sm:block">
                  {hour.split(':')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📋 BITÁCORA DE INGRESOS EN TIEMPO REAL */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Bitácora de Ingresos Recientes ({data?.recentEvents.length || 0})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Últimos accesos</span>
        </div>

        {(!data?.recentEvents || data.recentEvents.length === 0) ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Esperando primeros ingresos de usuarios...
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {data.recentEvents.map((evt, idx) => {
              const meta = ROUTE_LABELS[evt.path] || { name: evt.path, icon: '📄' };
              const timeStr = new Date(evt.timestamp).toLocaleTimeString('es-CR', {
                timeZone: 'America/Costa_Rica',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between text-xs transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">{meta.icon}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{meta.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {evt.device} · Referido: {evt.referrer || 'Directo'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0 ml-2">
                    {timeStr}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
