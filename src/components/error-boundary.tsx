'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { ROUTES } from '@/lib/constants/app'
import { STYLES } from '@/lib/constants/styles'
import { ANIMATIONS, TRANSITIONS } from '@/lib/constants/animations'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Here you could send error to an error reporting service
    // Example: Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = () => {
    window.location.href = ROUTES.login
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <motion.div 
          className={`min-h-screen ${STYLES.background.dark} flex items-center justify-center p-4 ${STYLES.transition}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={TRANSITIONS.smooth}
        >
          <motion.div 
            className="max-w-md w-full text-center space-y-6"
            variants={ANIMATIONS.scaleIn}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={TRANSITIONS.elastic}
            >
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS.smooth, delay: 0.2 }}
            >
              <h1 className={`text-xl font-semibold ${STYLES.text.primary}`}>
                Algo salió mal
              </h1>
              <p className={STYLES.text.secondary}>
                Ha ocurrido un error inesperado. No te preocupes, no es tu culpa.
              </p>
            </motion.div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                  Detalles del error (solo desarrollo)
                </summary>
                <div className="text-xs text-red-700 space-y-1">
                  <p><strong>Error:</strong> {this.state.error.message}</p>
                  {this.state.errorInfo && (
                    <p><strong>Stack:</strong> {this.state.errorInfo.componentStack}</p>
                  )}
                </div>
              </details>
            )}

                        <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS.smooth, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Ir al login
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

// Hook para usar error boundaries en componentes funcionales
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${context || 'component'}:`, error)
    }
    
    // Here you could send error to an error reporting service
    // Example: Sentry.captureException(error, { tags: { context } })
  }

  return { handleError }
}

// Componente para mostrar errores específicos
interface ErrorDisplayProps {
  error: Error | string
  title?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorDisplay({ 
  error, 
  title = 'Ha ocurrido un error', 
  onRetry, 
  showRetry = true 
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className="text-center space-y-4 p-6">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{errorMessage}</p>
      </div>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}

// Componente para errores de red
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Error de conexión. Verifica tu conexión a internet e intenta de nuevo."
      title="Error de conexión"
      onRetry={onRetry}
      showRetry={true}
    />
  )
}

// Componente para errores de autenticación
export function AuthError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      title="Sesión expirada"
      onRetry={onRetry}
      showRetry={false}
    />
  )
}

// Componente para errores de permisos
export function PermissionError() {
  return (
    <ErrorDisplay
      error="No tienes permisos para acceder a esta página."
      title="Acceso denegado"
      showRetry={false}
    />
  )
}
