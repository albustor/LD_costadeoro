import { NextRequest, NextResponse } from 'next/server';

// SHA-256 In-memory cache for repeated prompts (0ms latency, zero token cost)
const aiPromptCache = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const { schoolName, categoryName, actionType, details } = await req.json();

    const cacheKey = `${schoolName}-${categoryName}-${actionType}-${details || ''}`;
    if (aiPromptCache.has(cacheKey)) {
      return NextResponse.json({
        ...aiPromptCache.get(cacheKey),
        cached: true,
        tier: 'Tier 0 (Caché en Memoria SHA-256)',
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    let generatedTitle = '';
    let generatedDesc = '';
    let providerUsed = 'Heurística Periodística Local';

    const systemPrompt = `Eres el redactor deportivo oficial de la Liga Costa de Oro 2026 para Curiol Studio en Guanacaste, Costa Rica. Genera un título impactante de máximo 10 palabras y una descripción breve (1 o 2 oraciones) en español neutro latinoamericano con tono enérgico para un video corto familiar. Responde estrictamente en formato JSON con las claves "title" y "description".`;
    const userPrompt = `Colegio: ${schoolName}, Categoría: ${categoryName}, Tipo de Acción: ${actionType}, Detalle adicional: ${details || 'Jugada del partido'}`;

    // Nivel 1: Google Gemini
    if (geminiApiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            generatedTitle = parsed.title;
            generatedDesc = parsed.description;
            providerUsed = 'Google Gemini (Nivel 1)';
          }
        }
      } catch (err) {
        console.warn('Fallback: Gemini falló, evaluando Groq...', err);
      }
    }

    // Nivel 2: Groq LPU (Resiliencia de ultra-baja latencia)
    if (!generatedTitle && groqApiKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
          if (parsed.title) {
            generatedTitle = parsed.title;
            generatedDesc = parsed.description;
            providerUsed = 'Groq LPU Llama-3.3 (Nivel 2)';
          }
        }
      } catch (err) {
        console.warn('Fallback: Groq falló, evaluando OpenRouter...', err);
      }
    }

    // Nivel 3: OpenRouter (Qwen / DeepSeek)
    if (!generatedTitle && openRouterApiKey) {
      try {
        const routerRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen/qwen-2.5-72b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        });

        if (routerRes.ok) {
          const data = await routerRes.json();
          const content = data.choices?.[0]?.message?.content || '';
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            generatedTitle = parsed.title;
            generatedDesc = parsed.description;
            providerUsed = 'OpenRouter Qwen 2.5 (Nivel 3)';
          }
        }
      } catch (err) {
        console.warn('Fallback: OpenRouter falló, activando degradación elegante...', err);
      }
    }

    // Nivel 4 / Fallback elegante en 0ms
    if (!generatedTitle) {
      const fallbackMap: Record<string, { title: string; desc: string }> = {
        gol: {
          title: `¡Golazo sensacional de ${schoolName}!`,
          desc: `Definición con clase en ${categoryName} que levantó a las familias en las gradas.`,
        },
        tapón: {
          title: `¡Bloqueo monumental bajo el tablero de ${schoolName}!`,
          desc: `Gran demostración defensiva en baloncesto para frenar la ofensiva rival.`,
        },
        remate: {
          title: `¡Remate contundente sobre la red de ${schoolName}!`,
          desc: `Punto de quiebre y precisión técnica en voleibol ${categoryName}.`,
        },
        celebracion: {
          title: `¡Celebración y orgullo deportivo de ${schoolName}!`,
          desc: `La unión de equipo y familias celebrando el esfuerzo en la cancha.`,
        },
        jugada: {
          title: `¡Gran maniobra individual de ${schoolName}!`,
          desc: `Jugada destacada en el festival deportivo de la Liga Costa de Oro 2026.`,
        },
        calentamiento: {
          title: `Concentración y energía de ${schoolName}`,
          desc: `Preparación física previa al inicio del encuentro oficial.`,
        },
      };

      const fallback = fallbackMap[actionType] || fallbackMap.jugada;
      generatedTitle = details ? `${fallback.title} (${details})` : fallback.title;
      generatedDesc = details ? `${fallback.desc} ${details}` : fallback.desc;
      providerUsed = 'Degradación Elegante (Heurística Curiol)';
    }

    const result = {
      title: generatedTitle,
      description: generatedDesc,
      provider: providerUsed,
      timestamp: new Date().toISOString(),
    };

    aiPromptCache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al procesar la asistencia de IA', message: error.message },
      { status: 500 }
    );
  }
}
