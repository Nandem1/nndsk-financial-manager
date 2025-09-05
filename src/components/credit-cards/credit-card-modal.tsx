'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreditCard } from 'lucide-react'
import { CreditCardForm } from './credit-card-form'
import { useCreditCardModal } from '@/contexts/credit-card-modal-context'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { CreateCreditCardDTO } from '@/types'

export function CreditCardModal() {
  const { isOpen, selectedCard, isEditing, close } = useCreditCardModal()
  const { createCreditCard, updateCreditCard } = useCreditCards()

  const handleSubmit = async (data: CreateCreditCardDTO) => {
    try {
      if (isEditing && selectedCard) {
        await updateCreditCard(selectedCard.id, data)
      } else {
        await createCreditCard(data)
      }
      close()
    } catch (error) {
      console.error('Error saving credit card:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {isEditing ? 'Editar Tarjeta' : 'Nueva Tarjeta de Crédito'}
          </DialogTitle>
        </DialogHeader>
        <CreditCardForm
          initialData={selectedCard || undefined}
          onSubmit={handleSubmit}
          onCancel={close}
          variant="modal"
        />
      </DialogContent>
    </Dialog>
  )
}
