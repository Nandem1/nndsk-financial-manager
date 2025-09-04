'use client'

import { useDataLoader } from './use-data-loader'
import { TransactionService } from '@/lib/services/transaction-service'

export function useDashboard() {
  const {
    data,
    globalLoading,
    error,
    refreshData,
    isDataLoaded
  } = useDataLoader({
    stats: () => TransactionService.getDashboardStats(),
    recentTransactions: () => TransactionService.getRecentTransactions(4)
  })

  return {
    stats: data.stats || { balance: 0, expenses: 0, income: 0, transactions: 0 },
    recentTransactions: data.recentTransactions || [],
    loading: globalLoading || !isDataLoaded('stats') || !isDataLoaded('recentTransactions'),
    error,
    refreshData
  }
}
