'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DevViewportBar() {
  const pathname = usePathname();
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile' | 'studio'>('desktop');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [localIpUrl, setLocalIpUrl] = useState<string>('http://192.168.137.1:3000');
  const [copied, setCopied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = window.location.port ? `:${window.location.port}` : '';
      const hostname = window.location.hostname;
      // Default fallback or detected IP
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setLocalIpUrl(`http://192.168.137.1${port}${pathname}`);
      } else {
        setLocalIpUrl(`${window.location.origin}${pathname}`);
      }
    }
  }, [pathname]);

  // If we are already inside the /preview page or an iframe, don't show double bars
  const [isInsideIframe, setIsInsideIframe] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsInsideIframe(true);
    }
  }, []);

  // Solo visible en entorno local de desarrollo (localhost / 127.0.0.1)
  const isLocalHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.'));

  if (process.env.NODE_ENV === 'production' && !isLocalHost) {
    return null;
  }

  if (isInsideIframe || pathname === '/preview') {
    return null;
  }

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleOpenPopout = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank');
    }
  };

  const handleCopyIp = () => {
    navigator.clipboard.writeText(localIpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code URL using high-quality Google Chart API or QR service (pure SVG/PNG)
  const qrCodeImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    localIpUrl
  )}&margin=10&color=0f172a&bgcolor=ffffff`;

  return (
    <>
      {/* FLOATING EXACT TOOLBAR (As in user's image) */}
      <aside aria-label="Barra de herramientas de prueba multidispositivo" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.25)] rounded-full px-4 py-2 flex items-center gap-3">
          
          {/* 1. Mobile Icon (Celular) */}
          <Link
            href="/preview?mode=mobile"
            title="Vista Móvil (390px)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group relative"
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
            <span className="sr-only">Móvil</span>
          </Link>

          {/* 2. Tablet Icon (Tableta) */}
          <Link
            href="/preview?mode=tablet"
            title="Vista Tableta (820px)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group relative"
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
            <span className="sr-only">Tableta</span>
          </Link>

          {/* 3. Desktop / Laptop Icon (Selected Dark Circle from Reference Image) */}
          <Link
            href="/preview"
            title="Vista 3-en-1 / Escritorio"
            className="w-9 h-9 rounded-full bg-[#18181b] text-white flex items-center justify-center shadow-md hover:bg-black transition-all group relative"
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
            <span className="sr-only">Escritorio</span>
          </Link>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200" />

          {/* 4. Popout / Open in New Tab Icon */}
          <button
            onClick={handleOpenPopout}
            title="Abrir en pestaña nueva"
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
            <span className="sr-only">Nueva Pestaña</span>
          </button>

          {/* 5. Reload / Refresh Icon */}
          <button
            onClick={handleReload}
            title="Recargar página"
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
            <span className="sr-only">Recargar</span>
          </button>

          {/* 6. QR Code Icon (For Real Mobile Phone Testing) */}
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
            <span className="sr-only">Código QR Móvil</span>
          </button>

        </div>
      </aside>

      {/* QR CODE POPUP MODAL FOR REAL MOBILE SCANNING */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition font-bold"
            >
              ✕
            </button>

            {/* Header */}
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

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeImageSrc}
                alt="Código QR para probar en celular"
                className="w-48 h-48 rounded-xl object-contain"
              />
            </div>

            {/* Local IP Address Pill */}
            <div className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs text-slate-700 truncate select-all">
                {localIpUrl}
              </span>
              <button
                onClick={handleCopyIp}
                className="shrink-0 text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition"
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <Link
              href="/preview"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
            >
              Abrir Simulador 3 Pantallas en PC
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
