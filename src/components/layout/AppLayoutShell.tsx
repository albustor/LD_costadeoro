'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LiveMatchBanner } from '@/components/sports/LiveMatchBanner';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DevViewportBar } from '@/components/dev/DevViewportBar';
import { GestureOnboardingHint } from '@/components/accessibility/GestureOnboardingHint';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

interface AppLayoutShellProps {
  children: React.ReactNode;
}

export function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname();
  const [isInsideIframe, setIsInsideIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsInsideIframe(true);
    }
  }, []);

  const isPreviewPage = pathname === '/preview';

  // Si estamos en la página del simulador /preview o dentro de un iframe del simulador:
  // Renderizado limpio de pantalla completa sin duplicar cabeceras ni barras de navegación
  if (isPreviewPage || isInsideIframe) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-900 text-slate-100">
        <main className="flex-1 w-full">{children}</main>
      </div>
    );
  }

  // Renderizado normal de la aplicación para usuarios y visitantes
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased pb-28 lg:pb-0 w-full overflow-x-hidden relative">
      {/* Cabecera Oficial */}
      <Header />

      {/* Indicador de Partidos en Vivo */}
      <LiveMatchBanner />

      {/* Área Principal de Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-4 overflow-x-hidden">
        {children}
      </main>

      {/* Pie de Página Oficial */}
      <Footer />

      {/* Barra de Navegación Móvil Inferior */}
      <MobileBottomNav />

      {/* Animación Guía de Accesibilidad */}
      <GestureOnboardingHint />

      {/* Barra de Inspección de Viewports en Localhost */}
      <DevViewportBar />

      {/* Tracker de Analítica */}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </div>
  );
}
