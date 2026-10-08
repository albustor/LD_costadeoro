/**
 * Image processing utilities for client-side compression and JPG conversion
 * Ensures photos taken by parents on high-res mobile phones are optimized for web (WebP)
 * and downloaded in standard JPG format.
 */

export interface ProcessedImage {
  previewUrl: string;
  downloadUrl: string;
  fileSizeKB: number;
  width: number;
  height: number;
  format: 'image/webp' | 'image/jpeg';
}

export async function processAndCompressPhoto(
  file: File,
  maxDimension: number = 1600,
  quality: number = 0.82
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Scale down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de imagen canvas'));
          return;
        }

        // Smooth high quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try modern WebP first (ultra-compact), with automatic JPEG fallback
        let targetDataUrl = canvas.toDataURL('image/webp', quality);
        let targetFormat: 'image/webp' | 'image/jpeg' = 'image/webp';

        // Check if browser actually produced WebP
        if (!targetDataUrl.startsWith('data:image/webp')) {
          targetDataUrl = canvas.toDataURL('image/jpeg', quality);
          targetFormat = 'image/jpeg';
        }

        const approxSizeKB = Math.round((targetDataUrl.length * 3) / 4 / 1024);

        resolve({
          previewUrl: targetDataUrl,
          downloadUrl: targetDataUrl,
          fileSizeKB: approxSizeKB,
          width,
          height,
          format: targetFormat,
        });
      };

      img.onerror = () => reject(new Error('Error al cargar el archivo de imagen'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo desde el dispositivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts any image URL (WebP, Blob, PNG) to a standard JPEG file and triggers browser download
 */
export async function downloadImageAsJpg(imageUrl: string, fileName: string): Promise<void> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Error al cargar la imagen para descarga'));
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw white background in case of transparent pixels
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            const safeName = fileName.replace(/\.[^/.]+$/, '');
            link.download = `${safeName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          } else {
            // Direct fallback
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        },
        'image/jpeg',
        0.92
      );
    } else {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.warn('[downloadImageAsJpg] Fallback descarga directa:', err);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Compresses an image file in the browser and returns an optimized WebP File object ready for upload
 */
export async function processImageForUpload(
  file: File,
  options?: { maxWidth?: number; quality?: number }
): Promise<{ file: File; previewUrl: string; fileSizeKB: number; width: number; height: number }> {
  const maxDim = options?.maxWidth || 1600;
  const qual = options?.quality || 0.82;
  const processed = await processAndCompressPhoto(file, maxDim, qual);

  // Convert dataURL to real File object
  const arr = processed.previewUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/webp';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  const ext = mime === 'image/webp' ? '.webp' : '.jpg';
  const cleanName = file.name.replace(/\.[^/.]+$/, '') + ext;
  const compressedFile = new File([u8arr], cleanName, { type: mime });

  return {
    file: compressedFile,
    previewUrl: processed.previewUrl,
    fileSizeKB: processed.fileSizeKB,
    width: processed.width,
    height: processed.height,
  };
}
