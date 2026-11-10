import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleWeeklyReport(request);
}

export async function POST(request: NextRequest) {
  return handleWeeklyReport(request);
}

async function handleWeeklyReport(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Torneo Costa de Oro concluido. Reportes semanales de los viernes desactivados definitivamente.",
    deactivated: true
  });
}
