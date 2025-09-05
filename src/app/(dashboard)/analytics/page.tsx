'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'
import { useExpensesByCategory, useMonthlyTrend, type ExpenseByCategory, type MonthlyTrendPoint } from '@/hooks/use-analytics'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/utils/format'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AI_ANALYSIS_CACHE_TTL_MS } from '@/lib/constants/config'

export default function AnalyticsPage() {
  const { user, isLoading, isUnauthenticated } = useAuth()
  const {
    data: categoryData,
    loading: categoriesLoading,
    error: categoriesError,
    totalExpense,
  } = useExpensesByCategory()
  const {
    data: trendData,
    loading: trendLoading,
    error: trendError,
  } = useMonthlyTrend(6)

  if (isLoading) {
    return <Loading message="Verificando autenticación..." />
  }

// (Renderer moved inside AiInsightsCard)

function MonthlyTrendChart({ data, error }: { data: MonthlyTrendPoint[]; error: string | null }) {
  if (error) {
    return (
      <div className={`p-4 rounded-md border ${STYLES.border.primary} ${STYLES.background.secondary}`}>
        <p className={STYLES.text.error}>Error: {error}</p>
      </div>
    )
  }

  const hasValues = data.some(p => (p.income > 0) || (p.expenses > 0))

  if (!data.length || !hasValues) {
    return (
      <div className={`text-center py-8 ${STYLES.text.secondary}`}>
        No hay gastos registrados para calcular la tendencia.
      </div>
    )
  }

  const tickFormatter = (value: string) => value
  const currencyTick = (value: number) => formatCurrency(value)
  const tooltipFormatter = (value: number, name: string): [string, string] => [formatCurrency(value), name]

  return (
    <div className="w-full px-1 sm:px-2" style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="month" tickFormatter={tickFormatter} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={currencyTick} tick={{ fontSize: 12 }} width={72} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Line type="monotone" dataKey="income" name="Ingresos" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="balance" name="Balance" stroke="#6366F1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

  if (isUnauthenticated) {
    return <AuthError />
  }

  // Esperar a que ambas fuentes de datos estén listas para una UX consistente
  if (categoriesLoading || trendLoading) {
    return (
      <motion.div 
        className={UTILITY_CLASSES.spacing.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="py-6">
          <Loading message="Cargando análisis..." />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={UTILITY_CLASSES.spacing.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className={`text-2xl font-bold ${STYLES.text.primary}`}>
          Análisis
        </h1>
        <p className={`${STYLES.text.secondary}`}>
          Visualiza tus patrones de gasto
        </p>
        {user && (
          <p className={`text-sm ${STYLES.text.tertiary} mt-1`}>
            Usuario: {user.email}
          </p>
        )}
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
            <CardHeader>
              <CardTitle className={STYLES.text.primary}>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <ExpensesByCategoryChart data={categoryData} total={totalExpense} error={categoriesError} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
            <CardHeader>
              <CardTitle className={STYLES.text.primary}>
                Tendencia Mensual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <MonthlyTrendChart data={trendData} error={trendError} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* AI Insights */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={STYLES.text.primary}>Análisis con IA</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <AiInsightsCard 
              monthlyTrend={trendData} 
              expensesByCategory={categoryData} 
              totalExpense={totalExpense}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ExpensesByCategoryChart({ data, total, error }: { data: ExpenseByCategory[]; total: number; error: string | null }) {
  if (error) {
    return (
      <div className={`p-4 rounded-md border ${STYLES.border.primary} ${STYLES.background.secondary}`}>
        <p className={STYLES.text.error}>Error: {error}</p>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className={`text-center py-8 ${STYLES.text.secondary}`}>
        No hay gastos registrados en el período seleccionado.
      </div>
    )
  }

  const palette = [
    '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#14B8A6', '#F97316', '#84CC16', '#E11D48'
  ]

  const tooltipFormatter = (value: number, name: string): [string, string] => [
    formatCurrency(value),
    name,
  ]

  return (
    <div className="w-full px-1 sm:px-2" style={{ height: 320 }}>
      <div className={`mb-2 text-sm ${STYLES.text.secondary}`}>
        Total del período: <span className={`${STYLES.text.primary} font-medium`}>{formatCurrency(total)}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, bottom: 24, left: 8 }}>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function AiInsightsCard({
  monthlyTrend,
  expensesByCategory,
  totalExpense,
}: {
  monthlyTrend: MonthlyTrendPoint[]
  expensesByCategory: ExpenseByCategory[]
  totalExpense: number
}) {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Simple deterministic hash to key the cache by input payload
  const hashString = (s: string): string => {
    let h = 5381
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) + h) ^ s.charCodeAt(i)
    }
    return (h >>> 0).toString(36)
  }

  // Simple, dependency-free Markdown renderer with typing effect scoped to this card
  function MarkdownTypingRenderer({ markdown }: { markdown: string }) {
    const [index, setIndex] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)
    const [blink, setBlink] = useState<boolean>(true)
    const endRef = useRef<HTMLDivElement | null>(null)

    // Typing effect
    useEffect(() => {
      if (done) return
      const speedMs = 14 // typing speed per char
      const total = markdown.length
      const id = setInterval(() => {
        setIndex((i) => {
          const next = i + 1
          if (next >= total) {
            clearInterval(id)
            setDone(true)
          }
          return next
        })
      }, speedMs)
      return () => clearInterval(id)
    }, [markdown, done])

    // Caret blink
    useEffect(() => {
      if (done) return
      const id = setInterval(() => setBlink((b) => !b), 500)
      return () => clearInterval(id)
    }, [done])

    // Auto-scroll as it types
    useEffect(() => {
      if (!done && endRef.current) {
        endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }, [index, done])

    // Convert markdown to a clean text for typing overlay (strip # and **)
    const plainForTyping = useMemo(() => {
      return markdown
        .replace(/^###\s+/gm, '')
        .replace(/^##\s+/gm, '')
        .replace(/^#\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
    }, [markdown])

    // Minimal inline renderer for bold
    const renderInline = (text: string): ReactNode[] => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g)
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })
    }

    // Block-level markdown parsing (headings, lists, paragraphs)
    const rendered = useMemo(() => {
      const lines = markdown.split(/\r?\n/)
      const elements: ReactNode[] = []
      let i = 0
      while (i < lines.length) {
        const line = lines[i]
        // Headings
        const h3 = line.match(/^###\s+(.*)$/)
        if (h3) {
          elements.push(
            <h3 key={`h3-${i}`} className={`mt-4 mb-2 text-lg font-semibold ${STYLES.text.primary}`}>
              {renderInline(h3[1])}
            </h3>
          )
          i++
          continue
        }
        const h2 = line.match(/^##\s+(.*)$/)
        if (h2) {
          elements.push(
            <h2 key={`h2-${i}`} className={`mt-5 mb-3 text-xl sm:text-2xl font-bold ${STYLES.text.primary}`}>
              {renderInline(h2[1])}
            </h2>
          )
          i++
          continue
        }
        const h1 = line.match(/^#\s+(.*)$/)
        if (h1) {
          elements.push(
            <h1 key={`h1-${i}`} className={`mt-6 mb-3 text-2xl sm:text-3xl font-extrabold ${STYLES.text.primary}`}>
              {renderInline(h1[1])}
            </h1>
          )
          i++
          continue
        }

        // Unordered list
        if (/^\s*[-*]\s+/.test(line)) {
          const items: string[] = []
          while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
            i++
          }
          elements.push(
            <ul key={`ul-${i}`} className="list-disc ms-5 my-2 space-y-1">
              {items.map((it, idx) => (
                <li key={idx} className={STYLES.text.primary}>
                  {renderInline(it)}
                </li>
              ))}
            </ul>
          )
          continue
        }

        // Ordered list
        if (/^\s*\d+\.\s+/.test(line)) {
          const items: string[] = []
          while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
            i++
          }
          elements.push(
            <ol key={`ol-${i}`} className="list-decimal ms-5 my-2 space-y-1">
              {items.map((it, idx) => (
                <li key={idx} className={STYLES.text.primary}>
                  {renderInline(it)}
                </li>
              ))}
            </ol>
          )
          continue
        }

        // Empty line -> spacing
        if (!line.trim()) {
          elements.push(<div key={`sp-${i}`} className="h-2" />)
          i++
          continue
        }

        // Paragraph
        elements.push(
          <p key={`p-${i}`} className={`my-2 leading-relaxed ${STYLES.text.primary}`}>
            {renderInline(line)}
          </p>
        )
        i++
      }
      return elements
    }, [markdown])

    return (
      <div>
        {/* Typing overlay with consistent typography (no monospace) */}
        {!done && (
          <div className={`text-sm sm:text-base leading-relaxed ${STYLES.text.primary}`} style={{ whiteSpace: 'pre-wrap' }}>
            {plainForTyping.slice(0, Math.min(index, plainForTyping.length))}
            <span className={`${blink ? 'opacity-100' : 'opacity-0'}`}>|</span>
          </div>
        )}

        {/* Final formatted content */}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
              {rendered}
            </div>
          </motion.div>
        )}

        {/* Anchor for auto-scroll */}
        <div ref={endRef} />
      </div>
    )
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError(null)
      setAnalysis('')

      // Build a stable cache key from the inputs
      const payload = {
        monthlyTrend,
        expensesByCategory,
        totals: { totalExpense },
        locale: navigator?.language ?? 'es-AR',
      }
      const cacheKey = `ai-analysis:${hashString(JSON.stringify(payload))}`

      // Try read from cache
      try {
        const cachedRaw = localStorage.getItem(cacheKey)
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { analysis: string; ts: number }
          if (Date.now() - cached.ts < AI_ANALYSIS_CACHE_TTL_MS && cached.analysis) {
            setAnalysis(cached.analysis)
            setLoading(false)
            return
          }
        }
      } catch {
        // ignore cache errors
      }

      const res = await fetch('/api/analytics/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as { success: boolean; analysis?: string; error?: string }
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error generando análisis')
      }

      setAnalysis(data.analysis || '')
      // Save to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ analysis: data.analysis || '', ts: Date.now() }))
      } catch {
        // ignore cache write errors
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className={`${STYLES.text.secondary} text-sm`}>
          Genera un resumen y recomendaciones basadas en tus gastos y tendencias.
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-3 py-2 rounded-md border ${STYLES.border.primary} ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'} ${STYLES.background.secondary} ${STYLES.text.primary}`}
        >
          {loading ? 'Analizando…' : 'Generar análisis'}
        </button>
      </div>

      {error && (
        <div className={`p-3 rounded-md border ${STYLES.border.primary} ${STYLES.background.secondary} mb-3`}>
          <p className={STYLES.text.error}>Error: {error}</p>
        </div>
      )}

      {analysis ? (
        <MarkdownTypingRenderer markdown={analysis} />
      ) : (
        !loading && (
          <div className={`text-sm ${STYLES.text.tertiary}`}>
            Aún no hay análisis generado. Presiona &quot;Generar análisis&quot; para obtener insights.
          </div>
        )
      )}
    </div>
  )
}
