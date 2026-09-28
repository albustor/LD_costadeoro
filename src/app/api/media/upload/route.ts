import { NextRequest, NextResponse } from 'next/server';
import { BUNNY_MEDIA_CONFIG } from '@/lib/bunnyMediaService';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'costa_de_oro_2026/fotos';

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha adjuntado ningún archivo para subir.' },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith('video/');
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const publicId = `bny_${timestamp}_${safeName}`;
    
    // BunnyCDN Storage / Edge URL
    const cdnUrl = `${BUNNY_MEDIA_CONFIG.storageCdnHost}/${folder}/${publicId}`;

    return NextResponse.json({
      success: true,
      url: cdnUrl,
      secureUrl: cdnUrl,
      publicId,
      format: file.type.split('/')[1] || (isVideo ? 'mp4' : 'jpg'),
      bytes: file.size,
      resourceType: isVideo ? 'video' : 'image',
      provider: isVideo ? 'bunny_stream' : 'bunny_storage',
    });
  } catch (error: any) {
    console.error('Error en /api/media/upload:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}
