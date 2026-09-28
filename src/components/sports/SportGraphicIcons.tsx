import React from 'react';

interface SportGraphicProps {
  className?: string;
  size?: number | string;
  badge?: boolean;
}

/**
 * ⚽ FÚTBOL: Balón geométrico detallado y taco deportivo con arco de movimiento
 */
export function SoccerGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ballGrad" x1="12" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="cleatGrad" x1="18" y1="36" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <filter id="softGlowSoccer" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#16A34A" floodOpacity="0.2" />
        </filter>
      </defs>

      {badge && (
        <circle cx="32" cy="32" r="30" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2" />
      )}

      {/* Arco dinámico de velocidad */}
      <path
        d="M 10 44 C 14 52, 28 58, 46 54"
        stroke="#86EFAC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />

      {/* Balón de fútbol con pentágonos y costuras realistas */}
      <g filter="url(#softGlowSoccer)" transform="translate(4, 0)">
        {/* Esfera base */}
        <circle cx="28" cy="26" r="16" fill="url(#ballGrad)" stroke="#334155" strokeWidth="1.8" />
        
        {/* Pentágono Central */}
        <polygon points="28,21 32,24 30.5,29 25.5,29 24,24" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        
        {/* Costuras y pentágonos periféricos */}
        <line x1="28" y1="21" x2="28" y2="15" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="32" y1="24" x2="38" y2="21" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="30.5" y1="29" x2="36" y2="34" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="25.5" y1="29" x2="20" y2="34" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="24" y1="24" x2="18" y2="21" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />

        {/* Pentágonos en borde */}
        <polygon points="26,11 30,11 28,15" fill="#1E293B" />
        <polygon points="40,19 43,24 38,21" fill="#1E293B" />
        <polygon points="38,36 34,40 36,34" fill="#1E293B" />
        <polygon points="18,36 22,40 20,34" fill="#1E293B" />
        <polygon points="13,23 16,19 18,21" fill="#1E293B" />

        {/* Brillo especular */}
        <ellipse cx="23" cy="18" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-30 23 18)" />
      </g>

      {/* Taco Deportivo / Botín de Fútbol Estilizado */}
      <g transform="translate(6, 12)">
        {/* Suela con tacos */}
        <path
          d="M 22 42 Q 32 44, 46 39 L 45 42 Q 31 46, 21 44 Z"
          fill="#0F172A"
          stroke="#0F172A"
          strokeWidth="1"
        />
        {/* Tacos / Toperoles */}
        <rect x="23" y="44" width="2.5" height="3" rx="1" fill="#DC2626" />
        <rect x="28" y="44.5" width="2.5" height="3" rx="1" fill="#DC2626" />
        <rect x="38" y="43" width="2.5" height="3" rx="1" fill="#DC2626" />
        <rect x="43" y="41" width="2.5" height="2.5" rx="1" fill="#DC2626" />

        {/* Cuerpo del botín */}
        <path
          d="M 21 42 C 20 37, 24 33, 29 34 L 35 34 C 39 31, 44 33, 47 37 Q 48 39, 46 40 L 22 42 Z"
          fill="url(#cleatGrad)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Cordones y franja aerodinámica */}
        <path d="M 31 34 L 33 38 M 34 34 L 36 38 M 37 34 L 39 38" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 26 39 Q 34 37, 43 36" stroke="#FEF08A" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 🏐 VOLEIBOL: Balón tricolor oficial con paneles en curva sobre red de voleibol
 */
