'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'
import { useTransactions } from '@/hooks/use-transactions'
import type { CreateTransactionDTO } from '@/types'

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false)
  const { user, isLoading, isUnauthenticated } = useAuth()
  const { createTransaction, loading: transactionLoading, error } = useTransactions()

  const handleCreateTransaction = async (data: CreateTransactionDTO) => {
    const result = await createTransaction(data)
    if (result.success) {
      setShowForm(false)
    }
  }

  if (isLoading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (isUnauthenticated) {
    return <AuthError />
  }

  return (
    <motion.div 
      className={UTILITY_CLASSES.spacing.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h1 className={`text-2xl font-bold ${STYLES.text.primary}`}>
            Transacciones
          </h1>
          <p className={`${STYLES.text.secondary}`}>
            Gestiona tus gastos e ingresos
          </p>
          {user && (
            <p className={`text-sm ${STYLES.text.tertiary} mt-1`}>
              Usuario: {user.email}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            className={STYLES.button.primary}
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </Button>
        </motion.div>
      </motion.div>

      {/* Formulario Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <TransactionForm
              onSubmit={handleCreateTransaction}
              onCancel={() => setShowForm(false)}
              loading={transactionLoading}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Manejo de Errores */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className={`text-sm ${STYLES.text.error}`}>
            Error: {error}
          </p>
        </motion.div>
      )}

      {/* Contenido Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={STYLES.text.primary}>
              Lista de Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-center py-8 ${STYLES.text.secondary}`}>
              <p>
                Aquí aparecerán todas tus transacciones. 
                <br />
                Haz clic en &quot;Nueva Transacción&quot; para comenzar.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
