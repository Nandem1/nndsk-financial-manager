'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, Plus, Edit, Trash2, Wallet } from 'lucide-react'
import { STYLES } from '@/lib/constants/styles'
import { TRANSITIONS } from '@/lib/constants/animations'
import { UTILITY_CLASSES } from '@/lib/constants/styles'
import { formatCurrency } from '@/utils/format'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { useFormData } from '@/hooks/use-form-data'
import { TransactionService } from '@/lib/services/transaction-service'
import { CreditCardForm } from '@/components/credit-cards/credit-card-form'
import { PaymentMethod, CreateCreditCardDTO } from '@/types'
import { Loading } from '@/components/ui/loading'

interface PaymentMethodsSectionProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function PaymentMethodsSection({ onLoadingChange }: PaymentMethodsSectionProps) {
  const { 
    creditCards, 
    loading: loadingCreditCards, 
    error: creditCardsError, 
    createCreditCard, 
    updateCreditCard, 
    deleteCreditCard, 
    refreshCreditCards 
  } = useCreditCards()
  
  const { paymentMethods, loading: loadingPaymentMethods } = useFormData()
  
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // Notificar al componente padre cuando cambie el estado de loading
  useEffect(() => {
    const isLoading = loadingCreditCards || loadingPaymentMethods
    onLoadingChange?.(isLoading)
  }, [loadingCreditCards, loadingPaymentMethods, onLoadingChange])

  const handleCreateCard = async (data: CreateCreditCardDTO) => {
    try {
      await createCreditCard(data)
      setIsModalOpen(false)
      setSelectedCard(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error creating card:', error)
    }
  }

  const handleUpdateCard = async (data: CreateCreditCardDTO) => {
    if (!selectedCard) return
    
    try {
      await updateCreditCard(selectedCard.id, data)
      setIsModalOpen(false)
      setSelectedCard(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating card:', error)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) return
    
    try {
      await deleteCreditCard(cardId)
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const handleInitializeCredit = async () => {
    try {
      setIsInitializing(true)
      await TransactionService.initializeAllAvailableCredit()
      await refreshCreditCards() // Refrescar para mostrar los cupos actualizados
      alert('Cupos disponibles inicializados correctamente')
    } catch (error) {
      console.error('Error initializing credit:', error)
      alert('Error al inicializar cupos: ' + (error as Error).message)
    } finally {
      setIsInitializing(false)
    }
  }

  const openCreateModal = () => {
    setSelectedCard(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const openEditModal = (card: PaymentMethod) => {
    setSelectedCard(card)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  if (loadingCreditCards || loadingPaymentMethods) {
    return <Loading message="Cargando métodos de pago..." />
  }

  if (creditCardsError) {
    return (
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardContent className="text-center py-8">
          <h3 className={`${UTILITY_CLASSES.text.body} ${STYLES.text.error} mb-2`}>
            Error al cargar métodos de pago
          </h3>
          <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary} mb-4`}>
            {creditCardsError}
          </p>
          <Button onClick={refreshCreditCards} className={STYLES.button.primary}>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  const creditCardsList = creditCards.filter(card => card.type === 'credit_card')
  const otherPaymentMethods = paymentMethods.filter(method => method.type !== 'credit_card')

  return (
    <div className="space-y-6">
      {/* Tarjetas de Crédito */}
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
            <CreditCard className="h-5 w-5" />
            Tarjetas de Crédito
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`${STYLES.button.outline}`}
              onClick={handleInitializeCredit}
              disabled={isInitializing}
            >
              {isInitializing ? 'Inicializando...' : 'Inicializar Cupos'}
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${STYLES.button.outline}`}
                  onClick={openCreateModal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tarjeta
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {creditCardsList.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className={`${UTILITY_CLASSES.text.body} ${STYLES.text.primary} mb-2`}>
                No tienes tarjetas de crédito
              </h3>
              <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary} mb-4`}>
                Agrega tu primera tarjeta de crédito para controlar tu cupo disponible
              </p>
              <Button 
                className={STYLES.button.primary}
                onClick={openCreateModal}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Tarjeta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditCardsList.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...TRANSITIONS.smooth }}
                  className={`p-4 rounded-lg ${STYLES.border.primary} hover:${STYLES.background.secondary} transition-colors`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className={`font-medium ${STYLES.text.primary}`}>{card.name}</h4>
                      <p className={`text-sm ${STYLES.text.tertiary}`}>
                        **** {card.last_four_digits}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(card)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={STYLES.text.tertiary}>Límite:</span>
                      <span className={STYLES.text.primary}>
                        {formatCurrency(card.credit_limit || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={STYLES.text.tertiary}>Disponible:</span>
                      <span className={STYLES.text.success}>
                        {formatCurrency(card.available_credit || 0)}
                      </span>
                    </div>
                    <div className={`w-full ${STYLES.background.secondary} rounded-full h-2`}>
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{
                          width: `${Math.min((1 - ((card.available_credit || 0) / (card.credit_limit || 1))) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Vence día {card.due_date}</span>
                      <span>Cierra día {card.closing_date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Otros Métodos de Pago */}
      {otherPaymentMethods.length > 0 && (
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
              <Wallet className="h-5 w-5" />
              Otros Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherPaymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${STYLES.border.primary}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.type === 'debit_card' ? 'bg-blue-100 dark:bg-blue-900/50' :
                      method.type === 'cash' ? 'bg-green-100 dark:bg-green-900/50' :
                      'bg-purple-100 dark:bg-purple-900/50'
                    }`}>
                      {method.type === 'debit_card' ? (
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      ) : method.type === 'cash' ? (
                        <Wallet className="h-4 w-4 text-green-600" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${STYLES.text.primary}`}>{method.name}</h4>
                      <p className={`text-sm ${STYLES.text.tertiary}`}>
                        {method.type === 'debit_card' ? 'Tarjeta de Débito' :
                         method.type === 'cash' ? 'Efectivo' :
                         method.type === 'transfer' ? 'Transferencia' : method.type}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para crear/editar tarjetas */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {isEditing ? 'Editar Tarjeta' : 'Nueva Tarjeta de Crédito'}
            </DialogTitle>
          </DialogHeader>
          <CreditCardForm
            initialData={selectedCard || undefined}
            onSubmit={isEditing ? handleUpdateCard : handleCreateCard}
            onCancel={() => {
              setIsModalOpen(false)
              setSelectedCard(null)
              setIsEditing(false)
            }}
            variant="modal"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