export function VolleyballGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vballYellow" x1="20" y1="10" x2="44" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="vballBlue" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <filter id="softGlowVolley" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284C7" floodOpacity="0.2" />
        </filter>
      </defs>

      {badge && (
        <circle cx="32" cy="32" r="30" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="2" />
      )}

      {/* Red de Voleibol en la parte inferior */}
      <g transform="translate(0, 10)">
        {/* Poste y banda superior de la red */}
        <line x1="8" y1="42" x2="56" y2="42" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="8" y1="42" x2="56" y2="42" stroke="#0284C7" strokeWidth="1.2" />
        {/* Malla de la red */}
        <line x1="12" y1="42" x2="12" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="20" y1="42" x2="20" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="28" y1="42" x2="28" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="36" y1="42" x2="36" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="44" y1="42" x2="44" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="52" y1="42" x2="52" y2="54" stroke="#94A3B8" strokeWidth="1" />
        <line x1="8" y1="48" x2="56" y2="48" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="8" y1="54" x2="56" y2="54" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Trayectoria de remate / salto */}
      <path
        d="M 14 36 C 20 18, 30 14, 42 16"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />

      {/* Balón de Voleibol con 18 paneles agrupados de 3 en 3 */}
      <g filter="url(#softGlowVolley)" transform="translate(14, 4)">
        {/* Círculo base */}
        <circle cx="20" cy="20" r="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />

        {/* Panel Grupo 1: Curva Izquierda (Azul) */}
        <path
          d="M 9.5 9.5 C 16 12, 19 18, 20 20 C 14 21, 8 18, 5 15 C 6 13, 7.5 11, 9.5 9.5 Z"
          fill="url(#vballBlue)"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <path
          d="M 12 7 C 18 10, 20 16, 20 20 C 17 19, 14 16, 9.5 9.5 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.2"
        />

        {/* Panel Grupo 2: Curva Derecha Superior (Amarillo) */}
        <path
          d="M 20 20 C 21 13, 27 8, 32 10 C 34 13, 35 17, 34 21 C 28 20, 23 20, 20 20 Z"
          fill="url(#vballYellow)"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <path
          d="M 20 20 C 24 11, 30 6, 32 10 C 26 12, 22 16, 20 20 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.2"
        />

        {/* Panel Grupo 3: Curva Inferior (Azul y Blanco) */}
        <path
          d="M 20 20 C 20 27, 24 33, 27 34 C 29 32, 31 29, 32 26 C 27 24, 23 22, 20 20 Z"
          fill="url(#vballBlue)"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <path
          d="M 20 20 C 18 28, 12 33, 9 31 C 12 28, 16 24, 20 20 Z"
          fill="url(#vballYellow)"
          stroke="#0F172A"
          strokeWidth="1.2"
        />

        {/* Líneas divisorias de costura */}
        <path d="M 20 5 L 20 35" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 5 20 C 12 20, 28 20, 35 20" stroke="#0F172A" strokeWidth="1.2" />

        {/* Brillo especular */}
        <ellipse cx="14" cy="12" rx="3.5" ry="1.8" fill="#FFFFFF" fillOpacity="0.8" transform="rotate(-25 14 12)" />
      </g>
    </svg>
  );
}

/**
 * 🏀 BALONCESTO: Balón con textura realista de costuras negras entrando al aro con red
 */
export function BasketballGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="bballGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="60%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </radialGradient>
        <linearGradient id="rimGrad" x1="16" y1="36" x2="52" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <filter id="softGlowBasket" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#EA580C" floodOpacity="0.25" />
        </filter>
      </defs>

      {badge && (
        <circle cx="32" cy="32" r="30" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />
      )}

      {/* Tablero y Aro con Red en la parte inferior */}
      <g transform="translate(2, 6)">
        {/* Tablero transparente posterior */}
        <rect x="42" y="14" width="4" height="24" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
        <rect x="40" y="20" width="3" height="12" fill="#EF4444" fillOpacity="0.4" />

        {/* Aro Naranja/Rojo */}
        <ellipse cx="30" cy="36" rx="14" ry="3.5" fill="none" stroke="url(#rimGrad)" strokeWidth="3" />
        {/* Soporte del aro */}
        <line x1="42" y1="36" x2="44" y2="36" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

        {/* Red de Baloncesto (Malla entrelazada blanca) */}
        <path
          d="M 18 37 L 22 52 L 26 37 L 30 52 L 34 37 L 38 52 L 42 37"
          stroke="#CBD5E1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 22 52 L 38 52"
          stroke="#CBD5E1"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>

      {/* Balón de Baloncesto suspendido sobre el aro */}
      <g filter="url(#softGlowBasket)" transform="translate(6, 2)">
        {/* Esfera base con gradiente */}
        <circle cx="24" cy="20" r="14" fill="url(#bballGrad)" stroke="#18181B" strokeWidth="1.8" />

        {/* Costura Central Vertical */}
        <path d="M 24 6 L 24 34" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
        {/* Costura Central Horizontal */}
        <path d="M 10 20 L 38 20" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />

        {/* Costuras Curvas Laterales */}
        <path
          d="M 14 10 C 20 15, 20 25, 14 30"
          stroke="#18181B"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 34 10 C 28 15, 28 25, 34 30"
          stroke="#18181B"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Brillo especular suave */}
        <ellipse cx="18" cy="14" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(-30 18 14)" />
      </g>
    </svg>
  );
}

