'use client'

import { useState, useEffect, useCallback } from 'react'
import { SeedService } from '@/lib/services/seed-service'
import { useAsyncOperation } from './use-async-operation'

/**
 * Hook para manejar la inicialización de datos por defecto
 * Se ejecuta automáticamente cuando un usuario necesita datos iniciales
 */
export function useSeedData() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [needsInitialization, setNeedsInitialization] = useState(false)
  const { loading, error, execute, clearError } = useAsyncOperation()

  const checkInitializationStatus = useCallback(async () => {
    try {
      const needsData = await SeedService.needsDefaultData()
      setNeedsInitialization(needsData)
      setIsInitialized(!needsData)
    } catch (err) {
      console.error('Error checking initialization status:', err)
      setNeedsInitialization(false)
      setIsInitialized(true) // Asumir que está inicializado para evitar loops
    }
  }, [])

  const initializeDefaultData = useCallback(async () => {
    if (!needsInitialization) return

    const result = await execute(async () => {
      const data = await SeedService.createDefaultData()
      setIsInitialized(true)
      setNeedsInitialization(false)
      return data
    })

    return result
  }, [needsInitialization, execute])

  const forceInitialization = useCallback(async () => {
    const result = await execute(async () => {
      const data = await SeedService.createDefaultData()
      setIsInitialized(true)
      setNeedsInitialization(false)
      return data
    })

    return result
  }, [execute])

  useEffect(() => {
    checkInitializationStatus()
  }, [checkInitializationStatus])

  return {
    isInitialized,
    needsInitialization,
    loading,
    error,
    initializeDefaultData,
    forceInitialization,
    checkInitializationStatus,
    clearError
  }
}
