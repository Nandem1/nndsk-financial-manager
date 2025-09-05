'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PaymentMethod } from '@/types'

interface CreditCardModalContextType {
  isOpen: boolean
  selectedCard: PaymentMethod | null
  isEditing: boolean
  open: (card?: PaymentMethod) => void
  close: () => void
}

const CreditCardModalContext = createContext<CreditCardModalContextType | undefined>(undefined)

interface CreditCardModalProviderProps {
  children: ReactNode
}

export function CreditCardModalProvider({ children }: CreditCardModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const open = (card?: PaymentMethod) => {
    setSelectedCard(card || null)
    setIsEditing(!!card)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setSelectedCard(null)
    setIsEditing(false)
  }

  return (
    <CreditCardModalContext.Provider value={{
      isOpen,
      selectedCard,
      isEditing,
      open,
      close
    }}>
      {children}
    </CreditCardModalContext.Provider>
  )
}

export function useCreditCardModal() {
  const context = useContext(CreditCardModalContext)
  if (context === undefined) {
    throw new Error('useCreditCardModal must be used within a CreditCardModalProvider')
  }
  return context
}
