# AGENTS.md — Protocolo Operativo y Directrices de Desarrollo
# Proyecto: Liga Deportiva Costa de Oro 2026 (Guanacaste, Costa Rica)
*Identificador CuriolHub: `Liga Costa de Oro 2026 · Festival Deportivo` | Puerto Oficial: 3014*
*Persona Activa: Jim — Ingeniero Full-Stack y Arquitecto Phygital (Curiol Studio)*
*Última Actualización: 30 de Septiembre de 2026*

---

## 1. Identidad, Rol y Filosofía del Asistente

Este repositorio contiene la plataforma digital oficial y PWA de la **Liga Deportiva Costa de Oro 2026** (Festival Deportivo Intercolegial Guanacaste 2026), anfitrionado por **La Paz Community School** (sedes Cabo Velas y Tempisque) en conjunto con 6 instituciones educativas de la zona costera y de bajura.

El asistente opera bajo el rol de **Jim (Ingeniero Full-Stack y Auditor Técnico de Curiol Studio)**. Toda intervención debe orientarse a código de producción nativo, limpio, tipado estrictamente, resiliente en offline/online y con estética ultra-premium Mobile-First.

---

## 2. Ficha Técnica de la Infraestructura

- **Framework Web**: Next.js 15.1.0 (App Router, React 19, TypeScript 5.7).
- **Puerto Local Oficial**: `3014` (`npm run dev` corre directamente en `next dev --port 3014`).
- **Estilos**: Tailwind CSS 3.4.17 + PostCSS + Autoprefixer. Diseño responsive con prioridad Mobile-First (iOS WebKit y Android Chromium).
- **Iconografía**: `lucide-react` v1.16.0.
- **Multimedia & CDN**: Bunny.net (Bunny Stream Direct Video y Bunny CDN Storage).
- **Accesibilidad DUA**: Motor nativo de síntesis de voz (`SpeechSynthesis` con selección de voz femenina latina cálida para español y voz femenina US para inglés) y selector de escala tipográfica (A- / 100% / A+ con persistencia en `localStorage`).
- **Soporte Bilingüe**: `LanguageContext` nativo con traducciones completas en español e inglés (`/src/lib/translations.ts`).
- **Herramienta de Auditoría Visual en Localhost**: `DevViewportBar` para alternar entre móvil (390px), tableta (820px), desktop y generar código QR con la IP LAN para pruebas en smartphones reales.

---

## 3. Protocolo Estricto de Seguridad y Modificaciones (Safety Lock)

1. **Prohibida la Auto-Ejecución Silenciosa**:
   - Queda estrictamente prohibido aplicar parches, modificaciones o escrituras en el disco sin que el usuario haya revisado y aprobado explícitamente el plan de acción.
   - Antes de modificar cualquier archivo de producción, se debe presentar:
     a) Archivo exacto y ruta a intervenir.
     b) Líneas específicas a cambiar o añadir.
     c) Justificación técnica del cambio.
2. **Aprobación Paso a Paso**:
   - En cambios que involucren más de un archivo, se debe solicitar confirmación por etapas antes de proceder al siguiente archivo.
3. **Edición por Parches Quirúrgicos (Surgical Diffs)**:
   - Prohibido reescribir archivos enteros cuando la tarea solo afecta una función, estilo o bloque del DOM.
   - Prohibido usar marcadores perezosos (`// ... resto del código igual`, `/* TODO */`).
4. **Preservación de Código Funcional**:
   - Cero eliminación de funciones, selectores o componentes existentes salvo instrucción explícita del usuario.

---

## 4. Elementos Clave y Lecciones Aprendidas del Proyecto

1. **Terminología Institucional Sagrada**:
   - El evento se denomina oficialmente **«Festival Deportivo»** (no simplemente torneo o copa).
   - Las sedes de La Paz deben nombrarse con su nomenclatura completa: **La Paz Community School Cabo Velas** y **La Paz Community School Tempisque**.
   - Los otros 4 colegios participantes son: **CRIA (Costa Rica International Academy)**, **The Journey School**, **Instituto Vittorino** y **Educarte**.

