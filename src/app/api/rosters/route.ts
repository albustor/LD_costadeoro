import { NextRequest, NextResponse } from 'next/server';
import { getAllRostersFromDb, saveRosterToDb, saveMultipleRostersToDb, deleteRosterFromDb } from '@/lib/serverDb';
import { TeamRoster } from '@/types/tournament';
import { sendRosterNotificationToAdmins } from '@/lib/evolutionApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/rosters
 * Retorna todas las nóminas oficiales desde la base de datos centralizada
 */
export async function GET() {
  try {
    const rosters = await getAllRostersFromDb();
    return NextResponse.json(
      {
        success: true,
        count: rosters.length,
        rosters,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[API Rosters GET Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al consultar las nóminas oficiales en el servidor.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rosters
 * Guarda una o múltiples nóminas en la base de datos centralizada
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Caso 1: Arreglo de nóminas (importación masiva)
    if (Array.isArray(body)) {
      const saved = await saveMultipleRostersToDb(body as TeamRoster[]);
      
      // Notificar al comité organizador y Don Alejandro por cada nómina (o la primera si es masivo)
      if (saved.length > 0) {
        // Ejecución en segundo plano no bloqueante
        Promise.allSettled(saved.map((r) => sendRosterNotificationToAdmins(r))).catch((err) =>
          console.error('[Evolution API Roster Alert Error]:', err)
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Nóminas múltiples guardadas exitosamente en la base de datos central.',
        count: saved.length,
        rosters: saved,
      });
    }

    // Caso 2: Objeto contenedor { rosters: [...] }
    if (body && Array.isArray(body.rosters)) {
      const saved = await saveMultipleRostersToDb(body.rosters as TeamRoster[]);
      
      if (saved.length > 0) {
        Promise.allSettled(saved.map((r) => sendRosterNotificationToAdmins(r))).catch((err) =>
          console.error('[Evolution API Roster Alert Error]:', err)
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Nóminas múltiples guardadas exitosamente en la base de datos central.',
        count: saved.length,
        rosters: saved,
      });
    }

    // Caso 3: Nómina individual
    const rosterData = body.roster || body;
    if (!rosterData.schoolId || !rosterData.sport || !rosterData.categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos incompletos: schoolId, sport y categoryId son obligatorios.',
        },
        { status: 400 }
      );
    }

    const saved = await saveRosterToDb(rosterData as TeamRoster);

    // Despacho de WhatsApp en segundo plano a Don Alejandro y Soporte
    sendRosterNotificationToAdmins(saved).catch((err) =>
      console.error('[Evolution API Roster Alert Error]:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Nómina oficial guardada exitosamente en la base de datos central.',
      roster: saved,
    });
  } catch (error) {
    console.error('[API Rosters POST Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al persistir la nómina en la base de datos central.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rosters
 * Elimina la nómina de un equipo específico en una categoría y disciplina
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let schoolId = searchParams.get('schoolId');
    let sport = searchParams.get('sport');
    let categoryId = searchParams.get('categoryId');

    if (!schoolId || !sport || !categoryId) {
      try {
        const body = await req.json();
        schoolId = schoolId || body.schoolId;
        sport = sport || body.sport;
        categoryId = categoryId || body.categoryId;
      } catch {}
    }

    if (!schoolId || !sport || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros incompletos: schoolId, sport y categoryId son requeridos para eliminar.',
        },
        { status: 400 }
      );
    }

    const deleted = await deleteRosterFromDb(schoolId, sport, categoryId);

    return NextResponse.json({
      success: true,
      deleted,
      message: deleted
        ? 'Nómina del equipo eliminada exitosamente de la base de datos central.'
        : 'No se encontró la nómina especificada para eliminar.',
    });
  } catch (error) {
    console.error('[API Rosters DELETE Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al eliminar la nómina del servidor.',
      },
      { status: 500 }
    );
  }
}
