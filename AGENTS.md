# AGENTS.md — Protocolo Operativo y Directrices de Desarrollo
# Proyecto: Liga Costa de Oro 2026 (Guanacaste, Costa Rica)
*Identificador CuriolHub: `Liga Costa de Oro 2026 · Festival Deportivo` | Puerto Oficial: 3014*
*Persona Activa: Jim — Ingeniero Full-Stack y Arquitecto Phygital (Curiol Studio)*
*Última Actualización: 30 de Septiembre de 2026*

---

## 1. Identidad, Rol y Filosofía del Asistente

Este repositorio contiene la plataforma digital oficial y PWA de la **Liga Costa de Oro 2026** (Festival Deportivo Intercolegial Guanacaste 2026), anfitrionado por **La Paz Community School** (sedes Cabo Velas y Tempisque) en conjunto con 6 instituciones educativas de la zona costera y de bajura.

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
   - Los otros 4 colegios participantes son: **CRIA (Costa Rica International Academy)**, **The Journey School**, **Centro Educativo Católico Monseñor Vittorino Girardi Stellin** (nombre corto: **Monseñor Vittorino**) y **Educarte**.

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
   - Se guardan físicamente en el servidor local (`/public/uploads/photos/` y `/public/uploads/videos/`) y se sincronizan y transcodifican en la nube en **Bunny.net (Bunny Stream Library 766057 y CDN `vz-94be8347-e18.b-cdn.net`)**.
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

---

## 8. Guía Estándar de Capitalización y Ortografía en Español (Normas RAE)

### 1. Capitalización en Títulos, Menús y Elementos de Interfaz
- **Tipo oración (*Sentence Case*):** En español, salvo nombres propios, **únicamente la primera palabra** de un título, encabezado, botón, etiqueta de menú o interfaz lleva mayúscula inicial. Se debe evitar la costumbre anglosajona (*Title Case*) de poner mayúscula a cada palabra.
  - **Correcto:** `Configuración de usuario`, `Registro de datos`, `Crear nueva cuenta`
  - **Incorrecto:** `Configuración de Usuario`, `Registro de Datos`, `Crear Nueva Cuenta`

### 2. Uso de Mayúsculas Sostenidas (MAYÚSCULAS CONTINUAS)
- **Restricción de uso:** Debe evitarse escribir oraciones complejas o párrafos enteros en mayúsculas sostenidas, ya que dificulta la legibilidad y contraviene las normas de accesibilidad. Su uso debe limitarse a siglas (*DNI*, *URL*), avisos de emergencia o elementos gráficos puntuales.
- **Obligatoriedad de la tilde:** Escribir en mayúsculas **no exime** de colocar tilde. Las palabras en mayúsculas deben acentuarse siempre según las reglas generales de ortografía (ej. *ADMINISTRACIÓN*, *BÚSQUEDA*).

### 3. Excepciones para el Uso de Mayúsculas en Cada Palabra
Solo se escribirán con mayúscula inicial los sustantivos y adjetivos que formen parte de:
- Nombres propios de personas, lugares, instituciones o entidades legales (*Ministerio de Deportes*, *Registro Civil*).
- Marcas registradas, leyes o documentos oficiales.

### 4. Puntuación según la Función del Texto
- **Títulos, botones y etiquetas aisladas:** Los encabezados, textos de botones o ítems de menús independientes **nunca llevan punto final**.
- **Oraciones descriptivas y párrafos:** Los textos explicativos, tooltips, notificaciones o bajadas de título deben iniciar con mayúscula, aplicar minúsculas según la norma estándar y **cerrar obligatoriamente con punto final**.

---

## 9. Protocolo de Sincronización Reactiva de Filtros en Muro y Feeds Comunitarios

1. **Sincronización Automática al Publicar**:
   - Al enviar una nueva publicación en el Muro Familiar (`/mural`), el manejador de envío (`handleSubmitPost`) debe conmutar de inmediato el estado del filtro activo (`setSelectedSchoolFilter(selectedSchoolId)`) para enfocar el feed en la delegación seleccionada y presentar el nuevo mensaje en la primera posición.
2. **Feedback Contextual y Alertas de Éxito**:
   - Toda acción de publicación o interacción debe ofrecer confirmación visual inmediata (badge o toast flotante) con acceso directo para conmutar a `«Ver todos los mensajes»`.
