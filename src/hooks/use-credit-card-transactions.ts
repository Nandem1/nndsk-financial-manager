'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  CreateCreditCardTransactionDTO, 
  UpcomingPayment 
} from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'
import { useAsyncOperation } from './use-async-operation'
import { useAuth } from './use-auth'

/**
 * Hook personalizado para gestionar transacciones de tarjetas de crédito
 * Maneja el estado y operaciones de cuotas y pagos
 */
export function useCreditCardTransactions() {
  const { user, isAuthenticated } = useAuth()
  const { loading, error, execute, clearError } = useAsyncOperation()
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([])

  const createCreditCardTransaction = useCallback(async (data: CreateCreditCardTransactionDTO) => {
    return execute(async () => {
      const result = await TransactionService.createCreditCardTransaction(data)
      return result
    })
  }, [execute])

  const getUpcomingPayments = useCallback(async (limit: number = 5) => {
    // Solo cargar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      return []
    }
    
    return execute(async () => {
      const payments = await TransactionService.getUpcomingPayments(limit)
      setUpcomingPayments(payments)
      return payments
    })
  }, [execute, isAuthenticated, user])

  const getAvailableCredit = useCallback(async (cardId: string) => {
    return execute(async () => {
      const credit = await TransactionService.getAvailableCredit(cardId)
      return credit
    })
  }, [execute])

  const refreshAvailableCredit = useCallback(async (cardId: string) => {
    return execute(async () => {
      const credit = await TransactionService.refreshAvailableCredit(cardId)
      return credit
    })
  }, [execute])

  useEffect(() => {
    // Solo cargar pagos próximos si el usuario está autenticado
    if (isAuthenticated && user) {
      getUpcomingPayments()
    } else {
      // Limpiar pagos próximos si el usuario no está autenticado
      setUpcomingPayments([])
    }
  }, [getUpcomingPayments, isAuthenticated, user])

  return {
    upcomingPayments,
    loading,
    error,
    createCreditCardTransaction,
    getUpcomingPayments,
    getAvailableCredit,
    refreshAvailableCredit,
    clearError
  }
}
