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
    minLength: 1,
    maxLength: 100,
  },
  notes: {
    minLength: 0,
    maxLength: 500,
  },
  amount: {
    min: 0.01,
    max: 999999.99,
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
  descriptionRequired: 'La descripción es requerida',
  descriptionTooLong: 'La descripción no puede exceder 100 caracteres',
  amountRequired: 'El monto es requerido',
  amountTooSmall: 'El monto debe ser mayor a 0',
  amountTooLarge: 'El monto no puede exceder $999,999.99',
  categoryRequired: 'Selecciona una categoría',
  paymentMethodRequired: 'Selecciona un método de pago',
  dateRequired: 'La fecha es requerida',
  notesTooLong: 'Las notas no pueden exceder 500 caracteres',
} as const
