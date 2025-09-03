'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, DollarSign, Calendar, CreditCard, FileText } from 'lucide-react'
import { CreateTransactionDTO, Category, PaymentMethod } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'
import { STYLES } from '@/lib/constants/styles'
import { ANIMATIONS } from '@/lib/constants/animations'

// Schema de validación
const transactionSchema = z.object({
  transaction_type: z.enum(['expense', 'income']),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida').max(100, 'Máximo 100 caracteres'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  payment_method_id: z.string().min(1, 'Selecciona un método de pago'),
  transaction_date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDTO) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TransactionForm({ onSubmit, onCancel, loading = false }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
    },
  })

  const watchedType = watch('transaction_type')

  // Cargar categorías y métodos de pago
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [categoriesData, paymentMethodsData] = await Promise.all([
          TransactionService.getCategories(),
          TransactionService.getPaymentMethods()
        ])
        
        setCategories(categoriesData)
        setPaymentMethods(paymentMethodsData)
      } catch (error) {
        console.error('Error loading form data:', error)
      } finally {
        setCategoriesLoading(false)
        setPaymentMethodsLoading(false)
      }
    }

    loadFormData()
  }, [])

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // El error se maneja en el componente padre
      console.error('Error en formulario:', error)
    }
  }

  return (
    <motion.div
      initial={ANIMATIONS.fadeIn.initial}
      animate={ANIMATIONS.fadeIn.animate}
      exit={ANIMATIONS.fadeIn.exit}
    >
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
            <Receipt className="h-5 w-5" />
            Nueva Transacción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Tipo de Transacción */}
            <div className="space-y-3">
              <Label className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Tipo de Transacción
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={watchedType === 'expense' ? 'default' : 'outline'}
                  className={`flex-1 ${watchedType === 'expense' ? STYLES.button.primary : STYLES.button.outline}`}
                  onClick={() => setValue('transaction_type', 'expense')}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Gasto
                </Button>
                <Button
                  type="button"
                  variant={watchedType === 'income' ? 'default' : 'outline'}
                  className={`flex-1 ${watchedType === 'income' ? STYLES.button.primary : STYLES.button.outline}`}
                  onClick={() => setValue('transaction_type', 'income')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Ingreso
                </Button>
              </div>
              {errors.transaction_type && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.transaction_type.message}</p>
              )}
            </div>

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="amount" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Monto
              </Label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.amount.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Descripción
              </Label>
              <div className="relative">
                <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
                <Input
                  id="description"
                  placeholder="¿En qué gastaste?"
                  className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
                  {...register('description')}
                />
              </div>
              {errors.description && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.description.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Categoría
              </Label>
              {categoriesLoading ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.tertiary}`}>
                  Cargando categorías...
                </div>
              ) : categories.length === 0 ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.error}`}>
                  No hay categorías disponibles
                </div>
              ) : (
                <Select onValueChange={(value) => setValue('category_id', value)}>
                  <SelectTrigger className={`h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.category_id && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.category_id.message}</p>
              )}
            </div>

            {/* Método de Pago */}
            <div className="space-y-2">
              <Label htmlFor="payment_method" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Método de Pago
              </Label>
              {paymentMethodsLoading ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.tertiary}`}>
                  Cargando métodos de pago...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.error}`}>
                  No hay métodos de pago disponibles
                </div>
              ) : (
                <Select onValueChange={(value) => setValue('payment_method_id', value)}>
                  <SelectTrigger className={`h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}>
                    <SelectValue placeholder="Selecciona un método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {method.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.payment_method_id && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.payment_method_id.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="transaction_date" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Fecha
              </Label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
                <Input
                  id="transaction_date"
                  type="date"
                  className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
                  {...register('transaction_date')}
                />
              </div>
              {errors.transaction_date && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.transaction_date.message}</p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Notas (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales..."
                className={`min-h-[80px] ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
                {...register('notes')}
              />
              {errors.notes && (
                <p className={`text-sm ${STYLES.text.error}`}>{errors.notes.message}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className={`flex-1 ${STYLES.button.outline}`}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${STYLES.button.primary}`}
                disabled={loading || categoriesLoading || paymentMethodsLoading || categories.length === 0 || paymentMethods.length === 0}
              >
                {loading ? 'Guardando...' : 'Guardar Transacción'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
