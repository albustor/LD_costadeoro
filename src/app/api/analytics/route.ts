import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummaryFromDb, recordAnalyticsEventInDb, PageViewEvent } from '@/lib/serverDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics
 * Retorna las estadísticas agregadas de flujo de usuarios para el panel administrativo
 */
export async function GET() {
  try {
    const summary = await getAnalyticsSummaryFromDb();
    return NextResponse.json(
      {
        success: true,
        analytics: summary,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('[API Analytics GET Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al consultar métricas de analítica.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics
 * Registra un evento de visualización de página / flujo de usuario de forma no bloqueante
 */
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      try {
        const text = await req.text();
        body = text ? JSON.parse(text) : {};
      } catch {
        body = {};
      }
    }

    const userAgent = req.headers.get('user-agent') || '';
    let detectedDevice: PageViewEvent['device'] = 'desktop';

    if (/iPad|tablet|PlayBook/i.test(userAgent)) {
      detectedDevice = 'tablet';
    } else if (/iPhone|iPod/i.test(userAgent)) {
      detectedDevice = 'mobile_ios';
    } else if (/Android/i.test(userAgent)) {
      detectedDevice = 'mobile_android';
    } else if (/Mobile/i.test(userAgent)) {
      detectedDevice = 'mobile_android';
    }

    const event: PageViewEvent = {
      path: body.path || '/',
      device: body.device || detectedDevice,
      timestamp: new Date().toISOString(),
      sessionId: body.sessionId,
      referrer: body.referrer || req.headers.get('referer') || 'Directo / PWA',
    };

    // Registro atómico
    await recordAnalyticsEventInDb(event);

    return NextResponse.json({
      success: true,
      recorded: true,
    });
  } catch (error: any) {
    console.error('[API Analytics POST Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al registrar evento de analítica.',
      },
      { status: 500 }
    );
  }
}
