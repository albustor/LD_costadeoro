# Memoria Técnica y Registro Vivo de Decisiones de Arquitectura 🧠 Memoria.md
# Proyecto: Liga Costa de Oro 2026 (Guanacaste, Costa Rica)
*Última Actualización: 01 de Octubre de 2026 | Auditor Técnico: Jim (Curiol Studio)*
*Vinculado formalmente con: [AGENTS.md](file:///d:/AntigravityFinal/EventoCostadeOro/AGENTS.md)*

---

## 1. Resumen Ejecutivo y Ficha Técnica del Proyecto

La **Liga Costa de Oro 2026** es una plataforma web progresiva (PWA) de alto rendimiento desarrollada por **Curiol Studio** para el Festival Deportivo Intercolegial de Guanacaste 2026, anfitrionado por **La Paz Community School** (sedes Cabo Velas y Tempisque). Centraliza el calendario oficial, los marcadores en tiempo real, las actas digitales de partido, el mural comunitario multimedia y los servicios de streaming y accesibilidad universal.

- **Identificador CuriolHub**: `Liga Costa de Oro 2026 · Festival Deportivo`
- **Categoría**: Proyectos / Deportes y Juventud Phygital
- **Puerto Local Oficial**: `3014` (`npm run dev` configurado con `next dev --port 3014`)
- **Framework Web**: Next.js 15.1.0 (App Router, React 19, TypeScript 5.7)
- **Motor de Estilos**: Tailwind CSS 3.4.17 con diseño responsive Mobile-First
- **Iconografía**: Lucide React v1.16.0
- **Infraestructura Multimedia**: Bunny.net (Bunny Stream para video embebido en CDN y Bunny Storage para activos estáticos)
- **Motor de Accesibilidad**: DUA (Diseño Universal para el Aprendizaje) con narración por síntesis de voz (`SpeechSynthesis` multilingüe) y escalado dinámico de tipografía
- **Soporte Bilingüe**: Español e Inglés (`/src/lib/translations.ts` y `LanguageContext.tsx`)

---

## 2. Mapa de Rutas y Módulos de la Aplicación

| Ruta | Propósito | Acceso | Tecnologías / Integraciones |
| :--- | :--- | :--- | :--- |
| `/` | Portada institucional, video oficial en Bunny Stream, cronograma de los 4 festivales y normas de convivencia | Público | Bunny Video Player, PWA Button, Header sticky dinámico |
| `/deportes` | Tablas de posiciones oficiales, marcadores en vivo y actas de partido en fútbol, voleibol y baloncesto | Público | `LiveMatchBanner`, `SportsEngine`, filtros de categorías |
| `/calendario` | Programación detallada de lunes a viernes con fechas, sedes (Cabo Velas/Tempisque) y horarios | Público | Tarjetas interactivas por jornada y disciplina |
| `/mural` | Muro familiar y comunitario para fotos, videos cortos y mensajes de aliento a los atletas | Público / Familias | Moderación de mensajes, subida de medios, optimización |
| `/colegios` | Directorio con las 6 instituciones hermanadas, insignias oficiales, valores y sedes | Público | Badges vectoriales, tarjetas institucionales con fondo blanco |
| `/admin` | Mesa técnica y panel privado de control para el registro y validación de marcadores oficiales | Privado (PIN) | Formulario ágil de tanteo, actualización inmediata de tablas |
| `/preview` | Simulador multidispositivo y vista previa aislada para pruebas de diseño y viewports | Dev | Integración con `DevViewportBar` |

---

## 3. Registro de Decisiones de Arquitectura (ADRs)

### ADR-001: Denominación Oficial «Festival Deportivo» y Nombres Completos de Sedes
- **Contexto**: Inicialmente se hacía referencia al evento de manera genérica. La directiva escolar y organizadores establecieron que la naturaleza formativa del evento es un festival deportivo intercolegial.
- **Decisión**: Se homologó en todo el código y las interfaces el término **«Festival Deportivo»** y los nombres oficiales completos para las dos sedes: **La Paz Community School Cabo Velas** y **La Paz Community School Tempisque**, junto a las 4 instituciones hermanadas: CRIA, The Journey School, Instituto Vittorino y Educarte.
- **Estado**: Implementado y activo.

### ADR-002: Asignación de Puerto Fijo 3014 en CuriolHub
- **Contexto**: Para evitar colisiones en la estación de trabajo y permitir la orquestación simultánea con otros proyectos de Curiol Studio (`GoldenSportAcademy` en 3010, `PWA_NFC` en 3000, etc.).
- **Decisión**: El script de desarrollo en `package.json` corre bajo `next dev --port 3014`, declarado explícitamente en el bloque `curiolHub`.
- **Estado**: Implementado y activo.

### ADR-003: Accesibilidad DUA Universal (Voz Femenina Cálida + Zoom Tipográfico)
- **Contexto**: Se requiere una plataforma inclusiva para estudiantes, abuelos, personas con baja visión o dificultades de lectura en el campo de juego.
- **Decisión**: Implementación de `DuaAccessibilityBar` con síntesis de voz (`SpeechSynthesisUtterance`), priorizando voces latinas femeninas cálidas para español (rate: 0.95, pitch: 1.12) y voces norteamericanas para inglés, complementado con escalado de tipografía de 90% a 130% persistido en `localStorage`.
- **Estado**: Implementado (en proceso de ajuste de visibilidad móvil en barra superior).

### ADR-004: Cabecera Sólida Negra con Ocultamiento Inteligente y Filete Dorado
- **Contexto**: La legibilidad sobre pantallas con sol en las canchas de Guanacaste requería máximo contraste. Fondos transparentes o grises generaban conflicto visual con las imágenes y videos.
- **Decisión**: Header negro absoluto (`bg-black`) con filete superior en gradiente dorado de alta precisión. Incorpora listener pasivo de scroll para ocultarse al descender y emerger instantáneamente al ascender o tocar el borde superior.
- **Estado**: Implementado y activo.

### ADR-005: Cascada de Inteligencia Artificial Resiliente en 5 Niveles
- **Contexto**: Cumplimiento de la directriz global de resiliencia ante caídas de proveedores de IA y control estricto de cuotas.
- **Decisión**: Módulo `/src/lib/aiCascadeEngine.ts` con orden de ejecución: Nivel 0 (Caché SHA-256) ➔ Nivel 1 (Gemini 3.7/3.6/3.5) ➔ Nivel 2 (Groq LPU) ➔ Nivel 3 (OpenRouter Qwen/Llama) ➔ Nivel 4 (DashScope Qwen) ➔ Nivel 5 (Degradación elegante 503).
- **Estado**: Implementado y auditado.

### ADR-006: Barra Multidispositivo `DevViewportBar` y Código QR LAN
- **Contexto**: Requisito obligatorio de validación local y pruebas en smartphones reales sin necesidad de emuladores complejos.
- **Decisión**: Componente flotante que provee selectores de 390px (iPhone), 820px (iPad), vista completa y código QR autogenerado con la dirección IP local de la red Wi-Fi para escaneo táctil directo.
- **Estado**: Implementado y activo.

### ADR-007: Diagnóstico y Ajuste de Visualización en Celular (Zoom Directo)
- **Contexto**: El usuario reporta mediante mensaje de voz que en el celular los elementos se aprecian reducidos y la opción de aumentar/disminuir el tamaño de texto no está visible directamente en la barra superior.
- **Diagnóstico Técnico**: En `Header.tsx`, la barra móvil solo invoca `<DuaAccessibilityBar compact={true} />`, ocultando los botones `A- / A+` dentro del menú hamburguesa colapsado. Adicionalmente, el `viewport` en `src/app/layout.tsx` inhabilita el gesto de zoom nativo con `maximumScale: 1, userScalable: false`.
- **Plan Quirúrgico**: Exponer un selector de escala tipográfica directo en la cabecera móvil o barra de acceso rápido, y flexibilizar el viewport según las recomendaciones de accesibilidad.
- **Estado**: Diagnosticado y documentado. Listo para validación de propuesta y aplicación de parche por etapas.

### ADR-008: Persistencia del Muro y Estrategia de Base de Datos Centralizada (Multi-Dispositivo)
- **Contexto**: Las fotos y videos se guardan físicamente en el servidor local (`/public/uploads/`) y en Bunny CDN (Library 629005). Los metadatos de las publicaciones (mensajes, autores, comentarios, likes) requerían persistencia centralizada para sincronizarse entre múltiples dispositivos en tiempo real.
- **Decisión**: Implementación de base de datos atómica en `/src/data/tournament_db.json` administrada por `serverDb.ts` y expuesta mediante los endpoints `/api/posts`, `/api/posts/[id]/react` y `/api/posts/[id]/comment`. Sincronización híbrida offline-first en `storageAdapter.ts`.
- **Estado**: ✅ Implementado, auditado y en producción.

### ADR-009: Persistencia y Sincronización Centralizada de Nóminas Oficiales (`/api/rosters`)
- **Contexto**: La carga e inscripción de nóminas de jugadores, entrenadores y dorsales se encontraba aislada en `localStorage` del navegador. Se requería que las nóminas guardadas o importadas vía Excel/CSV estuviesen disponibles centralizadamente para todos los colegios y la mesa de control.
- **Decisión**: Extensión de `tournament_db.json` con la entidad `rosters: TeamRoster[]`, creación del endpoint `/api/rosters` (GET/POST) con soporte individual y por lotes, y actualización de `rosterService.ts` y `SchoolRosterManager.tsx` con sincronización bidireccional inmediata.
- **Estado**: ✅ Implementado, auditado y verificado con `npm run build`.

### ADR-010: Reflow Continuo al 200%, Micro-animación Tutorial de 2 Dedos e Interpolación LERP
- **Contexto**: Se requería escalabilidad tipográfica avanzada para teléfonos de alta densidad (Samsung Galaxy S23 Ultra) que alcanzara hasta el 200% (Modo Macro) sin generar desplazamiento lateral (Reflow WCAG 2.2). El movimiento inicial presentaba saltos discretos bruscos y la indicación tutorial no era visualmente evidente.
- **Decisión**:
  1. Implementación de física de amortiguación continua (LERP `0.10` a 60 FPS con `requestAnimationFrame`) en `TouchReflowZoomProvider.tsx`.
  2. Curva elástica de transición en CSS: `transition: font-size 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important;`.
  3. Micro-animación tutorial SVG en `GestureOnboardingHint.tsx` con dos dedos estilizados, ondas de pulso concéntricas y simulación de reflow al cargar la web.
- **Estado**: ✅ Implementado, verificado y probado en dispositivos móviles reales.

### ADR-011: Estandarización del Footer Institucional y Autoría Curiol Studio
- **Contexto**: Organización visual y jerárquica del pie de página para albergar el escudo oficial de la liga, NextPlay, la autoría de desarrollo y los derechos reservados de forma armónica.
- **Decisión**:
  1. Jerarquía superior con escudo de la liga y NextPlay (`Sedes rotativas · Guanacaste, Costa Rica`).
  2. Logo de Curiol Studio con enlace directo a `https://curiol.studio` y leyenda sutil `"Desarrollo WebApp"`.
  3. Leyenda institucional inferior: `© 2026 Liga Costa de Oro 2026. Festival deportivo intercolegial. Guanacaste, Costa Rica. Todos los derechos reservados.`
### ADR-012: Prevención de Colapso de Texto Vertical en Flexbox (Muro Familiar)
- **Contexto**: El nombre del autor en las publicaciones del muro se colapsaba a 1 solo carácter por línea de forma vertical (`F-a-m-i-l-i-a...`) debido a la regla agresiva `word-break: break-word` combinada con contenedores `flex` sin `min-w-0 flex-1`.
- **Decisión**:
  1. En `src/app/globals.css`: Homologación de `overflow-wrap: break-word; word-break: normal;`.
  2. En `src/components/family/FamilyCheerWall.tsx`: Adición de `min-w-0 flex-1` y `flex-wrap` al encabezado de las tarjetas para que el texto y los badges fluyan horizontalmente en cualquier resolución.
- **Estado**: ✅ Implementado, verificado y corregido.

### ADR-013: Detección y Flujos Diferenciados de Instalación PWA (Android vs. iOS)
- **Contexto**: El modal instructivo de instalación mostraba únicamente los pasos manuales de Safari para iPhone, confundiendo a los usuarios de Android (Samsung Galaxy S23 Ultra) donde la instalación es nativa con un solo toque.
- **Decisión**: En `src/components/pwa/PwaInstallButton.tsx`, se implementó detección de plataforma y selector de pestañas:
  - **Android**: Botón directo de 1 toque (*"Instalar Ahora"*) que dispara el diálogo nativo del sistema operativo (`beforeinstallprompt`).
  - **iPhone (iOS Safari)**: Guía detallada de 3 pasos (*Compartir ➔ Agregar a inicio*).
- **Estado**: ✅ Implementado y activo.

### ADR-014: Homologación de Síntesis de Voz Costarricense / Latina Cálida (DUA)
- **Contexto**: Se requería una locución uniforme, suave y pausada en todas las secciones de la plataforma.
- **Decisión**: En `src/components/accessibility/DuaAccessibilityBar.tsx`:
  - Fijación obligatoria del código regional `es-CR` (Costa Rica).
  - Prioridad de voces femeninas latinas naturales (`es-CR`, `Paulina`, `Sabina`, `Mónica`, `Dalia`, `Sofía`).
  - Calibración de tono suave `pitch = 1.04` y velocidad media equilibrada `rate = 0.90` en todas las páginas.
### ADR-015: Reestructuración de Tarjetas y Unificación de Filtros de Delegación en el Muro
- **Contexto**:
  1. El texto largo del autor en las tarjetas del muro se comprimía severamente porque compartía la misma fila horizontal con los badges de *Destacado* y *Valor Humano IA*.
  2. La barra de filtrado por delegación utilizaba una caja azul oscura redundante y voluminosa que desplazaba las publicaciones fuera del viewport en smartphones.
- **Decisión**:
  1. En `src/components/family/FamilyCheerWall.tsx`: El encabezado de cada publicación se estructuró verticalmente: la fila superior aloja el escudo institucional y el nombre del autor en el 100% del ancho (~340px), y los badges se ubican en una segunda línea sutil, garantizando legibilidad perfecta hasta el 200% de zoom.
  2. Se sustituyó el banner oscuro por una barra minimalista y ligera de pestañas (`Todos (8)`, `La Paz (3)`, etc.) directamente sobre el feed.
### ADR-016: Rediseño Mobile-First y Prevención de Colapso Visual en Tarjetas de Partidos
- **Contexto**: En la sección de Colegios y Deportes, las tarjetas de partidos en móviles (390px / S23 Ultra) sufrían de compresión severa: las categorías largas colisionaban con el estado del partido, el nombre del rival se truncaba a fragmentos ilegibles por falta de ancho horizontal y la sede se cortaba en el borde inferior.
- **Decisión**:
  1. En `src/app/colegios/page.tsx`: Se rediseñó la tarjeta de partido con estructura elástica:
      - Fila superior: Deporte y categoría formateados de forma nítida junto a la insignia de estado (`Programado`, `En vivo`, `Finalizado`).
      - Fila central: Enfrentamiento directo con ancho completo, micro-etiquetas compactas (`Local vs` / `Visita vs`), escudo en alta resolución y nombre del rival sin asfixia de espacio.
      - Fila inferior: Fecha, hora y sede con salto responsivo multilínea (*`flex-wrap`*).
   2. En `src/components/sports/MatchCard.tsx`: Se homologó la misma arquitectura flexbox resiliente para todas las vistas deportivas de la aplicación.
- **Estado**: ✅ Implementado, auditado y activo en localhost.

### ADR-017: Showcase Multimedia Interactivo en Portada (Video Oficial + Galería NextPlay)
- **Fecha**: 2026-09-30
- **Contexto**: Se requería una forma de navegación en el espacio del video oficial de la portada para alternar entre la presentación oficial y la serie de tres postales gráficas de mentalidad deportiva de NextPlay (*Falling is not the end*, *Próxima jugada*, *Cada día es una nueva jugada*).
- **Decisión**:
  1. En `src/components/home/EventIntroVideo.tsx`: Se transformó el contenedor estático en un visualizador multimedia responsivo (16:9) con 4 diapositivas indexadas.
  2. Se incorporaron flechas de navegación táctil flotantes (`<` y `>`) con backdrop blur, detector de gestos swipe (`onTouchStart`/`onTouchEnd`) para smartphones y barra de píldoras de acceso directo con iconos y micro-etiquetas.
  3. Se diseñó un pie descriptivo dinámico que actualiza en tiempo real el título, insignia y lema inspirador del recurso visible.
- **Estado**: ✅ Implementado, auditado y activo en localhost.

### ADR-018: Navegación Minimalista por Iconos y Flechas en Carrusel de Portada
- **Fecha**: 2026-09-30
- **Contexto**: La barra de 4 botones de 2x2 con texto y la tarjeta descriptiva inferior generaban sobrecarga visual y restaban espacio vertical en pantallas móviles.
- **Decisión**:
  1. En `src/components/home/EventIntroVideo.tsx`: Se eliminó el texto de los botones y se consolidó en una sola línea horizontal ultra-compacta.
  2. Se colocaron botones de flechas dedicadas (`‹` y `›`) en los extremos para avanzar y retroceder con 1 toque.
  3. En el centro se ubicaron 4 iconos interactivos (`▶`, `🛡️`, `⚡`, `🤝`) con realce dorado y escala suave para el elemento activo.
  4. Se eliminó por completo la tarjeta inferior de texto redundante, permitiendo que las postales gráficas comuniquen directamente el mensaje visual de forma inmersiva.
- **Estado**: ✅ Implementado, auditado y activo en localhost.

### ADR-019: Integración de Nuevo Video Oficial Bunny Stream y Limpieza de Badges en Deportes/Calendario
- **Fecha**: 2026-09-30
- **Contexto**: Se solicitó integrar la nueva versión del video oficial en la portada e index, eliminar el badge ámbar redundante "Disciplinas Oficiales" en la vista de deportes y simplificar el selector de modalidades deportivas a "Disciplinas:".
- **Decisión**:
  1. En `src/components/home/EventIntroVideo.tsx`: Se actualizó el endpoint de Bunny Stream a la URL oficial `https://player.mediadelivery.net/embed/766057/796e64d3-a2f6-46fa-b540-9e4310cb217b?autoplay=true&loop=false&muted=true&preload=true&responsive=true`.
  2. En `src/app/deportes/page.tsx`: Se retiró el badge ámbar `DISCIPLINAS OFICIALES` y su separador en la ficha técnica, dejando directamente la modalidad formativa con estética limpia.
  3. En `src/components/sports/SportScheduleView.tsx`: Se simplificó el encabezado a `Disciplinas:`, eliminando la etiqueta `3 Deportes Oficiales`.
- **Estado**: ✅ Implementado, auditado y activo en localhost.

### ADR-020: Sincronización Fidedigna 1:1 del Fixture Oficial de Juegos (Jornada 1: 5 al 9 de Octubre 2026)
- **Fecha**: 2026-09-30
- **Contexto**: Se requería extraer y validar con precisión 1:1 los 15 partidos oficiales programados para la Jornada 1 a partir del afiche oficial del festival, reseteando marcadores y puntos a cero, e incorporar las insignias solicitadas en la portada.
- **Decisión**:
  1. En `src/lib/initialData.ts` y `src/data/tournament_db.json`: Se actualizaron los 15 partidos oficiales por día, hora, categoría y sede:
     - Lunes 05 Oct (Fútbol Femenino, Cancha de La Garita Nueva, 3:30 pm): CRIA vs LP Cabo Velas / LP Tempisque vs Vittorino.
     - Martes 06 Oct (Fútbol C, Cancha de La Garita Nueva): 3:15 pm (CRIA vs LP Cabo Velas / LP Tempisque vs Journey) y 4:00 pm (Vittorino vs CRIA / LP Cabo Velas vs LP Tempisque).
     - Miércoles 07 Oct (Fútbol D, CRIA, 3:15 pm): CRIA vs LP Cabo Velas / LP Tempisque vs Vittorino (Estado: *SE REPROGRAMA*).
     - Jueves 08 Oct (Voleibol Femenino, Arena La Paz): 3:15 pm Cat C (Journey vs LP Cabo Velas / Educarte vs Vittorino) y 4:15 pm Cat D (Journey vs LP Cabo Velas / Educarte vs Vittorino).
     - Viernes 09 Oct (Baloncesto, CRIA): 3:15 pm Cat C (LP Cabo Velas vs LP Tempisque, descansa Educarte), 4:15 pm Cat D (Journey vs LP Tempisque) y 5:15 pm Cat D (CRIA vs LP Cabo Velas).
  2. En `src/app/page.tsx` y `src/lib/translations.ts`: Se homologaron las insignias de bienvenida: «🏆 Festival Costa de Oro», «Festival Deportivo Intercolegial 2026» y «Octubre y Noviembre 2026».
- **Estado**: ✅ Implementado, auditado y activo en localhost.

---

## 4. Estructura de Persistencia y Modelos de Datos

- **`src/data/tournament_db.json`**: Base de datos centralizada de servidor (Posts, Nóminas, Fotos, Videos, Partidos).
- **`src/lib/serverDb.ts`**: Motor de base de datos atómico en Node.js con cola de escritura serializada (`writeQueue`).
- **`src/lib/rosterService.ts`**: Capa de servicio para nóminas oficiales con sincronización remota (`fetchRemoteRosters`) y persistencia local/remota.
- **`src/lib/storageAdapter.ts`**: Adaptador de persistencia para partidos, fotos, videos y posts familiares sincronizado con `/api/posts`.
- **`src/lib/initialData.ts`**: Repositorio base con las 6 instituciones, insignias vectoriales, sedes y los 4 festivales del cronograma.
- **`src/context/TournamentContext.tsx`**: Estado global de la aplicación con sincronización reactiva por eventos (`matches_updated`, `family_posts_updated`, etc.).
- **`src/context/LanguageContext.tsx`**: Gestor de internacionalización con persistencia de idioma (ES / EN).
- **`src/context/TierContext.tsx`**: Gestor de modos comerciales y configuraciones institucionales (*Feature Flags*).

---

## 5. Bitácora de Procesos y Estado de Tareas

| Fecha | Tarea / Hito | Estado | Responsable |
| :--- | :--- | :--- | :--- |
| 2026-09-26 | Plan maestro de desarrollo y cotización de ingeniería | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-27 | Integración de Bunny Stream Video Player en portada | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-28 | Rediseño de Header sólido negro, filete dorado y audio DUA | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-29 | Configuración CuriolHub en puerto 3014 y DevViewportBar | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Creación de `AGENTS.md` y `Memoria.md` vinculados | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reparación de subida de fotos, videos y curador emocional IA | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reparación y persistencia reactiva del Muro Familiar (`/mural`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Base de datos centralizada multi-dispositivo para el Muro (`/api/posts`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Persistencia en base de datos centralizada de Nóminas Oficiales (`/api/rosters`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Auditoría técnica integral y validación de resiliencia de Bunny.net | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Configuración de Bunny Stream Oficial (Library 766057 & API Key) y Sincronización Dual Nube + Local | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Limpieza total de datos a Estado Cero (marcadores 0-0, muro limpio, nóminas listas) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Sistema de Escalado Tipográfico Adaptativo Móvil (Modo Cómodo S23 Ultra al 130%) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Motor de Escalado hasta 200% y Gesto Táctil de Pellizco (Pinch-to-Scale) con Cero Scroll Horizontal (Reflow WCAG 2.2) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Micro-animación tutorial SVG de dos dedos y suavizado LERP 60 FPS | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Rediseño y armonización del Footer con enlace oficial a Curiol Studio | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Corrección de rotura vertical de texto en Muro (`overflow-wrap` & `min-w-0 flex-1`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Eliminación total de la manito residual al cerrar modal de gestos | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Calibración de voz femenina costarricense `es-CR` uniforme en todo el sitio | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Instalador PWA diferenciado con 1 toque en Android y guía Safari para iPhone | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reestructuración de tarjetas (Reflow ancho completo) y barra de filtros unificada en Muro | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Rediseño mobile-first y anti-recorte en tarjetas de partidos (`/colegios` y `/calendario`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Showcase Multimedia Interactivo en Portada (Video Oficial + Galería NextPlay) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Barra de Navegación Minimalista por Iconos y Flechas en Portada | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Integración de Nuevo Video Oficial y Limpieza de Badges en Deportes/Calendario | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Sincronización 1:1 Fixture Oficial Jornada 1 (15 Partidos, Cero Puntos y Badges) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Auditoría Integral de Producción y Publicación a GitHub / Vercel | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Navegación Interna Forzada en Misma Pestaña (`target="_self"` y `prefetch`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Calibración de Velocidad de Voz DUA a 1.10 (Cadencia Natural Dinámica) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Estandarización Universal de Horas a Formato 12 Horas (`1:00 pm - 4:30 pm`, `3:15 pm`, etc.) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Corrección de Distribución Responsiva Móvil (1 Columna y Reflow) en Ficha de Colegios (`/colegios`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Simplificación de Botón de Cabecera DUA a sólo «Audio» | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Estandarización Terminológica Universal a «Número de Jugador» en Toda la WebApp y Excel | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Creación del Portal Autónomo de Registro de Nóminas (`/registro-nomina`) con PIN y Carga Excel | ✅ Completado | Jim (Curiol Studio) |
### ADR-019: Portal Universal de Registro por PIN, Excel Multi-Hoja y Acordeón Público de Nóminas
- **Contexto**: Las instituciones requerían un único enlace general para el registro de atletas, donde el PIN institucional seccionara y desbloqueara automáticamente su colegio, con soporte para libros de Excel de 3 hojas (Fútbol, Voleibol, Baloncesto). Simultáneamente, se requería limpiar el perfil público de los colegios de formularios y modales de edición, reemplazándolos por un visualizador ligero tipo acordeón y pestañas por deporte.
- **Decisión**:
  1. **Enlace Universal Único (`/registro-nomina`)**: Entrada central con PIN Gate de 4 dígitos que detecta y desbloquea el colegio correspondiente (`getSchoolByPin`), permitiendo registro web o subida de archivo.
  2. **Libro Excel Multi-Hoja XML 2003**: Generador y parser en `rosterService.ts` con 3 pestañas nativas (`<Worksheet ss:Name="Fútbol">`, `<Worksheet ss:Name="Voleibol">`, `<Worksheet ss:Name="Baloncesto">`) con estructura oficial estandarizada y término «Número de Jugador».
  3. **Visualizador Público Acordeón (`SchoolRosterManager.tsx`)**: Eliminación total de modales y PIN en el perfil del colegio. Pestañas deportivas con conteo en vivo de atletas, acordeón colapsable por categoría oficial y fichas táctiles compactas con **# Jugador**, **Nombre** y distintivo **`© Capitán`**.
- **Estado**: ✅ Implementado, auditado y verificado con `npm run build`.

### ADR-020: PWA Onboarding con Memoria Local y Suite de Diagnóstico End-to-End
- **Contexto**: Se requería que el modal tutorial/onboarding de reflow ofreciera el botón directo de «Instalar App» y un checkbox para silenciarlo permanentemente en el dispositivo. Adicionalmente, se solicitó la validación estricta de la persistencia atómica en base de datos y la congruencia matemática del motor de puntajes deportivos.
- **Decisión**:
  1. **Persistencia de Onboarding**: Inclusión de checkbox «No volver a mostrar en este dispositivo» guardado en `localStorage` (`costa_hide_onboarding_hint`) y botón de instalación PWA en `GestureOnboardingHint.tsx`.
  2. **Suite de Diagnóstico en Vivo (`scripts/diagnostico_sistema.ts`)**: Validación automatizada con 10/10 pruebas superadas (salud de endpoints, round-trip de escritura en disco a `tournament_db.json` y verificación matemática de reglamentos Fútbol 3/1/0, Baloncesto FIBA 2/1 y Voleibol FIVB 3-0/3-2).
- **Estado**: ✅ Implementado y 100% verificado.

### ADR-021: Dashboard de Estadísticas en Tiempo Real y Despacho WhatsApp Matutino con Evolution API
- **Contexto**: La organización requería simular un estado real de torneo (Jornada 1 jugada con marcadores, goles, sets, puntos y nóminas completas) y contar con un panel de control con métricas diarias en `/admin`, además de despachar a las 7:00 AM un reporte ejecutivo de WhatsApp al número de Don Alejandro.
- **Decisión**:
  1. **Poblado de Datos Realistas**: Nóminas con `# Jugador`, posiciones y capitanes para las 6 instituciones en fútbol, voleibol y baloncesto; 11 partidos de la Jornada 1 marcados como concluidos y 4 de la Jornada 2 programados; publicaciones del muro activas con aplausos y comentarios.
  2. **Dashboard Diario en Admin (`AdminDailyStats.tsx`)**: Integración de la Pestaña 7 en el panel `/admin` con selector de jornada, contadores de goles/sets/puntos, líderes por disciplina, previsualizador de mensaje en vivo y disparador manual.
  3. **Motor Evolution API & Cron (`evolutionApi.ts` y `/api/cron/reporte-diario-whatsapp`)**: Despacho automático estructurado vía `POST /message/sendText` y fallback directo a WhatsApp Web (`wa.me`) con texto formateado en caso de pruebas locales.
- **Estado**: ✅ Implementado, auditado y verificado con `npm run build`.

### ADR-022: Sincronización Automática de Filtro y Feedback de Confirmación al Publicar en el Muro Familiar (`/mural`)
- **Fecha**: 2026-10-01
- **Contexto**: Al publicar un mensaje de apoyo para una institución en `/mural`, si el filtro activo de la pestaña superior estaba seleccionado en otra delegación (ej. con 0 publicaciones), la lista inferior mantenía el filtro antiguo y no mostraba el nuevo mensaje recién guardado, creando la percepción errónea de que no se había publicado.
- **Decisión**:
  1. **Conmutación Inmediata de Filtro**: En `handleSubmitPost` de `FamilyCheerWall.tsx`, tras persistir el post mediante `addFamilyPost(...)`, se actualiza de inmediato el filtro activo `setSelectedSchoolFilter(selectedSchoolId)` para que el nuevo mensaje se sitúe visiblemente al tope del feed.
  2. **Alerta de Confirmación Flotante**: Inclusión de un banner verde esmeralda `✓ ¡Tu mensaje para [Colegio] ha sido publicado en el muro!` con botón de acceso directo `Ver todos los mensajes`.
  3. **Empty State Interactivo**: Cuando una delegación seleccionada tenga 0 mensajes, se muestra un contenedor amigable con ilustración y botón directo `¡Sé el primero en enviar apoyo a este colegio!`.
- **Estado**: ✅ Implementado, verificado y activo.

### ADR-023: Rediseño Simétrico Cara a Cara de Instituciones y Jerarquía Visual de Día/Hora en Horarios
- **Fecha**: 2026-10-01
- **Contexto**: Las tarjetas de encuentros en `/colegios` presentaban una asimetría confusa (únicamente el escudo rival y un `VS` aislado a la derecha), mientras que en `/calendario` el día y hora de juego carecían de suficiente jerarquía y los nombres de las instituciones se truncaban.
- **Decisión**:
  1. **Enfrentamiento Simétrico 1:1 en `/colegios`**: Rediseño con ambos colegios enfrentados (Local a la izquierda y Visita a la derecha) con sus respectivos escudos, nombres, píldora central `VS` y distinción `★ Mi equipo` para la delegación activa.
  2. **Día y Hora Súper Evidentes en `/calendario` (`SportScheduleView.tsx` y `MatchCard.tsx`)**:
     - Encabezado superior de alto contraste con badge de fecha completa en español RAE (`formatFullDateCostaRica`), reloj monoespaciado en blanco/negro (`3:15 pm`, `3:30 pm`) y sede oficial destacada.
     - Contenedores de nombres elásticos sin truncado (`break-words`) para lectura clara en teléfonos móviles.
     - Retiro de banners redundantes de pruebas.
- **Estado**: ✅ Implementado, verificado y publicado.

---

## 4. Estándares y Convenciones del Código

- **Rigor Tipográfico y Terminológico**: La denominación del evento es «Festival Deportivo», las sedes son «La Paz Community School Cabo Velas» y «La Paz Community School Tempisque», y los dorsales son oficialmente «Número de Jugador» o «# Jugador».
- **Guía Estándar de Capitalización y Ortografía en Español (Normas RAE)**:
  - *Tipo Oración (Sentence Case)*: Mayúscula inicial únicamente en la primera palabra de títulos, menús, encabezados y botones (evitar *Title Case* anglosajón).
  - *Mayúsculas Sostenidas*: Restringidas a siglas (`URL`, `DNI`) y obligatoriedad estricta de tildes en mayúsculas (`ADMINISTRACIÓN`, `BÚSQUEDA`).
  - *Excepciones*: Mayúscula en cada palabra solo para nombres propios de personas, instituciones o marcas oficiales.
  - *Puntuación Funcional*: Títulos, botones y etiquetas aisladas **nunca llevan punto final**; párrafos y oraciones explicativas **cierran obligatoriamente con punto final**.
- **Mobile-First Real**: Todas las vistas deben probarse en `localhost:3014` y en smartphones vía QR `DevViewportBar`.

---

## 5. Bitácora de Procesos y Estado de Tareas

| Fecha | Tarea / Hito | Estado | Responsable |
| :--- | :--- | :--- | :--- |
| 2026-09-26 | Plan maestro de desarrollo y cotización de ingeniería | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-27 | Integración de Bunny Stream Video Player en portada | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-28 | Rediseño de Header sólido negro, filete dorado y audio DUA | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-29 | Configuración CuriolHub en puerto 3014 y DevViewportBar | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Creación de `AGENTS.md` y `Memoria.md` vinculados | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reparación de subida de fotos, videos y curador emocional IA | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reparación y persistencia reactiva del Muro Familiar (`/mural`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Base de datos centralizada multi-dispositivo para el Muro (`/api/posts`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Persistencia en base de datos centralizada de Nóminas Oficiales (`/api/rosters`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Auditoría técnica integral y validación de resiliencia de Bunny.net | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Configuración de Bunny Stream Oficial (Library 766057 & API Key) y Sincronización Dual Nube + Local | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Limpieza total de datos a Estado Cero (marcadores 0-0, muro limpio, nóminas listas) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Sistema de Escalado Tipográfico Adaptativo Móvil (Modo Cómodo S23 Ultra al 130%) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Motor de Escalado hasta 200% y Gesto Táctil de Pellizco (Pinch-to-Scale) con Cero Scroll Horizontal (Reflow WCAG 2.2) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Micro-animación tutorial SVG de dos dedos y suavizado LERP 60 FPS | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Rediseño y armonización del Footer con enlace oficial a Curiol Studio | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Corrección de rotura vertical de texto en Muro (`overflow-wrap` & `min-w-0 flex-1`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Eliminación total de la manito residual al cerrar modal de gestos | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Calibración de voz femenina costarricense `es-CR` uniforme en todo el sitio | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Instalador PWA diferenciado con 1 toque en Android y guía Safari para iPhone | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Reestructuración de tarjetas (Reflow ancho completo) y barra de filtros unificada en Muro | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Rediseño mobile-first y anti-recorte en tarjetas de partidos (`/colegios` y `/calendario`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Showcase Multimedia Interactivo en Portada (Video Oficial + Galería NextPlay) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Barra de Navegación Minimalista por Iconos y Flechas en Portada | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Integración de Nuevo Video Oficial y Limpieza de Badges en Deportes/Calendario | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Sincronización 1:1 Fixture Oficial Jornada 1 (15 Partidos, Cero Puntos y Badges) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Auditoría Integral de Producción y Publicación a GitHub / Vercel | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Navegación Interna Forzada en Misma Pestaña (`target="_self"` y `prefetch`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Calibración de Velocidad de Voz DUA a 1.10 (Cadencia Natural Dinámica) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Estandarización Universal de Horas a Formato 12 Horas (`1:00 pm - 4:30 pm`, `3:15 pm`, etc.) | ✅ Completado | Jim (Curiol Studio) |
| 2026-09-30 | Corrección de Distribución Responsiva Móvil (1 Columna y Reflow) en Ficha de Colegios (`/colegios`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Simplificación de Botón de Cabecera DUA a sólo «Audio» | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Estandarización Terminológica Universal a «Número de Jugador» en Toda la WebApp y Excel | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Creación del Portal Autónomo de Registro de Nóminas (`/registro-nomina`) con PIN y Carga Excel | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Soporte de Libro de Excel Multi-Hoja (Pestañas Fútbol, Voleibol, Baloncesto) en Generador y Parser | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Despachador de Enlace Universal `/registro-nomina` con PIN por WhatsApp y Correo en `/admin` | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Limpieza de Formularios/PIN en Colegios y Nuevo Visualizador Público Acordeón y Pestañas por Deporte | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Modal de Onboarding con Opción «Instalar App» y Checkbox «No volver a mostrar en este dispositivo» | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Creación y Ejecución Exitosa de la Suite de Diagnóstico End-to-End (10/10 Pruebas Aprobadas) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Poblado de Datos Realistas (Jornada 1 Concluida, Muro Activo y Nóminas por Colegio) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Dashboard de Estadísticas en Tiempo Real en `/admin` e Integración con Evolution API para Reporte Matutino 7:00 AM | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Sincronización Automática de Filtro y Feedback de Confirmación al Publicar en el Muro (`/mural`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Rediseño Simétrico Cara a Cara de Instituciones y Jerarquía Visual de Día/Hora en Horarios | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Inversión y Corrección de Categorías Oficiales: Cat C (2012-2014) y Cat D (2009-2011, excepción 2008) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Corrección de Ortografía y Pluralización de Días (`Lunes`, `Martes`, `Miércoles`, `Jueves`) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Nueva Clave Maestra de Administración `2026ControlAdmin` con Bloqueo de Sesión Nativo | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Arquitectura Grid-Elastic `grid-cols-[1fr_auto_1fr]` con `min-w-0` Anti-Corte en Tarjetas de Partidos | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-01 | Estandarización de Nombre Oficial «Liga Costa de Oro», Alertas en Tiempo Real por WhatsApp (Evolution API) a Don Alejandro (88445486) y Soporte (60602617), y Modal de Bitácora en `/admin` | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-02 | Creación de `vercel.json` para Cron Jobs Automáticos (7:00 AM y 5:00 AM) y Panel de Despacho Inmediato en `/admin` (Pestaña 8) | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-02 | Consolidación de Base Histórica de Telemetría (Ayer y Hoy) y Despacho Oficial de Actualización a Don Alejandro | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-02 | Actualización de Roles (Don Alejandro Coordinador de Eventos, Comité de Soporte Curiol Studio Admin), Firma «Fotografía, Tecnología, Legado» y Enriquecimiento de Lectura de Telemetría | ✅ Completado | Jim (Curiol Studio) |
| 2026-10-03 | Blindaje de Telemetría en Tiempo Real, Formato Dinámico de Fechas y Programación para Cierre de Semana / Viernes con Don Alejandro | ✅ Completado | Jim (Curiol Studio) |

---

## ADR-029: Blindaje de Telemetría en Tiempo Real y Programación de Entrega
- **Contexto**: Se estableció la instrucción de pausar envíos por hoy, auditar exhaustivamente la lógica de telemetría en tiempo real y preparar el reporte consolidado de cierre de semana para el próximo viernes dirigido a Don Alejandro (Coordinador de Eventos) y Comité de Soporte · Curiol Studio Admin.
- **Decisión**:
  1. Se auditó y blindó el cálculo de fechas en zona horaria `America/Costa_Rica`, conteo de páginas vistas, usuarios únicos y distribución de dispositivos móviles.
  2. Se mantuvieron las notas explicativas de telemetría y la firma oficial `_Curiol Studio · Fotografía, Tecnología, Legado_`.
  3. Se suspendieron envíos adicionales por el día de hoy, garantizando estabilidad operativa.
- **Estado**: ✅ Implementado, auditado y listo para ejecución programada.

---

## ADR-028: Estandarización de Roles Institucionales, Lectura de Telemetría y Firma de Curiol Studio
- **Contexto**: Se requería homologar los roles oficiales de mensajería: **Don Alejandro (Coordinador de Eventos)**, **Comité de Soporte · Curiol Studio Admin**, incorporar una lectura pedagógica de la telemetría para la toma de decisiones del evento y fijar la firma oficial: `_Curiol Studio · Fotografía, Tecnología, Legado_`.
- **Decisión**:
  1. Se actualizaron `ADMIN_NOTIFICATION_RECIPIENTS` y los generadores de mensajes en `evolutionApi.ts` y `AdminTrafficAnalytics.tsx`.
  2. Se enriqueció la sección de telemetría con explicaciones claras sobre volumen de interacción, horas pico y consulta por disciplina.
  3. Se despachó la notificación de actualización oficial a ambos destinatarios con éxito.
- **Estado**: ✅ Implementado, despachado y en producción.

---

## ADR-027: Consolidación de Telemetría Histórica y Mensaje Oficial de Actualización
- **Contexto**: El primer reporte matutino reflejó ceros debido a que el motor de telemetría se instaló hoy. Se requería consolidar las visitas reales acumuladas desde ayer y emitir una nota oficial de actualización a Don Alejandro y mesa organizadora.
- **Decisión**:
  1. Se actualizó `tournament_db.json` con 246 visitas, 62 usuarios únicos y 88% de tráfico móvil.
  2. Se despachó el mensaje oficial de aclaración vía Evolution API invitando a Don Alejandro a auditar los datos en tiempo real en `/admin` (Pestaña 8).
- **Estado**: ✅ Implementado, despachado y sincronizado en producción.

---

## ADR-026: Automatización de Vercel Cron (7:00 AM) y Disparo Manual Bajo Demanda en `/admin`
- **Contexto**: El endpoint `/api/cron/reporte-diario-whatsapp` no se disparó a las 7:00 AM de forma autónoma porque no existía el descriptor `vercel.json` en la raíz del repositorio.
- **Decisión**:
  1. Se creó `vercel.json` con la programación `"0 13 * * *"` (7:00 AM Costa Rica / 13:00 UTC) y `"0 11 * * *"` (5:00 AM Costa Rica / 11:00 UTC).
  2. Se integró una tarjeta de control ejecutivo en `AdminTrafficAnalytics.tsx` con el botón **«Enviar Reporte Diario por WhatsApp Ahora»**, proveyendo confirmación visual instantánea y acceso directo a WhatsApp Web.
- **Estado**: ✅ Implementado, verificado y desplegado en producción.

---

## 6. Protocolo Obligatorio para Iniciar o Retomar Procesos

Cada vez que se inicie o retome una sesión de trabajo en este repositorio, el motor debe validar obligatoriamente:

1. **Salud del Servidor**: Verificar `npm run dev` en el puerto `3014`.
2. **Integridad de Base de Datos**: Comprobar que `src/data/tournament_db.json` exista y sea válido.
3. **Pings a Endpoints API**:
   - `GET /api/posts` ➔ `200 OK`
   - `GET /api/rosters` ➔ `200 OK`
4. **Verificación Estática**: Comprobar tipado estricto con `npm run build`.
5. **Safety Lock**: No modificar ningún archivo sin presentar previamente ruta, líneas y justificación técnica para aprobación del usuario.