/**
 * 🏆 MULTIDEPORTE / AVANCE GLOBAL: Trofeo Dorado con Corona de Laureles
 */
export function TrophyGlobalGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGrad" x1="16" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <filter id="softGlowTrophy" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#EAB308" floodOpacity="0.3" />
        </filter>
      </defs>

      {badge && (
        <circle cx="32" cy="32" r="30" fill="#FEFCE8" stroke="#FEF08A" strokeWidth="2" />
      )}

      {/* Laureles decorativos */}
      <g stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6">
        <path d="M 12 36 C 10 26, 14 16, 22 10" />
        <path d="M 52 36 C 54 26, 50 16, 42 10" />
        <circle cx="11" cy="24" r="1.5" fill="#EAB308" />
        <circle cx="15" cy="16" r="1.5" fill="#EAB308" />
        <circle cx="53" cy="24" r="1.5" fill="#EAB308" />
        <circle cx="49" cy="16" r="1.5" fill="#EAB308" />
      </g>

      {/* Copa Trofeo Principal */}
      <g filter="url(#softGlowTrophy)">
        {/* Asas del trofeo */}
        <path
          d="M 22 18 C 14 18, 12 28, 20 32 M 42 18 C 50 18, 52 28, 44 32"
          stroke="#EAB308"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Copa */}
        <path
          d="M 20 14 L 44 14 C 44 26, 38 36, 32 38 C 26 36, 20 26, 20 14 Z"
          fill="url(#goldGrad)"
          stroke="#A16207"
          strokeWidth="1.5"
        />

        {/* Estrella grabada en la copa */}
        <polygon
          points="32,20 33.5,24 37.5,24 34.5,26.5 35.5,30.5 32,28 28.5,30.5 29.5,26.5 26.5,24 30.5,24"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />

        {/* Tallo del trofeo */}
        <rect x="29" y="38" width="6" height="7" rx="1" fill="url(#goldGrad)" stroke="#A16207" strokeWidth="1" />

        {/* Base de Madera / Mármol */}
        <path
          d="M 22 45 L 42 45 L 45 52 L 19 52 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <rect x="25" y="47" width="14" height="3" rx="0.5" fill="#FEF08A" />
      </g>
    </svg>
  );
}

/**
 * 🏅 MODALIDAD PERSONALIZADA / NUEVO DEPORTE: Antorcha y Medalla Dinámica
 */
export function CustomSportGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="flameGrad" x1="28" y1="8" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {badge && (
        <circle cx="32" cy="32" r="30" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      )}

      {/* Llama de la antorcha */}
      <path
        d="M 32 8 C 36 14, 40 18, 36 24 C 34 22, 33 20, 31 20 C 31 24, 27 26, 25 24 C 23 20, 26 14, 32 8 Z"
        fill="url(#flameGrad)"
      />
      <circle cx="32" cy="18" r="3" fill="#FEF08A" />

      {/* Mango de la Antorcha */}
      <path
        d="M 26 26 L 38 26 L 35 44 L 29 44 Z"
        fill="#475569"
        stroke="#0F172A"
        strokeWidth="1.5"
      />
      <path d="M 28 44 L 36 44 L 34 54 L 30 54 Z" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />

      {/* Aros de agarre */}
      <line x1="27" y1="32" x2="37" y2="32" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="38" x2="36" y2="38" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 🏄 SURFING: Tabla de surf y ola del Pacífico de Guanacaste
 */
