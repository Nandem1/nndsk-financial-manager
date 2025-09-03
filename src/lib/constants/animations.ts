// 🎭 SISTEMA DE ANIMACIONES CON FRAMER MOTION
export const ANIMATIONS = {
  // Variantes de entrada
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // Variantes de escala
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  // Variantes de deslizamiento
  slideIn: {
    left: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    },
    right: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
    },
    up: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
    },
    down: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
  },
  
  // Variantes de lista
  list: {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        }
      },
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
  },
  
  // Variantes de cards
  card: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { 
      y: -5, 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 },
  },
  
  // Variantes de botones
  button: {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    focus: { scale: 1.02 },
  },
  
  // Variantes de página
  page: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  
  // Variantes de modal
  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    content: {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.8, y: 20 },
    },
  },
} as const

// ⚡ CONFIGURACIÓN DE TRANSICIONES
export const TRANSITIONS = {
  // Transiciones suaves
  smooth: {
    duration: 0.3,
    ease: "easeInOut",
  },
  
  // Transiciones rápidas
  fast: {
    duration: 0.15,
    ease: "easeOut",
  },
  
  // Transiciones lentas
  slow: {
    duration: 0.6,
    ease: "easeInOut",
  },
  
  // Transiciones elásticas
  elastic: {
    duration: 0.8,
    ease: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Transiciones de rebote
  bounce: {
    duration: 0.6,
    ease: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Transiciones de página
  page: {
    duration: 0.4,
    ease: "easeInOut",
  },
} as const
