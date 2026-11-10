import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleDailyReport(request);
}

export async function POST(request: NextRequest) {
  return handleDailyReport(request);
}

async function handleDailyReport(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Torneo Costa de Oro concluido. Reportes diarios desactivados definitivamente.",
    deactivated: true
  });
}
