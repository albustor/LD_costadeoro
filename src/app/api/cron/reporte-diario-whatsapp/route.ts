import { NextRequest, NextResponse } from 'next/server';
import { getTournamentDb, getAnalyticsSummaryFromDb } from '@/lib/serverDb';
import { calculateStandings } from '@/lib/sportsEngine';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { 
  DailyReportData, 
  generateDailyReportMessage, 
  sendWhatsAppMessageViaEvolutionApi,
  getWhatsAppDirectUrl,
  ADMIN_NOTIFICATION_RECIPIENTS
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
  const analytics = await getAnalyticsSummaryFromDb();

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

  const totalDeviceHits = (analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android + analytics.deviceDistribution.tablet + analytics.deviceDistribution.desktop) || 1;
  const mobilePercent = Math.round(((analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android) / totalDeviceHits) * 100);

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
    trafficStats: {
      totalViews: analytics.totalViews,
      todayViews: analytics.todayViews,
      uniqueVisitors: analytics.uniqueVisitorsCount,
      mobilePercent,
    },
    dateStr: nowCR,
  };

  const messageText = generateDailyReportMessage(reportData);
  const deliveryResults = [];

  // Enviar a Don Alejandro y al Comité Organizador / Soporte
  for (const admin of ADMIN_NOTIFICATION_RECIPIENTS) {
    const sendRes = await sendWhatsAppMessageViaEvolutionApi(admin.phone, messageText);
    const directUrl = getWhatsAppDirectUrl(admin.phone, messageText);
    deliveryResults.push({
      recipient: admin.name,
      phone: admin.phone,
      success: sendRes.success,
      messageId: sendRes.messageId,
      error: sendRes.error,
      directWhatsAppWebUrl: directUrl,
    });
  }

  return NextResponse.json({
    success: true,
    timestamp: nowCR,
    executionTimeMs: Date.now() - startTime,
    recipients: ADMIN_NOTIFICATION_RECIPIENTS,
    deliveries: deliveryResults,
    reportMessage: messageText,
    summaryStats: {
      completedMatches: completedMatches.length,
      upcomingMatches: upcomingMatches.length,
      totalCommunityPosts: posts.length,
      totalApplause,
      totalTrafficViews: analytics.totalViews,
      uniqueVisitors: analytics.uniqueVisitorsCount,
    },
  });
}
