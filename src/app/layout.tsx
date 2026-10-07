import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TierProvider } from '@/context/TierContext';
import { TournamentProvider } from '@/context/TournamentContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TouchReflowZoomProvider } from '@/components/accessibility/TouchReflowZoomProvider';
import { AppLayoutShell } from '@/components/layout/AppLayoutShell';

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
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased w-full overflow-x-hidden relative">
        <TierProvider>
          <LanguageProvider>
            <TournamentProvider>
              <TouchReflowZoomProvider>
                <AppLayoutShell>{children}</AppLayoutShell>
              </TouchReflowZoomProvider>
            </TournamentProvider>
          </LanguageProvider>
        </TierProvider>
      </body>
    </html>
  );
}
