import { NextRequest, NextResponse } from 'next/server';
import { getTournamentDb, getAnalyticsSummaryFromDb } from '@/lib/serverDb';
import { calculateStandings } from '@/lib/sportsEngine';
import { SCHOOLS_DATA } from '@/config/tournamentConfig';
import { 
  WeeklyReportData, 
  generateWeeklyReportMessage, 
  generateExecutiveWeeklyReportForAlejandro,
  formatRouteFriendlyName,
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

  const mappedTopRoutes = Object.entries(analytics.viewsByRoute || {})
    .map(([routePath, views]) => ({ path: routePath, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((r) => ({
      path: r.path,
      label: formatRouteFriendlyName(r.path),
      views: r.views,
    }));

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
      todayViews: analytics.todayViews,
      weekViews: (analytics.dailyHistory || []).reduce((sum, d) => sum + (d.views || 0), 0),
      uniqueVisitors: analytics.uniqueVisitorsCount,
      mobilePercent,
      topRoutes: mappedTopRoutes,
      geoDistribution: analytics.geoDistribution,
      dailyHistory: analytics.dailyHistory,
    },
    dateStr: nowCR,
  };

  const deliveryResults = [];

  // Enviar versión ejecutiva a Don Alejandro (Viernes) y versión técnica a Alberto
  for (const admin of WEEKLY_REPORT_RECIPIENTS) {
    const isDonAlejandro = admin.phone === '50688445486';
    const messageText = isDonAlejandro
      ? generateExecutiveWeeklyReportForAlejandro(weeklyData)
      : generateWeeklyReportMessage(weeklyData);

    const sendRes = await sendWhatsAppMessageViaEvolutionApi(admin.phone, messageText);
    const directUrl = getWhatsAppDirectUrl(admin.phone, messageText);
    deliveryResults.push({
      recipient: admin.name,
      phone: admin.phone,
      reportType: isDonAlejandro ? 'executive_summary_30s' : 'technical_detailed',
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
    executiveMessage: generateExecutiveWeeklyReportForAlejandro(weeklyData),
    technicalMessage: generateWeeklyReportMessage(weeklyData),
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
