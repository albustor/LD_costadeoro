import { NextRequest, NextResponse } from 'next/server';
import { BUNNY_CONFIG } from '@/lib/unifiedStorageService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, collectionId } = body;

    const libraryId = process.env.BUNNY_LIBRARY_ID || BUNNY_CONFIG.libraryId;
    const apiKey = process.env.BUNNY_STREAM_API_KEY || BUNNY_CONFIG.apiKey;

    // Create video entry in Bunny Stream Library
    const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title: title || 'Liga Costa de Oro 2026 - Video Fan Short',
        collectionId: collectionId || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bunny Stream API Error:', errorText);
      return NextResponse.json(
        { error: 'Error al comunicarse con Bunny Stream API', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Returns videoId, direct upload endpoint, and embedUrl
    const videoId = data.guid;
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`;
    const directUploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
    const thumbnailUrl = `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`;

    return NextResponse.json({
      success: true,
      videoId,
      embedUrl,
      directUploadUrl,
      thumbnailUrl,
      libraryId,
    });
  } catch (error: any) {
    console.error('Server error in Bunny upload route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}
