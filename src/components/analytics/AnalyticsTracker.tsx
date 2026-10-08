'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fullPath = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    // Evitar registrar la misma ruta consecutivamente en el mismo ciclo
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    // Obtener o inicializar ID de sesión anónima persistente
    let sessionId: string | null = null;
    try {
      sessionId = localStorage.getItem('lco_visitor_uuid');
      if (!sessionId) {
        sessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('lco_visitor_uuid', sessionId);
      }
    } catch {
      sessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Detectar dispositivo en cliente
    const ua = navigator.userAgent || '';
    let device = 'desktop';
    if (/iPad|tablet|PlayBook/i.test(ua)) {
      device = 'tablet';
    } else if (/iPhone|iPod/i.test(ua)) {
      device = 'mobile_ios';
    } else if (/Android/i.test(ua) || /Mobile/i.test(ua)) {
      device = 'mobile_android';
    }

    // Enviar evento de telemetría sin bloquear el hilo de render
    try {
      const payload = JSON.stringify({
        path: pathname || '/',
        device,
        sessionId,
        referrer: document.referrer || 'Directo / Acceso PWA',
      });

      // Enviar evento de telemetría sin bloquear el render (fetch keepalive universal)
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        cache: 'no-store',
      }).catch(() => {
        // Fallback secundario si fetch falla
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics', blob);
        }
      });
    } catch {
      // Ignorar errores de red
    }
  }, [pathname, searchParams]);

  return null;
}
