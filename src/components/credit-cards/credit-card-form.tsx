'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign, Calendar, Hash } from 'lucide-react'
import { CreateCreditCardDTO, PaymentMethod } from '@/types'
import { STYLES } from '@/lib/constants/styles'
import { ANIMATIONS } from '@/lib/constants/animations'
import { creditCardSchema, CreditCardFormData } from '@/lib/constants/schemas'
import { useFormHandler } from '@/hooks/use-form-handler'

interface CreditCardFormProps {
  initialData?: PaymentMethod;
  onSubmit: (data: CreateCreditCardDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'page' | 'modal';
}

export function CreditCardForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false, 
  variant = 'page' 
}: CreditCardFormProps) {
  const {
    form,
    loading: formLoading,
    error: formError,
    handleSubmit
  } = useFormHandler<CreditCardFormData>(creditCardSchema, {
    name: initialData?.name || '',
    last_four_digits: initialData?.last_four_digits || '',
    credit_limit: initialData?.credit_limit || 0,
    due_date: initialData?.due_date || 10,
    closing_date: initialData?.closing_date || 1
  })

  const handleFormSubmit = form.handleSubmit((data) => {
    handleSubmit(() => onSubmit(data))
  })

  const FormInner = (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Nombre de la Tarjeta */}
      <div className="space-y-2">
        <Label htmlFor="name" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Nombre de la Tarjeta
        </Label>
        <div className="relative">
          <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
          <Input
            id="name"
            placeholder="Ej: Visa Oro, Mastercard Platinum"
            className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
            {...form.register('name')}
          />
        </div>
        {form.formState.errors.name && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Últimos 4 dígitos */}
      <div className="space-y-2">
        <Label htmlFor="last_four_digits" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Últimos 4 Dígitos
        </Label>
        <div className="relative">
          <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
          <Input
            id="last_four_digits"
            placeholder="1234"
            maxLength={4}
            className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
            {...form.register('last_four_digits')}
          />
        </div>
        {form.formState.errors.last_four_digits && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.last_four_digits.message}</p>
        )}
      </div>

      {/* Límite de Crédito */}
      <div className="space-y-2">
        <Label htmlFor="credit_limit" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Límite de Crédito
        </Label>
        <div className="relative">
          <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
          <Input
            id="credit_limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
            {...form.register('credit_limit', { valueAsNumber: true })}
          />
        </div>
        {form.formState.errors.credit_limit && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.credit_limit.message}</p>
        )}
      </div>

      {/* Fecha de Vencimiento */}
      <div className="space-y-2">
        <Label htmlFor="due_date" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Día de Vencimiento
        </Label>
        <div className="relative">
          <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
          <Input
            id="due_date"
            type="number"
            min="1"
            max="28"
            placeholder="10"
            className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
            {...form.register('due_date', { valueAsNumber: true })}
          />
        </div>
        {form.formState.errors.due_date && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.due_date.message}</p>
        )}
      </div>

      {/* Fecha de Cierre */}
      <div className="space-y-2">
        <Label htmlFor="closing_date" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Día de Cierre
        </Label>
        <div className="relative">
          <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${STYLES.text.tertiary}`} />
          <Input
            id="closing_date"
            type="number"
            min="1"
            max="28"
            placeholder="1"
            className={`pl-10 h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
            {...form.register('closing_date', { valueAsNumber: true })}
          />
        </div>
        {form.formState.errors.closing_date && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.closing_date.message}</p>
        )}
      </div>

      {/* Error del formulario */}
      {formError && (
        <div className={`p-3 ${STYLES.background.secondary} ${STYLES.border.primary} rounded-lg`}>
          <p className={`text-sm ${STYLES.text.error}`}>{formError}</p>
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
          disabled={loading || formLoading}
        >
          {loading || formLoading ? 'Guardando...' : 'Guardar Tarjeta'}
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
              <CreditCard className="h-5 w-5" />
              {initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta de Crédito'}
            </h3>
          </div>
          {FormInner}
        </div>
      ) : (
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
              <CreditCard className="h-5 w-5" />
              {initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta de Crédito'}
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
