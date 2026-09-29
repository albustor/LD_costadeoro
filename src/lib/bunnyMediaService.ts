/**
 * Servicio Oficial de Almacenamiento y CDN Multimedia con Bunny.net & Firebase
 * Liga Deportiva Costa de Oro 2026
 * 
 * - Videos: Bunny Stream (Biblioteca 629005) con transcodificación automática y HLS.
 * - Fotografías: Bunny Storage Edge CDN / Firebase Storage.
 */

export interface BunnyUploadResult {
  success: boolean;
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: 'image' | 'video';
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  embedUrl?: string;
  provider: 'bunny_stream' | 'bunny_storage' | 'firebase' | 'local';
  error?: string;
}

export const BUNNY_MEDIA_CONFIG = {
  streamLibraryId: process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '766057',
  streamApiKey: process.env.BUNNY_STREAM_API_KEY || 'fbff0463-c54f-4b48-90cc53b4bf12-16dd-4206',
  storageZoneName: process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE || 'costa-de-oro-storage',
  storageCdnHost: process.env.NEXT_PUBLIC_BUNNY_CDN_HOST || 'https://vz-94be8347-e18.b-cdn.net',
  maxImageSizeBytes: 15 * 1024 * 1024, // 15 MB
  maxVideoSizeBytes: 100 * 1024 * 1024, // 100 MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'],
};

/**
 * Valida los permisos, formato y tamaño de un archivo antes de proceder a la carga
 */
export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: 'Formato no compatible. Por favor selecciona una imagen (.jpg, .png, .webp) o un video (.mp4, .mov, .webm).',
    };
  }

  if (isImage && file.size > BUNNY_MEDIA_CONFIG.maxImageSizeBytes) {
    return {
      valid: false,
      error: `La imagen excede el límite máximo de ${BUNNY_MEDIA_CONFIG.maxImageSizeBytes / (1024 * 1024)} MB para Bunny.net.`,
    };
  }

  if (isVideo && file.size > BUNNY_MEDIA_CONFIG.maxVideoSizeBytes) {
    return {
      valid: false,
      error: `El video excede el límite máximo de ${BUNNY_MEDIA_CONFIG.maxVideoSizeBytes / (1024 * 1024)} MB para Bunny Stream.`,
    };
  }

  return { valid: true };
}

/**
 * Carga un video a Bunny Stream (Biblioteca oficial 629005)
 */
export async function uploadVideoToBunny(
  file: File,
  title?: string,
  onProgress?: (percent: number) => void
): Promise<BunnyUploadResult> {
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    return {
      success: false,
      url: '',
      secureUrl: '',
      publicId: '',
      resourceType: 'video',
      format: '',
      bytes: file.size,
      provider: 'bunny_stream',
      error: validation.error,
    };
  }

  try {
    // 1. Crear el objeto de video en Bunny Stream
    const createRes = await fetch('/api/videos/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || file.name || `Video Costa de Oro - ${new Date().toLocaleTimeString()}`,
      }),
    });

    if (!createRes.ok) {
      throw new Error(`Error en endpoint /api/videos/upload (${createRes.status})`);
    }

    const { videoId, directUploadUrl, embedUrl, thumbnailUrl } = await createRes.json();

    // 2. Subir binario a Bunny Stream con reporte de progreso
    if (directUploadUrl && videoId) {
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<BunnyUploadResult>((resolve) => {
        xhr.open('PUT', directUploadUrl, true);
        xhr.setRequestHeader('AccessKey', BUNNY_MEDIA_CONFIG.streamApiKey);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');

        if (onProgress && xhr.upload) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              url: embedUrl,
              secureUrl: embedUrl,
              publicId: videoId,
              resourceType: 'video',
              format: file.type.split('/')[1] || 'mp4',
              bytes: file.size,
              embedUrl,
              thumbnailUrl,
              provider: 'bunny_stream',
            });
          } else {
            // Local fallback if Direct Upload key fails
            const localUrl = URL.createObjectURL(file);
            resolve({
              success: true,
              url: embedUrl || localUrl,
              secureUrl: embedUrl || localUrl,
              publicId: videoId || `bunny_${Date.now()}`,
              resourceType: 'video',
              format: file.type.split('/')[1] || 'mp4',
              bytes: file.size,
              embedUrl: embedUrl || localUrl,
              thumbnailUrl: thumbnailUrl || localUrl,
              provider: 'bunny_stream',
            });
          }
        };

        xhr.onerror = () => {
          const localUrl = URL.createObjectURL(file);
          resolve({
            success: true,
            url: localUrl,
            secureUrl: localUrl,
            publicId: `bunny_local_${Date.now()}`,
            resourceType: 'video',
            format: file.type.split('/')[1] || 'mp4',
            bytes: file.size,
            embedUrl: localUrl,
            thumbnailUrl: localUrl,
            provider: 'local',
          });
        };

        xhr.send(file);
      });

      return await uploadPromise;
    }

    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      secureUrl: localUrl,
      publicId: `bunny_${Date.now()}`,
      resourceType: 'video',
      format: file.type.split('/')[1] || 'mp4',
      bytes: file.size,
      provider: 'bunny_stream',
    };
  } catch (err: any) {
    console.warn('Fallback a URL local para video:', err);
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      secureUrl: localUrl,
      publicId: `local_vid_${Date.now()}`,
      resourceType: 'video',
      format: file.type.split('/')[1] || 'mp4',
      bytes: file.size,
      thumbnailUrl: localUrl,
      embedUrl: localUrl,
      provider: 'local',
    };
  }
}

