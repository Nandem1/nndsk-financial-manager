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

// Mapeo de códigos de error de Supabase a tipos de error
const SUPABASE_ERROR_MAP: Record<string, { type: ErrorType; message: string }> = {
  'PGRST116': { type: ErrorType.NOT_FOUND, message: 'Recurso no encontrado' },
  '42501': { type: ErrorType.AUTHORIZATION, message: 'No tienes permisos para esta acción' },
  '23505': { type: ErrorType.VALIDATION, message: 'El recurso ya existe' },
  '23503': { type: ErrorType.VALIDATION, message: 'Referencia inválida' },
  '23514': { type: ErrorType.VALIDATION, message: 'Datos inválidos' },
  '42P01': { type: ErrorType.SERVER, message: 'Tabla no encontrada' },
  '42P02': { type: ErrorType.SERVER, message: 'Columna no encontrada' },
}

// Mapeo de patrones de mensaje a tipos de error
const MESSAGE_PATTERN_MAP: Array<{ pattern: RegExp; type: ErrorType; message: string }> = [
  { pattern: /network|fetch/i, type: ErrorType.NETWORK, message: 'Error de conexión' },
  { pattern: /unauthorized|401/i, type: ErrorType.AUTHENTICATION, message: 'No autorizado' },
  { pattern: /forbidden|403/i, type: ErrorType.AUTHORIZATION, message: 'Acceso denegado' },
  { pattern: /not found|404/i, type: ErrorType.NOT_FOUND, message: 'No encontrado' },
]

// Función para convertir errores de Supabase a errores de la aplicación
export function handleSupabaseError(error: unknown): AppError {
  const originalError = error instanceof Error ? error : undefined

  // Verificar si el error tiene código
  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code: string; message?: string }
    const errorConfig = SUPABASE_ERROR_MAP[errorWithCode.code]
    
    if (errorConfig) {
      return createAppError(errorConfig.type, errorConfig.message, originalError)
    }
  }

  // Verificar si el error tiene mensaje
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string }
    
    for (const { pattern, type, message } of MESSAGE_PATTERN_MAP) {
      if (pattern.test(errorWithMessage.message)) {
        return createAppError(type, message, originalError)
      }
    }
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    return createAppError(ErrorType.UNKNOWN, error.message, error)
  }

  return createAppError(ErrorType.UNKNOWN, 'Error desconocido', originalError)
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

