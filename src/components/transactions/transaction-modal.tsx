'use client'

import { useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useTransactionModal } from '@/contexts/transaction-modal-context'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { useTransactions } from '@/hooks/use-transactions'
import type { CreateTransactionDTO } from '@/types'

export function TransactionModal() {
  const { isOpen, close, defaultType, onSuccess } = useTransactionModal()
  const { loading, createTransaction } = useTransactions()

  const handleSubmit = useCallback(async (data: CreateTransactionDTO) => {
    const result = await createTransaction(data)
    if (result.success) {
      close()
      onSuccess?.()
    }
    // Errors are handled inside useAsyncOperation/useTransactions
  }, [createTransaction, close, onSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogTitle className="sr-only">Nueva Transacción</DialogTitle>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={close}
          loading={loading}
          variant="modal"
          /* default type to preselect expense/income */
          defaultType={defaultType}
        />
      </DialogContent>
    </Dialog>
  )
}
