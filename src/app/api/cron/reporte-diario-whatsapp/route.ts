import { NextRequest, NextResponse } from 'next/server';
import { getTournamentDb } from '@/lib/serverDb';
import { calculateStandings } from '@/lib/sportsEngine';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { 
  DailyReportData, 
  generateDailyReportMessage, 
  sendWhatsAppMessageViaEvolutionApi,
  getWhatsAppDirectUrl
} from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleDailyReport(request);
}

export async function POST(request: NextRequest) {
  return handleDailyReport(request);
}

async function handleDailyReport(request: NextRequest) {
  const startTime = Date.now();
  const db = await getTournamentDb();

  // Fecha y hora en Costa Rica
  const nowCR = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

  const matches = db.matches || [];
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled' || m.status === 'live');

  // Calcular tablas de posiciones por deporte
  const standingsFutbol = calculateStandings('cat-fem-futbol', 'futbol', matches, SCHOOLS_DATA);
  const standingsVoley = calculateStandings('cat-fem-c-voley', 'voleibol', matches, SCHOOLS_DATA);
  const standingsBasket = calculateStandings('cat-c-basket', 'baloncesto', matches, SCHOOLS_DATA);

  const posts = db.posts || [];
  const totalApplause = posts.reduce((sum, p) => sum + (p.likesCount || 0) + (p.applauseCount || 0), 0);

  const reportData: DailyReportData = {
    jornada: 1,
    completedMatches,
    upcomingMatches,
    standingsBySport: {
      futbol: standingsFutbol,
      voleibol: standingsVoley,
      baloncesto: standingsBasket,
    },
    totalPosts: posts.length,
    totalApplause,
    dateStr: nowCR,
  };

  const messageText = generateDailyReportMessage(reportData);
  const targetPhone = process.env.DON_ALEJANDRO_PHONE || '50660602617';

  // Intentar envío por Evolution API
  const sendResult = await sendWhatsAppMessageViaEvolutionApi(targetPhone, messageText);
  const directWaUrl = getWhatsAppDirectUrl(targetPhone, messageText);

  return NextResponse.json({
    success: true,
    timestamp: nowCR,
    executionTimeMs: Date.now() - startTime,
    recipient: {
      name: 'Don Alejandro',
      phone: targetPhone,
    },
    delivery: {
      evolutionApiSuccess: sendResult.success,
      messageId: sendResult.messageId,
      error: sendResult.error,
      directWhatsAppWebUrl: directWaUrl,
    },
    reportMessage: messageText,
    summaryStats: {
      completedMatches: completedMatches.length,
      upcomingMatches: upcomingMatches.length,
      totalCommunityPosts: posts.length,
      totalApplause,
    },
  });
}
