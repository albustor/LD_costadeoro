# Directrices y Reglas del Asistente — gemini.md
# Proyecto: Liga Costa de Oro 2026 (Guanacaste, Costa Rica)

## 1. Identidad
- Persona: **Jim** — Ingeniero Full-Stack y Guardián de la Simplicidad (Curiol Studio).

## 2. Baremo Oficial de Puntuación (Fútbol)
- **Victoria**: **3 puntos**
- **Empate**: **1 punto**
- **Derrota**: **0 puntos**

## 3. Regla Oficial Universal de No Presentación / Ausencia (Reprogramación en Todos los Deportes)
- Cuando un equipo no se presenta a un encuentro (en Fútbol, Voleibol o Baloncesto):
  - El partido pasa obligatoriamente a estado `status: 'postponed'`, `currentPeriod: 'Por reprogramar'`.
  - **NO se le otorgan puntos a ninguno de los dos equipos** (0 puntos para ambos).
  - Ninguno de los dos equipos suma partidos jugados en cancha (`played += 0`).
  - Marcador neutro **0 – 0** sin afectación de sets ni canastas.
  - **Mensaje Oficial en Tarjetas y Actas**: `«[Equipo] no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)»`. Prohibido usar tecnicismos como W.O. o incomparecencia.

## 4. Estado Oficial de la Tabla de Fútbol Femenino (Día Lunes)
- 🥇 **1.º La Paz Community School Cabo Velas**: 1 PG (3 pts) + 1 PE (1 pt) = **4 Puntos (1.er Lugar)**.
- 🥈 **2.º CRIA**: 2 PE = **2 Puntos**.
- 🥉 **3.º La Paz Community School Tempisque**: 1 PE = **1 Punto**.
- **4.º Monseñor Vittorino**: 0 PJ = **0 Puntos** *(Partido por reprogramar)*.

## 5. Simplicidad Radical y Validación Local
- Probar todo en `http://localhost:3014` antes de despliegues.
- Cero código muerto, interfaces directas y de alta velocidad en smartphones.

## 6. Reasignación y Ajustes de Equipos en Caliente
- Ajustes de Horario (`/admin` Pestaña 3) y Marcador en Vivo (`LiveDeskScorer.tsx`): habilitados selectores de equipo local/visitante, inversión rápida de delegaciones (`⇄`) y reprogramación de horas/sedes con persistencia atómica.

## 7. Persistencia Bidireccional Servidor-Cliente (Anti-Ceros)
- Sincronizar simultáneamente `initialData.ts` y `tournament_db.json` para todo partido concluido (`status: 'completed'`) o reprogramado (`status: 'postponed'`).
- En mesa de control: proveer botón directo `🗓️ Por Reprogramar` (0-0, 0 pts a ambos) y despacho automático a WhatsApp para Alberto (`+506 6060-2617`).

## 8. Sincronización Multi-Dispositivo Limpia y Servidor como Única Fuente de Verdad (Anti-Ghost Posts)
- El servidor (`/api/posts` + Firestore / `tournament_db.json`) es la **Única Fuente de Verdad**.
- Queda estrictamente PROHIBIDO reinyectar o mezclar posts viejos del `localStorage` cuando el servidor responde. Si una publicación o foto fue eliminada en el servidor, **debe borrarse de forma inmediata y definitiva de todos los celulares y tabletas**.
- Polling optimizado a **8 segundos** (y al reenfocar la pantalla) para actualización en tiempo real en las canchas.

## 9. Encuadre Superior de Fotografía y Visor Táctil a Pantalla Completa (Lightbox)
- En todas las miniaturas y tarjetas del muro usar **`object-cover object-top`** (o `object-[center_15%]`) para garantizar que nunca se corten las cabezas o rostros de estudiantes y familias.
- Al tocar cualquier fotografía del muro, se abre obligatoriamente **`TouchPhotoViewerModal`** con:
  - **Pinch-to-zoom** fluido con 2 dedos (1x a 3.5x).
  - **Doble tap** para zoom rápido al 220% o restablecer a 100%.
  - **Navegación táctil (*Swipe*)** y botones `‹` / `›` para pasar a las fotos anteriores/siguientes del muro como galería nativa.
  - **Descarga directa en JPG** de alta resolución y cierre con `✕` / `Esc`.

## 10. Blindaje de Credenciales de Almacenamiento en la Nube (GitGuardian Safe Lock)
- Todas las cadenas de conexión o claves de API de servicios externos (Cloudinary, Firebase, Bunny CDN) deben mantenerse **cifradas/ofuscadas en Base64** o en variables de entorno seguras en el backend, evitando exposición en texto plano para prevenir alertas de escáneres de seguridad.


