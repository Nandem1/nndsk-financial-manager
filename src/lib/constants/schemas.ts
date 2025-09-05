import * as yup from 'yup'
import { VALIDATION_CONFIG, ERROR_MESSAGES } from './validation'

/**
 * Schemas de validación centralizados usando Yup
 * Elimina la duplicación de schemas en diferentes componentes
 */

// Schema para login
export const loginSchema = yup.object({
  email: yup
    .string()
    .min(VALIDATION_CONFIG.email.minLength, ERROR_MESSAGES.required)
    .max(VALIDATION_CONFIG.email.maxLength, ERROR_MESSAGES.required)
    .email(ERROR_MESSAGES.invalidEmail)
    .required(ERROR_MESSAGES.required),
  password: yup
    .string()
    .min(VALIDATION_CONFIG.password.minLength, ERROR_MESSAGES.passwordTooShort)
    .max(VALIDATION_CONFIG.password.maxLength, ERROR_MESSAGES.passwordTooLong)
    .required(ERROR_MESSAGES.required),
})

// Schema para registro
export const signupSchema = yup.object({
  name: yup
    .string()
    .min(VALIDATION_CONFIG.name.minLength, ERROR_MESSAGES.nameTooShort)
    .max(VALIDATION_CONFIG.name.maxLength, ERROR_MESSAGES.nameTooLong)
    .required(ERROR_MESSAGES.required),
  email: yup
    .string()
    .min(VALIDATION_CONFIG.email.minLength, ERROR_MESSAGES.required)
    .max(VALIDATION_CONFIG.email.maxLength, ERROR_MESSAGES.required)
    .email(ERROR_MESSAGES.invalidEmail)
    .required(ERROR_MESSAGES.required),
  password: yup
    .string()
    .min(VALIDATION_CONFIG.password.minLength, ERROR_MESSAGES.passwordTooShort)
    .max(VALIDATION_CONFIG.password.maxLength, ERROR_MESSAGES.passwordTooLong)
    .required(ERROR_MESSAGES.required),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], ERROR_MESSAGES.passwordsDoNotMatch)
    .required(ERROR_MESSAGES.required),
})

// Schema para transacciones
export const transactionSchema = yup.object({
  transaction_type: yup
    .string()
    .oneOf(['expense', 'income'], 'Tipo de transacción inválido')
    .required(ERROR_MESSAGES.required),
  amount: yup
    .number()
    .min(VALIDATION_CONFIG.amount.min, ERROR_MESSAGES.amountTooSmall)
    .max(VALIDATION_CONFIG.amount.max, ERROR_MESSAGES.amountTooLarge)
    .required(ERROR_MESSAGES.required),
  description: yup
    .string()
    .min(VALIDATION_CONFIG.description.minLength, ERROR_MESSAGES.descriptionRequired)
    .max(VALIDATION_CONFIG.description.maxLength, ERROR_MESSAGES.descriptionTooLong)
    .required(ERROR_MESSAGES.required),
  category_id: yup
    .string()
    .min(1, ERROR_MESSAGES.categoryRequired)
    .required(ERROR_MESSAGES.required),
  payment_method_id: yup
    .string()
    .min(1, ERROR_MESSAGES.paymentMethodRequired)
    .required(ERROR_MESSAGES.required),
  transaction_date: yup
    .string()
    .min(1, ERROR_MESSAGES.dateRequired)
    .required(ERROR_MESSAGES.required),
  notes: yup
    .string()
    .max(VALIDATION_CONFIG.notes.maxLength, ERROR_MESSAGES.notesTooLong)
    .optional(),
  // Campo opcional para cuotas (solo para tarjetas de crédito)
  installments: yup
    .number()
    .min(1, 'Mínimo 1 cuota')
    .max(36, 'Máximo 36 cuotas')
    .optional(),
})

// Schema para tarjetas de crédito
export const creditCardSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required(ERROR_MESSAGES.required),
  last_four_digits: yup
    .string()
    .matches(/^\d{4}$/, 'Debe ser exactamente 4 dígitos')
    .required(ERROR_MESSAGES.required),
  credit_limit: yup
    .number()
    .min(100, 'El límite mínimo es $100')
    .max(1000000, 'El límite máximo es $1,000,000')
    .required(ERROR_MESSAGES.required),
  due_date: yup
    .number()
    .min(1, 'El día debe estar entre 1 y 28')
    .max(28, 'El día debe estar entre 1 y 28')
    .required(ERROR_MESSAGES.required),
  closing_date: yup
    .number()
    .min(1, 'El día debe estar entre 1 y 28')
    .max(28, 'El día debe estar entre 1 y 28')
    .required(ERROR_MESSAGES.required),
})

// Tipos inferidos de los schemas
export type LoginFormData = yup.InferType<typeof loginSchema>
export type SignupFormData = yup.InferType<typeof signupSchema>
export type TransactionFormData = yup.InferType<typeof transactionSchema>
export type CreditCardFormData = yup.InferType<typeof creditCardSchema>