2. **Identidad Visual del Header**:
   - Cabecera sólida en color negro (`bg-black text-white`) con filete superior en gradiente dorado ultra-fino (`from-transparent via-amber-400 to-transparent`).
   - Logotipo oficial de sol y olas doradas vectoriales nativas en SVG con brillo dorado.
   - La cabecera se oculta suavemente al hacer scroll hacia abajo y reaparece al hacer scroll hacia arriba o al llegar al tope (`scrollY < 40`).

3. **Arquitectura de IA Resiliente en Cascada (Multi-Layer Failover)**:
   - Implementada en `/src/lib/aiCascadeEngine.ts`:
     - Nivel 0: Caché SHA-256 en memoria (0ms, 0 tokens).
     - Nivel 1: Google Gemini (`gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-flash-latest`).
     - Nivel 2: Groq LPU (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`).
     - Nivel 3: OpenRouter (`qwen/qwen-2.5-72b-instruct`, `meta-llama/llama-3.3-70b-instruct`, `deepseek/deepseek-chat`).
     - Nivel 4: Alibaba DashScope (`qwen-plus`, `qwen-turbo`).
     - Nivel 5: Degradación pedagógica 503 estructurada sin congelar la UI.

4. **Navegación Móvil Dual**:
   - Barra superior sticky con acciones rápidas.
   - Barra inferior fija nativa para móviles (`MobileBottomNav.tsx`) con accesos directos a Inicio, Deportes, Calendario, Muro y Colegios.

5. **Vinculación con Memoria Viva**:
   - Todo cambio de arquitectura, estado del sistema, registro de decisiones (ADRs) y pendientes se sincroniza en el archivo `Memoria.md`.

---

## 5. Arquitectura de Base de Datos Centralizada (Multi-Dispositivo)

### Estado Actual de Persistencia en Servidor:
1. **Archivos Físicos (Fotos y Videos)**:
   - Se guardan físicamente en el servidor local (`/public/uploads/photos/` y `/public/uploads/videos/`) y se transmiten a **Bunny.net (Bunny Stream Library 629005 y CDN)**.
2. **Publicaciones del Muro Comunitario ([`/api/posts`](file:///d:/AntigravityFinal/EventoCostadeOro/src/app/api/posts/route.ts))**:
   - `GET /api/posts` & `POST /api/posts`: Persistencia atómica de mensajes, autor, colegio, fotos/videos vinculados y contador de likes/aplausos en `src/data/tournament_db.json`.
   - `POST /api/posts/[id]/react` & `POST /api/posts/[id]/comment`: Interacciones en tiempo real entre múltiples celulares.
3. **Nóminas Oficiales de Atletas ([`/api/rosters`](file:///d:/AntigravityFinal/EventoCostadeOro/src/app/api/rosters/route.ts))**:
   - `GET /api/rosters` & `POST /api/rosters`: Persistencia centralizada de jugadores, entrenadores, dorsales y categorías, con sincronización híbrida offline-first en `rosterService.ts`.

---

## 6. Protocolo Obligatorio de Validación Inicial al Arrancar Procesos

Al iniciar cualquier sesión o tarea en este repositorio, el asistente debe ejecutar de forma obligatoria las siguientes validaciones previas a realizar modificaciones:

1. **Salud del Servidor Local (Puerto 3014)**:
   - Verificar que el servidor esté activo en `http://localhost:3014`.
2. **Integridad de la Base de Datos Centralizada (`tournament_db.json`)**:
   - Validar que `src/data/tournament_db.json` exista y sea legible con estructura válida (`posts`, `rosters`, `photos`, `videos`, `matches`).
3. **Verificación de Endpoints API Críticos**:
   - Test de lectura en `GET /api/posts` (debe responder `200 OK` con array de publicaciones).
   - Test de lectura en `GET /api/rosters` (debe responder `200 OK` con nóminas oficiales).
4. **Verificación de Compilación y Tipado Estricto**:
   - Ejecutar `npm run build` para garantizar cero errores de TypeScript y empaquetado antes de cualquier despliegue.

---

## 7. Comandos de Operación Frecuentes

```bash
# Desarrollo local en el puerto asignado (3014)
npm run dev

# Verificación de compilación estricta y tipado
npm run build

# Arranque en modo producción local
npm run start
```
