'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
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
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  FolderOpen,
  FileCode,
  X,
  Settings
} from 'lucide-react';

interface ProjectRoute {
  path: string;
  label: string;
}

interface ProjectDefinition {
  id: string;
  name: string;
  icon: string;
  port: number | null;
  baseUrl?: string;
  description: string;
  routes: ProjectRoute[];
}

const DEFAULT_PROJECTS: ProjectDefinition[] = [
  {
    id: 'curiol-studio',
    name: 'Curiol Studio Web',
    icon: '📷',
    port: 3000,
    description: 'Fotografía de Autor, Phygital & Legado Familiar',
    routes: [
      { path: '/', label: '🏠 Portada Principal' },
      { path: '/nexo', label: '🧠 NEXO CURIOL' },
      { path: '/linea-de-tiempo/curiol-studio', label: '🌳 Árbol de Guanacaste' },
      { path: '/cotizaciones', label: '📄 Cotizador' },
      { path: '/admin', label: '⚙️ Admin' },
    ],
  },
  {
    id: 'nexo-curiol',
    name: 'NEXO CURIOL / Bitácoras',
    icon: '🧠',
    port: 3000,
    description: 'Centro Neurálgico, Mando Diario y Subagentes',
    routes: [
      { path: '/nexo', label: '🧠 Mando Diario y Operaciones' },
      { path: '/cotizaciones', label: '📄 Cotizaciones e Invitaciones' },
      { path: '/linea-de-tiempo/curiol-studio', label: '🌳 Árbol de Guanacaste' },
      { path: '/redes-sociales', label: '📣 Redes Sociales' },
    ],
  },
  {
    id: 'invitaciones-especiales',
    name: 'Invitaciones y Páginas Sueltas',
    icon: '💌',
    port: 3014,
    description: 'Obsequios de Graduación, Invitaciones de Gala y Landing Pages',
    routes: [
      { path: '/invitaciones/obsequio-de-graduacion.html', label: '🎓 Obsequio de Graduación (Luis Ángel)' },
      { path: '/invitaciones/invitacion_especial_familia_rodriguez_marquez.html', label: '👑 Invitación Familia Rodríguez Márquez' },
      { path: '/invitaciones/graduacion-luis-angel.html', label: '🎓 Gala Graduación Universitaria' },
      { path: '/invitaciones/invitacion_vielka_presentacion.html', label: '🌸 Invitación XV Años Vielka' },
    ],
  },
  {
    id: 'costa-de-oro',
    name: 'Liga Costa de Oro 2026',
    icon: '🏆',
    port: 3014,
    description: 'Portal Deportivo Intercolegial Guanacaste 2026',
    routes: [
      { path: '/', label: '🏠 Inicio' },
      { path: '/deportes', label: '🏆 Deportes (Instituciones)' },
      { path: '/calendario', label: '📅 Horarios del Día' },
      { path: '/mural', label: '💬 Muro Familiar' },
      { path: '/marcadores', label: '📊 Marcadores y Posiciones' },
      { path: '/admin', label: '⚙️ Panel Administrador' },
    ],
  },
  {
    id: 'diagnostico-mep',
    name: 'Diagnóstico Secundaria MEP',
    icon: '📊',
    port: 3001,
    description: 'Suite Diagnóstico PNFT 7.° y 9.° Año',
    routes: [
      { path: '/', label: '🏠 Inicio' },
      { path: '/diagnostico', label: '📝 Módulo Diagnóstico' },
      { path: '/admin', label: '🏛️ Observatorio Macro' },
      { path: '/docente', label: '👨‍🏫 Panel Docente' },
      { path: '/auditoria-forense', label: '🔍 Auditoría Forense' },
    ],
  },
  {
    id: 'recurso-apoyo-pnft',
    name: 'Portal Recursos PNFT',
    icon: '🎓',
    port: 3003,
    description: 'Asesoría y Seguimiento Curricular MEP 2026',
    routes: [
      { path: '/', label: '🏠 Recursos PNFT' },
      { path: '/admin', label: '⚙️ Consola Admin' },
    ],
  },
  {
    id: 'propitie-3d',
    name: 'Propitie Costa Rica (3D)',
    icon: '🏢',
    port: 3015,
    description: 'Bienes Raíces Interactivo Three.js',
    routes: [
      { path: '/', label: '🏠 Explorador 3D' },
    ],
  },
  {
    id: 'presupuesto-familiar',
    name: 'Presupuesto Familiar',
    icon: '💰',
    port: 5173,
    description: 'Control de Finanzas y Hacienda 2026',
    routes: [
      { path: '/', label: '🏠 Balance y Presupuesto' },
    ],
  },
  {
    id: 'sura-properties',
    name: 'SURA Property Managers',
    icon: '🏡',
    port: 5174,
    description: 'Gestión y Concierge de Villas de Lujo',
    routes: [
      { path: '/', label: '🏠 Villas & Concierge' },
    ],
  },
];

type MobileBrand = 'iphone' | 'android' | 'huawei' | 'xiaomi';

interface MobileBrandConfig {
  id: MobileBrand;
  name: string;
  brandName: string;
  osName: string;
  engine: string;
  icon: string;
  model: string;
  width: number;
  height: number;
  dpr: number;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  timeText: string;
  safeAreaTop: number;
  safeAreaBottom: number;
  cameraType: 'dynamic-island' | 'punch-hole-center' | 'punch-hole-pill' | 'punch-hole-minimal';
  homeIndicator: 'ios-bar' | 'android-pill' | 'harmony-bar' | 'hyperos-bar';
  cornerRadius: string;
  bezelBorder: string;
  chassisBg: string;
}

