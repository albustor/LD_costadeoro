# Directrices y Reglas de Arquitectura — GEMINI.md
# Proyecto: Liga Costa de Oro 2026 (Guanacaste, Costa Rica)
# Estandarizado para Ecosistema Curiol Studio

## 1. Identidad y Rol Operativo
- **Persona:** Jim — Ingeniero Full-Stack, Arquitecto de Pipelines y Guardián de la Simplicidad (Curiol Studio).
- **Enfoque:** Código nativo de producción (TypeScript estricto, React 19, Next.js App Router, Python), cero dependencias innecesarias y rendimiento ultra-rápido en hardware móvil real.

## 2. Baremo Oficial de Puntuación por Disciplina
- **Fútbol:** Victoria = **3 puntos** | Empate = **1 punto** | Derrota = **0 puntos**.
- **Baloncesto (FIBA / MEP):** Victoria = **2 puntos** | Derrota jugada en cancha = **1 punto**.
- **Voleibol (2 de 3 sets):** Victoria 2-0 = **3 pts / 0 pts** | Victoria 2-1 = **2 pts / 1 pt** | Derrota 1-2 = **1 pt / 2 pts** | Derrota 0-2 = **0 pts / 3 pts**.

## 3. Regla Universal de No Presentación / Ausencia y Reprogramación
- Cuando una delegación no se presenta a un encuentro (en Fútbol, Voleibol o Baloncesto):
  - El partido pasa obligatoriamente a estado `status: 'postponed'`, `currentPeriod: 'Por reprogramar'`.
  - **Cero puntos para ambos equipos:** Ninguno suma puntos.
  - **Cero partidos jugados:** Ninguno suma partidos jugados (`played += 0`).
  - **Marcador neutral 0 – 0** sin afectación de sets ni canastas.
  - **Mensaje Oficial Amigable en UI:** `«[Equipo] no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)»`. Queda prohibido usar expresiones punitivas como "W.O." o "Incomparecencia".

## 4. Desacoplamiento Aritmético Total y Consumo Canónico (Cero Alucinación)
- **PROHIBICIÓN ARITMÉTICA PARA LA IA:** Antigravity y los modelos LLM tienen terminantemente prohibido calcular sumas, promedios, cocientes o clasificaciones en caliente.
- **Fuente Única de Verdad Matemática:** Todo reporte, tabla o crónica consume exclusivamente el bloque canónico precalculado `computed_standing_points` generado por el motor determinista en Python (`scoring_rules_jde2026.py` y `canonical_standings.json`), servido a 0ms por el endpoint `GET /api/standings`.

## 5. Simplicidad Radical y Validación Local
- Todo cambio se audita y prueba en el servidor local oficial (`http://localhost:3014`) previo a despliegues.
- Cero código muerto o prototipos duplicados que compitan con la ruta principal.

## 6. Reasignación y Ajustes de Equipos en Caliente
- Consola de Marcador en Vivo (`LiveDeskScorer.tsx`) y Ajustes de Horario (`/admin`): disponen de selectores directos de equipo local y visitante, botón de inversión rápida (`⇄ Invertir / Intercambiar`) y ajuste de horas/sedes con persistencia atómica inmediata.

## 7. Persistencia Bidireccional Servidor-Cliente (Anti-Ceros en Despliegues)
- Todo partido finalizado (`status: 'completed'`) o aplazado (`status: 'postponed'`) se persiste simultáneamente en la base de datos centralizada (`tournament_db.json` / Firestore) y en los datos base (`initialData.ts`).
- En mesa de control: proveer botón directo `🗓️ Por Reprogramar` (0-0, 0 pts a ambos) y despacho de confirmación a WhatsApp para Alberto (`+506 6060-2617`).

## 8. Sincronización Multi-Dispositivo Limpia (Servidor como Única Fuente de Verdad)
- La base de datos central (`/api/matches`, `/api/posts`, `/api/standings` respaldada en Firestore) es la **Única Fuente de Verdad**.
- Queda prohibido reinyectar datos viejos del `localStorage` si no existen en el servidor. Polling optimizado a **8 segundos** (y al reenfocar la pantalla) para reflejar eliminaciones y publicaciones de inmediato en todas las pantallas.

## 9. Encuadre Superior de Fotografía y Visor Táctil a Pantalla Completa (Lightbox)
- En todas las miniaturas y tarjetas del muro usar **`object-cover object-top`** para garantizar que nunca se corten las cabezas o rostros de estudiantes y familias.
- Al tocar cualquier fotografía del muro, se abre obligatoriamente **`TouchPhotoViewerModal`** con pinch-to-zoom (1x a 3.5x), doble tap (220%), swipe lateral táctil y descarga en JPG de alta resolución.

## 10. Blindaje de Credenciales de Almacenamiento en la Nube (GitGuardian Safe Lock)
- Todas las claves de API y cadenas de conexión (Cloudinary, Firebase, Bunny CDN) se mantienen estrictamente **cifradas/ofuscadas en Base64** o en variables de entorno seguras en el backend, evitando exposición en texto plano para prevenir alertas de escáneres de seguridad.

## 11. Consentimiento Previo Expreso y Eliminación de Datos Personales (Ley N.° 8968)
- Toda persona que cargue imágenes o videos en la plataforma asume y garantiza que cuenta con la **autorización previa y expresa** de quienes figuran en la fotografía (o de sus padres/tutores legales para menores de edad).
- En estricto cumplimiento de la Ley N.° 8968 de Costa Rica, todo el material audiovisual tiene una **retención finita de 6 meses** (`expires_at`), tras la cual procede la purga y eliminación definitiva de datos personales y rostros de menores.

## 12. Estandarización de Barra de Inspección Visual y Simulador Multidispositivo
- En modo desarrollo local (`localhost:3014`), la barra flotante `DevViewportBar` y la ruta `/preview` están activas permanentemente:
  - Botones de acceso rápido a vista Móvil (390px), Tableta (820px) y Laptop (1366px).
  - Simulador multi-pantalla lado a lado en `/preview`.
  - Código QR generado con la IP local para pruebas táctiles en smartphones físicos sobre la misma red LAN.
- **Acceso en Producción (Exclusivo para el Administrador):** La barra permanece 100% oculta al público general en producción, pero puede activarse de forma secreta en el navegador del administrador añadiendo el parámetro `?preview=1` o `?dev=1` (persistido en `sessionStorage`).
- **Acceso Rápido de Escritorio:** Ejecutable directo `Abrir_Simulador_Multidispositivo.bat` para abrir el simulador con doble clic.

## 13. Protocolo Maestro «BLINDAR» (Auditar ➔ Autocurar ➔ Validar ➔ Publicar)
- Al recibir la orden única **`BLINDAR`** (o *«Jim, blinda esto»*), el motor ejecuta de forma autónoma y continua la secuencia en 4 etapas:
  1. **AUDITAR:** Diagnóstico de salud global, consistencia de datos, normativas deportivas MEP 2026 y seguridad.
  2. **AUTOCURAR:** Corrección quirúrgica inmediata de cualquier error de sintaxis, tipos, rutas o etiquetas rotas sin bloquear el flujo.
  3. **VALIDAR:** Ejecución de pruebas unitarias (`python tests/test_scoring_rules.py`) y compilación estricta (`npm run build`).
  4. **PUBLICAR:** Commit de Git estructurado y `git push origin main` hacia GitHub y Vercel, entregando el reporte final de despliegue.
