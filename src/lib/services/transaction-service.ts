import { supabase } from '@/lib/supabase/client'
import { 
  Category, 
  PaymentMethod, 
  TransactionWithRelations, 
  DashboardStats, 
  CreateTransactionDTO,
  CreateCreditCardDTO,
  CreateCreditCardTransactionDTO,
  CreditCardTransaction,
  UpcomingPayment
} from '@/types'

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
   * Tendencia mensual de ingresos y gastos por mes.
   * Devuelve los últimos `months` meses incluyendo el mes actual.
   */
  static async getMonthlyTrend(params?: { months?: number }): Promise<Array<{
    month: string // YYYY-MM
    income: number
    expenses: number
    balance: number
  }>> {
    try {
      const user = await this.getAuthenticatedUser()
      const months = Math.max(1, Math.min(params?.months ?? 6, 24))

      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const from = start.toISOString().split('T')[0]
      const to = end.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, 
          amount, 
          transaction_type, 
          transaction_date,
          payment_method_id
        `)
        .eq('user_id', user.id)
        .gte('transaction_date', from)
        .lte('transaction_date', to)

      if (error) {
        throw new Error(`Error al obtener tendencia mensual: ${error.message}`)
      }

      // Inicializar estructura con 0 para todos los meses del rango
      const points: Record<string, { income: number; expenses: number }> = {}
      for (let i = 0; i < months; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        points[key] = { income: 0, expenses: 0 }
      }

      // Obtener métodos de pago para hacer el filtrado manual
      const paymentMethodIds = data?.map(t => t.payment_method_id).filter(Boolean) || []
      let paymentMethods: { [key: string]: string } = {}
      
      if (paymentMethodIds.length > 0) {
        const { data: methods, error: methodsError } = await supabase
          .from('payment_methods')
          .select('id, type')
          .in('id', paymentMethodIds)
        
        if (methodsError) {
          throw new Error(`Error al obtener métodos de pago: ${methodsError.message}`)
        }
        
        // Crear un mapa de ID -> tipo
        paymentMethods = methods?.reduce((acc, method) => {
          acc[method.id] = method.type
          return acc
        }, {} as { [key: string]: string }) || {}
      }

      type Row = { 
        id: string; 
        amount: number; 
        transaction_type: 'income' | 'expense'; 
        transaction_date: string;
        payment_method_id: string;
      }
      for (const t of (data ?? []) as Row[]) {
        // Solo procesar transacciones que no sean de tarjetas de crédito
        const paymentMethodType = paymentMethods[t.payment_method_id]
        if (paymentMethodType !== 'credit_card') {
          const date = new Date(t.transaction_date)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          if (!points[key]) continue
          if (t.transaction_type === 'income') points[key].income += t.amount
          else points[key].expenses += t.amount
        }
      }

      return Object.entries(points).map(([month, v]) => ({
        month,
        income: v.income,
        expenses: v.expenses,
        balance: v.income - v.expenses,
      }))
    } catch (error) {
      console.error('Error en getMonthlyTrend:', error)
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
   * Obtener transacciones paginadas del usuario autenticado
   */
  static async getTransactionsPaginated(
    page: number,
    pageSize: number,
    filters?: { category_id?: string; search?: string }
  ): Promise<{
    items: TransactionWithRelations[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }> {
    try {
      const user = await this.getAuthenticatedUser()

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('transactions')
        .select(
          `
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `,
          { count: 'exact' }
        )
        .eq('user_id', user.id)

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id)
      }
      if (filters?.search && filters.search.trim().length > 0) {
        const term = filters.search.trim()
        // Buscar por descripción o notas
        query = query.or(`description.ilike.%${term}%,notes.ilike.%${term}%`)
      }

      // Ordenar SIEMPRE por fecha descendente para paginación consistente
      const { data, error, count } = await query
        .order('transaction_date', { ascending: false })
        .range(from, to)

      if (error) {
        throw new Error(`Error al obtener transacciones paginadas: ${error.message}`)
      }

      const total = count ?? 0
      const items = (data as TransactionWithRelations[]) || []
      const totalPages = Math.max(1, Math.ceil(total / pageSize))

      return { items, total, page, pageSize, totalPages }
    } catch (error) {
      console.error('Error en getTransactionsPaginated:', error)
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

      // Obtener transacciones del mes actual con JOIN manual
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          transaction_type, 
          amount,
          payment_method_id
        `)
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

      // Obtener métodos de pago para hacer el filtrado manual
      const paymentMethodIds = transactions?.map(t => t.payment_method_id).filter(Boolean) || []
      let paymentMethods: { [key: string]: string } = {}
      
      if (paymentMethodIds.length > 0) {
        const { data: methods, error: methodsError } = await supabase
          .from('payment_methods')
          .select('id, type')
          .in('id', paymentMethodIds)
        
        if (methodsError) {
          throw new Error(`Error al obtener métodos de pago: ${methodsError.message}`)
        }
        
        // Crear un mapa de ID -> tipo
        paymentMethods = methods?.reduce((acc, method) => {
          acc[method.id] = method.type
          return acc
        }, {} as { [key: string]: string }) || {}
      }

      // Debug: Mostrar todas las transacciones obtenidas
      console.log('🔍 Todas las transacciones obtenidas:', transactions)
      console.log('🔍 Métodos de pago obtenidos:', paymentMethods)
      
      transactions?.forEach(transaction => {
        // Obtener el tipo de método de pago del mapa
        const paymentMethodType = paymentMethods[transaction.payment_method_id]
        
        console.log('🔍 Procesando transacción:', {
          amount: transaction.amount,
          type: transaction.transaction_type,
          payment_method_id: transaction.payment_method_id,
          payment_method_type: paymentMethodType
        })
        
        if (paymentMethodType !== 'credit_card') {
          if (transaction.transaction_type === 'income') {
            stats.income += transaction.amount
          } else {
            stats.expenses += transaction.amount
          }
          console.log('✅ Incluyendo transacción en dashboard')
        } else {
          console.log('❌ Excluyendo transacción de tarjeta de crédito del dashboard')
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

  /**
   * Obtener gastos agregados por categoría para el usuario autenticado
   * Por defecto, del mes actual. Se puede pasar un rango de fechas opcional (ISO yyyy-mm-dd)
   */
  static async getExpensesByCategory(params?: { from?: string; to?: string }): Promise<Array<{
    categoryId: string
    name: string
    color: string | null
    total: number
  }>> {
    try {
      const user = await this.getAuthenticatedUser()

      // Rango por defecto: mes actual
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const from = params?.from ?? firstDayOfMonth.toISOString().split('T')[0]
      const to = params?.to ?? lastDayOfMonth.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          transaction_type,
          category_id,
          payment_method_id,
          categories(name, color)
        `)
        .eq('user_id', user.id)
        .eq('transaction_type', 'expense')
        .gte('transaction_date', from)
        .lte('transaction_date', to)

      if (error) {
        throw new Error(`Error al obtener gastos por categoría: ${error.message}`)
      }

      // Obtener métodos de pago para hacer el filtrado manual
      const paymentMethodIds = data?.map(t => t.payment_method_id).filter(Boolean) || []
      let paymentMethods: { [key: string]: string } = {}
      
      if (paymentMethodIds.length > 0) {
        const { data: methods, error: methodsError } = await supabase
          .from('payment_methods')
          .select('id, type')
          .in('id', paymentMethodIds)
        
        if (methodsError) {
          throw new Error(`Error al obtener métodos de pago: ${methodsError.message}`)
        }
        
        // Crear un mapa de ID -> tipo
        paymentMethods = methods?.reduce((acc, method) => {
          acc[method.id] = method.type
          return acc
        }, {} as { [key: string]: string }) || {}
      }

      type ExpenseRow = {
        id: string
        amount: number
        transaction_type: 'income' | 'expense'
        category_id: string
        payment_method_id: string
        categories: { name?: string | null; color?: string | null }[] | null
      }

      const map = new Map<string, { categoryId: string; name: string; color: string | null; total: number }>()
      ;((data ?? []) as ExpenseRow[]).forEach((t) => {
        // Solo procesar transacciones que no sean de tarjetas de crédito
        const paymentMethodType = paymentMethods[t.payment_method_id]
        if (paymentMethodType !== 'credit_card') {
          // Types: selecting relational columns returns nested objects per supabase-js types
          const key: string = t.category_id
          const name: string = (t.categories?.[0]?.name ?? 'Sin categoría') as string
          const color: string | null = (t.categories?.[0]?.color ?? null) as string | null
          const prev = map.get(key)
          if (prev) {
            prev.total += t.amount
          } else {
            map.set(key, { categoryId: key, name, color, total: t.amount })
          }
        }
      })

      return Array.from(map.values()).sort((a, b) => b.total - a.total)
    } catch (error) {
      console.error('Error en getExpensesByCategory:', error)
      throw error
    }
  }

  /**
   * Crear una nueva transacción
   */
  static async createTransaction(data: CreateTransactionDTO): Promise<TransactionWithRelations> {
    try {
      const user = await this.getAuthenticatedUser()
      
      // Si es tarjeta de crédito con cuotas > 1, usar createCreditCardTransaction
      if (data.installments && data.installments > 1 && data.payment_method_id) {
        // Verificar si es tarjeta de crédito
        const { data: paymentMethod } = await supabase
          .from('payment_methods')
          .select('type')
          .eq('id', data.payment_method_id)
          .single()
        
        if (paymentMethod?.type === 'credit_card') {
          // Usar createCreditCardTransaction para cuotas múltiples
          const creditCardData: CreateCreditCardTransactionDTO = {
            card_id: data.payment_method_id,
            amount: data.amount,
            description: data.description,
            category_id: data.category_id,
            transaction_date: data.transaction_date,
            installments: data.installments
          }
          
          const result = await this.createCreditCardTransaction(creditCardData)
          return result.transaction
        }
      }
      
      // Para transacciones normales (sin cuotas o 1 cuota), remover installments
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { installments, ...transactionData } = data
      
      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          user_id: user.id
        })
        .select(`
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `)
        .single()

      if (error) {
        throw new Error(`Error al crear transacción: ${error.message}`)
      }

      return newTransaction
    } catch (error) {
      console.error('Error en createTransaction:', error)
      throw error
    }
  }

  /**
   * Actualizar una transacción existente
   */
  static async updateTransaction(id: string, data: Partial<CreateTransactionDTO>): Promise<TransactionWithRelations> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data: updatedTransaction, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `)
        .single()

      if (error) {
        throw new Error(`Error al actualizar transacción: ${error.message}`)
      }

      return updatedTransaction
    } catch (error) {
      console.error('Error en updateTransaction:', error)
      throw error
    }
  }

  /**
   * Eliminar una transacción
   */
  static async deleteTransaction(id: string): Promise<void> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Error al eliminar transacción: ${error.message}`)
      }
    } catch (error) {
      console.error('Error en deleteTransaction:', error)
      throw error
    }
  }

  /**
   * Obtener una transacción por ID
   */
  static async getTransactionById(id: string): Promise<TransactionWithRelations> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        throw new Error(`Error al obtener transacción: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error en getTransactionById:', error)
      throw error
    }
  }

  // ===== MÉTODOS PARA TARJETAS DE CRÉDITO =====

  /**
   * Obtener tarjetas de crédito del usuario autenticado
   */
  static async getCreditCards(): Promise<PaymentMethod[]> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'credit_card')
        .order('name')

      if (error) {
        throw new Error(`Error al obtener tarjetas de crédito: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error en getCreditCards:', error)
      throw error
    }
  }

  /**
   * Crear una nueva tarjeta de crédito
   */
  static async createCreditCard(data: CreateCreditCardDTO): Promise<PaymentMethod> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data: newCard, error } = await supabase
        .from('payment_methods')
        .insert({
          ...data,
          user_id: user.id,
          type: 'credit_card'
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear tarjeta de crédito: ${error.message}`)
      }

      return newCard
    } catch (error) {
      console.error('Error en createCreditCard:', error)
      throw error
    }
  }

  /**
   * Actualizar una tarjeta de crédito existente
   */
  static async updateCreditCard(id: string, data: Partial<CreateCreditCardDTO>): Promise<PaymentMethod> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { data: updatedCard, error } = await supabase
        .from('payment_methods')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('type', 'credit_card')
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar tarjeta de crédito: ${error.message}`)
      }

      return updatedCard
    } catch (error) {
      console.error('Error en updateCreditCard:', error)
      throw error
    }
  }

  /**
   * Eliminar una tarjeta de crédito
   */
  static async deleteCreditCard(id: string): Promise<void> {
    try {
      const user = await this.getAuthenticatedUser()
      
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('type', 'credit_card')

      if (error) {
        throw new Error(`Error al eliminar tarjeta de crédito: ${error.message}`)
      }
    } catch (error) {
      console.error('Error en deleteCreditCard:', error)
      throw error
    }
  }

  /**
   * Crear transacción con cuotas (extensión del método existente)
   */
  static async createCreditCardTransaction(data: CreateCreditCardTransactionDTO): Promise<{
    transaction: TransactionWithRelations;
    installments: CreditCardTransaction[];
  }> {
    try {
      const user = await this.getAuthenticatedUser()
      
      // Verificar cupo disponible
      const availableCredit = await this.getAvailableCredit(data.card_id)
      
      // Si available_credit es 0 o null, usar credit_limit como fallback
      let creditToCheck = availableCredit
      if (availableCredit === 0 || availableCredit === null) {
        const { data: card } = await supabase
          .from('payment_methods')
          .select('credit_limit')
          .eq('id', data.card_id)
          .single()
        creditToCheck = card?.credit_limit || 0
        console.log('Debug - Usando credit_limit como fallback:', creditToCheck)
      }
      
      if (creditToCheck < data.amount) {
        throw new Error(`Cupo insuficiente en la tarjeta de crédito. Disponible: ${creditToCheck}, Requerido: ${data.amount}`)
      }

      // Calcular fechas de vencimiento
      const dueDates = this.calculateDueDates(data.installments, new Date(data.transaction_date))
      const installmentAmount = data.amount / data.installments

      // Crear transacción principal
      console.log('🔍 Creando transacción principal con user_id:', user.id)
      const transactionData = {
        amount: -data.amount,
        description: data.installments > 1 ? 
          `${data.description} (${data.installments} cuotas)` : 
          data.description,
        category_id: data.category_id,
        payment_method_id: data.card_id,
        transaction_type: 'expense',
        transaction_date: data.transaction_date,
        notes: data.notes,
        user_id: user.id
      }
      console.log('📝 Datos de transacción:', transactionData)

      const { data: mainTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select(`
          *,
          category:categories(name, color, icon),
          payment_method:payment_methods(name, type)
        `)
        .single()

      if (transactionError) {
        console.error('❌ Error al crear transacción:', transactionError)
        throw new Error(`Error al crear transacción: ${transactionError.message}`)
      }

      // Crear registros de cuotas una por una para evitar problemas de foreign key - v3.0
      const createdInstallments: CreditCardTransaction[] = []
      let parentInstallmentId: string | null = null
      
      for (let index = 0; index < dueDates.length; index++) {
        const dueDate = dueDates[index]
        const installmentData: Record<string, unknown> = {
          user_id: user.id, // ✅ RLS: Aislamiento por usuario
          card_id: data.card_id,
          transaction_id: index === 0 ? mainTransaction.id : null, // Solo la primera cuota tiene transaction_id
          parent_transaction_id: parentInstallmentId, // Referencia a la primera cuota creada
          amount: installmentAmount,
          description: data.installments > 1 ? 
            `${data.description} (${index + 1}/${data.installments})` : 
            data.description,
          installments: data.installments,
          current_installment: index + 1,
          due_date: dueDate.toISOString(),
          is_paid: false
        }

        console.log(`🔍 Creando cuota ${index + 1}/${dueDates.length}:`, installmentData)
        
        const { data: createdInstallment, error: installmentError } = await supabase
          .from('credit_card_transactions')
          .insert(installmentData)
          .select('*')
          .single()

        if (installmentError) {
          console.error(`❌ Error al crear cuota ${index + 1}:`, installmentError)
          console.error('📝 Datos que se intentaron insertar:', installmentData)
          console.error('🔍 Detalles del error:', {
            message: installmentError.message,
            details: installmentError.details,
            hint: installmentError.hint,
            code: installmentError.code
          })
          throw new Error(`Error al crear cuota ${index + 1}: ${installmentError.message || 'Error desconocido'}`)
        }

        createdInstallments.push(createdInstallment as CreditCardTransaction)
        console.log(`✅ Cuota ${index + 1} creada exitosamente`)
        
        // La primera cuota se convierte en la "padre" para las siguientes
        if (index === 0) {
          parentInstallmentId = createdInstallment.id
          console.log(`🔗 Estableciendo cuota padre: ${parentInstallmentId}`)
        }
      }

      return {
        transaction: mainTransaction,
        installments: createdInstallments || []
      }
    } catch (error) {
      console.error('Error en createCreditCardTransaction:', error)
      throw error
    }
  }

  /**
   * Obtener cupo disponible de una tarjeta
   */
  static async getAvailableCredit(cardId: string): Promise<number> {
    try {
      const { data: card, error } = await supabase
        .from('payment_methods')
        .select('available_credit, credit_limit, name')
        .eq('id', cardId)
        .eq('type', 'credit_card')
        .single()

      if (error) {
        throw new Error(`Error al obtener cupo: ${error.message}`)
      }

      console.log('Debug - Tarjeta:', {
        name: card.name,
        credit_limit: card.credit_limit,
        available_credit: card.available_credit
      })

      return card.available_credit || 0
    } catch (error) {
      console.error('Error en getAvailableCredit:', error)
      throw error
    }
  }

  /**
   * Actualizar cupo disponible de una tarjeta (útil para sincronización)
   */
  static async refreshAvailableCredit(cardId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('calculate_available_credit', { p_card_id: cardId })

      if (error) {
        throw new Error(`Error al calcular cupo: ${error.message}`)
      }

      // Actualizar el campo en la base de datos
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ available_credit: data })
        .eq('id', cardId)
        .eq('type', 'credit_card')

      if (updateError) {
        throw new Error(`Error al actualizar cupo: ${updateError.message}`)
      }

      return data || 0
    } catch (error) {
      console.error('Error en refreshAvailableCredit:', error)
      throw error
    }
  }

  /**
   * Obtener próximos pagos de tarjetas de crédito
   */
  static async getUpcomingPayments(limit: number = 5): Promise<UpcomingPayment[]> {
    try {
      const { data, error } = await supabase
        .from('credit_card_transactions')
        .select(`
          id,
          amount,
          due_date,
          description,
          payment_methods:card_id (name, last_four_digits)
        `)
        .eq('is_paid', false)
        .gte('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true })
        .limit(limit)

      if (error) {
        throw new Error(`Error al obtener próximos pagos: ${error.message}`)
      }

      return (data || []) as unknown as UpcomingPayment[]
    } catch (error) {
      console.error('Error en getUpcomingPayments:', error)
      throw error
    }
  }

  /**
   * Calcular fechas de vencimiento para cuotas
   */
  private static calculateDueDates(installments: number, startDate: Date): Date[] {
    const dueDates: Date[] = []
    const firstDueDate = new Date(startDate)
    firstDueDate.setMonth(firstDueDate.getMonth() + 1) // Primera cuota al mes siguiente
    
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(firstDueDate)
      dueDate.setMonth(dueDate.getMonth() + i)
      dueDates.push(dueDate)
    }
    
    return dueDates
  }

  /**
   * Inicializar cupo disponible de todas las tarjetas (función de utilidad)
   */
  static async initializeAllAvailableCredit(): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('initialize_available_credit')

      if (error) {
        throw new Error(`Error al inicializar cupos: ${error.message}`)
      }

      console.log('Cupos disponibles inicializados correctamente')
    } catch (error) {
      console.error('Error en initializeAllAvailableCredit:', error)
      throw error
    }
  }
}
