import crypto from 'crypto';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json_object' | 'text';
}

export interface AiCompletionResponse {
  content: string;
  provider: 'cache' | 'gemini' | 'groq' | 'openrouter' | 'dashscope' | 'fallback';
  model: string;
  latencyMs: number;
  cached: boolean;
}

// 🧠 1. Caché en Memoria (SHA-256)
interface CacheEntry {
  response: string;
  provider: string;
  model: string;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 horas

function calculateHash(messages: AiMessage[], responseFormat?: string): string {
  const raw = JSON.stringify({ messages, responseFormat });
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/**
 * ⚡ Nivel 1: Google Gemini (gemini-2.5-flash, gemini-1.5-flash)
 */
async function queryGemini(request: AiCompletionRequest): Promise<{ content: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  const model = 'gemini-2.5-flash';
  const systemMessage = request.messages.find((m) => m.role === 'system')?.content;
  const userMessages = request.messages.filter((m) => m.role !== 'system');

  const contents = userMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: Record<string, any> = {
    contents,
    generationConfig: {
      temperature: request.temperature ?? 0.4,
      maxOutputTokens: request.maxTokens ?? 1024,
    },
  };

  if (systemMessage) {
    payload.systemInstruction = {
      parts: [{ text: systemMessage }],
    };
  }

  if (request.responseFormat === 'json_object') {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini retornó una respuesta vacía');

  return { content: text, model };
}

/**
 * ⚡ Nivel 2: Groq LPU (Ultra-baja latencia con fallback multinúcleo)
 */
async function queryGroq(request: AiCompletionRequest): Promise<{ content: string; model: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY no configurada');

  const modelsToTry = ['qwen/qwen3.8-27b', 'llama-3.3-70b-versatile', 'openai/gpt-oss-120b'];
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: request.messages,
          temperature: request.temperature ?? 0.4,
          max_tokens: request.maxTokens ?? 1024,
          response_format: request.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return { content: text, model };
      } else {
        lastError = `HTTP ${res.status}: ${await res.text()}`;
      }
    } catch (err) {
      lastError = (err as Error).message;
    }
  }

  throw new Error(`Groq API Error en todos los modelos: ${lastError}`);
}

/**
 * ⚡ Nivel 3: OpenRouter (qwen/qwen-2.5-72b-instruct)
 */
async function queryOpenRouter(request: AiCompletionRequest): Promise<{ content: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY no configurada');

  const model = 'qwen/qwen-2.5-72b-instruct';
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://costadeoro.app',
      'X-Title': 'Liga Deportiva Costa de Oro',
    },
    body: JSON.stringify({
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.4,
      max_tokens: request.maxTokens ?? 1024,
      response_format: request.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API Error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter retornó una respuesta vacía');

  return { content: text, model };
}

/**
 * ⚡ Nivel 4: Alibaba Cloud DashScope (qwen-plus)
 */
async function queryDashScope(request: AiCompletionRequest): Promise<{ content: string; model: string }> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('DASHSCOPE_API_KEY no configurada');

  const model = 'qwen-plus';
  const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.4,
      max_tokens: request.maxTokens ?? 1024,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`DashScope API Error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('DashScope retornó una respuesta vacía');

  return { content: text, model };
}

/**
 * 🛡️ Fallback Local Estructurado y Pedagógico (503 Elegante)
 */
function generateGracefulFallback(request: AiCompletionRequest): { content: string; model: string } {
  if (request.responseFormat === 'json_object') {
    return {
      model: 'curiol-human-values-v1',
      content: JSON.stringify({
        status: 'ok',
        badge: 'Compañerismo Ejemplar',
        humanValue: 'Respeto y Juego Limpio',
        summary: 'Jornada deportiva formativa celebrada en torno a los valores de hermandad estudiantil, superación y sana convivencia en Guanacaste.',
        highlight: 'Cada atleta representa el espíritu deportivo de su institución con disciplina y alegría.',
        isFallback: true,
      }),
    };
  }

  return {
    model: 'curiol-human-values-v1',
    content: 'Jornada deportiva formativa celebrada en torno a los valores de compañerismo, esfuerzo y respeto mutuo en la Liga Deportiva Costa de Oro 2026.',
  };
}

/**
 * 🚀 ORQUESTADOR EN CASCADA MULTI-PROVEEDOR (Failover Multicapa)
 */
export async function executeAiCascade(request: AiCompletionRequest): Promise<AiCompletionResponse> {
  const startTime = Date.now();
  const cacheKey = calculateHash(request.messages, request.responseFormat);

  // 1. Caché en Memoria
  const cached = MEMORY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      content: cached.response,
      provider: 'cache',
      model: cached.model,
      latencyMs: Date.now() - startTime,
      cached: true,
    };
  }

  // 2. Nivel 1: Google Gemini
  try {
    const result = await queryGemini(request);
    MEMORY_CACHE.set(cacheKey, {
      response: result.content,
      provider: 'gemini',
      model: result.model,
      timestamp: Date.now(),
    });
    return {
      content: result.content,
      provider: 'gemini',
      model: result.model,
      latencyMs: Date.now() - startTime,
      cached: false,
    };
  } catch (errGemini) {
    console.warn('[AI Cascade] Nivel 1 (Gemini) falló, pasando a Nivel 2 (Groq):', (errGemini as Error).message);
  }

  // 3. Nivel 2: Groq LPU
  try {
    const result = await queryGroq(request);
    MEMORY_CACHE.set(cacheKey, {
      response: result.content,
      provider: 'groq',
      model: result.model,
      timestamp: Date.now(),
    });
    return {
      content: result.content,
      provider: 'groq',
      model: result.model,
      latencyMs: Date.now() - startTime,
      cached: false,
    };
  } catch (errGroq) {
    console.warn('[AI Cascade] Nivel 2 (Groq) falló, pasando a Nivel 3 (OpenRouter):', (errGroq as Error).message);
  }

  // 4. Nivel 3: OpenRouter
  try {
    const result = await queryOpenRouter(request);
    MEMORY_CACHE.set(cacheKey, {
      response: result.content,
      provider: 'openrouter',
      model: result.model,
      timestamp: Date.now(),
    });
    return {
      content: result.content,
      provider: 'openrouter',
      model: result.model,
      latencyMs: Date.now() - startTime,
      cached: false,
    };
  } catch (errOpenRouter) {
    console.warn('[AI Cascade] Nivel 3 (OpenRouter) falló, pasando a Nivel 4 (DashScope):', (errOpenRouter as Error).message);
  }

  // 5. Nivel 4: Alibaba DashScope
  try {
    const result = await queryDashScope(request);
    MEMORY_CACHE.set(cacheKey, {
      response: result.content,
      provider: 'dashscope',
      model: result.model,
      timestamp: Date.now(),
    });
    return {
      content: result.content,
      provider: 'dashscope',
      model: result.model,
      latencyMs: Date.now() - startTime,
      cached: false,
    };
  } catch (errDashScope) {
    console.warn('[AI Cascade] Nivel 4 (DashScope) falló. Activando degradación elegante:', (errDashScope as Error).message);
  }

  // 6. Degradación Elegante
  const fallback = generateGracefulFallback(request);
  return {
    content: fallback.content,
    provider: 'fallback',
    model: fallback.model,
    latencyMs: Date.now() - startTime,
    cached: false,
  };
}
