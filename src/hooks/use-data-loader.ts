'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAsyncOperation } from './use-async-operation'

/**
 * Hook personalizado para cargar datos de múltiples fuentes
 * Elimina la duplicación de código en carga de datos
 */
export function useDataLoader<T extends Record<string, unknown>>(
  loaders: { [K in keyof T]: () => Promise<T[K]> }
) {
  const [data, setData] = useState<Partial<T>>({})
  const [loadingStates, setLoadingStates] = useState<Partial<Record<keyof T, boolean>>>({})
  
  const { loading: globalLoading, error, clearError } = useAsyncOperation()

  // Usar useRef para mantener una referencia estable a los loaders
  const loadersRef = useRef(loaders)
  loadersRef.current = loaders

  const loadData = useCallback(async () => {
    const loaderEntries = Object.entries(loadersRef.current) as [keyof T, () => Promise<T[keyof T]>][]
    
    // Inicializar estados de loading
    const initialLoadingStates = loaderEntries.reduce((acc, [key]) => {
      acc[key] = true
      return acc
    }, {} as Partial<Record<keyof T, boolean>>)
    setLoadingStates(initialLoadingStates)

    try {
      // Cargar todos los datos en paralelo
      const results = await Promise.allSettled(
        loaderEntries.map(([, loader]) => loader())
      )

      // Procesar resultados
      const newData = {} as Partial<T>
      const newLoadingStates = {} as Partial<Record<keyof T, boolean>>

      loaderEntries.forEach(([key], index) => {
        const result = results[index]
        newLoadingStates[key] = false

        if (result.status === 'fulfilled') {
          newData[key] = result.value
        } else {
          console.error(`Error loading ${String(key)}:`, result.reason)
        }
      })

      setData(newData)
      setLoadingStates(newLoadingStates)
    } catch (error) {
      console.error('Error in useDataLoader:', error)
      // Reset loading states on error
      setLoadingStates({})
    }
  }, [])

  const refreshData = useCallback(() => {
    loadData()
  }, [loadData])

  const isDataLoaded = useCallback((key: keyof T) => {
    return key in data && !loadingStates[key]
  }, [data, loadingStates])

  const isLoading = useCallback((key: keyof T) => {
    return loadingStates[key] === true
  }, [loadingStates])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loadingStates,
    globalLoading,
    error,
    refreshData,
    isDataLoaded,
    isLoading,
    clearError
  }
}
