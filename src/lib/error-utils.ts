// 🚨 UTILIDADES PARA MANEJO DE ERRORES
// Manejo centralizado y consistente de errores en la aplicación

// Tipos de errores comunes
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NETWORK = 'NETWORK',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// Interfaz para errores de la aplicación
export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: unknown
  originalError?: Error
}

// Función para crear errores de la aplicación
export function createAppError(
  type: ErrorType,
  message?: string,
  originalError?: Error,
  details?: unknown
): AppError {
  return {
    type,
    message: message || getDefaultErrorMessage(type),
    originalError,
    details,
  }
}

// Función para obtener mensajes de error por defecto
export function getDefaultErrorMessage(type: ErrorType): string {
  switch (type) {
    case ErrorType.VALIDATION:
      return 'Los datos proporcionados no son válidos'
    case ErrorType.AUTHENTICATION:
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
    case ErrorType.AUTHORIZATION:
      return 'No tienes permisos para realizar esta acción'
    case ErrorType.NETWORK:
      return 'Error de conexión. Verifica tu internet e inténtalo de nuevo'
    case ErrorType.NOT_FOUND:
      return 'El recurso solicitado no fue encontrado'
    case ErrorType.SERVER:
      return 'Error del servidor. Inténtalo más tarde'
    case ErrorType.UNKNOWN:
    default:
      return 'Ha ocurrido un error inesperado'
  }
}

// Función para convertir errores de Supabase a errores de la aplicación
export function handleSupabaseError(error: unknown): AppError {
  // Verificar si el error tiene la estructura esperada
  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code: string; message?: string }
    
    switch (errorWithCode.code) {
      case 'PGRST116':
        return createAppError(ErrorType.NOT_FOUND, 'Recurso no encontrado', error instanceof Error ? error : undefined)
      case '42501':
        return createAppError(ErrorType.AUTHORIZATION, 'No tienes permisos para esta acción', error instanceof Error ? error : undefined)
      case '23505':
        return createAppError(ErrorType.VALIDATION, 'El recurso ya existe', error instanceof Error ? error : undefined)
      case '23503':
        return createAppError(ErrorType.VALIDATION, 'Referencia inválida', error instanceof Error ? error : undefined)
      case '23514':
        return createAppError(ErrorType.VALIDATION, 'Datos inválidos', error instanceof Error ? error : undefined)
      case '42P01':
        return createAppError(ErrorType.SERVER, 'Tabla no encontrada', error instanceof Error ? error : undefined)
      case '42P02':
        return createAppError(ErrorType.SERVER, 'Columna no encontrada', error instanceof Error ? error : undefined)
      default:
        return createAppError(ErrorType.UNKNOWN, errorWithCode.message || 'Error desconocido', error instanceof Error ? error : undefined)
    }
  }

  // Verificar si el error tiene mensaje
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string }
    
    if (errorWithMessage.message.includes('network') || errorWithMessage.message.includes('fetch')) {
      return createAppError(ErrorType.NETWORK, 'Error de conexión', error instanceof Error ? error : undefined)
    }
    if (errorWithMessage.message.includes('unauthorized') || errorWithMessage.message.includes('401')) {
      return createAppError(ErrorType.AUTHENTICATION, 'No autorizado', error instanceof Error ? error : undefined)
    }
    if (errorWithMessage.message.includes('forbidden') || errorWithMessage.message.includes('403')) {
      return createAppError(ErrorType.AUTHORIZATION, 'Acceso denegado', error instanceof Error ? error : undefined)
    }
    if (errorWithMessage.message.includes('not found') || errorWithMessage.message.includes('404')) {
      return createAppError(ErrorType.NOT_FOUND, 'No encontrado', error instanceof Error ? error : undefined)
    }
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    return createAppError(ErrorType.UNKNOWN, error.message, error)
  }

  return createAppError(ErrorType.UNKNOWN, 'Error desconocido', error instanceof Error ? error : undefined)
}

// Función para validar si un error es recuperable
export function isRecoverableError(error: AppError): boolean {
  return [
    ErrorType.VALIDATION,
    ErrorType.NETWORK,
    ErrorType.NOT_FOUND,
  ].includes(error.type)
}

// Función para obtener el título del error
export function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.VALIDATION:
      return 'Error de validación'
    case ErrorType.AUTHENTICATION:
      return 'Sesión expirada'
    case ErrorType.AUTHORIZATION:
      return 'Acceso denegado'
    case ErrorType.NETWORK:
      return 'Error de conexión'
    case ErrorType.NOT_FOUND:
      return 'No encontrado'
    case ErrorType.SERVER:
      return 'Error del servidor'
    case ErrorType.UNKNOWN:
    default:
      return 'Error inesperado'
  }
}

// Función para formatear errores para logging
export function formatErrorForLogging(error: AppError): string {
  return `[${error.type}] ${error.message}${error.code ? ` (Code: ${error.code})` : ''}${error.details ? ` - Details: ${JSON.stringify(error.details)}` : ''}`
}

// Función para manejar errores de validación de formularios
export function handleFormValidationError(fieldErrors: Record<string, string[]>): AppError {
  const firstError = Object.values(fieldErrors)[0]?.[0]
  return createAppError(
    ErrorType.VALIDATION,
    firstError || 'Error de validación en el formulario',
    undefined,
    fieldErrors
  )
}

