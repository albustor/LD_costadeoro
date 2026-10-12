import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import canonicalData from '@/data/canonical_standings.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/standings
 * Retorna las clasificaciones canónicas precalculadas por el motor determinista en Python.
 * Cero cálculo aritmético en caliente.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    let data = canonicalData as any;

    // Intentar leer la versión más reciente en disco si está disponible
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'canonical_standings.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch {
      // Usar la copia importada en memoria
    }

    if (categoryId) {
      const categoryStandings = data.computed_standing_points?.[categoryId] || [];
      return NextResponse.json(
        {
          success: true,
          canonical: true,
          categoryId,
          last_updated: data.last_updated,
          standings: categoryStandings,
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        canonical: true,
        generator: data.generator,
        last_updated: data.last_updated,
        version: data.version,
        matches_processed: data.matches_processed,
        computed_standing_points: data.computed_standing_points,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[API Standings GET Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al consultar las clasificaciones canónicas.',
      },
      { status: 500 }
    );
  }
}
