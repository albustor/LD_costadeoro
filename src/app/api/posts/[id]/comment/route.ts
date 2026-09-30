import { NextRequest, NextResponse } from 'next/server';
import { addCommentToPost } from '@/lib/serverDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorName, authorRelation, text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'El texto del comentario es obligatorio' },
        { status: 400 }
      );
    }

    const createdComment = await addCommentToPost(id, {
      authorName: authorName?.trim() || 'Familiar Acompañante',
      authorRelation: authorRelation || 'Familia',
      text: text.trim(),
    });

    if (!createdComment) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada para comentar' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: createdComment,
    });
  } catch (err: any) {
    console.error('[API POST /api/posts/[id]/comment Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al agregar comentario' },
      { status: 500 }
    );
  }
}
