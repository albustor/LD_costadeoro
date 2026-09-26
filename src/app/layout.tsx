import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TierProvider } from '@/context/TierContext';
import { TournamentProvider } from '@/context/TournamentContext';
import { TierDemoSwitcher } from '@/components/layout/TierDemoSwitcher';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LiveMatchBanner } from '@/components/sports/LiveMatchBanner';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Liga Deportiva Costa de Oro 2026 | Portal Oficial',
  description:
    'Plataforma digital oficial de la Liga Costa de Oro 2026. Marcadores en vivo, tablas de posiciones, cobertura fotográfica y videos de la comunidad.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
  themeColor: '#0b1120',
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
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased pb-16 md:pb-0">
        <TierProvider>
          <TournamentProvider>
            {/* Interactive Package Switcher Bar */}
            <TierDemoSwitcher />

            {/* Main Sticky Header */}
            <Header />

            {/* Dynamic Live Banner */}
            <LiveMatchBanner />

            {/* Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile PWA Bottom Navigation Bar */}
            <MobileBottomNav />
          </TournamentProvider>
        </TierProvider>
      </body>
    </html>
  );
}
