'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type TransactionType = 'expense' | 'income'

interface OpenOptions {
  type?: TransactionType
  onSuccess?: () => void
}

interface TransactionModalContextValue {
  isOpen: boolean
  defaultType: TransactionType
  open: (options?: OpenOptions) => void
  close: () => void
  onSuccess?: () => void
}

const TransactionModalContext = createContext<TransactionModalContextValue | undefined>(undefined)

export function TransactionModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultType, setDefaultType] = useState<TransactionType>('expense')
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>(undefined)

  const open = useCallback((options?: OpenOptions) => {
    if (options?.type) setDefaultType(options.type)
    setOnSuccess(() => options?.onSuccess)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<TransactionModalContextValue>(() => ({
    isOpen,
    defaultType,
    open,
    close,
    onSuccess,
  }), [isOpen, defaultType, open, close, onSuccess])

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
    </TransactionModalContext.Provider>
  )
}

export function useTransactionModal() {
  const ctx = useContext(TransactionModalContext)
  if (!ctx) throw new Error('useTransactionModal must be used within TransactionModalProvider')
  return ctx
}
