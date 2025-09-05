'use client'

import { useState, useEffect, useCallback } from 'react'
import { PaymentMethod, CreateCreditCardDTO } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'
import { useAsyncOperation } from './use-async-operation'
import { useAuth } from './use-auth'

/**
 * Hook personalizado para gestionar tarjetas de crédito
 * Maneja el estado y operaciones CRUD de tarjetas de crédito
 */
export function useCreditCards() {
  const { user, isAuthenticated } = useAuth()
  const { loading, error, execute, clearError } = useAsyncOperation()
  const [creditCards, setCreditCards] = useState<PaymentMethod[]>([])

  const loadCreditCards = useCallback(async () => {
    // Solo cargar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      return []
    }
    
    return execute(async () => {
      const cards = await TransactionService.getCreditCards()
      setCreditCards(cards)
      return cards
    })
  }, [execute, isAuthenticated, user])

  const createCreditCard = useCallback(async (data: CreateCreditCardDTO) => {
    return execute(async () => {
      const newCard = await TransactionService.createCreditCard(data)
      setCreditCards(prev => [...prev, newCard])
      return newCard
    })
  }, [execute])

  const updateCreditCard = useCallback(async (id: string, data: Partial<CreateCreditCardDTO>) => {
    return execute(async () => {
      const updatedCard = await TransactionService.updateCreditCard(id, data)
      setCreditCards(prev => prev.map(card => 
        card.id === id ? updatedCard : card
      ))
      return updatedCard
    })
  }, [execute])

  const deleteCreditCard = useCallback(async (id: string) => {
    return execute(async () => {
      await TransactionService.deleteCreditCard(id)
      setCreditCards(prev => prev.filter(card => card.id !== id))
      return { success: true }
    })
  }, [execute])

  const refreshAvailableCredit = useCallback(async (cardId: string) => {
    return execute(async () => {
      const newCredit = await TransactionService.refreshAvailableCredit(cardId)
      setCreditCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, available_credit: newCredit } : card
      ))
      return newCredit
    })
  }, [execute])

  useEffect(() => {
    // Solo cargar tarjetas si el usuario está autenticado
    if (isAuthenticated && user) {
      loadCreditCards()
    } else {
      // Limpiar tarjetas si el usuario no está autenticado
      setCreditCards([])
    }
  }, [loadCreditCards, isAuthenticated, user])

  return {
    creditCards,
    loading,
    error,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    refreshAvailableCredit,
    refreshCreditCards: loadCreditCards,
    clearError
  }
}
