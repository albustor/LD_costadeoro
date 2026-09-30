/**
 * Unified Media and Storage Architecture for Liga Costa de Oro 2026
 * Powered 100% by Bunny.net (Bunny Stream Library 629005) for videos
 * and Files / High-Definition CDN for photo assets.
 */

export interface BunnyStreamConfig {
  libraryId: string;
  apiKey: string;
  embedBaseUrl: string;
  cdnHost: string;
}

export const BUNNY_CONFIG: BunnyStreamConfig = {
  libraryId: process.env.BUNNY_LIBRARY_ID || '766057',
  apiKey: process.env.BUNNY_STREAM_API_KEY || 'fbff0463-c54f-4b48-90cc53b4bf12-16dd-4206',
  embedBaseUrl: 'https://iframe.mediadelivery.net/embed',
  cdnHost: process.env.NEXT_PUBLIC_BUNNY_CDN_HOST || 'https://vz-94be8347-e18.b-cdn.net',
};

/**
 * Generates an embeddable Bunny Stream player URL
 */
export function getBunnyEmbedUrl(videoIdOrUrl: string): string {
  if (!videoIdOrUrl) {
    return `${BUNNY_CONFIG.embedBaseUrl}/${BUNNY_CONFIG.libraryId}/sample-short?autoplay=true&loop=false&muted=false&preload=true`;
  }

  // If already an iframe / embed URL
  if (videoIdOrUrl.includes('mediadelivery.net')) {
    return videoIdOrUrl;
  }

  // If clean UUID or Bunny video ID
  if (/^[a-f0-9\-]+$/i.test(videoIdOrUrl)) {
    return `${BUNNY_CONFIG.embedBaseUrl}/${BUNNY_CONFIG.libraryId}/${videoIdOrUrl}?autoplay=true&loop=false&muted=false&preload=true`;
  }

  // Fallback to direct URL
  return videoIdOrUrl;
}

/**
 * Generates direct Bunny Stream thumbnail URL
 */
export function getBunnyThumbnailUrl(videoId: string): string {
  if (!videoId || videoId.startsWith('http')) return videoId;
  return `${BUNNY_CONFIG.cdnHost}/${videoId}/thumbnail.jpg`;
}

/**
 * Builds high-resolution JPG download URL with optional dimensions via Bunny.net Edge
 */
export function getOptimizedJpgUrl(
  originalUrl: string,
  options?: { width?: number; quality?: number }
): string {
  if (!originalUrl) return '';

  if (originalUrl.includes('b-cdn.net')) {
    const widthParam = options?.width ? `?width=${options.width}` : '';
    const qualityParam = options?.quality ? `&quality=${options.quality}` : '';
    return `${originalUrl}${widthParam}${qualityParam}`;
  }

  return originalUrl;
}