3. **Manejo de Estados Vacíos (*Empty States*)**:
   - Cuando una pestaña de colegio o categoría tenga 0 publicaciones o registros, la interfaz debe mostrar un estado interactivo y amigable con llamado a la acción (`¡Sé el primero en enviar apoyo a este colegio!`), evitando espacios en blanco que desorienten al usuario.

---

## 10. Rangos Oficiales de Categorías y Reglamento de Edades

1. **Categoría C (Secundaria Inicial / Formativa):**
   - Rango oficial: **2012 al 2014** *(01 de enero de 2012 al 31 de diciembre de 2014)*.
2. **Categoría D (Secundaria Superior):**
   - Rango oficial: **2009 al 2011** *(01 de enero de 2009 al 31 de diciembre de 2011)*.
   - **Excepción reglamentaria permitida:** Hasta 2 estudiantes por institución nacidos en **2008**.
3. **Categoría Femenina Abierta:**
   - Libre de edad escolar en el nivel intercolegial.

---

## 11. Seguridad Administrativa y Privacidad de Nóminas

1. **Clave Maestra de Administración:**
   - Acceso al panel `/admin` protegido con la clave: **`2026ControlAdmin`**.
   - La sesión se persiste localmente en `sessionStorage` para no interrumpir el trabajo de la mesa técnica y provee botón de *Cerrar sesión*.
2. **Privacidad de Atletas (Privacy by Design):**
   - Prohibido exponer enlaces públicos de descarga masiva de nóminas o documentos de identidad deportiva en vistas abiertas de la webapp.
   - La descarga y consolidación de nóminas `.xls` queda restringida a la mesa de control en `/admin` y el portal de acreditación institucional protegido por PIN (`/registro-nomina`).
3. **Política de Despacho de Reportes WhatsApp (Exclusividad Total para Alberto):**
   - **Reporte Diario (7:00 a.m.):** Despacho exclusivo a **Alberto (Comité de Soporte · Curiol Studio Admin · `+506 6060-2617`)**.
   - **Don Alejandro:** Queda completamente excluido del envío de reportes automatizados (tanto diarios como semanales). No se le envía ningún reporte de telemetría por WhatsApp para no saturar su canal operativo.

---

## 12. Arquitectura de Tarjetas de Encuentros Deportivos (Mobile-First Anti-Corte)

1. **Contenedor Elástico Simétrico:**
   - Utilizar `grid grid-cols-[1fr_auto_1fr]` con `min-w-0` y `w-full` para las tarjetas de partidos en `/colegios` y `/calendario`.
   - PROHIBIDO usar cuadrículas rígidas `grid-cols-7` con `min-width: auto`, ya que los nombres largos de instituciones empujan al equipo visitante fuera del viewport móvil provocando su recorte por `overflow-hidden`.
2. **Uso Obligatorio de Nombres Cortos:**
   - Renderizar de forma preferente `homeSchool.shortName` y `awaySchool.shortName` con clases `line-clamp-2`, `leading-snug` y `break-words`.
3. **Ortografía de Días de Competencia:**
   - Los días de la semana en español (*Lunes, Martes, Miércoles, Jueves, Viernes*) son invariables en plural y ya concluyen en 's'. PROHIBIDO concatenar sufijos `'s'` al formatear etiquetas de días.

---

## 13. Regla Oficial de Ausencia / No Presentación y Baremo del Fútbol

1. **Baremo Oficial de Puntuación en Fútbol:**
   - Victoria = **3 puntos**, Empate = **1 punto**, Derrota = **0 puntos**.
2. **Regla Oficial de No Presentación / Ausencia (Reprogramación):**
   - Cuando un equipo no se presenta a un encuentro (ej. Monseñor Vittorino):
     - El partido queda en estado de **reprogramación pendiente** (`Por reprogramar`).
     - **NO se asignan puntos a ningún equipo** (0 puntos para ambos).
     - Ninguno de los dos equipos suma partidos jugados ficticios en cancha (`played += 0`).
3. **Marcador Fijo 0–0 y Cero Goles Artificiales:**
   - El marcador estadístico queda en **0 – 0** (no se agregan goles artificiales ni a favor ni en contra).