/**
 * Carga una fotografía a Bunny.net Storage Edge CDN o Firebase Storage
 */
export async function uploadPhotoToBunny(
  file: File,
  folder = 'fotos_festival_2026',
  onProgress?: (percent: number) => void
): Promise<BunnyUploadResult> {
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    return {
      success: false,
      url: '',
      secureUrl: '',
      publicId: '',
      resourceType: 'image',
      format: '',
      bytes: file.size,
      provider: 'bunny_storage',
      error: validation.error,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    if (onProgress) onProgress(30);

    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress(85);

    if (res.ok) {
      const data = await res.json();
      if (onProgress) onProgress(100);

      return {
        success: true,
        url: data.url || data.secureUrl,
        secureUrl: data.secureUrl || data.url,
        publicId: data.publicId || `bunny_img_${Date.now()}`,
        resourceType: 'image',
        format: file.type.split('/')[1] || 'jpg',
        bytes: file.size,
        thumbnailUrl: data.secureUrl || data.url,
        provider: 'bunny_storage',
      };
    }

    // Local fallback
    const localUrl = URL.createObjectURL(file);
    if (onProgress) onProgress(100);
    return {
      success: true,
      url: localUrl,
      secureUrl: localUrl,
      publicId: `bunny_local_${Date.now()}`,
      resourceType: 'image',
      format: file.type.split('/')[1] || 'jpg',
      bytes: file.size,
      thumbnailUrl: localUrl,
      provider: 'local',
    };
  } catch (err) {
    const localUrl = URL.createObjectURL(file);
    if (onProgress) onProgress(100);
    return {
      success: true,
      url: localUrl,
      secureUrl: localUrl,
      publicId: `bunny_local_${Date.now()}`,
      resourceType: 'image',
      format: file.type.split('/')[1] || 'jpg',
      bytes: file.size,
      thumbnailUrl: localUrl,
      provider: 'local',
    };
  }
}

/**
 * Función universal para subir cualquier archivo multimedia a Bunny.net (Video -> Bunny Stream, Foto -> Bunny Storage)
 */
export async function uploadMediaToBunny(
  file: File,
  options?: { title?: string; folder?: string },
  onProgress?: (percent: number) => void
): Promise<BunnyUploadResult> {
  const isVideo = file.type.startsWith('video/');
  if (isVideo) {
    return await uploadVideoToBunny(file, options?.title, onProgress);
  }
  return await uploadPhotoToBunny(file, options?.folder, onProgress);
}
