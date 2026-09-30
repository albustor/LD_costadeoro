import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
    const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${isVideo ? 'vid' : 'foto'}_${timestamp}_${safeBaseName}.${ext}`;
    const targetSubdir = isVideo ? 'videos' : 'photos';

    // Directorio físico en /public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetSubdir);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL servida directamente por Next.js
    const accessibleUrl = `/uploads/${targetSubdir}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: accessibleUrl,
      secureUrl: accessibleUrl,
      publicId: fileName,
      fileName,
      format: ext,
      bytes: file.size,
      resourceType: isVideo ? 'video' : 'image',
      provider: 'local_storage',
    });
  } catch (error: any) {
    console.error('Error en /api/media/upload:', error);
    return NextResponse.json(
      { error: 'Error interno al guardar archivo multimedia', message: error.message },
      { status: 500 }
    );
  }
}
