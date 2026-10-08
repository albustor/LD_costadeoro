import { NextRequest, NextResponse } from 'next/server';
import { deletePost, toggleFeaturePost } from '@/lib/serverDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Publicación eliminada correctamente',
    });
  } catch (err: any) {
    console.error('[API DELETE /api/posts/[id] Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al eliminar publicación' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await toggleFeaturePost(id);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    console.error('[API PATCH /api/posts/[id] Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al actualizar publicación' },
      { status: 500 }
    );
  }
}
