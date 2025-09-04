'use client'

import { useState, useEffect, useCallback } from 'react'
import { TransactionService } from '@/lib/services/transaction-service'
import { DashboardStats, TransactionWithRelations } from '@/types'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    expenses: 0,
    income: 0,
    transactions: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Obtener estadísticas y transacciones recientes en paralelo
      const [dashboardStats, recent] = await Promise.all([
        TransactionService.getDashboardStats(),
        TransactionService.getRecentTransactions(4)
      ])

      setStats(dashboardStats)
      setRecentTransactions(recent)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos del dashboard'
      setError(errorMessage)
      console.error('Error en fetchDashboardData:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    recentTransactions,
    loading,
    error,
    refreshData
  }
}
