// Configuración de validación
export const VALIDATION_CONFIG = {
  email: {
    minLength: 1,
    maxLength: 254,
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  description: {
    minLength: 0,
    maxLength: 500,
  },
  notes: {
    minLength: 0,
    maxLength: 1000,
  },
} as const

// Mensajes de error
export const ERROR_MESSAGES = {
  required: 'Este campo es requerido',
  invalidEmail: 'Email inválido',
  passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
  passwordTooLong: 'La contraseña no puede exceder 128 caracteres',
  nameTooShort: 'El nombre debe tener al menos 2 caracteres',
  nameTooLong: 'El nombre no puede exceder 100 caracteres',
  passwordsDoNotMatch: 'Las contraseñas no coinciden',
} as const
