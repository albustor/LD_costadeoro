import { NextRequest, NextResponse } from 'next/server';
import { sendTestSystemNotification, ADMIN_NOTIFICATION_RECIPIENTS } from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/notifications/test
 * Dispara el mensaje de prueba oficial por WhatsApp a Don Alejandro y Soporte
 */
export async function POST(req: NextRequest) {
  try {
    const result = await sendTestSystemNotification();

    return NextResponse.json({
      success: true,
      message: 'Mensaje de prueba oficial procesado.',
      recipients: ADMIN_NOTIFICATION_RECIPIENTS,
      details: result,
    });
  } catch (error: any) {
    console.error('[API Notification Test Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar el mensaje de prueba.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/test
 * Retorna el estado y los destinatarios configurados
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    recipients: ADMIN_NOTIFICATION_RECIPIENTS,
    service: 'Evolution API WhatsApp Gateway',
  });
}
