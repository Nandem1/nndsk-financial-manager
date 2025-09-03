import { useState, useCallback } from 'react'
import { CreateTransactionDTO, Transaction } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTransaction = useCallback(async (data: CreateTransactionDTO) => {
    setLoading(true)
    setError(null)
    
    try {
      // Por ahora solo logueamos, después se implementará la creación real
      console.log('Creando transacción:', data)
      
      // TODO: Implementar creación real en Supabase
      // const newTransaction = await TransactionService.createTransaction(data)
      // setTransactions(prev => [newTransaction, ...prev])
      
      return { success: true }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la transacción'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    transactions,
    loading,
    error,
    createTransaction,
    clearError
  }
}
