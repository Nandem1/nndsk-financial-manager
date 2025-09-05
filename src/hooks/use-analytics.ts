import { useCallback, useEffect, useState } from 'react'
import { TransactionService } from '@/lib/services/transaction-service'

export interface ExpenseByCategory {
  categoryId: string
  name: string
  color: string | null
  total: number
}

interface UseExpensesByCategoryOptions {
  from?: string
  to?: string
}

export function useExpensesByCategory(options?: UseExpensesByCategoryOptions) {
  const [data, setData] = useState<ExpenseByCategory[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await TransactionService.getExpensesByCategory({
        from: options?.from,
        to: options?.to,
      })
      setData(result)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [options?.from, options?.to])

  useEffect(() => {
    void load()
  }, [load])

  const totalExpense = data.reduce((acc, cur) => acc + cur.total, 0)

  return { data, loading, error, reload: load, totalExpense }
}

export interface MonthlyTrendPoint {
  month: string // YYYY-MM
  income: number
  expenses: number
  balance: number
}

export function useMonthlyTrend(months: number = 6) {
  const [data, setData] = useState<MonthlyTrendPoint[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await TransactionService.getMonthlyTrend({ months })
      setData(result)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [months])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, reload: load }
}
