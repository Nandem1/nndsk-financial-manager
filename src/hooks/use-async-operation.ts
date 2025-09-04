'use client'

import { useState, useCallback } from 'react'

/**
 * Hook personalizado para manejar operaciones asíncronas
 * Elimina la duplicación de código en manejo de loading, error y success
 */
export function useAsyncOperation<T = unknown>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async <R = T>(
    operation: () => Promise<R>,
    options?: {
      onSuccess?: (result: R) => void
      onError?: (error: string) => void
      successMessage?: string
    }
  ): Promise<{ success: boolean; data?: R; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await operation()
      setData(result as T)
      options?.onSuccess?.(result)
      return { success: true, data: result }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    clearError,
    reset
  }
}
