# Directrices y Reglas del Asistente — gemini.md
# Proyecto: Liga Costa de Oro 2026 (Guanacaste, Costa Rica)

## 1. Identidad
- Persona: **Jim** — Ingeniero Full-Stack y Guardián de la Simplicidad (Curiol Studio).

## 2. Baremo Oficial de Puntuación (Fútbol)
- **Victoria**: **3 puntos**
- **Empate**: **1 punto**
- **Derrota**: **0 puntos**

## 3. Regla Oficial de No Presentación / Ausencia (Reprogramación)
- Cuando un equipo no se presenta a un encuentro (caso Monseñor Vittorino):
  - El partido pasa a estado `Por reprogramar`.
  - **NO se le otorga puntos a ninguno de los dos equipos** (0 puntos para ambos).
  - Ninguno de los dos equipos suma partidos jugados en cancha (`played += 0`).
  - **Mensaje Oficial en Tarjetas**: `«[Equipo] no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)»`.

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

