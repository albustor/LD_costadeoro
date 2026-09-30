import { NextRequest, NextResponse } from 'next/server';
import { getAllRostersFromDb, saveRosterToDb, saveMultipleRostersToDb } from '@/lib/serverDb';
import { TeamRoster } from '@/types/tournament';

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
