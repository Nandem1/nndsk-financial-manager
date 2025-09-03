import { supabase } from '@/lib/supabase/client'
import { Category, PaymentMethod } from '@/types'

export class TransactionService {
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
   * Obtener datos de una tabla para el usuario autenticado
   */
  private static async getUserData<T>(
    table: string, 
    orderBy: string = 'name'
  ): Promise<T[]> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .order(orderBy)

      if (error) {
        throw new Error(`Error al obtener ${table}: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error(`Error en getUserData(${table}):`, error)
      throw error
    }
  }

  /**
   * Obtener categorías del usuario autenticado
   */
  static async getCategories(): Promise<Category[]> {
    return this.getUserData<Category>('categories')
  }

  /**
   * Obtener métodos de pago del usuario autenticado
   */
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.getUserData<PaymentMethod>('payment_methods')
  }
}
