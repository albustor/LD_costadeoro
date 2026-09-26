/**
 * AI Video Assistant with multi-tier resilience cascade (Rule #2)
 * Connects to /api/ai/describe-video with fallback to client heuristic
 */

export interface VideoAiSuggestion {
  title: string;
  description: string;
  tags: string[];
  provider: string;
}

export async function generateSportsVideoCopy(params: {
  schoolName: string;
  categoryName: string;
  actionType: 'gol' | 'tapón' | 'remate' | 'celebracion' | 'jugada' | 'calentamiento';
  details?: string;
}): Promise<VideoAiSuggestion> {
  try {
    const res = await fetch('/api/ai/describe-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        description: data.description,
        tags: [`#${params.schoolName.replace(/\s+/g, '')}`, '#LigaCostaDeOro2026', '#CuriolStudio'],
        provider: data.provider || 'Google Gemini / Groq Cascade',
      };
    }
  } catch (err) {
    console.warn('Fallo de red en endpoint IA, utilizando generador local:', err);
  }

  // Client-side fallback
  const cleanTitle = `¡Gran momento de ${params.schoolName}!`;
  const cleanDesc = `Jugada destacada en ${params.categoryName} durante la Liga Costa de Oro 2026.`;

  return {
    title: params.details ? `${cleanTitle} - ${params.details}` : cleanTitle,
    description: params.details ? `${cleanDesc} ${params.details}` : cleanDesc,
    tags: [`#${params.schoolName.replace(/\s+/g, '')}`, '#CostaDeOro2026'],
    provider: 'Degradación Elegante Local',
  };
}
