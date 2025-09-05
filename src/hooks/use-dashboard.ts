'use client'

import { useDataLoader } from './use-data-loader'
import { TransactionService } from '@/lib/services/transaction-service'
import { useEffect } from 'react'

export function useDashboard() {
  const {
    data,
    globalLoading,
    error,
    refreshData,
    isDataLoaded
  } = useDataLoader({
    stats: () => TransactionService.getDashboardStats(),
    recentTransactions: () => TransactionService.getRecentTransactions(3)
  })

  // Escucha global para refrescar dashboard al crear/editar/eliminar transacciones
  useEffect(() => {
    const handler = () => { refreshData() }
    if (typeof window !== 'undefined') {
      window.addEventListener('dashboard:refresh', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('dashboard:refresh', handler)
      }
    }
  }, [refreshData])

  return {
    stats: data.stats || { balance: 0, expenses: 0, income: 0, transactions: 0 },
    recentTransactions: data.recentTransactions || [],
    loading: globalLoading || !isDataLoaded('stats') || !isDataLoaded('recentTransactions'),
    error,
    refreshData
  }
}
