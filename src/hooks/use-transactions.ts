import { useAsyncOperation } from './use-async-operation'
import { CreateTransactionDTO } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'
import { useCallback } from 'react'

export function useTransactions() {
  const { loading, error, execute, clearError } = useAsyncOperation()

  const createTransaction = useCallback(async (data: CreateTransactionDTO) => {
    return execute(async () => {
      const newTransaction = await TransactionService.createTransaction(data)
      return newTransaction
    })
  }, [execute])

  const updateTransaction = useCallback(async (id: string, data: Partial<CreateTransactionDTO>) => {
    return execute(async () => {
      const updatedTransaction = await TransactionService.updateTransaction(id, data)
      return updatedTransaction
    })
  }, [execute])

  const deleteTransaction = useCallback(async (id: string) => {
    return execute(async () => {
      await TransactionService.deleteTransaction(id)
      return { success: true }
    })
  }, [execute])

  const getTransactions = useCallback(async (limit?: number) => {
    return execute(async () => {
      const transactions = await TransactionService.getTransactions(limit)
      return transactions
    })
  }, [execute])

  const getTransactionsPaginated = useCallback(async (
    page: number,
    pageSize: number,
    filters?: { category_id?: string; search?: string }
  ) => {
    return execute(async () => {
      const result = await TransactionService.getTransactionsPaginated(page, pageSize, filters)
      return result
    })
  }, [execute])

  const getTransactionById = useCallback(async (id: string) => {
    return execute(async () => {
      const transaction = await TransactionService.getTransactionById(id)
      return transaction
    })
  }, [execute])

  return {
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions,
    getTransactionsPaginated,
    getTransactionById,
    clearError
  }
}
