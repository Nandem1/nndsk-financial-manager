import { supabase } from '@/lib/supabase/client'
import { Category, PaymentMethod } from '@/types'

/**
 * Servicio para crear datos iniciales (seed data) para nuevos usuarios
 */
export class SeedService {
  /**
   * Obtener usuario autenticado
   */
  private static async getAuthenticatedUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Usuario no autenticado')
    }
    
    return user
  }

  /**
   * Crear categorías por defecto para un usuario
   */
  static async createDefaultCategories(): Promise<Category[]> {
    try {
      const user = await this.getAuthenticatedUser()
      
      // Verificar si el usuario ya tiene categorías
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existingCategories && existingCategories.length > 0) {
        // El usuario ya tiene categorías, no crear duplicados
        return []
      }

      const defaultCategories = [
        { name: 'Alimentación', color: '#EF4444', icon: 'Utensils' },
        { name: 'Transporte', color: '#3B82F6', icon: 'Car' },
        { name: 'Entretenimiento', color: '#8B5CF6', icon: 'Gamepad2' },
        { name: 'Salud', color: '#10B981', icon: 'Heart' },
        { name: 'Educación', color: '#F59E0B', icon: 'BookOpen' },
        { name: 'Ropa', color: '#EC4899', icon: 'Shirt' },
        { name: 'Hogar', color: '#6B7280', icon: 'Home' },
        { name: 'Otros', color: '#9CA3AF', icon: 'MoreHorizontal' },
      ]

      const categoriesToInsert = defaultCategories.map(category => ({
        ...category,
        user_id: user.id
      }))

      const { data: newCategories, error } = await supabase
        .from('categories')
        .insert(categoriesToInsert)
        .select()

      if (error) {
        throw new Error(`Error al crear categorías por defecto: ${error.message}`)
      }

      return newCategories || []
    } catch (error) {
      console.error('Error en createDefaultCategories:', error)
      throw error
    }
  }

  /**
   * Crear métodos de pago por defecto para un usuario
   */
  static async createDefaultPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const user = await this.getAuthenticatedUser()
      
      // Verificar si el usuario ya tiene métodos de pago
      const { data: existingMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existingMethods && existingMethods.length > 0) {
        // El usuario ya tiene métodos de pago, no crear duplicados
        return []
      }

      const defaultPaymentMethods = [
        { name: 'Efectivo', type: 'cash' as const },
        { name: 'Tarjeta de Débito', type: 'debit_card' as const },
        { name: 'Tarjeta de Crédito', type: 'credit_card' as const },
        { name: 'Transferencia', type: 'transfer' as const },
      ]

      const methodsToInsert = defaultPaymentMethods.map(method => ({
        ...method,
        user_id: user.id
      }))

      const { data: newMethods, error } = await supabase
        .from('payment_methods')
        .insert(methodsToInsert)
        .select()

      if (error) {
        throw new Error(`Error al crear métodos de pago por defecto: ${error.message}`)
      }

      return newMethods || []
    } catch (error) {
      console.error('Error en createDefaultPaymentMethods:', error)
      throw error
    }
  }

  /**
   * Crear todos los datos iniciales para un usuario
   */
  static async createDefaultData(): Promise<{
    categories: Category[]
    paymentMethods: PaymentMethod[]
  }> {
    try {
      const [categories, paymentMethods] = await Promise.all([
        this.createDefaultCategories(),
        this.createDefaultPaymentMethods()
      ])

      return { categories, paymentMethods }
    } catch (error) {
      console.error('Error en createDefaultData:', error)
      throw error
    }
  }

  /**
   * Verificar si un usuario necesita datos iniciales
   */
  static async needsDefaultData(): Promise<boolean> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const [categoriesResult, paymentMethodsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('id')
          .eq('user_id', user.id)
          .limit(1),
        supabase
          .from('payment_methods')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
      ])

      const hasCategories = categoriesResult.data && categoriesResult.data.length > 0
      const hasPaymentMethods = paymentMethodsResult.data && paymentMethodsResult.data.length > 0

      return !hasCategories || !hasPaymentMethods
    } catch (error) {
      console.error('Error en needsDefaultData:', error)
      return false
    }
  }
}
