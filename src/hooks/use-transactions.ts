import { useAsyncOperation } from './use-async-operation'
import { CreateTransactionDTO, TransactionWithRelations } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'

export function useTransactions() {
  const { loading, error, execute, clearError } = useAsyncOperation()

  const createTransaction = async (data: CreateTransactionDTO) => {
    return execute(async () => {
      // Implementar creación real en Supabase
      const newTransaction = await TransactionService.createTransaction(data)
      return newTransaction
    })
  }

  const updateTransaction = async (id: string, data: Partial<CreateTransactionDTO>) => {
    return execute(async () => {
      const updatedTransaction = await TransactionService.updateTransaction(id, data)
      return updatedTransaction
    })
  }

  const deleteTransaction = async (id: string) => {
    return execute(async () => {
      await TransactionService.deleteTransaction(id)
      return { success: true }
    })
  }

  const getTransactions = async (limit?: number) => {
    return execute(async () => {
      const transactions = await TransactionService.getTransactions(limit)
      return transactions
    })
  }

  const getTransactionById = async (id: string) => {
    return execute(async () => {
      const transaction = await TransactionService.getTransactionById(id)
      return transaction
    })
  }

  return {
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions,
    getTransactionById,
    clearError
  }
}
