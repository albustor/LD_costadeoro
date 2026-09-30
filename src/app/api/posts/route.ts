import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/serverDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err: any) {
    console.error('[API GET /api/posts Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al obtener publicaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolId, authorName, authorRelation, message, mediaType, mediaUrl, sportId } = body;

    if (!message && !mediaUrl) {
      return NextResponse.json(
        { success: false, error: 'El mensaje o archivo multimedia es obligatorio' },
        { status: 400 }
      );
    }

    const createdPost = await createPost({
      schoolId: schoolId || 'la-paz-cabo-velas',
      authorName: authorName?.trim() || 'Familia Acompañante',
      authorRelation: authorRelation || 'Familia',
      message: message?.trim() || '',
      mediaType: mediaType || 'none',
      mediaUrl: mediaUrl || undefined,
      sportId: sportId || 'futbol',
      isFeatured: false,
    });

    return NextResponse.json({
      success: true,
      data: createdPost,
    });
  } catch (err: any) {
    console.error('[API POST /api/posts Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error al crear la publicación' },
      { status: 500 }
    );
  }
}
