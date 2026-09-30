import { NextRequest, NextResponse } from 'next/server';
import { executeAiCascade } from '@/lib/aiCascadeEngine';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, author, schoolName, sport, moment, matchNotes } = body;

    const systemPrompt = `Eres el Asistente Curador de Valor Humano de la Liga Costa de Oro 2026 en Guanacaste, Costa Rica.
Tu misión es analizar mensajes de apoyo, fotos o incidencias de partidos y extraer el valor humano primordial (Compañerismo, Superación, Respeto, Pasión Sana, Unión Familiar, Fair Play).

Debes responder ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "badge": "Frase corta del valor (máximo 4 palabras, ej: 'Compañerismo Ejemplar')",
  "humanValue": "Nombre del valor (ej: 'Respeto y Juego Limpio')",
  "summary": "Reseña formativa breve y emotiva (máximo 2 oraciones)",
  "highlight": "Frase inspiradora para los estudiantes atletas (máximo 1 oración)"
}`;

    const userPrompt = `Contexto del evento:
- Institución: ${schoolName || 'Institución Participante'}
- Deporte / Categoría: ${sport || 'Festival Intercolegial'}
- Autor / Familiar: ${author || 'Comunidad'}
- Momento: ${moment || 'Jornada Deportiva'}
- Mensaje o Reseña: "${message || matchNotes || 'Gran entrega deportiva en cancha.'}"

Por favor genera la curaduría de valor humano en formato JSON.`;

    const aiResponse = await executeAiCascade({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      responseFormat: 'json_object',
    });

    let parsedContent;
    try {
      parsedContent = JSON.parse(aiResponse.content);
    } catch {
      parsedContent = {
        badge: 'Espíritu Deportivo',
        humanValue: 'Compañerismo y Respeto',
        summary: aiResponse.content,
        highlight: 'La pasión por el deporte formativo une a nuestras familias.',
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedContent,
      meta: {
        provider: aiResponse.provider,
        model: aiResponse.model,
        latencyMs: aiResponse.latencyMs,
        cached: aiResponse.cached,
      },
    });
  } catch (error) {
    console.error('[Curador Emocional Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Error procesando curaduría emocional',
        data: {
          badge: 'Unión y Juego Limpio',
          humanValue: 'Respeto Mutuo',
          summary: 'Festival intercolegial guiado por la hermandad deportiva en Guanacaste.',
          highlight: 'El esfuerzo de cada estudiante enaltece a su institución.',
        },
      },
      { status: 200 } // Retornar 200 con fallback para no romper clientes
    );
  }
}
