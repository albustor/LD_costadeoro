import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const OFFICIAL_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || '629005';
const OFFICIAL_STREAM_KEY = process.env.BUNNY_STREAM_API_KEY || '3667ba08-0c14-4014-a69a-0facf55b9eff';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // CASO 1: Subida de archivo de video binario (FormData)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const title = (formData.get('title') as string) || 'Video Fan Short Costa de Oro 2026';

      if (!file) {
        return NextResponse.json(
          { error: 'No se adjuntó ningún archivo de video.' },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const safeBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const fileName = `vid_${timestamp}_${safeBaseName}.${ext}`;

      // 1.1 Guardar copia física local en /public/uploads/videos/
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const localVideoUrl = `/uploads/videos/${fileName}`;

      // 1.2 Intentar sincronización con Bunny Stream en backend
      try {
        const bunnyCreateRes = await fetch(`https://video.bunnycdn.com/library/${OFFICIAL_LIBRARY_ID}/videos`, {
          method: 'POST',
          headers: {
            AccessKey: OFFICIAL_STREAM_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ title }),
        });

        if (bunnyCreateRes.ok) {
          const bunnyData = await bunnyCreateRes.json();
          const videoId = bunnyData.guid;

          // Subir los bytes a Bunny Stream
          const uploadToBunnyRes = await fetch(
            `https://video.bunnycdn.com/library/${OFFICIAL_LIBRARY_ID}/videos/${videoId}`,
            {
              method: 'PUT',
              headers: {
                AccessKey: OFFICIAL_STREAM_KEY,
                'Content-Type': 'application/octet-stream',
              },
              body: buffer,
            }
          );

          if (uploadToBunnyRes.ok) {
            const embedUrl = `https://iframe.mediadelivery.net/embed/${OFFICIAL_LIBRARY_ID}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`;
            const thumbnailUrl = `https://vz-${OFFICIAL_LIBRARY_ID}.b-cdn.net/${videoId}/thumbnail.jpg`;

            return NextResponse.json({
              success: true,
              videoId,
              videoUrl: localVideoUrl,
              embedUrl,
              thumbnailUrl: localVideoUrl, // Fallback inmediato al video local mientras Bunny transcodifica
              directUploadUrl: `https://video.bunnycdn.com/library/${OFFICIAL_LIBRARY_ID}/videos/${videoId}`,
              libraryId: OFFICIAL_LIBRARY_ID,
              provider: 'bunny_stream',
              fileName,
            });
          }
        }
      } catch (bunnyError) {
        console.warn('Bunny Stream no disponible, usando almacenamiento local:', bunnyError);
      }

      // Fallback local garantizado
      return NextResponse.json({
        success: true,
        videoId: `local_${timestamp}`,
        videoUrl: localVideoUrl,
        embedUrl: localVideoUrl,
        thumbnailUrl: localVideoUrl,
        provider: 'local_storage',
        fileName,
      });
    }

    // CASO 2: Creación de registro para carga directa (JSON)
    const body = await req.json();
    const { title, collectionId } = body;

    const response = await fetch(`https://video.bunnycdn.com/library/${OFFICIAL_LIBRARY_ID}/videos`, {
      method: 'POST',
      headers: {
        AccessKey: OFFICIAL_STREAM_KEY,
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
    const videoId = data.guid;
    const embedUrl = `https://iframe.mediadelivery.net/embed/${OFFICIAL_LIBRARY_ID}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`;
    const directUploadUrl = `https://video.bunnycdn.com/library/${OFFICIAL_LIBRARY_ID}/videos/${videoId}`;
    const thumbnailUrl = `https://vz-${OFFICIAL_LIBRARY_ID}.b-cdn.net/${videoId}/thumbnail.jpg`;

    return NextResponse.json({
      success: true,
      videoId,
      embedUrl,
      directUploadUrl,
      thumbnailUrl,
      libraryId: OFFICIAL_LIBRARY_ID,
      provider: 'bunny_stream',
    });
  } catch (error: any) {
    console.error('Server error in Bunny upload route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}
