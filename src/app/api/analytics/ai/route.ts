import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AI_ANALYSIS_CACHE_TTL_MS } from '@/lib/constants/config'

interface MonthlyTrendPoint {
  month: string
  income: number
  expenses: number
  balance: number
}

interface ExpenseByCategory {
  name: string
  total: number
}

interface AiPayload {
  monthlyTrend: MonthlyTrendPoint[]
  expensesByCategory: ExpenseByCategory[]
  totals: { totalExpense: number }
  locale?: string
}

interface AiResponseBody {
  success: boolean
  analysis?: string
  error?: string
}

export async function POST(req: NextRequest): Promise<NextResponse<AiResponseBody>> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing GEMINI_API_KEY' }, { status: 500 })
    }

    const body = (await req.json()) as AiPayload
    if (!body || !Array.isArray(body.monthlyTrend) || !Array.isArray(body.expensesByCategory)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const { monthlyTrend, expensesByCategory, totals, locale } = body

    // Authenticate user (server-side) to scope cache per user
    const supabase = await createServerSupabaseClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authData.user.id

    // Build a stable hash for the payload to key the cache
    const payloadForHash = JSON.stringify({ monthlyTrend, expensesByCategory, totals, locale: locale ?? 'es-AR' })
    const hashString = (s: string): string => {
      let h = 5381
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) ^ s.charCodeAt(i)
      }
      return (h >>> 0).toString(36)
    }
    const payloadHash = hashString(payloadForHash)

    // Try cache first
    type CacheRow = { user_id: string; payload_hash: string; analysis: string; last_generated_at: string }
    const { data: cachedRows, error: cacheErr } = await supabase
      .from('ai_analysis_cache')
      .select('user_id, payload_hash, analysis, last_generated_at')
      .eq('user_id', userId)
      .eq('payload_hash', payloadHash)
      .limit(1)

    if (!cacheErr && cachedRows && cachedRows.length > 0) {
      const row = cachedRows[0] as CacheRow
      const lastGenMs = new Date(row.last_generated_at).getTime()
      if (Date.now() - lastGenMs < AI_ANALYSIS_CACHE_TTL_MS) {
        return NextResponse.json({ success: true, analysis: row.analysis })
      }
    }

    const prompt = [
      'Eres un analista financiero personal. A partir de los siguientes datos del usuario, genera un análisis claro y accionable en español.',
      '',
      'Requisitos:',
      '- Comienza con un resumen ejecutivo de 2-3 frases.',
      '- Analiza la tendencia mensual (ingresos, gastos, balance). Indica meses atípicos, dirección (mejora/empeora) y estabilidad.',
      '- Destaca las 3 categorías con mayor gasto y comenta posibles optimizaciones.',
      '- Da 3-5 recomendaciones prácticas y priorizadas (breves, concretas).',
      '- Si faltan datos, indícalo y sugiere el siguiente paso para mejorar el análisis.',
      '',
      'Datos (JSON):',
      `- monthlyTrend: ${JSON.stringify(monthlyTrend)}`,
      `- expensesByCategory: ${JSON.stringify(expensesByCategory)}`,
      `- totals: ${JSON.stringify(totals)}`,
      `- locale: ${locale ?? 'es-AR'}`,
      '',
      'Responde en Markdown simple con títulos y viñetas. No incluyas código ni JSON en la respuesta.'
    ].join('\n')

    // Gemini REST API call (no client dependency)
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    const res = await fetch(`${url}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      return NextResponse.json({ success: false, error: `Gemini error: ${errText}` }, { status: 500 })
    }

    type GeminiPart = { text?: string }
    type GeminiContent = { parts?: GeminiPart[] }
    type GeminiCandidate = { content?: GeminiContent }
    type GeminiResponse = { candidates?: GeminiCandidate[] }

    const isGeminiResponse = (v: unknown): v is GeminiResponse => {
      if (!v || typeof v !== 'object') return false
      const obj = v as Record<string, unknown>
      if (!Array.isArray(obj.candidates)) return false
      // Shallow checks to avoid any
      return true
    }

    const json: unknown = await res.json()
    if (!isGeminiResponse(json)) {
      return NextResponse.json({ success: false, error: 'Unexpected response format from Gemini' }, { status: 500 })
    }

    const analysis = json.candidates?.[0]?.content?.parts?.[0]?.text

    if (!analysis) {
      return NextResponse.json({ success: false, error: 'No analysis returned by Gemini' }, { status: 500 })
    }

    // Upsert into cache
    const { error: upsertErr } = await supabase
      .from('ai_analysis_cache')
      .upsert({ user_id: userId, payload_hash: payloadHash, analysis, last_generated_at: new Date().toISOString() }, { onConflict: 'user_id,payload_hash' })

    if (upsertErr) {
      // Non-blocking
      console.error('[AI Cache] upsert error:', upsertErr.message)
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
