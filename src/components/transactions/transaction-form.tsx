'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, DollarSign, Calendar, CreditCard, FileText } from 'lucide-react'
import { CreateTransactionDTO } from '@/types'
import { STYLES } from '@/lib/constants/styles'
import { ANIMATIONS } from '@/lib/constants/animations'
import { transactionSchema, TransactionFormData } from '@/lib/constants/schemas'
import { useFormHandler } from '@/hooks/use-form-handler'
import { useFormData } from '@/hooks/use-form-data'

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDTO) => Promise<void>
  onCancel: () => void
  loading?: boolean
  defaultType?: 'expense' | 'income'
  variant?: 'page' | 'modal'
}

export function TransactionForm({ onSubmit, onCancel, loading = false, defaultType = 'expense', variant = 'page' }: TransactionFormProps) {
  const { categories, paymentMethods, loading: formDataLoading, error: formDataError } = useFormData()
  
  const {
    form,
    loading: formLoading,
    error: formError,
    handleSubmit
  } = useFormHandler<TransactionFormData>(transactionSchema, {
    transaction_type: defaultType,
    transaction_date: new Date().toISOString().split('T')[0],
  })

  const watchedType = form.watch('transaction_type')

  const handleFormSubmit = form.handleSubmit((data) => {
    handleSubmit(() => onSubmit(data))
  })

  const FormInner = (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
                  onClick={() => form.setValue('transaction_type', 'expense')}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Gasto
                </Button>
                <Button
                  type="button"
                  variant={watchedType === 'income' ? 'default' : 'outline'}
                  className={`flex-1 ${watchedType === 'income' ? STYLES.button.primary : STYLES.button.outline}`}
                  onClick={() => form.setValue('transaction_type', 'income')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Ingreso
                </Button>
              </div>
              {form.formState.errors.transaction_type && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.transaction_type.message}</p>
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
                  {...form.register('amount', { valueAsNumber: true })}
                />
              </div>
              {form.formState.errors.amount && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.amount.message}</p>
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
                  {...form.register('description')}
                />
              </div>
              {form.formState.errors.description && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Categoría
              </Label>
              {formDataLoading ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.tertiary}`}>
                  Cargando categorías...
                </div>
              ) : categories.length === 0 ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.error}`}>
                  No hay categorías disponibles
                </div>
              ) : (
                <Select onValueChange={(value) => form.setValue('category_id', value)}>
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
              {form.formState.errors.category_id && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.category_id.message}</p>
              )}
            </div>

            {/* Método de Pago */}
            <div className="space-y-2">
              <Label htmlFor="payment_method" className={`text-sm font-medium ${STYLES.text.secondary}`}>
                Método de Pago
              </Label>
              {formDataLoading ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.tertiary}`}>
                  Cargando métodos de pago...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className={`h-11 ${STYLES.border.primary} rounded-md flex items-center px-3 ${STYLES.text.error}`}>
                  No hay métodos de pago disponibles
                </div>
              ) : (
                <Select onValueChange={(value) => form.setValue('payment_method_id', value)}>
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
              {form.formState.errors.payment_method_id && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.payment_method_id.message}</p>
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
                  {...form.register('transaction_date')}
                />
              </div>
              {form.formState.errors.transaction_date && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.transaction_date.message}</p>
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
                {...form.register('notes')}
              />
              {form.formState.errors.notes && (
                <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.notes.message}</p>
              )}
            </div>

            {/* Error del formulario */}
            {formError && (
              <div className={`p-3 ${STYLES.background.secondary} ${STYLES.border.primary} rounded-lg`}>
                <p className={`text-sm ${STYLES.text.error}`}>{formError}</p>
              </div>
            )}

            {/* Error de datos del formulario */}
            {formDataError && (
              <div className={`p-3 ${STYLES.background.secondary} ${STYLES.border.primary} rounded-lg`}>
                <p className={`text-sm ${STYLES.text.error}`}>{formDataError}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className={`flex-1 ${STYLES.button.outline}`}
                disabled={loading || formLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${STYLES.button.primary}`}
                disabled={loading || formLoading || formDataLoading || categories.length === 0 || paymentMethods.length === 0}
              >
                {loading || formLoading ? 'Guardando...' : 'Guardar Transacción'}
              </Button>
            </div>
    </form>
  )

  return (
    <motion.div
      initial={ANIMATIONS.fadeIn.initial}
      animate={ANIMATIONS.fadeIn.animate}
      exit={ANIMATIONS.fadeIn.exit}
    >
      {variant === 'modal' ? (
        <div>
          <div className={`mb-4 sm:mb-6`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${STYLES.text.primary}`}>
              <Receipt className="h-5 w-5" />
              Nueva Transacción
            </h3>
          </div>
          {FormInner}
        </div>
      ) : (
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
              <Receipt className="h-5 w-5" />
              Nueva Transacción
            </CardTitle>
          </CardHeader>
          <CardContent>
            {FormInner}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

