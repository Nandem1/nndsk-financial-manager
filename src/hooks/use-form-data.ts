'use client'

import { useState, useEffect, useCallback } from 'react'
import { Category, PaymentMethod } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'
import { useSeedData } from './use-seed-data'

/**
 * Hook personalizado para cargar datos necesarios para formularios
 * Elimina la duplicación de lógica de carga de categorías y métodos de pago
 * Maneja automáticamente la inicialización de datos por defecto
 */
export function useFormData() {
  const [categories, setCategories] = useState<Category[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { 
    isInitialized, 
    needsInitialization, 
    loading: seedLoading, 
    error: seedError,
    initializeDefaultData 
  } = useSeedData()

  const loadFormData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Si necesita inicialización, crear datos por defecto primero
      if (needsInitialization && !isInitialized) {
        await initializeDefaultData()
      }

      const [categoriesData, paymentMethodsData] = await Promise.all([
        TransactionService.getCategories(),
        TransactionService.getPaymentMethods()
      ])
      
      setCategories(categoriesData)
      setPaymentMethods(paymentMethodsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos del formulario'
      setError(errorMessage)
      console.error('Error loading form data:', err)
    } finally {
      setLoading(false)
    }
  }, [needsInitialization, isInitialized, initializeDefaultData])

  const refreshData = useCallback(() => {
    loadFormData()
  }, [loadFormData])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  return {
    categories,
    paymentMethods,
    loading: loading || seedLoading,
    error: error || seedError,
    refreshData,
    hasData: categories.length > 0 && paymentMethods.length > 0,
    isInitializing: needsInitialization && !isInitialized
  }
}