const MOBILE_BRANDS: Record<MobileBrand, MobileBrandConfig> = {
  iphone: {
    id: 'iphone',
    name: 'iPhone 16 Pro',
    brandName: 'Apple iPhone',
    osName: 'iOS 18 (Safari WebKit)',
    engine: 'WebKit iOS',
    icon: '🍏',
    model: 'iPhone 16 Pro · Dynamic Island',
    width: 393,
    height: 852,
    dpr: 3,
    accentColor: '#38bdf8',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/30',
    badgeText: 'text-sky-400',
    timeText: '9:41',
    safeAreaTop: 54,
    safeAreaBottom: 34,
    cameraType: 'dynamic-island',
    homeIndicator: 'ios-bar',
    cornerRadius: 'rounded-[52px]',
    bezelBorder: 'border-[#2d3139]',
    chassisBg: 'bg-[#181a20]',
  },
  android: {
    id: 'android',
    name: 'Galaxy S24 / Pixel',
    brandName: 'Android (Google/Samsung)',
    osName: 'Android 15 (Chromium)',
    engine: 'Chromium Blink',
    icon: '🤖',
    model: 'Galaxy S24 / Pixel 9 · Centered Punch-Hole',
    width: 412,
    height: 915,
    dpr: 2.625,
    accentColor: '#34d399',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
    timeText: '10:00',
    safeAreaTop: 36,
    safeAreaBottom: 24,
    cameraType: 'punch-hole-center',
    homeIndicator: 'android-pill',
    cornerRadius: 'rounded-[44px]',
    bezelBorder: 'border-[#23272e]',
    chassisBg: 'bg-[#15171c]',
  },
  huawei: {
    id: 'huawei',
    name: 'Pura 70 / Mate 60',
    brandName: 'Huawei Mate/Pura',
    osName: 'HarmonyOS NEXT (Huawei Browser)',
    engine: 'HarmonyOS Web',
    icon: '🔴',
    model: 'Pura 70 Ultra · Cápsula / Triple Agujero',
    width: 412,
    height: 900,
    dpr: 3,
    accentColor: '#fb7185',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
    timeText: '08:08',
    safeAreaTop: 40,
    safeAreaBottom: 20,
    cameraType: 'punch-hole-pill',
    homeIndicator: 'harmony-bar',
    cornerRadius: 'rounded-[46px]',
    bezelBorder: 'border-[#2c2227]',
    chassisBg: 'bg-[#1c1418]',
  },
  xiaomi: {
    id: 'xiaomi',
    name: 'Xiaomi 14 / Redmi',
    brandName: 'Xiaomi HyperOS',
    osName: 'Xiaomi HyperOS (Mi Browser)',
    engine: 'HyperOS Blink',
    icon: '🟠',
    model: 'Xiaomi 14 · Micro Punch-Hole & Bisel 1.6mm',
    width: 393,
    height: 873,
    dpr: 2.75,
    accentColor: '#fb923c',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    timeText: '12:00',
    safeAreaTop: 34,
    safeAreaBottom: 18,
    cameraType: 'punch-hole-minimal',
    homeIndicator: 'hyperos-bar',
    cornerRadius: 'rounded-[46px]',
    bezelBorder: 'border-[#2e2621]',
    chassisBg: 'bg-[#1a1715]',
  },
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') as 'all' | 'brands' | 'mobile' | 'tablet' | 'laptop' | null;
  const initialBrand = (searchParams.get('brand') as MobileBrand) || 'iphone';

  // Projects State & Persistence
  const [projects, setProjects] = useState<ProjectDefinition[]>(DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('curiol-studio');
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Standalone HTML File State
  const [standaloneFile, setStandaloneFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectPort, setNewProjectPort] = useState<string>('');
  const [newProjectBaseUrl, setNewProjectBaseUrl] = useState<string>('');
  const [newProjectIcon, setNewProjectIcon] = useState<string>('🚀');
  const [newProjectRoutes, setNewProjectRoutes] = useState<string>('/, /admin');

  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [customPathInput, setCustomPathInput] = useState<string>('/');
  const [globalZoom, setGlobalZoom] = useState<number>(0.65);
  const [viewMode, setViewMode] = useState<'all' | 'brands' | 'mobile' | 'tablet' | 'laptop'>(initialMode || 'all');
  const [selectedMobileBrand, setSelectedMobileBrand] = useState<MobileBrand>(initialBrand);
  const [showSafeArea, setShowSafeArea] = useState<boolean>(true);
  const [backdropTheme, setBackdropTheme] = useState<'studio' | 'blueprint' | 'dark' | 'light'>('studio');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [localIp, setLocalIp] = useState<string>('192.168.137.1');
  const [copied, setCopied] = useState<boolean>(false);

  // Individual device orientations
  const [mobileLandscape, setMobileLandscape] = useState<boolean>(false);
  const [brandLandscapes, setBrandLandscapes] = useState<Record<MobileBrand, boolean>>({
    iphone: false,
    android: false,
    huawei: false,
    xiaomi: false,
  });
  const [tabletLandscape, setTabletLandscape] = useState<boolean>(false);
  const [laptopResolution, setLaptopResolution] = useState<{ width: number; height: number }>({
    width: 1366,
    height: 768,
  });

  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const tabletIframeRef = useRef<HTMLIFrameElement>(null);
  const laptopIframeRef = useRef<HTMLIFrameElement>(null);

  // Live Port Health Status: 'checking' | 'online' | 'offline' | 'local'
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline' | 'local'>('checking');

  // Load custom projects from localStorage and auto-migrate canonical defaults
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProjects = localStorage.getItem('curiol_multidevice_projects');
        if (storedProjects) {
          let parsed = JSON.parse(storedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Auto-migrate default canonical projects (e.g. nexo 3009 -> 3000)
            parsed = parsed.map((p: any) => {
              const canonical = DEFAULT_PROJECTS.find((dp) => dp.id === p.id);
              if (canonical) {
                return {
                  ...p,
                  port: canonical.port,
                  routes: canonical.routes,
                  description: canonical.description,
                  icon: canonical.icon,
                  name: canonical.name,
                };
              }
              return p;
            });

            // Merge with default projects ensuring invitations are present
            const hasInvitations = parsed.some((p: any) => p.id === 'invitaciones-especiales');
            if (!hasInvitations) {
              const inv = DEFAULT_PROJECTS.find((p) => p.id === 'invitaciones-especiales');
              if (inv) parsed.splice(1, 0, inv);
            }
            setProjects(parsed);
            localStorage.setItem('curiol_multidevice_projects', JSON.stringify(parsed));
          }
        }

        // Restore last active project
        const lastProjectId = localStorage.getItem('curiol_multidevice_last_project');
        if (lastProjectId) {
          const projectExists = (projects || DEFAULT_PROJECTS).some((p) => p.id === lastProjectId);
          if (projectExists) {
            setSelectedProjectId(lastProjectId);
          }
        }

        // Restore last active path
        const lastPath = localStorage.getItem('curiol_multidevice_last_path');
        if (lastPath) {
          setCurrentPath(lastPath);
          setCustomPathInput(lastPath);
        }

        // Restore last active mobile brand
        const lastBrand = localStorage.getItem('curiol_multidevice_last_brand') as MobileBrand | null;
        if (lastBrand && MOBILE_BRANDS[lastBrand]) {
          setSelectedMobileBrand(lastBrand);
        }

        // Restore last view mode
        const lastViewMode = localStorage.getItem('curiol_multidevice_last_viewmode') as any;
        if (lastViewMode && ['all', 'brands', 'mobile', 'tablet', 'laptop'].includes(lastViewMode)) {
          setViewMode(lastViewMode);
        }

        const storedIp = localStorage.getItem('curiol_multidevice_localip');
        if (storedIp) {
          setLocalIp(storedIp);
        } else if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          setLocalIp(window.location.hostname);
        }
      } catch (err) {
        console.warn('Error leyendo localStorage de proyectos:', err);
      }
    }
  }, []);

  // Find active project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || DEFAULT_PROJECTS[0];
  }, [projects, selectedProjectId]);

  // Dynamically sync window and tab title to the active development
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const activeName = standaloneFile ? standaloneFile.name : activeProject?.name || 'Estudio';
      document.title = `${activeName} | Estudio Multidispositivo · Curiol Studio`;
    }
  }, [activeProject, standaloneFile]);

  // Save projects to localStorage
  const saveProjects = (updated: ProjectDefinition[]) => {
    setProjects(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_projects', JSON.stringify(updated));
    }
  };

  const handleSaveLocalIp = (newIp: string) => {
    setLocalIp(newIp);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_localip', newIp);
    }
  };

  // Live health ping for the active project port
  useEffect(() => {
    if (standaloneFile || !activeProject.port) {
      setServerStatus('local');
      return;
    }
    let isCurrent = true;
    setServerStatus('checking');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    fetch(`http://localhost:${activeProject.port}/`, { mode: 'no-cors', signal: controller.signal })
      .then(() => {
        if (isCurrent) setServerStatus('online');
      })
      .catch(() => {
        if (isCurrent) setServerStatus('offline');
      })
      .finally(() => clearTimeout(timer));

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [activeProject.port, standaloneFile, refreshKey]);

  // Handle local standalone HTML file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local blob URL
    const blobUrl = URL.createObjectURL(file);
    setStandaloneFile({
      name: file.name,
      url: blobUrl,
    });
    setCustomPathInput(file.name);
  };

  const handleClearStandaloneFile = () => {
    if (standaloneFile?.url) {
      URL.revokeObjectURL(standaloneFile.url);
    }
    setStandaloneFile(null);
    setCurrentPath(activeProject.routes?.[0]?.path || '/');
    setCustomPathInput(activeProject.routes?.[0]?.path || '/');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Compute live target URL for iframes
  const resolvedTargetUrl = useMemo(() => {
    if (standaloneFile) {
      return standaloneFile.url;
    }

    let cleanPath = currentPath.trim();
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http://') && !cleanPath.startsWith('https://')) {
      cleanPath = '/' + cleanPath;
    }

    // Direct absolute URL input
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    if (activeProject.baseUrl) {
      const base = activeProject.baseUrl.replace(/\/+$/, '');
      return `${base}${cleanPath}`;
    }

    if (activeProject.port) {
      if (typeof window !== 'undefined') {
        const currentPort = window.location.port ? parseInt(window.location.port, 10) : 80;
        // Same port: use relative URL for instant local session sharing
        if (currentPort === activeProject.port) {
          return cleanPath;
        }
        const hostname = window.location.hostname || 'localhost';
        return `http://${hostname}:${activeProject.port}${cleanPath}`;
      }
      return `http://localhost:${activeProject.port}${cleanPath}`;
    }

    return cleanPath;
  }, [activeProject, currentPath, standaloneFile]);

  // Compute LAN URL for mobile QR code
  const resolvedLanUrl = useMemo(() => {
    if (standaloneFile) {
      // If standalone file matches an invitation in public/invitaciones
      const cleanName = standaloneFile.name.toLowerCase();
      if (cleanName.includes('graduacion') || cleanName.includes('obsequio') || cleanName.includes('invitacion')) {
        return `http://${localIp}:3014/invitaciones/${encodeURIComponent(standaloneFile.name)}`;
      }
      return `http://${localIp}:3014/invitaciones/obsequio-de-graduacion.html`;
    }

    let cleanPath = currentPath.trim();
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http://') && !cleanPath.startsWith('https://')) {
      cleanPath = '/' + cleanPath;
    }

    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    if (activeProject.baseUrl) {
      const base = activeProject.baseUrl.replace(/\/+$/, '');
      return `${base}${cleanPath}`;
    }

    const port = activeProject.port ? `:${activeProject.port}` : '';
    return `http://${localIp}${port}${cleanPath}`;
  }, [activeProject, currentPath, localIp, standaloneFile]);

  // Adjust zoom automatically if focusing on solo device
  useEffect(() => {
    if (viewMode === 'mobile') setGlobalZoom(0.75);
    else if (viewMode === 'tablet') setGlobalZoom(0.68);
    else if (viewMode === 'laptop') setGlobalZoom(0.65);
    else setGlobalZoom(0.55);
  }, [viewMode]);

  // Switch project handler
  const handleProjectSelect = (projectId: string) => {
    if (standaloneFile) {
      handleClearStandaloneFile();
    }
    setSelectedProjectId(projectId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_last_project', projectId);
    }
    const target = projects.find((p) => p.id === projectId);
    if (target && target.routes && target.routes.length > 0) {
      setCurrentPath(target.routes[0].path);
      setCustomPathInput(target.routes[0].path);
      if (typeof window !== 'undefined') {
        localStorage.setItem('curiol_multidevice_last_path', target.routes[0].path);
      }
    } else {
      setCurrentPath('/');
      setCustomPathInput('/');
      if (typeof window !== 'undefined') {
        localStorage.setItem('curiol_multidevice_last_path', '/');
      }
    }
  };

  // Sync route input with selection
  const handleRouteChange = (newPath: string) => {
    if (standaloneFile) {
      setStandaloneFile(null);
    }
    setCurrentPath(newPath);
    setCustomPathInput(newPath);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_last_path', newPath);
    }
  };

  const handleCustomPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (standaloneFile) {
      setStandaloneFile(null);
    }
    let target = customPathInput.trim();
    if (!target.startsWith('/') && !target.startsWith('http://') && !target.startsWith('https://')) {
      target = '/' + target;
    }
    setCurrentPath(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_last_path', target);
    }
  };

  const handleGlobalRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenPopout = () => {
    if (typeof window !== 'undefined') {
      window.open(resolvedTargetUrl, '_blank');
    }
  };

  const handleCopyLanUrl = () => {
    navigator.clipboard.writeText(resolvedLanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add Project Handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const parsedRoutes: ProjectRoute[] = newProjectRoutes
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => ({
        path: r.startsWith('/') ? r : `/${r}`,
        label: `📄 ${r}`,
      }));

    if (parsedRoutes.length === 0) {
      parsedRoutes.push({ path: '/', label: '🏠 Inicio' });
    }

    const newProject: ProjectDefinition = {
      id: `custom-${Date.now()}`,
      name: newProjectName.trim(),
      icon: newProjectIcon.trim() || '🚀',
      port: newProjectPort.trim() ? parseInt(newProjectPort.trim(), 10) : null,
      baseUrl: newProjectBaseUrl.trim() || undefined,
      description: 'Proyecto personalizado del desarrollador',
      routes: parsedRoutes,
    };

    const updated = [...projects, newProject];
    saveProjects(updated);
    setSelectedProjectId(newProject.id);
    setCurrentPath(parsedRoutes[0].path);
    setCustomPathInput(parsedRoutes[0].path);

    // Reset Form
    setNewProjectName('');
    setNewProjectPort('');
    setNewProjectBaseUrl('');
    setNewProjectRoutes('/, /admin');
    setShowAddProjectModal(false);
  };

  // Delete Custom Project
  const handleDeleteCustomProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (selectedProjectId === id) {
      setSelectedProjectId(updated[0]?.id || DEFAULT_PROJECTS[0].id);
    }
  };

  // Restore Default Projects
  const handleResetProjects = () => {
    if (confirm('¿Deseas restaurar la lista de proyectos e invitaciones predeterminadas de Curiol?')) {
      saveProjects(DEFAULT_PROJECTS);
      setSelectedProjectId(DEFAULT_PROJECTS[0].id);
      setCurrentPath('/');
      setCustomPathInput('/');
    }
  };

  // Active mobile brand dimension calculation
  const activeBrandConfig = MOBILE_BRANDS[selectedMobileBrand];
  const mobileWidth = mobileLandscape ? activeBrandConfig.height : activeBrandConfig.width;
  const mobileHeight = mobileLandscape ? activeBrandConfig.width : activeBrandConfig.height;

  const tabletWidth = tabletLandscape ? 1180 : 820;
  const tabletHeight = tabletLandscape ? 820 : 1180;

  const laptopWidth = laptopResolution.width;
  const laptopHeight = laptopResolution.height;

  // Helper to render authentic mobile hardware cutouts & status bars
  const renderMobileCutout = (brand: MobileBrandConfig, isLandscape: boolean) => {
    if (isLandscape) {
      return (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 z-30 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-800" />
        </div>
      );
    }

    switch (brand.cameraType) {
      case 'dynamic-island':
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center group pointer-events-auto">
            <div className="w-[124px] h-[34px] bg-black rounded-full flex items-center justify-between px-3 shadow-md ring-1 ring-slate-800/80 transition-all duration-300 hover:w-[155px]">
              {/* Camera lens */}
              <div className="w-3 h-3 rounded-full bg-[#0c0e12] ring-1 ring-[#1b202c] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>
              {/* Audio wave / mic dot indicator */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              {/* TrueDepth sensor */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0c10] ring-1 ring-slate-900" />
            </div>
          </div>
        );
      case 'punch-hole-pill':
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
            <div className="w-[58px] h-[16px] bg-black rounded-full ring-1 ring-slate-800 shadow-inner flex items-center justify-between px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0e1218] ring-1 ring-slate-700/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0e1218] ring-1 ring-slate-700/80" />
            </div>
          </div>
        );
      case 'punch-hole-minimal':
        return (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black rounded-full ring-1 ring-slate-700/80 shadow-inner" />
          </div>
        );
      case 'punch-hole-center':
      default:
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-700/70 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          </div>
        );
    }
  };

  const renderMobileStatusBar = (brand: MobileBrandConfig, isLandscape: boolean) => {
    if (isLandscape) return null;

    return (
      <div className="absolute top-0 left-0 right-0 h-11 px-7 z-20 flex items-center justify-between pointer-events-none select-none text-[11px] font-semibold text-slate-800 dark:text-slate-200">
        <span className="font-mono tracking-tight font-bold">{brand.timeText}</span>

        <div className="flex items-center gap-1.5">
          {brand.id === 'iphone' ? (
            <>
              <div className="flex items-end gap-[1.5px] h-2.5">
                <span className="w-[2.5px] h-1 bg-current rounded-[0.5px]" />
                <span className="w-[2.5px] h-1.5 bg-current rounded-[0.5px]" />
                <span className="w-[2.5px] h-2 bg-current rounded-[0.5px]" />
                <span className="w-[2.5px] h-2.5 bg-current rounded-[0.5px]" />
              </div>
              <span className="text-[9px] font-bold tracking-tighter">5G</span>
              <div className="w-5 h-2.5 border border-current rounded-[3px] p-[1px] flex items-center relative">
                <div className="h-full w-[80%] bg-current rounded-[1px]" />
                <div className="w-[1.5px] h-1 bg-current absolute -right-[2.5px] top-1/2 -translate-y-1/2 rounded-r-[0.5px]" />
              </div>
            </>
          ) : brand.id === 'huawei' ? (
            <>
              <div className="flex items-end gap-[1.5px] h-2.5">
                <span className="w-[2.5px] h-1.5 bg-current rounded-[0.5px]" />
                <span className="w-[2.5px] h-2 bg-current rounded-[0.5px]" />
                <span className="w-[2.5px] h-2.5 bg-current rounded-[0.5px]" />
              </div>
              <span className="text-[9px] font-mono font-bold text-rose-500">H·OS</span>
              <div className="w-5 h-2.5 border border-current rounded-full p-[1.5px] flex items-center">
                <div className="h-full w-[85%] bg-current rounded-full" />
              </div>
            </>
          ) : brand.id === 'xiaomi' ? (
            <>
              <span className="text-[9px] font-bold text-orange-500">MI</span>
              <span className="text-[9px] font-mono">5G</span>
              <div className="w-4 h-2.5 border border-current rounded-[2px] p-[1px] flex items-center relative">
                <div className="h-full w-[90%] bg-current rounded-[1px]" />
              </div>
            </>
          ) : (
            <>
              <span className="text-[9px] font-mono">5G</span>
              <div className="w-4 h-2.5 border border-current rounded-[2px] p-[1px] flex items-center relative">
                <div className="h-full w-[75%] bg-current rounded-[1px]" />
                <div className="w-[1.5px] h-1 bg-current absolute -right-[2px] top-1/2 -translate-y-1/2 rounded-r-[0.5px]" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleSelectMobileBrand = (brand: MobileBrand) => {
    setSelectedMobileBrand(brand);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_last_brand', brand);
    }
  };

  const handleSelectViewMode = (mode: 'all' | 'brands' | 'mobile' | 'tablet' | 'laptop') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('curiol_multidevice_last_viewmode', mode);
    }
  };

  const renderHomeIndicator = (brand: MobileBrandConfig, isLandscape: boolean) => {
    if (isLandscape) return null;
    switch (brand.homeIndicator) {
      case 'ios-bar':
        return <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1 bg-slate-700/80 dark:bg-slate-300/80 rounded-full z-30 pointer-events-none" />;
      case 'android-pill':
        return <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600/80 rounded-full z-30 pointer-events-none" />;
      case 'harmony-bar':
        return <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600/80 rounded-full z-30 pointer-events-none" />;
      case 'hyperos-bar':
      default:
        return <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-slate-600/80 rounded-full z-30 pointer-events-none" />;
    }
  };

  const renderMobileDeviceFrame = ({
    brandKey,
    isLandscape,
    onToggleLandscape,
    onMaximize,
    showBrandSwitcher = false,
  }: {
    brandKey: MobileBrand;
    isLandscape: boolean;
    onToggleLandscape: () => void;
    onMaximize?: () => void;
    showBrandSwitcher?: boolean;
  }) => {
    const brand = MOBILE_BRANDS[brandKey];
    const w = isLandscape ? brand.height : brand.width;
    const h = isLandscape ? brand.width : brand.height;

    return (
      <div key={brandKey} className="flex flex-col items-center">
        {/* Brand Switcher Bar (only in single-mobile mode) */}
        {showBrandSwitcher && (
          <div className="mb-3.5 flex items-center justify-center p-1 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-lg gap-1 max-w-[440px] w-full">
            {(Object.keys(MOBILE_BRANDS) as MobileBrand[]).map((bKey) => {
              const b = MOBILE_BRANDS[bKey];
              const isSelected = selectedMobileBrand === bKey;
              return (
                <button
                  key={bKey}
                  onClick={() => handleSelectMobileBrand(bKey)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span className="truncate">{b.brandName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Device Header Bar */}
        <div
          style={{ width: `${w * globalZoom}px` }}
          className="mb-3 flex items-center justify-between px-2 text-xs min-w-[280px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{brand.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100">{brand.brandName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${brand.badgeBg} ${brand.badgeBorder} ${brand.badgeText}`}>
                  {brand.name}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>{w} × {h} px</span>
                <span>•</span>
                <span className="text-amber-400/90">{brand.engine}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleLandscape}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700"
              title="Girar orientación (Vertical / Horizontal)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSafeArea(!showSafeArea)}
              className={`px-1.5 py-1 rounded text-[10px] font-mono border transition ${
                showSafeArea
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Alternar simulación de muesca/isla y barra inferior del SO"
            >
              {showSafeArea ? '🛡️ Safe-Area: ON' : '🛡️ Safe-Area: OFF'}
            </button>
            {onMaximize && (
              <button
                onClick={onMaximize}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700"
                title="Enfocar este dispositivo"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scaled Device Container */}
        <div
          style={{
            width: `${w * globalZoom}px`,
            height: `${h * globalZoom}px`,
          }}
          className="relative shrink-0 transition-all duration-300"
        >
          <div
            style={{
              width: `${w}px`,
              height: `${h}px`,
              transform: `scale(${globalZoom})`,
              transformOrigin: 'top left',
            }}
            className={`relative ${brand.cornerRadius} ${brand.chassisBg} p-3 ring-1 ring-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-[6px] ${brand.bezelBorder} flex flex-col`}
          >
            {/* Authentic OS Cutout */}
            {showSafeArea && renderMobileCutout(brand, isLandscape)}

            {/* Authentic OS Status Bar */}
            {showSafeArea && renderMobileStatusBar(brand, isLandscape)}

            {/* Screen Glass Area with Iframe */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative shadow-inner">
              {serverStatus === 'offline' && !standaloneFile ? (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white select-none">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 text-xl">
                    ⚠️
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Servidor local desconectado</h4>
                  <p className="text-xs text-slate-400 max-w-[240px] mb-3 leading-relaxed">
                    El proyecto <span className="text-amber-400 font-semibold">{activeProject.name}</span> requiere que inicies su servidor en el puerto <span className="font-mono text-emerald-400">:{activeProject.port}</span>.
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-emerald-400 mb-4 select-all">
                    npm run dev
                  </div>
                  <button
                    onClick={handleGlobalRefresh}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Reintentar conexión
                  </button>
                </div>
              ) : (
                <iframe
                  key={`${brandKey}-${refreshKey}-${resolvedTargetUrl}`}
                  src={resolvedTargetUrl}
                  title={`Vista ${brand.brandName}`}
                  className="w-full h-full border-0 bg-white"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
                />
              )}
            </div>

            {/* Authentic OS Home Indicator Bar */}
            {showSafeArea && renderHomeIndicator(brand, isLandscape)}
          </div>
        </div>
      </div>
    );
  };

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

  const qrCodeImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    resolvedLanUrl
  )}&margin=10&color=0f172a&bgcolor=ffffff`;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col h-screen w-screen overflow-hidden select-none font-sans ${getBackdropClass()}`}>
      
      {/* Hidden File Input for Standalone HTML Pages */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".html,.htm"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* TOP CONTROLLER BAR */}
      <header className="shrink-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-sm z-50">
        
        {/* Left: Universal Curiol Studio Hub Badge, Project Selector & Standalone HTML Loader */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-sm text-xs select-none">
            <span className="text-base">💎</span>
            <div className="flex flex-col">
              <span className="font-bold text-amber-400 leading-none">Estudio Multidispositivo</span>
              <span className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">Curiol Studio Suite</span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* PROJECT SELECTOR DROPDOWN */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg border border-slate-700 p-1">
            <span className="text-sm px-1">{activeProject.icon}</span>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="bg-transparent text-white font-bold text-xs pr-6 pl-1 py-1 focus:outline-none cursor-pointer appearance-none max-w-[170px] sm:max-w-[210px] truncate"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-slate-900 text-white font-medium">
                    {proj.icon} {proj.name} {proj.port ? `(:${proj.port})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 top-2 pointer-events-none" />
            </div>

            {activeProject.port && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border flex items-center gap-1.5 transition-all ${
                  serverStatus === 'online'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : serverStatus === 'offline'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}
                title={
                  serverStatus === 'online'
                    ? `Servidor activo en el puerto ${activeProject.port}`
                    : serverStatus === 'offline'
                    ? `Servidor apagado en el puerto ${activeProject.port}. Requiere npm run dev`
                    : 'Comprobando respuesta del puerto...'
                }
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    serverStatus === 'online'
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : serverStatus === 'offline'
                      ? 'bg-red-500'
                      : 'bg-amber-400'
                  }`}
                />
                :{activeProject.port}
                {serverStatus === 'offline' && (
                  <span className="text-[9px] font-sans font-normal opacity-90 hidden md:inline">inactivo</span>
                )}
              </span>
            )}

            {/* Quick Add Project Button */}
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
              title="Añadir otro proyecto o puerto"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* STANDALONE HTML FILE BUTTON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
              standaloneFile
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Cargar cualquier archivo HTML suelto desde tu PC (como invitaciones u obsequios)"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Cargar HTML Suelto</span>
          </button>

          {/* Standalone File Active Pill */}
          {standaloneFile && (
            <div className="flex items-center gap-1.5 bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded-lg text-xs animate-fadeIn">
              <FileCode className="w-3.5 h-3.5" />
              <span className="max-w-[140px] truncate">{standaloneFile.name}</span>
              <button
                onClick={handleClearStandaloneFile}
                className="w-4 h-4 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center transition"
                title="Quitar archivo suelto y volver al proyecto"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Route Selector & Custom URL */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          {!standaloneFile && activeProject.routes && activeProject.routes.length > 0 && (
            <div className="relative">
              <select
                value={currentPath}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none font-medium max-w-[150px] sm:max-w-[210px] truncate"
              >
                {activeProject.routes.map((route) => (
                  <option key={route.path} value={route.path}>
                    {route.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          )}

          <form onSubmit={handleCustomPathSubmit} className="flex-1 flex items-center gap-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={customPathInput}
                onChange={(e) => setCustomPathInput(e.target.value)}
                placeholder="/invitaciones/obsequio-de-graduacion.html o http://..."
                className="w-full bg-slate-950/70 text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
              title="Cargar ruta en todos los dispositivos"
            >
              Ir
            </button>
          </form>
        </div>

        {/* Right: Zoom Controls, Settings & Theme */}
        <div className="flex items-center gap-2.5">
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

          {/* Settings / IP Local Configuration */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors border border-slate-700"
            title="Configurar IP de red local o gestionar proyectos"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Selector */}
          <button
            onClick={() => {
              const themes: ('studio' | 'blueprint' | 'dark' | 'light')[] = ['studio', 'blueprint', 'dark', 'light'];
              const next = themes[(themes.indexOf(backdropTheme) + 1) % themes.length];
              setBackdropTheme(next);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title={`Fondo: ${backdropTheme}. Clic para alternar`}
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
            minWidth:
              viewMode === 'brands'
                ? `${(393 + 412 + 412 + 393) * globalZoom + 220}px`
                : viewMode === 'all'
                ? `${(mobileWidth + tabletWidth + laptopWidth) * globalZoom + 160}px`
                : 'auto',
          }}
        >
          {/* COMPARADOR 4 MARCAS MÓVILES (IPHONE · ANDROID · HUAWEI · XIAOMI) */}
          {viewMode === 'brands' && (
            <div className="flex items-start justify-center gap-8 flex-nowrap">
              {(Object.keys(MOBILE_BRANDS) as MobileBrand[]).map((bKey) =>
                renderMobileDeviceFrame({
                  brandKey: bKey,
                  isLandscape: brandLandscapes[bKey] ?? false,
                  onToggleLandscape: () =>
                    setBrandLandscapes((prev) => ({ ...prev, [bKey]: !prev[bKey] })),
                  onMaximize: () => {
                    setSelectedMobileBrand(bKey);
                    setViewMode('mobile');
                  },
                  showBrandSwitcher: false,
                })
              )}
            </div>
          )}

          {/* 1. CELULAR ACTIVO (CON SELECTOR DE MARCA) */}
          {(viewMode === 'all' || viewMode === 'mobile') &&
            renderMobileDeviceFrame({
              brandKey: selectedMobileBrand,
              isLandscape: mobileLandscape,
              onToggleLandscape: () => setMobileLandscape(!mobileLandscape),
              onMaximize: () => setViewMode(viewMode === 'mobile' ? 'all' : 'mobile'),
              showBrandSwitcher: viewMode === 'mobile',
            })
          }

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
                    {serverStatus === 'offline' && !standaloneFile ? (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white select-none">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 text-xl">
                          ⚠️
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">Servidor local desconectado</h4>
                        <p className="text-xs text-slate-400 max-w-[280px] mb-3 leading-relaxed">
                          El proyecto <span className="text-amber-400 font-semibold">{activeProject.name}</span> requiere que inicies su servidor en el puerto <span className="font-mono text-emerald-400">:{activeProject.port}</span>.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs font-mono text-emerald-400 mb-4 select-all">
                          npm run dev
                        </div>
                        <button
                          onClick={handleGlobalRefresh}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                        >
                          <RotateCw className="w-3.5 h-3.5" /> Reintentar conexión
                        </button>
                      </div>
                    ) : (
                      <iframe
                        key={`tablet-${refreshKey}-${resolvedTargetUrl}`}
                        ref={tabletIframeRef}
                        src={resolvedTargetUrl}
                        title="Vista Tableta"
                        className="w-full h-full border-0 bg-white"
                        loading="lazy"
                      />
                    )}
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
                    <div className="absolute top-2 left-4 flex items-center gap-1.5 z-30 max-w-[85%] truncate">
                      <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shrink-0" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shrink-0" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shrink-0" />
                      <span className="text-[11px] text-slate-400 font-mono ml-2 truncate">
                        {standaloneFile ? `archivo://${standaloneFile.name}` : activeProject.port ? `localhost:${activeProject.port}${currentPath}` : resolvedTargetUrl}
                      </span>
                    </div>

                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-700 z-30" />

                    <div className="w-full h-full rounded-md overflow-hidden bg-white relative shadow-inner">
                      {serverStatus === 'offline' && !standaloneFile ? (
                        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-10 text-center text-white select-none">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 text-2xl">
                            ⚠️
                          </div>
                          <h4 className="text-base font-bold text-white mb-1.5">Servidor local desconectado</h4>
                          <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                            El proyecto <span className="text-amber-400 font-semibold">{activeProject.name}</span> no responde en el puerto <span className="font-mono text-emerald-400">:{activeProject.port}</span>. Inicia el servidor de desarrollo en su terminal para previsualizarlo.
                          </p>
                          <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-emerald-400 mb-4 select-all">
                            npm run dev
                          </div>
                          <button
                            onClick={handleGlobalRefresh}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-lg"
                          >
                            <RotateCw className="w-4 h-4" /> Reintentar conexión
                          </button>
                        </div>
                      ) : (
                        <iframe
                          key={`laptop-${refreshKey}-${resolvedTargetUrl}`}
                          ref={laptopIframeRef}
                          src={resolvedTargetUrl}
                          title="Vista Portátil"
                          className="w-full h-full border-0 bg-white"
                          loading="lazy"
                        />
                      )}
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

      {/* FLOATING MINIMALIST DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.3)] rounded-full px-4 py-2 flex items-center gap-3">
          
          {/* 1. Mobile Icon (Celular Individual) */}
          <button
            onClick={() => handleSelectViewMode('mobile')}
            title="Vista Móvil Individual (iPhone · Android · Huawei · Xiaomi)"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group ${
              viewMode === 'mobile'
                ? 'bg-[#18181b] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* 1.5. Cuádruple Comparativa 4 Marcas Móviles */}
          <button
            onClick={() => handleSelectViewMode('brands')}
            title="Comparativa 4 Marcas (iPhone · Android · Huawei · Xiaomi simultáneos)"
            className={`px-3 h-8 rounded-full flex items-center gap-1.5 transition-all text-xs font-bold ${
              viewMode === 'brands'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">📱📱</span>
            <span className="hidden sm:inline">4 Marcas</span>
          </button>

          {/* 2. Tablet Icon (Tableta) */}
          <button
            onClick={() => handleSelectViewMode('tablet')}
            title="Vista Tableta (820px)"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group ${
              viewMode === 'tablet'
                ? 'bg-[#18181b] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Tablet className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* 3. Desktop / Laptop Icon */}
          <button
            onClick={() => handleSelectViewMode(viewMode === 'laptop' ? 'all' : 'laptop')}
            title="Vista Escritorio / Portátil (o Clic para alternar 3 Vistas)"
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all group ${
              viewMode === 'laptop' || viewMode === 'all'
                ? 'bg-[#18181b] text-white'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-5 h-5 transition-transform group-hover:scale-105" />
          </button>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200" />

          {/* 4. Popout / Open in New Tab Icon */}
          <button
            onClick={handleOpenPopout}
            title="Abrir página en pestaña completa"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group"
          >
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* 5. Reload / Refresh Icon */}
          <button
            onClick={handleGlobalRefresh}
            title="Recargar todas las vistas"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all group"
          >
            <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
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

      {/* QR CODE POPUP MODAL (REAL MOBILE TESTING) */}
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
              <span className="text-2xl">{standaloneFile ? '💌' : activeProject.icon}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Escanear con tu Smartphone Real
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-1">
              Probando: <strong>{standaloneFile ? standaloneFile.name : activeProject.name}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              Conecta tu teléfono al mismo WiFi que esta PC para abrir directamente.
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeImageSrc}
                alt="Código QR para probar en celular"
                className="w-52 h-52 rounded-xl object-contain"
              />
            </div>

            <div className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[11px] text-slate-700 truncate select-all">
                {resolvedLanUrl}
              </span>
              <button
                onClick={handleCopyLanUrl}
                className="shrink-0 text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {/* Guide for 4 OS hardware devices */}
            <div className="w-full bg-slate-100/90 rounded-2xl p-3 border border-slate-200/80 mb-3 text-left">
              <div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span>📱</span>
                <span>Instrucciones por Marca y Sistema Operativo:</span>
              </div>
              <div className="space-y-1 text-[10px] text-slate-600">
                <div className="flex items-start gap-1.5">
                  <span>🍏</span>
                  <span><strong>iPhone (iOS):</strong> Apunta con la app Cámara y toca la notificación amarilla para abrir en Safari WebKit.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span>🤖</span>
                  <span><strong>Android (Samsung / Pixel):</strong> Usa Google Lens o la Cámara para abrir directo en Chrome.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span>🔴</span>
                  <span><strong>Huawei (HarmonyOS):</strong> Escanea con la Cámara o la app de Huawei Browser.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span>🟠</span>
                  <span><strong>Xiaomi (HyperOS / MIUI):</strong> Usa la app nativa Escáner o la Cámara para abrir en Mi Browser.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQrModal(false);
                setShowSettingsModal(true);
              }}
              className="text-[11px] text-amber-600 hover:text-amber-700 font-medium underline"
            >
              ¿Cambiaste de red Wi-Fi? Cambiar IP Local ({localIp})
            </button>
          </div>
        </div>
      )}

      {/* ADD CUSTOM PROJECT MODAL */}
      {showAddProjectModal && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddProjectModal(false)}
        >
          <div
            className="bg-slate-900 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddProjectModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition font-bold text-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ➕
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Cargar Nuevo Desarrollo / Proyecto</h3>
                <p className="text-[11px] text-slate-400">Guarda un proyecto para inspeccionarlo en cualquier dispositivo</p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-3 mt-2 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Desarrollo:</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ej: Tienda Artesanía, WebApp 2026, Portafolio..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Puerto Localhost:</label>
                  <input
                    type="number"
                    value={newProjectPort}
                    onChange={(e) => setNewProjectPort(e.target.value)}
                    placeholder="Ej: 3000, 3005..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Icono / Emoji:</label>
                  <input
                    type="text"
                    value={newProjectIcon}
                    onChange={(e) => setNewProjectIcon(e.target.value)}
                    placeholder="Ej: ⚽, 🚀, 📸"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 text-center text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">O URL Base Completa (opcional):</label>
                <input
                  type="text"
                  value={newProjectBaseUrl}
                  onChange={(e) => setNewProjectBaseUrl(e.target.value)}
                  placeholder="Ej: https://midominio.vercel.app o http://192.168.1.50:8080"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rutas Frecuentes (separadas por coma):</label>
                <input
                  type="text"
                  value={newProjectRoutes}
                  onChange={(e) => setNewProjectRoutes(e.target.value)}
                  placeholder="/, /admin, /dashboard, /contacto"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs shadow-md"
                >
                  Guardar y Cargar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL (IP LAN & PROJECT MANAGER) */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="bg-slate-900 text-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-700 flex flex-col relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition font-bold text-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                ⚙️
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Configuración del Multi-Device Studio</h3>
                <p className="text-[11px] text-slate-400">Ajusta tu red local para pruebas físicas y administra proyectos</p>
              </div>
            </div>

            {/* IP Local Config */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
              <label className="block text-slate-200 font-bold text-xs mb-1">
                IP de Red Local (LAN Wi-Fi):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={localIp}
                  onChange={(e) => handleSaveLocalIp(e.target.value)}
                  placeholder="Ej: 192.168.1.15 o 192.168.137.1"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Esta es la dirección IP de tu computadora a la que tu smartphone se conectará al escanear el código QR.
              </p>
            </div>

            {/* Registered Projects Management */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Proyectos Disponibles ({projects.length}):</span>
                <button
                  onClick={handleResetProjects}
                  className="text-[10px] text-slate-400 hover:text-amber-400 underline transition"
                >
                  Restaurar predeterminados
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      handleProjectSelect(proj.id);
                      setShowSettingsModal(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                      selectedProjectId === proj.id
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{proj.icon}</span>
                      <span className="font-semibold truncate">{proj.name}</span>
                      {proj.port && (
                        <span className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono text-[9px]">
                          :{proj.port}
                        </span>
                      )}
                    </div>
                    {proj.id.startsWith('custom-') && (
                      <button
                        onClick={(e) => handleDeleteCustomProject(proj.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Eliminar proyecto personalizado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
              >
                Listo
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
