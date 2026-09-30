import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ModelPingResult {
  provider: string;
  model: string;
  status: 'ONLINE' | 'OFFLINE' | 'DECOMMISSIONED' | 'NO_API_KEY';
  latencyMs: number;
  error?: string;
}

export async function GET(request: NextRequest) {
  return handleAudit(request);
}

export async function POST(request: NextRequest) {
  return handleAudit(request);
}

async function handleAudit(request: NextRequest) {
  const startTime = Date.now();
  const testResults: ModelPingResult[] = [];

  // 1. Ping Google Gemini
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    testResults.push({
      provider: 'Google Gemini',
      model: 'gemini-3.7-flash',
      status: 'NO_API_KEY',
      latencyMs: 0,
      error: 'GEMINI_API_KEY no detectada en variables de entorno',
    });
  } else {
    const t0 = Date.now();
    const modelsToPing = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
    let pingSuccess = false;
    let finalModel = 'gemini-3.7-flash';
    let lastError = '';

    for (const model of modelsToPing) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Ping salud modelo' }] }],
            }),
            signal: AbortSignal.timeout(12000),
          }
        );
        if (res.ok) {
          testResults.push({
            provider: 'Google Gemini',
            model,
            status: 'ONLINE',
            latencyMs: Date.now() - t0,
          });
          pingSuccess = true;
          break;
        } else {
          lastError = `HTTP ${res.status}: ${await res.text()}`;
        }
      } catch (e) {
        lastError = (e as Error).message;
      }
    }

    if (!pingSuccess) {
      testResults.push({
        provider: 'Google Gemini',
        model: finalModel,
        status: 'OFFLINE',
        latencyMs: Date.now() - t0,
        error: lastError.slice(0, 120),
      });
    }
  }

  // 2. Ping Groq LPU
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    testResults.push({
      provider: 'Groq LPU',
      model: 'qwen/qwen3.8-27b',
      status: 'NO_API_KEY',
      latencyMs: 0,
      error: 'GROQ_API_KEY no detectada en variables de entorno',
    });
  } else {
    const t0 = Date.now();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        testResults.push({
          provider: 'Groq LPU',
          model: 'qwen/qwen3.8-27b',
          status: 'ONLINE',
          latencyMs: Date.now() - t0,
        });
      } else {
        const errorText = await res.text();
        const isDecommissioned = res.status === 404 || res.status === 410;
        testResults.push({
          provider: 'Groq LPU',
          model: 'qwen/qwen3.8-27b',
          status: isDecommissioned ? 'DECOMMISSIONED' : 'OFFLINE',
          latencyMs: Date.now() - t0,
          error: `HTTP ${res.status}: ${errorText.slice(0, 120)}`,
        });
      }
    } catch (e) {
      testResults.push({
        provider: 'Groq LPU',
        model: 'qwen/qwen3.8-27b',
        status: 'OFFLINE',
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      });
    }
  }

  // 3. Ping OpenRouter (Qwen)
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    testResults.push({
      provider: 'OpenRouter (Qwen)',
      model: 'qwen/qwen-2.5-72b-instruct',
      status: 'NO_API_KEY',
      latencyMs: 0,
      error: 'OPENROUTER_API_KEY no detectada en variables de entorno',
    });
  } else {
    const t0 = Date.now();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-72b-instruct',
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        testResults.push({
          provider: 'OpenRouter (Qwen)',
          model: 'qwen/qwen-2.5-72b-instruct',
          status: 'ONLINE',
          latencyMs: Date.now() - t0,
        });
      } else {
        const errorText = await res.text();
        testResults.push({
          provider: 'OpenRouter (Qwen)',
          model: 'qwen/qwen-2.5-72b-instruct',
          status: 'OFFLINE',
          latencyMs: Date.now() - t0,
          error: `HTTP ${res.status}: ${errorText.slice(0, 120)}`,
        });
      }
    } catch (e) {
      testResults.push({
        provider: 'OpenRouter (Qwen)',
        model: 'qwen/qwen-2.5-72b-instruct',
        status: 'OFFLINE',
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      });
    }
  }

  // 4. Ping Alibaba Cloud DashScope
  const dashScopeKey = process.env.DASHSCOPE_API_KEY;
  if (!dashScopeKey) {
    testResults.push({
      provider: 'Alibaba DashScope',
      model: 'qwen-plus',
      status: 'NO_API_KEY',
      latencyMs: 0,
      error: 'DASHSCOPE_API_KEY no detectada en variables de entorno',
    });
  } else {
    const t0 = Date.now();
    try {
      const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${dashScopeKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        testResults.push({
          provider: 'Alibaba DashScope',
          model: 'qwen-plus',
          status: 'ONLINE',
          latencyMs: Date.now() - t0,
        });
      } else {
        const errorText = await res.text();
        testResults.push({
          provider: 'Alibaba DashScope',
          model: 'qwen-plus',
          status: 'OFFLINE',
          latencyMs: Date.now() - t0,
          error: `HTTP ${res.status}: ${errorText.slice(0, 120)}`,
        });
      }
    } catch (e) {
      testResults.push({
        provider: 'Alibaba DashScope',
        model: 'qwen-plus',
        status: 'OFFLINE',
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      });
    }
  }

  const allOperational = testResults.every((r) => r.status === 'ONLINE');
  const nowCostaRica = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

  // 📧 Formateo de Reporte Ejecutivo para Correo Oficial
  const emailPayload = {
    recipients: [
      'info@curiol.studio',
      'alberto.bustos.ortega@mep.go.cr',
    ],
    subject: `🤖 [Auditoría IA 5:00 AM] Liga Deportiva Costa de Oro 2026 — Estado: ${allOperational ? '100% OPERACIONAL ✅' : 'ATENCIÓN REQUERIDA ⚠️'}`,
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">Reporte Diario de Salud de Modelos IA (5:00 AM)</h2>
        <p style="color: #64748b; font-size: 13px;">Liga Deportiva Costa de Oro 2026 · La Paz Community School · Guanacaste</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
        <p><strong>Fecha y Hora de Auditoría:</strong> ${nowCostaRica} (Hora de Costa Rica)</p>
        <p><strong>Estado General:</strong> <span style="color: ${allOperational ? '#16a34a' : '#d97706'}; font-weight: bold;">${allOperational ? 'Todos los proveedores en línea' : 'Algunos proveedores requieren verificación'}</span></p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 8px;">Proveedor</th>
              <th style="padding: 8px;">Modelo</th>
              <th style="padding: 8px;">Estado</th>
              <th style="padding: 8px;">Latencia</th>
            </tr>
          </thead>
          <tbody>
            ${testResults.map((r) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">${r.provider}</td>
                <td style="padding: 8px; font-family: monospace;">${r.model}</td>
                <td style="padding: 8px; color: ${r.status === 'ONLINE' ? '#16a34a' : '#dc2626'}; font-weight: bold;">${r.status}</td>
                <td style="padding: 8px;">${r.latencyMs} ms</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 12px; background-color: #f1f5f9; border-radius: 8px; font-size: 11px; color: #475569;">
          <strong>Nota de Arquitectura:</strong> Si algún proveedor experimenta caídas, el motor conmuta automáticamente en cascada (SHA-256 Cache ➔ Gemini ➔ Groq ➔ OpenRouter ➔ DashScope ➔ Fallback 503 Formativo).
        </div>
      </div>
    `,
  };

  // 📱 Formateo de Payload para WhatsApp
  const whatsappPayload = {
    targetPhone: '+506 6060-2617',
    message: `🤖 *AUDITORÍA DIARIA DE MODELOS IA (5:00 AM)*
🏆 *Liga Deportiva Costa de Oro 2026*
📅 ${nowCostaRica}

${testResults.map((r) => `${r.status === 'ONLINE' ? '✅' : '⚠️'} *${r.provider}* (${r.model}): ${r.status} [${r.latencyMs}ms]`).join('\n')}

🛡️ *Resiliencia:* Cascada activa de 4 niveles con respaldo local SHA-256.
✉️ *Copia enviada a:* info@curiol.studio y alberto.bustos.ortega@mep.go.cr`,
  };

  return NextResponse.json({
    success: true,
    timestamp: nowCostaRica,
    executionTimeMs: Date.now() - startTime,
    auditResults: testResults,
    emailReport: emailPayload,
    whatsappReport: whatsappPayload,
  });
}
