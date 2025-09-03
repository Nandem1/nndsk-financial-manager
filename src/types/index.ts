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
  created_at: string
}

// Tipos de transacciones
export type TransactionType = 'expense' | 'income'

// Transacción principal
export interface Transaction {
  id: string
  user_id: string
  transaction_type: TransactionType
  amount: number
  description: string
  category_id: string
  payment_method_id: string
  transaction_date: string
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
