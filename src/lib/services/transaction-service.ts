import { supabase } from '@/lib/supabase/client'
import { Category, PaymentMethod, TransactionWithRelations, DashboardStats } from '@/types'

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

  /**
   * Obtener transacciones del usuario autenticado
   */
  static async getTransactions(limit?: number): Promise<TransactionWithRelations[]> {
    try {
      const user = await this.getAuthenticatedUser()
      
      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener transacciones: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error en getTransactions:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas del dashboard para el usuario autenticado
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const user = await this.getAuthenticatedUser()
      
      // Obtener fecha actual y primer día del mes
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Obtener transacciones del mes actual
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('transaction_type, amount')
        .eq('user_id', user.id)
        .gte('transaction_date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('transaction_date', lastDayOfMonth.toISOString().split('T')[0])

      if (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`)
      }

      // Calcular estadísticas
      const stats = {
        balance: 0,
        expenses: 0,
        income: 0,
        transactions: transactions?.length || 0
      }

      transactions?.forEach(transaction => {
        if (transaction.transaction_type === 'income') {
          stats.income += transaction.amount
        } else {
          stats.expenses += transaction.amount
        }
      })

      stats.balance = stats.income - stats.expenses

      return stats
    } catch (error) {
      console.error('Error en getDashboardStats:', error)
      throw error
    }
  }

  /**
   * Obtener transacciones recientes del usuario autenticado
   */
  static async getRecentTransactions(limit: number = 5): Promise<TransactionWithRelations[]> {
    return this.getTransactions(limit)
  }
}
