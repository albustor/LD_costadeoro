/**
 * Image processing utilities for client-side compression and JPG conversion
 * Ensures photos taken by parents on high-res mobile phones are optimized for web
 * and downloaded in standard JPG format.
 */

export interface ProcessedImage {
  previewUrl: string;
  downloadUrl: string;
  fileSizeKB: number;
  width: number;
  height: number;
  format: 'image/jpeg';
}

export async function processAndCompressPhoto(
  file: File,
  maxDimension: number = 2048,
  quality: number = 0.85
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

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to standard JPEG format
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSizeKB = Math.round((jpegDataUrl.length * 3) / 4 / 1024);

        resolve({
          previewUrl: jpegDataUrl,
          downloadUrl: jpegDataUrl,
          fileSizeKB: approxSizeKB,
          width,
          height,
          format: 'image/jpeg',
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
 * Triggers a direct browser download as a JPG file
 */
export function downloadImageAsJpg(imageUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Compresses an image file in the browser and returns an optimized File object ready for upload
 */
export async function processImageForUpload(
  file: File,
  options?: { maxWidth?: number; quality?: number }
): Promise<{ file: File; previewUrl: string; fileSizeKB: number }> {
  const maxDim = options?.maxWidth || 1920;
  const qual = options?.quality || 0.85;
  const processed = await processAndCompressPhoto(file, maxDim, qual);

  // Convert dataURL to real File object
  const arr = processed.previewUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
  const compressedFile = new File([u8arr], cleanName, { type: mime });

  return {
    file: compressedFile,
    previewUrl: processed.previewUrl,
    fileSizeKB: processed.fileSizeKB,
  };
}
