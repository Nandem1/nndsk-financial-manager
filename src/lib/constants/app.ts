// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'nndsk Finance',
  version: '1.0.0',
  description: 'Gestor de finanzas personales, simple y rápido',
  maxPasswordLength: 128,
  minPasswordLength: 6,
  maxNameLength: 100,
  maxDescriptionLength: 500,
  maxNotesLength: 1000,
} as const

// Rutas de la aplicación
export const ROUTES = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  transactions: '/transactions',
  analytics: '/analytics',
  settings: '/settings',
} as const

// Navegación del dashboard
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: ROUTES.dashboard, icon: 'LayoutDashboard' },
  { name: 'Transacciones', href: ROUTES.transactions, icon: 'Receipt' },
  { name: 'Análisis', href: ROUTES.analytics, icon: 'PieChart' },
  { name: 'Configuración', href: ROUTES.settings, icon: 'Settings' },
] as const
