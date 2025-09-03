// 🎨 SISTEMA DE ESTILOS UNIFICADO
export const STYLES = {
  // Colores de texto
  text: {
    primary: 'text-gray-900 dark:text-slate-100',
    secondary: 'text-gray-600 dark:text-slate-400',
    tertiary: 'text-gray-500 dark:text-slate-500',
    error: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  },
  
  // Colores de fondo
  background: {
    primary: 'bg-white dark:bg-slate-900/50',
    secondary: 'bg-gray-50 dark:bg-slate-800/50',
    tertiary: 'bg-gray-100 dark:bg-slate-800',
    dark: 'bg-slate-950',
    card: 'bg-white dark:bg-slate-900/50',
  },
  
  // Bordes
  border: {
    primary: 'border-gray-200 dark:border-slate-800',
    secondary: 'border-gray-100 dark:border-slate-700',
    focus: 'border-blue-500 dark:border-blue-400',
  },
  
  // Botones
  button: {
    primary: 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-slate-100',
    outline: 'border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800',
    ghost: 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  
  // Estados de hover
  hover: {
    primary: 'hover:bg-gray-50 dark:hover:bg-slate-800/50',
    secondary: 'hover:bg-gray-100 dark:hover:bg-slate-800',
    text: 'hover:text-gray-900 dark:hover:text-slate-100',
    background: 'hover:bg-gray-100 dark:hover:bg-slate-800',
  },
  
  // Transiciones
  transition: 'transition-colors duration-200',
  
  // Efectos
  effects: {
    backdrop: 'backdrop-blur-xl',
    shadow: 'shadow-md',
    hoverShadow: 'hover:shadow-lg',
    glow: 'shadow-lg shadow-blue-500/25',
    ring: 'ring-2 ring-blue-500 ring-offset-2',
  },
} as const

// 🎯 CLASES UTILITARIAS PREDEFINIDAS
export const UTILITY_CLASSES = {
  // Layout
  container: 'px-4 sm:px-6 lg:px-8',
  card: 'bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg',
  
  // Texto responsive
  text: {
    title: 'text-xl sm:text-2xl font-bold',
    subtitle: 'text-lg sm:text-xl font-semibold',
    body: 'text-sm sm:text-base',
    small: 'text-xs sm:text-sm',
    caption: 'text-xs',
  },
  
  // Espaciado responsive
  spacing: {
    section: 'space-y-4 sm:space-y-6',
    card: 'p-4 sm:p-6',
    button: 'px-4 py-2',
  },
  
  // Grid responsive
  grid: {
    stats: 'grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6',
    actions: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6',
    form: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  },
  
  // Interacciones
  interactions: {
    clickable: 'cursor-pointer select-none',
    focusable: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    hoverable: 'hover:shadow-md transition-shadow duration-200',
  },
} as const
