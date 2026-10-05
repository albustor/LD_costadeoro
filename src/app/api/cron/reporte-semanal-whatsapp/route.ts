import { NextRequest, NextResponse } from 'next/server';
import { getTournamentDb, getAnalyticsSummaryFromDb } from '@/lib/serverDb';
import { calculateStandings } from '@/lib/sportsEngine';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { 
  WeeklyReportData, 
  generateWeeklyReportMessage, 
  sendWhatsAppMessageViaEvolutionApi,
  getWhatsAppDirectUrl,
  WEEKLY_REPORT_RECIPIENTS
} from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleWeeklyReport(request);
}

export async function POST(request: NextRequest) {
  return handleWeeklyReport(request);
}

async function handleWeeklyReport(request: NextRequest) {
  const startTime = Date.now();
  const db = await getTournamentDb();
  const analytics = await getAnalyticsSummaryFromDb();

  // Fecha y hora actual en Costa Rica
  const nowCR = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

  const matches = db.matches || [];
  const completedMatchesThisWeek = matches.filter((m) => m.status === 'completed');
  const upcomingMatchesNextWeek = matches.filter((m) => m.status === 'scheduled' || m.status === 'live');

  // Tablas de posiciones consolidadas
  const standingsFutbol = calculateStandings('cat-fem-futbol', 'futbol', matches, SCHOOLS_DATA);
  const standingsVoley = calculateStandings('cat-fem-c-voley', 'voleibol', matches, SCHOOLS_DATA);
  const standingsBasket = calculateStandings('cat-c-basket', 'baloncesto', matches, SCHOOLS_DATA);

  // Muro comunitario y reacciones
  const posts = db.posts || [];
  const totalApplause = posts.reduce((sum, p) => sum + (p.likesCount || 0) + (p.applauseCount || 0), 0);

  // Censo de nóminas y atletas inscritos
  const rosters = db.rosters || [];
  const totalRostersCount = rosters.length;
  const totalPlayersCount = rosters.reduce((sum, r) => sum + (r.players?.length || 0), 0);

  // Telemetría acumulada
  const totalDeviceHits = (analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android + analytics.deviceDistribution.tablet + analytics.deviceDistribution.desktop) || 1;
  const mobilePercent = Math.round(((analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android) / totalDeviceHits) * 100);

  const weeklyData: WeeklyReportData = {
    jornada: 1,
    completedMatchesThisWeek,
    upcomingMatchesNextWeek,
    standingsBySport: {
      futbol: standingsFutbol,
      voleibol: standingsVoley,
      baloncesto: standingsBasket,
    },
    totalRostersCount,
    totalPlayersCount,
    totalPosts: posts.length,
    totalApplause,
    trafficStats: {
      totalViews: analytics.totalViews,
      weekViews: analytics.todayViews * 5, // Estimado semanal
      uniqueVisitors: analytics.uniqueVisitorsCount,
      mobilePercent,
    },
    dateStr: nowCR,
  };

  const messageText = generateWeeklyReportMessage(weeklyData);
  const deliveryResults = [];

  // Enviar a Don Alejandro (Viernes 5:30 PM) y copia a Alberto
  for (const admin of WEEKLY_REPORT_RECIPIENTS) {
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
    type: 'weekly_report_friday',
    timestamp: nowCR,
    executionTimeMs: Date.now() - startTime,
    recipients: WEEKLY_REPORT_RECIPIENTS,
    deliveries: deliveryResults,
    reportMessage: messageText,
    summaryStats: {
      completedMatchesThisWeek: completedMatchesThisWeek.length,
      upcomingMatchesNextWeek: upcomingMatchesNextWeek.length,
      totalRostersCount,
      totalPlayersCount,
      totalCommunityPosts: posts.length,
      totalApplause,
      totalViews: analytics.totalViews,
      uniqueVisitors: analytics.uniqueVisitorsCount,
    },
  });
}
