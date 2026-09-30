'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ArrowLeft,
  Grid,
  Copy,
  Check
} from 'lucide-react';

const AVAILABLE_ROUTES = [
  { path: '/', label: '🏠 Inicio (Portal)' },
  { path: '/tabla', label: '📊 Posiciones por Deporte' },
  { path: '/calendario', label: '📅 Deportes y Horarios' },
  { path: '/mural', label: '📸 Muro Familiar' },
  { path: '/colegios', label: '🏫 Colegios Participantes' },
  { path: '/admin', label: '⚙️ Panel Administrador' },
];

function PreviewContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') as 'all' | 'mobile' | 'tablet' | 'laptop' | null;

  const [currentPath, setCurrentPath] = useState<string>('/');
  const [customPathInput, setCustomPathInput] = useState<string>('/');
  const [globalZoom, setGlobalZoom] = useState<number>(0.65);
  const [viewMode, setViewMode] = useState<'all' | 'mobile' | 'tablet' | 'laptop'>(initialMode || 'all');
  const [backdropTheme, setBackdropTheme] = useState<'studio' | 'blueprint' | 'dark' | 'light'>('studio');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [localIpUrl, setLocalIpUrl] = useState<string>('http://192.168.137.1:3000');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Individual device orientations
  const [mobileLandscape, setMobileLandscape] = useState<boolean>(false);
  const [tabletLandscape, setTabletLandscape] = useState<boolean>(false);
  const [laptopResolution, setLaptopResolution] = useState<{ width: number; height: number }>({
    width: 1366,
    height: 768,
  });

  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const tabletIframeRef = useRef<HTMLIFrameElement>(null);
  const laptopIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = window.location.port ? `:${window.location.port}` : '';
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setLocalIpUrl(`http://192.168.137.1${port}${currentPath}`);
      } else {
        setLocalIpUrl(`${window.location.origin}${currentPath}`);
      }
    }
  }, [currentPath]);

  // Adjust zoom automatically if focusing on solo device
  useEffect(() => {
    if (viewMode === 'mobile') setGlobalZoom(0.75);
    else if (viewMode === 'tablet') setGlobalZoom(0.68);
    else if (viewMode === 'laptop') setGlobalZoom(0.65);
    else setGlobalZoom(0.55);
  }, [viewMode]);

  // Sync route input with selection
  const handleRouteChange = (newPath: string) => {
    setCurrentPath(newPath);
    setCustomPathInput(newPath);
  };

  const handleCustomPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = customPathInput.trim();
    if (!target.startsWith('/')) {
      target = '/' + target;
    }
    setCurrentPath(target);
  };

  const handleGlobalRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenPopout = () => {
    if (typeof window !== 'undefined') {
      window.open(currentPath, '_blank');
    }
  };

  const handleCopyIp = () => {
    navigator.clipboard.writeText(localIpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dimensions
  const mobileWidth = mobileLandscape ? 844 : 390;
  const mobileHeight = mobileLandscape ? 390 : 844;

  const tabletWidth = tabletLandscape ? 1180 : 820;
  const tabletHeight = tabletLandscape ? 820 : 1180;

  const laptopWidth = laptopResolution.width;
  const laptopHeight = laptopResolution.height;

  // Background style helper
  const getBackdropClass = () => {
    switch (backdropTheme) {
      case 'blueprint':
        return 'bg-[#0a192f] bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] text-white';
      case 'dark':
        return 'bg-slate-950 text-white';
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'studio':
      default:
        return 'bg-[#0c101d] bg-[linear-gradient(to_right,#161f36_1px,transparent_1px),linear-gradient(to_bottom,#161f36_1px,transparent_1px)] [background-size:32px_32px] text-white';
    }
  };

  const qrCodeImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    localIpUrl
  )}&margin=10&color=0f172a&bgcolor=ffffff`;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col h-screen w-screen overflow-hidden select-none font-sans ${getBackdropClass()}`}>
      
      {/* TOP CONTROLLER BAR */}
      <header className="shrink-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-sm z-50">
        
        {/* Left Brand & Quick Back */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold transition-all border border-amber-500/20 shadow-sm text-xs"
            title="Volver a la aplicación"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la App</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md font-black text-xs">
              3V
            </div>
            <div>
              <div className="font-bold text-white text-xs leading-none flex items-center gap-1.5">
                <span>Multi-Device Studio</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-mono border border-emerald-500/30">
                  Localhost
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Celular • Tableta • Portátil</p>
            </div>
          </div>
        </div>

        {/* Center: Route Selector & Custom URL */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative">
            <select
              value={currentPath}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none font-medium"
            >
              {AVAILABLE_ROUTES.map((route) => (
                <option key={route.path} value={route.path}>
                  {route.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <form onSubmit={handleCustomPathSubmit} className="flex-1 flex items-center gap-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={customPathInput}
                onChange={(e) => setCustomPathInput(e.target.value)}
                placeholder="/ruta-personalizada"
                className="w-full bg-slate-950/70 text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
            >
              Ir
            </button>
          </form>
        </div>

        {/* Right: Zoom Controls & Theme */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setGlobalZoom((z) => Math.max(0.35, +(z - 0.05).toFixed(2)))}
              className="text-slate-400 hover:text-white"
              title="Alejar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.35"
              max="1.0"
              step="0.05"
              value={globalZoom}
              onChange={(e) => setGlobalZoom(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
            />
            <button
              onClick={() => setGlobalZoom((z) => Math.min(1.0, +(z + 0.05).toFixed(2)))}
              className="text-slate-400 hover:text-white"
              title="Acercar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-amber-400 w-9 text-right font-semibold">
              {Math.round(globalZoom * 100)}%
            </span>
          </div>

          <button
            onClick={() => {
              const themes: ('studio' | 'blueprint' | 'dark' | 'light')[] = ['studio', 'blueprint', 'dark', 'light'];
              const next = themes[(themes.indexOf(backdropTheme) + 1) % themes.length];
              setBackdropTheme(next);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title={`Fondo: ${backdropTheme}. Clic para cambiar`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT STAGE */}
      <main className="flex-1 overflow-x-auto overflow-y-auto p-6 flex items-start justify-center">
        <div
          className={`flex items-start justify-center gap-10 transition-all duration-300 pb-24 pt-2 ${
            viewMode === 'all' ? 'flex-nowrap' : 'flex-wrap'
          }`}
          style={{
            minWidth: viewMode === 'all' ? `${(mobileWidth + tabletWidth + laptopWidth) * globalZoom + 160}px` : 'auto',
          }}
        >
          {/* 1. CELULAR / SMARTPHONE */}
          {(viewMode === 'all' || viewMode === 'mobile') && (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center justify-between w-full max-w-[390px] px-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Celular Móvil</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    {mobileWidth} × {mobileHeight} px
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMobileLandscape(!mobileLandscape)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition border border-slate-700"
                    title="Girar orientación"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === 'mobile' ? 'all' : 'mobile')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition border border-slate-700"
                    title="Enfocar vista móvil"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: `${mobileWidth * globalZoom}px`,
                  height: `${mobileHeight * globalZoom}px`,
                }}
                className="relative shrink-0 transition-all duration-300"
              >
                <div
                  style={{
                    width: `${mobileWidth}px`,
                    height: `${mobileHeight}px`,
                    transform: `scale(${globalZoom})`,
                    transformOrigin: 'top left',
                  }}
                  className="relative rounded-[48px] bg-slate-900 p-3 ring-1 ring-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-800"
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                    <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                    </div>
                  </div>

                  <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative shadow-inner">
                    <iframe
                      key={`mobile-${refreshKey}-${currentPath}`}
                      ref={mobileIframeRef}
                      src={currentPath}
                      title="Vista Móvil"
                      className="w-full h-full border-0 bg-white"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-30" />
                </div>
              </div>
            </div>
          )}

          {/* 2. TABLETA (TABLET) */}
          {(viewMode === 'all' || viewMode === 'tablet') && (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center justify-between w-full max-w-[820px] px-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Tableta</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    {tabletWidth} × {tabletHeight} px
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTabletLandscape(!tabletLandscape)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition border border-slate-700"
                    title="Girar orientación"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === 'tablet' ? 'all' : 'tablet')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition border border-slate-700"
                    title="Enfocar vista tableta"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: `${tabletWidth * globalZoom}px`,
                  height: `${tabletHeight * globalZoom}px`,
                }}
                className="relative shrink-0 transition-all duration-300"
              >
                <div
                  style={{
                    width: `${tabletWidth}px`,
                    height: `${tabletHeight}px`,
                    transform: `scale(${globalZoom})`,
                    transformOrigin: 'top left',
                  }}
                  className="relative rounded-[36px] bg-slate-900 p-4 ring-1 ring-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[8px] border-slate-800"
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 ring-1 ring-slate-600 z-30" />

                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-white relative shadow-inner">
                    <iframe
                      key={`tablet-${refreshKey}-${currentPath}`}
                      ref={tabletIframeRef}
                      src={currentPath}
                      title="Vista Tableta"
                      className="w-full h-full border-0 bg-white"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-40 h-1 bg-slate-600 rounded-full z-30" />
                </div>
              </div>
            </div>
          )}

          {/* 3. PORTÁTIL / LAPTOP */}
          {(viewMode === 'all' || viewMode === 'laptop') && (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center justify-between w-full max-w-[1366px] px-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Portátil (Laptop)</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    {laptopWidth} × {laptopHeight} px
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setLaptopResolution((prev) =>
                        prev.width === 1366
                          ? { width: 1440, height: 900 }
                          : prev.width === 1440
                          ? { width: 1280, height: 800 }
                          : { width: 1366, height: 768 }
                      )
                    }
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700 text-[10px] font-mono"
                  >
                    Res: {laptopWidth}p
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === 'laptop' ? 'all' : 'laptop')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700"
                    title="Enfocar vista portátil"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: `${laptopWidth * globalZoom}px`,
                  height: `${(laptopHeight + 60) * globalZoom}px`,
                }}
                className="relative shrink-0 transition-all duration-300"
              >
                <div
                  style={{
                    width: `${laptopWidth}px`,
                    height: `${laptopHeight + 60}px`,
                    transform: `scale(${globalZoom})`,
                    transformOrigin: 'top left',
                  }}
                  className="relative flex flex-col items-center"
                >
                  <div
                    style={{ width: `${laptopWidth}px`, height: `${laptopHeight}px` }}
                    className="relative rounded-t-[20px] bg-slate-900 pt-7 px-4 pb-4 ring-1 ring-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] border-[4px] border-b-0 border-slate-800 flex flex-col"
                  >
                    <div className="absolute top-2 left-4 flex items-center gap-1.5 z-30">
                      <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        localhost:3000{currentPath}
                      </span>
                    </div>

                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-700 z-30" />

                    <div className="w-full h-full rounded-md overflow-hidden bg-white relative shadow-inner">
                      <iframe
                        key={`laptop-${refreshKey}-${currentPath}`}
                        ref={laptopIframeRef}
                        src={currentPath}
                        title="Vista Portátil"
                        className="w-full h-full border-0 bg-white"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div
                    style={{ width: `${laptopWidth + 60}px` }}
                    className="h-7 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-b-xl border-t border-slate-600 shadow-2xl relative flex items-center justify-center"
                  >
                    <div className="w-24 h-1.5 bg-slate-900/80 rounded-full border-b border-slate-700 shadow-inner" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING EXACT MINIMALIST DOCK (Matching User's Reference Image) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.3)] rounded-full px-4 py-2 flex items-center gap-3">
          
          {/* 1. Mobile Icon (Celular) */}
          <button
            onClick={() => setViewMode('mobile')}
            title="Vista Móvil (390px)"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group ${
              viewMode === 'mobile'
                ? 'bg-[#18181b] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <line x1="12" x2="12.01" y1="18" y2="18" strokeWidth="2.5" />
            </svg>
          </button>

          {/* 2. Tablet Icon (Tableta) */}
          <button
            onClick={() => setViewMode('tablet')}
            title="Vista Tableta (820px)"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group ${
              viewMode === 'tablet'
                ? 'bg-[#18181b] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
              <line x1="12" x2="12.01" y1="18" y2="18" strokeWidth="2.5" />
            </svg>
          </button>

          {/* 3. Desktop / Laptop Icon (Selected Dark Circle from Reference Image) */}
          <button
            onClick={() => setViewMode(viewMode === 'laptop' ? 'all' : 'laptop')}
            title="Vista Escritorio / Portátil (o Clic para alternar 3 Vistas)"
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all group ${
              viewMode === 'laptop' || viewMode === 'all'
                ? 'bg-[#18181b] text-white'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="12" x="3" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="15" y2="21" />
            </svg>
          </button>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200" />

          {/* 4. Popout / Open in New Tab Icon */}
          <button
            onClick={handleOpenPopout}
            title="Abrir página en pestaña completa"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </button>

          {/* 5. Reload / Refresh Icon */}
          <button
            onClick={handleGlobalRefresh}
            title="Recargar todas las vistas"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>

          {/* 6. QR Code Icon */}
          <button
            onClick={() => setShowQrModal(true)}
            title="Escanear QR con tu teléfono real en la red local"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="5" height="5" x="3" y="3" rx="1" />
              <rect width="5" height="5" x="16" y="3" rx="1" />
              <rect width="5" height="5" x="3" y="16" rx="1" />
              <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
              <path d="M21 21v.01" />
              <path d="M12 7v3a2 2 0 0 1-2 2H7" />
              <path d="M3 12h.01" />
              <path d="M12 3h.01" />
              <path d="M12 16v.01" />
              <path d="M16 12h1" />
              <path d="M21 12v.01" />
              <path d="M12 21v-1" />
            </svg>
          </button>

        </div>
      </div>

      {/* QR CODE POPUP MODAL */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="5" height="5" x="3" y="3" rx="1" />
                <rect width="5" height="5" x="16" y="3" rx="1" />
                <rect width="5" height="5" x="3" y="16" rx="1" />
                <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                <path d="M21 21v.01" />
                <path d="M12 7v3a2 2 0 0 1-2 2H7" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Escanear en tu Celular Real
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Apunta la cámara de tu smartphone conectado al mismo WiFi para probar en tiempo real.
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeImageSrc}
                alt="Código QR para probar en celular"
                className="w-48 h-48 rounded-xl object-contain"
              />
            </div>

            <div className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs text-slate-700 truncate select-all">
                {localIpUrl}
              </span>
              <button
                onClick={handleCopyIp}
                className="shrink-0 text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MultiDevicePreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Cargando Multi-Device Studio...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
