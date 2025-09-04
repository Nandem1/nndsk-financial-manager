import { useState, useCallback } from 'react'
import { CreateTransactionDTO } from '@/types'

export function useTransactions() {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la transacción'
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
    loading,
    error,
    createTransaction,
    clearError
  }
}
