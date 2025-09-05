// 📦 TIPOS UNIFICADOS DE LA APLICACIÓN
// Este archivo centraliza todos los tipos para evitar duplicación

// ===== TIPOS DE BASE DE DATOS =====

// Categoría de transacción
export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  created_at: string
}

// Método de pago
export interface PaymentMethod {
  id: string
  user_id: string
  name: string
  type: 'credit_card' | 'debit_card' | 'cash' | 'transfer'
  // Campos específicos para tarjetas de crédito
  credit_limit?: number
  last_four_digits?: string
  due_date?: number
  closing_date?: number
  available_credit?: number
  created_at: string
}

// Tipos de transacciones
export type TransactionType = 'expense' | 'income'

// Transacción principal
export interface Transaction {
  id: string
  user_id: string
  transaction_type: TransactionType
  amount: number // En la DB es numeric, pero TypeScript lo maneja como number
  description: string
  category_id: string
  payment_method_id: string
  transaction_date: string // En la DB es date, pero lo manejamos como string ISO
  notes?: string
  created_at: string
}

// ===== TIPOS PARA FRONTEND =====

// Transacción con relaciones populadas
export interface TransactionWithRelations extends Transaction {
  category: Pick<Category, 'name' | 'color' | 'icon'>
  payment_method: Pick<PaymentMethod, 'name' | 'type'>
}

// DTO para crear transacción
export interface CreateTransactionDTO {
  transaction_type: TransactionType
  amount: number
  description: string
  category_id: string
  payment_method_id: string
  transaction_date: string
  notes?: string
  // Campo opcional para cuotas (solo para tarjetas de crédito)
  installments?: number
}

// DTO para actualizar transacción
export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  id: string
}

// ===== TIPOS PARA FORMULARIOS =====

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// ===== TIPOS PARA ESTADÍSTICAS =====

export interface DashboardStats {
  balance: number
  expenses: number
  income: number
  transactions: number
}

export interface TransactionStats {
  total: number
  expenses: number
  income: number
  count: number
}

export interface CategoryStats {
  category_id: string
  category_name: string
  total: number
  count: number
}

// ===== TIPOS PARA FILTROS =====

export interface TransactionFilters {
  transaction_type?: TransactionType
  category_id?: string
  payment_method_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

// ===== TIPOS PARA API =====

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ===== TIPOS PARA USUARIO =====

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

// ===== TIPOS PARA NOTIFICACIONES =====

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// ===== TIPOS PARA COMPONENTES =====

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

// ===== TIPOS PARA TARJETAS DE CRÉDITO =====

// Transacción de tarjeta de crédito (cuotas)
export interface CreditCardTransaction {
  id: string
  card_id: string
  transaction_id?: string
  parent_transaction_id?: string
  amount: number
  description: string
  installments: number
  current_installment: number
  is_paid: boolean
  due_date: string
  payment_date?: string
  created_at: string
  updated_at: string
}

// DTO para crear tarjeta de crédito
export interface CreateCreditCardDTO {
  name: string
  last_four_digits: string
  credit_limit: number
  due_date: number
  closing_date: number
}

// DTO para actualizar tarjeta de crédito
export interface UpdateCreditCardDTO extends Partial<CreateCreditCardDTO> {
  id: string
}

// DTO para crear transacción con cuotas
export interface CreateCreditCardTransactionDTO {
  card_id: string
  amount: number
  description: string
  category_id: string
  transaction_date: string
  installments: number
  notes?: string
}

// Pago próximo
export interface UpcomingPayment {
  id: string
  amount: number
  due_date: string
  description: string
  payment_methods: {
    name: string
    last_four_digits: string
  }
}

// Resumen de gastos por tarjeta
export interface CreditCardSpending {
  cardName: string
  total: number
  percentage: number
}
