import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummaryFromDb } from '@/lib/serverDb';
import { sendClarificationUpdateNotification, ADMIN_NOTIFICATION_RECIPIENTS } from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/notifications/update
 * Despacha el mensaje oficial de aclaración y actualización técnica a Don Alejandro y Soporte
 */
export async function POST(req: NextRequest) {
  try {
    const analytics = await getAnalyticsSummaryFromDb();
    const nowCR = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

    const totalDeviceHits = (analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android + analytics.deviceDistribution.tablet + analytics.deviceDistribution.desktop) || 1;
    const mobilePercent = Math.round(((analytics.deviceDistribution.mobile_ios + analytics.deviceDistribution.mobile_android) / totalDeviceHits) * 100);

    const result = await sendClarificationUpdateNotification({
      totalViews: analytics.totalViews,
      uniqueVisitors: analytics.uniqueVisitorsCount,
      todayViews: analytics.todayViews,
      mobilePercent,
      dateStr: nowCR,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje de actualización y aclaración despachado con éxito.',
      recipients: ADMIN_NOTIFICATION_RECIPIENTS,
      details: result,
    });
  } catch (error: any) {
    console.error('[API Notification Update Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar el mensaje de actualización.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/update
 */
export async function GET(req: NextRequest) {
  return POST(req);
}
