import { NextRequest, NextResponse } from 'next/server';
import { reactToPost } from '@/lib/serverDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type } = body as { type: 'like' | 'applause' | 'feature' };

    if (!type || !['like', 'applause', 'feature'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de reacción inválido. Debe ser like, applause o feature.' },
        { status: 400 }
      );
    }

    const updatedPost = await reactToPost(id, type);

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (err: any) {
    console.error('[API POST /api/posts/[id]/react Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al procesar reacción' },
      { status: 500 }
    );
  }
}
