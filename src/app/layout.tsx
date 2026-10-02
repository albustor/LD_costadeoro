import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { TierProvider } from '@/context/TierContext';
import { TournamentProvider } from '@/context/TournamentContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LiveMatchBanner } from '@/components/sports/LiveMatchBanner';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DevViewportBar } from '@/components/dev/DevViewportBar';
import { TouchReflowZoomProvider } from '@/components/accessibility/TouchReflowZoomProvider';
import { GestureOnboardingHint } from '@/components/accessibility/GestureOnboardingHint';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://costadeoro.curiol.studio'),
  title: 'Liga Costa de Oro 2026 | Portal oficial',
  description:
    'Plataforma digital oficial de la Liga Costa de Oro 2026. Marcadores en tiempo real, tablas de posiciones oficiales, calendario y actas de partido.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Liga Costa de Oro 2026 | Portal oficial',
    description:
      'Plataforma digital oficial de la Liga Costa de Oro 2026. Marcadores en tiempo real, tablas de posiciones oficiales, calendario y actas de partido.',
    url: 'https://costadeoro.curiol.studio',
    siteName: 'Liga Costa de Oro 2026',
    images: [
      {
        url: '/logos/liga_costa_de_oro_gold_black.jpg',
        width: 1200,
        height: 630,
        alt: 'Liga Costa de Oro 2026',
        type: 'image/jpeg',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liga Costa de Oro 2026 | Portal oficial',
    description:
      'Plataforma digital oficial de la Liga Costa de Oro 2026. Marcadores en tiempo real, tablas de posiciones y estadísticas.',
    images: ['/logos/liga_costa_de_oro_gold_black.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Costa de Oro 2026',
  },
  keywords: [
    'Liga Costa de Oro 2026',
    'La Paz Community School',
    'Fútbol Guanacaste',
    'Voleibol Guanacaste',
    'Baloncesto Guanacaste',
    'Curiol Studio',
  ],
};

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light overflow-x-hidden">
      <head>
        {/* Cache-Buster & Legacy PWA Service Worker Purge */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) {
                    caches.delete(name);
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased pb-28 lg:pb-0 w-full overflow-x-hidden relative">
        <TierProvider>
          <LanguageProvider>
            <TournamentProvider>
              <TouchReflowZoomProvider>
                {/* Minimalist Sticky Header */}
                <Header />

                {/* Dynamic Live Match Indicator */}
                <LiveMatchBanner />

                {/* Main Content Area */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-4 overflow-x-hidden">
                  {children}
                </main>

                {/* Minimalist Footer */}
                <Footer />

                {/* Mobile PWA Bottom Navigation */}
                <MobileBottomNav />

                {/* Gesture Onboarding Hint (2 Fingers Animation) */}
                <GestureOnboardingHint />

                {/* Floating Multi-Device Dev Viewport Toolbar */}
                <DevViewportBar />

                {/* Real-time Web Traffic & User Flow Tracker */}
                <Suspense fallback={null}>
                  <AnalyticsTracker />
                </Suspense>
              </TouchReflowZoomProvider>
            </TournamentProvider>
          </LanguageProvider>
        </TierProvider>
      </body>
    </html>
  );
}
