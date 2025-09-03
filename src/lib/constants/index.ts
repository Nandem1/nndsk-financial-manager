// 📦 EXPORTACIÓN CENTRALIZADA DE CONSTANTES
// Este archivo mantiene la compatibilidad con imports existentes
// mientras organiza las constantes en módulos específicos

export * from './app'
export * from './validation'
export * from './styles'
export * from './animations'

// Re-exportar constantes específicas para mantener compatibilidad
export { APP_CONFIG, ROUTES, NAVIGATION_ITEMS } from './app'
export { VALIDATION_CONFIG, ERROR_MESSAGES } from './validation'
export { STYLES, UTILITY_CLASSES } from './styles'
export { ANIMATIONS, TRANSITIONS } from './animations'
