import { Match, Standing, TeamRoster, FamilyPost } from '@/types/tournament';
import { SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';
import { calculateStandings } from './sportsEngine';

export interface DailyReportData {
  jornada: number;
  completedMatches: Match[];
  upcomingMatches: Match[];
  standingsBySport: {
    futbol: Standing[];
    voleibol: Standing[];
    baloncesto: Standing[];
  };
  totalPosts: number;
  totalApplause: number;
  dateStr: string;
}

/**
 * Genera el texto del reporte ejecutivo formateado para WhatsApp
 */
export function generateDailyReportMessage(data: DailyReportData): string {
  const {
    jornada,
    completedMatches,
    upcomingMatches,
    standingsBySport,
    totalPosts,
    totalApplause,
    dateStr,
  } = data;

  const futbolMatches = completedMatches.filter((m) => m.sport === 'futbol');
  const voleyMatches = completedMatches.filter((m) => m.sport === 'voleibol');
  const basketMatches = completedMatches.filter((m) => m.sport === 'baloncesto');

  // Obtener líderes
  const leaderFutbol = standingsBySport.futbol[0]?.school?.shortName || 'Por definir';
  const leaderFutbolPts = standingsBySport.futbol[0]?.points ?? 0;
  const leaderFutbolDiff = standingsBySport.futbol[0]?.diff ?? 0;

  const leaderVoley = standingsBySport.voleibol[0]?.school?.shortName || 'Por definir';
  const leaderVoleyPts = standingsBySport.voleibol[0]?.points ?? 0;
  const leaderVoleyDiff = standingsBySport.voleibol[0]?.setsDiff ?? 0;

  const leaderBasket = standingsBySport.baloncesto[0]?.school?.shortName || 'Por definir';
  const leaderBasketPts = standingsBySport.baloncesto[0]?.points ?? 0;
  const leaderBasketDiff = standingsBySport.baloncesto[0]?.diff ?? 0;

  // Formato de hora am/pm
  const formatHour12 = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map((v) => parseInt(v, 10));
    if (isNaN(h)) return time24;
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  let message = `🏆 *FESTIVAL DEPORTIVO COSTA DE ORO 2026*
📋 *REPORTE EJECUTIVO MATUTINO (7:00 AM)*
📍 *Sede:* Guanacaste, Costa Rica · La Paz Community School
📅 *Fecha:* ${dateStr}

Estimado Don Alejandro, le compartimos el resumen de la jornada anterior y los encuentros programados para hoy:

━━━━━━━━━━━━━━━━━━━━
📊 *RESUMEN DE RESULTADOS (Jornada ${jornada}):*
`;

  // Fútbol
  if (futbolMatches.length > 0) {
    message += `\n⚽ *Fútbol:*`;
    futbolMatches.forEach((m) => {
      const home = SCHOOLS_DATA.find((s) => s.id === m.homeTeamId)?.shortName || m.homeTeamId;
      const away = SCHOOLS_DATA.find((s) => s.id === m.awayTeamId)?.shortName || m.awayTeamId;
      message += `\n• ${home} ${m.homeScore} — ${m.awayScore} ${away}`;
    });
  }

  // Voleibol
  if (voleyMatches.length > 0) {
    message += `\n\n🏐 *Voleibol:*`;
    voleyMatches.forEach((m) => {
      const home = SCHOOLS_DATA.find((s) => s.id === m.homeTeamId)?.shortName || m.homeTeamId;
      const away = SCHOOLS_DATA.find((s) => s.id === m.awayTeamId)?.shortName || m.awayTeamId;
      const sets = m.homeSetsWon !== undefined && m.awaySetsWon !== undefined
        ? ` (${m.homeSetsWon} - ${m.awaySetsWon} sets)`
        : '';
      message += `\n• ${home} ${m.homeScore} — ${m.awayScore} ${away}${sets}`;
    });
  }

  // Baloncesto
  if (basketMatches.length > 0) {
    message += `\n\n🏀 *Baloncesto:*`;
    basketMatches.forEach((m) => {
      const home = SCHOOLS_DATA.find((s) => s.id === m.homeTeamId)?.shortName || m.homeTeamId;
      const away = SCHOOLS_DATA.find((s) => s.id === m.awayTeamId)?.shortName || m.awayTeamId;
      message += `\n• ${home} ${m.homeScore} — ${m.awayScore} ${away}`;
    });
  }

  message += `\n\n━━━━━━━━━━━━━━━━━━━━
🥇 *TABLA DE LÍDERES POR DISCIPLINA:*
• ⚽ *Fútbol:* ${leaderFutbol} (${leaderFutbolPts} pts | Dif: ${leaderFutbolDiff > 0 ? '+' : ''}${leaderFutbolDiff})
• 🏐 *Voleibol:* ${leaderVoley} (${leaderVoleyPts} pts | Dif Sets: ${leaderVoleyDiff > 0 ? '+' : ''}${leaderVoleyDiff})
• 🏀 *Baloncesto:* ${leaderBasket} (${leaderBasketPts} pts | Dif: ${leaderBasketDiff > 0 ? '+' : ''}${leaderBasketDiff})

━━━━━━━━━━━━━━━━━━━━
🗓️ *ENCUENTROS PROGRAMADOS PARA HOY:*`;

  if (upcomingMatches.length > 0) {
    upcomingMatches.slice(0, 5).forEach((m) => {
      const home = SCHOOLS_DATA.find((s) => s.id === m.homeTeamId)?.shortName || m.homeTeamId;
      const away = SCHOOLS_DATA.find((s) => s.id === m.awayTeamId)?.shortName || m.awayTeamId;
      const sportEmoji = m.sport === 'futbol' ? '⚽' : m.sport === 'voleibol' ? '🏐' : '🏀';
      const timeStr = formatHour12(m.time);
      message += `\n• ${sportEmoji} ${timeStr} · ${home} vs ${away} (${m.venue || 'Sede Principal'})`;
    });
  } else {
    message += `\n• Jornada de descanso técnico / Sin partidos oficiales programados hoy.`;
  }

  message += `\n\n━━━━━━━━━━━━━━━━━━━━
📸 *Muro Familiar Comunitario:*
• ${totalPosts} publicaciones y ${totalApplause} aplausos y reacciones registradas.

🔗 *Plataforma Oficial:* https://costadeoro.curiol.studio
_Curiol Studio · Ingeniería y Auditoría Deportiva_`;

  return message;
}

/**
 * Despacha un mensaje a través de Evolution API (WhatsApp)
 */
export async function sendWhatsAppMessageViaEvolutionApi(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiUrl = process.env.EVOLUTION_API_URL || 'https://evolution.curiol.studio';
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'costadeoro';

  // Sanitizar número (debe incluir código de país, ej: 50688888888)
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (!cleanPhone.startsWith('506') && cleanPhone.length === 8) {
    cleanPhone = `506${cleanPhone}`;
  }

  if (!apiKey) {
    return {
      success: false,
      error: 'EVOLUTION_API_KEY no está configurada en las variables de entorno. Se puede usar WhatsApp Web directo.',
    };
  }

  try {
    const res = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: cleanPhone,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: true,
        },
        textMessage: {
          text: message,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        messageId: data?.key?.id || data?.id || 'ok',
      };
    } else {
      const errText = await res.text();
      return {
        success: false,
        error: `HTTP ${res.status}: ${errText.slice(0, 150)}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error de conexión con Evolution API',
    };
  }
}

/**
 * Genera la URL universal de WhatsApp Web con el mensaje pre-cargado
 */
export function getWhatsAppDirectUrl(phoneNumber: string, message: string): string {
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (!cleanPhone.startsWith('506') && cleanPhone.length === 8) {
    cleanPhone = `506${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