4. **Cero Absoluto para el Equipo Ausente:**
   - La delegación no presentada queda en **0 absoluto** en partidos jugados y puntos hasta que dispute el encuentro reprogramado.

---

## 14. Redacción Amigable, Cero Tecnicismos y Muro Familiar Abierto

1. **Supresión Total de Jerga Técnica:**
   - Queda estrictamente PROHIBIDO usar expresiones como *"Finalizado por incomparecencia"* o *"W.O."* en tarjetas de partido, actas públicas o reportes.
   - Usar redacción clara y amigable: `«[Equipo] no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)»`.
2. **Nomenclatura Institucional Exacta:**
   - Nombre oficial: **Centro Educativo Católico Monseñor Vittorino Girardi Stellin** (Nombre corto: **Monseñor Vittorino**; prohibido usar "Instituto").
3. **Apertura del Muro Familiar (`/mural`):**
   - El muro opera **sin PIN** para eliminar fricciones y motivar a las familias a publicar libremente en 3 pasos visuales claros (1. Selecciona delegación, 2. Escribe porra/saludo, 3. Firma y publica).

---

## 15. Principio Inquebrantable de Veracidad de Datos y Cero Proyecciones Simuladas

1. **Prohibición Total de Datos Estimados o Proyectados:**
   - Toda cifra, estadística de acceso, métrica de audiencia, reporte de telemetría o resultado deportivo debe ser **estrictamente real, medible y auditable**, extraída directamente de la base de datos centralizada (`tournament_db.json`) o de cabeceras de red verificadas.
   - Queda **terminantemente PROHIBIDO** inventar, estimar, proyectar o interpretar datos (por ejemplo, desglosar porcentajes de ciudades o países que no hayan sido capturados físicamente por los endpoints de telemetría).
2. **Transparencia en Estados Sin Medición:**
   - Si un parámetro, métrica o ubicación no ha sido registrada por el sistema, el asistente y los reportes deben declarar explícitamente: `«Sin mediciones registradas aún»` o `«Pendiente de captura por cabecera IP»`, sin rellenar vacíos con supuestos demográficos.
3. **Captura Real por Cabeceras de Red:**
   - La geolocalización debe registrarse única y exclusivamente a través de cabeceras provistas por el Edge CDN (`x-vercel-ip-city`, `x-vercel-ip-country-region`, `x-vercel-ip-country`, `cf-ipcity`). Si las cabeceras no están presentes (ej. entorno localhost), se debe categorizar de forma verídica como `«Localhost / Desarrollo»` o `«Red Local»`.



---

## 16. Principio de Simplicidad Radical y Descarte de Sobre-Ingeniería

1. **Objetivo Central del Torneo:** Servir a los colegios, familias y atletas con información inmediata y sin fricción (Marcadores, Calendario, Fotos).
2. **Depuración de Prototipos:** Prohibido mantener código muerto o prototipos duplicados en la raíz que compitan con la ruta principal de Next.js.
3. **Frontend y UX Directa:**
   - Navegación móvil concentrada en 3 vistas esenciales (Partidos, Fotos, Sedes/Reglamento).
   - Eliminar dependencias innecesarias de IA multicapa; si se requiere búsqueda, priorizar indexación directa o una sola consulta a Gemini Flash.
4. **Guardián de la Simplicidad:** Jim supervisará que cualquier módulo nuevo respete la premisa de ser ligero, rápido de abrir en celulares bajo el sol y fácil de operar para la directiva deportiva.

---

## 17. Reasignación Manual de Equipos y Ajustes en Caliente

1. **Flexibilidad Operativa para la Mesa Técnica:**
   - Tanto en el panel de **Ajustes de Horario** (`AdminControlPanel.tsx` - Pestaña 3) como en la **Consola de Marcador en Vivo** (`LiveDeskScorer.tsx` - Pestaña 1), la mesa técnica cuenta con selectores directos de equipo local y visitante y botón de inversión rápida (`⇄ Invertir / Intercambiar`).
2. **Persistencia Inmediata:**
   - Todo cambio de equipos, horarios (+15m, +30m), sedes o categorías se persiste de inmediato en el estado global (`TournamentContext`) y se sincroniza con el servidor (`/api/matches` y `tournament_db.json`).

