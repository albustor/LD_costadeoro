import { NextRequest, NextResponse } from 'next/server';
import { getAllMatchesFromDb, updateMatchInDb } from '@/lib/serverDb';
import { Match } from '@/types/tournament';
import { sendMatchNotificationToAlberto } from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/matches
 * Retorna todos los partidos y marcadores oficiales desde la base de datos centralizada
 */
export async function GET() {
  try {
    const matches = await getAllMatchesFromDb();
    return NextResponse.json(
      {
        success: true,
        count: matches.length,
        matches,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[API Matches GET Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al consultar los partidos en el servidor.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/matches
 * Actualiza o registra el resultado de un partido en la base de datos centralizada
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const match = body.match || body;

    if (!match.id || !match.categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos incompletos: id y categoryId son requeridos.',
        },
        { status: 400 }
      );
    }

    const updatedMatches = await updateMatchInDb(match as Match);

    // Despacho de alerta por WhatsApp a Alberto (+506 6060-2617) si el partido está concluido o reprogramado
    let notificationResult = null;
    if (match.status === 'completed' || match.status === 'postponed' || match.currentPeriod === 'Por reprogramar') {
      try {
        notificationResult = await sendMatchNotificationToAlberto(match as Match);
      } catch (notifyErr) {
        console.warn('[API Matches Notify Alberto Warning]:', notifyErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Partido actualizado exitosamente en el servidor.',
      match,
      totalMatches: updatedMatches.length,
      notification: notificationResult,
    });
  } catch (error) {
    console.error('[API Matches POST Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar el partido en el servidor.',
      },
      { status: 500 }
    );
  }
}
