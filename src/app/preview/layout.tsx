import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estudio Multidispositivo | Curiol Studio',
  description: 'Simulador universal multi-proyecto, móvil (iPhone, Android, Huawei, Xiaomi), tableta y PC de Curiol Studio.',
  manifest: '/preview-manifest.json',
  applicationName: 'Estudio Multidispositivo · Curiol Studio',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Estudio Multidispositivo',
  },
  icons: {
    icon: '/logos/curiol_suite_device_simulator.ico',
    apple: '/logos/curiol_suite_device_simulator.ico',
  },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
