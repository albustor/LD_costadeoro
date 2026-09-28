import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TierProvider } from '@/context/TierContext';
import { TournamentProvider } from '@/context/TournamentContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LiveMatchBanner } from '@/components/sports/LiveMatchBanner';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DevViewportBar } from '@/components/dev/DevViewportBar';

export const metadata: Metadata = {
  title: 'Liga Deportiva Costa de Oro 2026 | Portal Oficial',
  description:
    'Plataforma digital oficial de la Liga Costa de Oro 2026. Marcadores en tiempo real, tablas de posiciones oficiales, calendario y actas de partido.',
  manifest: '/manifest.json',
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
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased pb-20 md:pb-0">
        <TierProvider>
          <LanguageProvider>
            <TournamentProvider>
              {/* Minimalist Sticky Header */}
              <Header />

              {/* Dynamic Live Match Indicator */}
              <LiveMatchBanner />

              {/* Main Content Area */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
                {children}
              </main>

              {/* Minimalist Footer */}
              <Footer />

              {/* Mobile PWA Bottom Navigation */}
              <MobileBottomNav />

              {/* Floating Multi-Device Dev Viewport Toolbar */}
              <DevViewportBar />
            </TournamentProvider>
          </LanguageProvider>
        </TierProvider>
      </body>
    </html>
  );
}