export function SurfingGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="waveGrad" x1="10" y1="20" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="boardGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {badge && <circle cx="32" cy="32" r="30" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="2" />}

      {/* Ola del Mar */}
      <path
        d="M 8 48 C 16 32, 28 22, 42 24 C 48 25, 52 28, 54 34 C 48 30, 42 32, 38 38 C 32 46, 20 50, 8 48 Z"
        fill="url(#waveGrad)"
      />
      <path d="M 42 24 C 46 22, 52 24, 56 30 C 53 28, 48 28, 44 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Tabla de Surf */}
      <g transform="rotate(-35 32 30)">
        <path
          d="M 32 10 C 37 18, 38 36, 35 50 C 34 54, 30 54, 29 50 C 26 36, 27 18, 32 10 Z"
          fill="url(#boardGrad)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <line x1="32" y1="12" x2="32" y2="48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 28 32 Q 32 30, 36 32" stroke="#1E293B" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * ♟️ AJEDREZ: Caballo / Rey de ajedrez deportivo
 */
export function ChessGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {badge && <circle cx="32" cy="32" r="30" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />}

      {/* Tablero base */}
      <rect x="18" y="46" width="28" height="6" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="22" y="42" width="20" height="4" fill="#475569" stroke="#0F172A" strokeWidth="1.2" />

      {/* Pieza de Caballo (Knight) */}
      <path
        d="M 24 42 C 24 36, 22 30, 26 24 C 28 20, 34 16, 38 14 C 40 18, 38 22, 42 24 C 44 26, 44 32, 40 36 C 41 38, 42 40, 40 42 Z"
        fill="#334155"
        stroke="#0F172A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Ojo y crin */}
      <circle cx="32" cy="22" r="1.5" fill="#FEF08A" />
      <path d="M 36 18 C 35 22, 36 26, 38 28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 🏃 ATLETISMO DE PLAYA: Pista y zapatilla con alas
 */
export function AthleticsGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {badge && <circle cx="32" cy="32" r="30" fill="#FEFCE8" stroke="#FEF08A" strokeWidth="2" />}
      <path d="M 12 46 C 24 38, 40 38, 52 46" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M 18 36 C 24 30, 34 26, 46 28 L 44 34 C 36 32, 28 34, 22 40 Z" fill="#CA8A04" stroke="#0F172A" strokeWidth="1.2" />
      <circle cx="44" cy="20" r="4" fill="#F59E0B" />
      <path d="M 32 26 L 38 32 L 32 38" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 🏊 NATACIÓN: Nadador y ondas de agua
 */
export function SwimmingGraphic({ className = '', size = 48, badge = false }: SportGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {badge && <circle cx="32" cy="32" r="30" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="2" />}
      <path d="M 10 40 Q 20 34, 30 40 T 50 40" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 14 48 Q 24 42, 34 48 T 54 48" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="24" r="4" fill="#0F766E" />
      <path d="M 28 28 L 42 22 L 46 26" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Selector Universal de Gráfico por Deporte
 */
export function SportIconRenderer({
  sportId,
  size = 48,
  badge = false,
  className = '',
}: {
  sportId: string;
  size?: number | string;
  badge?: boolean;
  className?: string;
}) {
  const normalized = sportId.toLowerCase();
  if (normalized.includes('futbol') || normalized.includes('fútbol') || normalized.includes('soccer')) {
    return <SoccerGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('voleibol') || normalized.includes('voley') || normalized.includes('volleyball')) {
    return <VolleyballGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('baloncesto') || normalized.includes('basket') || normalized.includes('basketball')) {
    return <BasketballGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('surf') || normalized.includes('surfing')) {
    return <SurfingGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('ajedrez') || normalized.includes('chess')) {
    return <ChessGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('atletismo') || normalized.includes('atlet') || normalized.includes('running')) {
    return <AthleticsGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('natacion') || normalized.includes('natación') || normalized.includes('swimming')) {
    return <SwimmingGraphic size={size} badge={badge} className={className} />;
  }
  if (normalized.includes('global') || normalized.includes('general') || normalized.includes('todos')) {
    return <TrophyGlobalGraphic size={size} badge={badge} className={className} />;
  }
  return <CustomSportGraphic size={size} badge={badge} className={className} />;
}
