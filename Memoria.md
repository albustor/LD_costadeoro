# Memoria Técnica y Registro Vivo de Decisiones de Arquitectura 🧠 Memoria.md
# Proyecto: Liga Deportiva Costa de Oro 2026 (Guanacaste, Costa Rica)
*Última Actualización: 30 de Septiembre de 2026 | Auditor Técnico: Jim (Curiol Studio)*
*Vinculado formalmente con: [AGENTS.md](file:///d:/AntigravityFinal/EventoCostadeOro/AGENTS.md)*

---

## 1. Resumen Ejecutivo y Ficha Técnica del Proyecto

La **Liga Deportiva Costa de Oro 2026** es una plataforma web progresiva (PWA) de alto rendimiento desarrollada por **Curiol Studio** para el Festival Deportivo Intercolegial de Guanacaste 2026, anfitrionado por **La Paz Community School** (sedes Cabo Velas y Tempisque). Centraliza el calendario oficial, los marcadores en tiempo real, las actas digitales de partido, el mural comunitario multimedia y los servicios de streaming y accesibilidad universal.

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
| 2026-09-30 | Despliegue Oficial en Producción Vercel (`https://costadeoro.curiol.studio`) | ✅ Completado | Jim (Curiol Studio) |

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
