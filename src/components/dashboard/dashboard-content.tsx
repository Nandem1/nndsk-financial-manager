'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { ANIMATIONS, TRANSITIONS } from '@/lib/constants/animations'
import { motion } from 'framer-motion'
import { useDashboard } from '@/hooks/use-dashboard'
import { Loading } from '@/components/ui/loading'
import { useTransactionModal } from '@/contexts/transaction-modal-context'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/app'
import { formatCurrency } from '@/utils/format'
import { CreditCardsSummary } from './credit-cards-summary'
import { UpcomingPayments } from '@/components/credit-cards/upcoming-payments'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { useCreditCardModal } from '@/contexts/credit-card-modal-context'

export function DashboardContent() {
  const { user } = useAuth()
  const { stats, recentTransactions, loading, error, refreshData } = useDashboard()
  const { open } = useTransactionModal()
  const { creditCards } = useCreditCards()
  const { open: openCreditCardModal } = useCreditCardModal()

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return <Loading message="Cargando datos del dashboard..." />
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <div className={UTILITY_CLASSES.spacing.section}>
        <div className="text-center">
          <h2 className={`${UTILITY_CLASSES.text.title} ${STYLES.text.error} mb-4`}>
            Error al cargar el dashboard
          </h2>
          <p className={`${UTILITY_CLASSES.text.body} ${STYLES.text.secondary} mb-6`}>
            {error}
          </p>
          <Button onClick={refreshData} className={STYLES.button.primary}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className={UTILITY_CLASSES.spacing.section}
      variants={ANIMATIONS.page}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...TRANSITIONS.smooth, delay: 0.1 }}
      >
        <div>
          <motion.h1 
            className={`${UTILITY_CLASSES.text.title} ${STYLES.text.primary}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TRANSITIONS.smooth, delay: 0.2 }}
          >
            ¡Hola, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'}!
          </motion.h1>
          <motion.p 
            className={`${UTILITY_CLASSES.text.body} ${STYLES.text.secondary}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TRANSITIONS.smooth, delay: 0.3 }}
          >
            Resumen de tus finanzas personales
          </motion.p>
        </div>
        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={TRANSITIONS.fast}
          >
            <Button 
              variant="outline" 
              onClick={refreshData}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={TRANSITIONS.fast}
          >
            <Button
              className={`${STYLES.button.primary} w-full sm:w-auto`}
              onClick={() => open({ type: 'expense', onSuccess: refreshData })}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nueva Transacción</span>
              <span className="sm:hidden">+ Transacción</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className={UTILITY_CLASSES.grid.stats}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`${UTILITY_CLASSES.text.small} font-medium ${STYLES.text.secondary}`}>Balance del Mes</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className={UTILITY_CLASSES.spacing.card}>
            <div className={`text-lg sm:text-2xl font-bold ${stats.balance >= 0 ? STYLES.text.success : STYLES.text.error}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className={`text-xs ${STYLES.text.tertiary}`}>
              {stats.balance >= 0 ? '+12.5%' : '-8.2%'} vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`${UTILITY_CLASSES.text.small} font-medium ${STYLES.text.secondary}`}>Gastos Totales</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
          </CardHeader>
          <CardContent className={UTILITY_CLASSES.spacing.card}>
            <div className={`text-lg sm:text-2xl font-bold ${STYLES.text.error}`}>
              {formatCurrency(stats.expenses)}
            </div>
            <p className={`text-xs ${STYLES.text.tertiary}`}>
              +5.2% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`${UTILITY_CLASSES.text.small} font-medium ${STYLES.text.secondary}`}>Ingresos</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent className={UTILITY_CLASSES.spacing.card}>
            <div className={`text-lg sm:text-2xl font-bold ${STYLES.text.success}`}>
              {formatCurrency(stats.income)}
            </div>
            <p className={`text-xs ${STYLES.text.tertiary}`}>
              +2.1% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`${UTILITY_CLASSES.text.small} font-medium ${STYLES.text.secondary}`}>Transacciones</CardTitle>
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className={UTILITY_CLASSES.spacing.card}>
            <div className={`text-lg sm:text-2xl font-bold ${STYLES.text.info}`}>
              {stats.transactions}
            </div>
            <p className={`text-xs ${STYLES.text.tertiary}`}>
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITIONS.smooth, delay: 0.4 }}
        >
          <CreditCardsSummary 
            cards={creditCards.filter(card => card.type === 'credit_card')} 
            onCardClick={(cardId) => {
              if (cardId === 'new') {
                // Navegar a configuración > métodos de pago
                window.location.href = `${ROUTES.settings}#payment-methods`
              } else {
                const card = creditCards.find(c => c.id === cardId)
                if (card) {
                  openCreditCardModal(card)
                }
              }
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITIONS.smooth, delay: 0.5 }}
        >
          <UpcomingPayments userId={user?.id || ''} limit={5} />
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-6">
          <CardTitle className={`flex items-center gap-2 ${UTILITY_CLASSES.text.body}`}>
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Transacciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
                    }`}>
                      {transaction.transaction_type === 'income' ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${STYLES.text.primary} ${UTILITY_CLASSES.text.body} truncate`}>
                        {transaction.description}
                      </p>
                      <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.tertiary}`}>
                        {new Date(transaction.transaction_date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${UTILITY_CLASSES.text.body} ${
                    transaction.transaction_type === 'income' ? STYLES.text.success : STYLES.text.error
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className={`${UTILITY_CLASSES.text.body} ${STYLES.text.secondary} mb-2`}>
                No hay transacciones recientes
              </p>
              <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.tertiary}`}>
                Comienza agregando tu primera transacción
              </p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link href={ROUTES.transactions}>
              <Button variant="outline" className="w-full">
                Ver todas las transacciones
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={UTILITY_CLASSES.grid.actions}>
        <Card className={`${STYLES.effects.shadow} ${STYLES.effects.hoverShadow} ${STYLES.transition} cursor-pointer`} onClick={() => open({ type: 'expense', onSuccess: refreshData })}>
          <CardContent className={`${UTILITY_CLASSES.spacing.card} text-center`}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h3 className={`font-medium ${STYLES.text.primary} mb-2 ${UTILITY_CLASSES.text.body}`}>Agregar Gasto</h3>
            <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary}`}>Registra un nuevo gasto rápidamente</p>
          </CardContent>
        </Card>

        <Card className={`${STYLES.effects.shadow} ${STYLES.effects.hoverShadow} ${STYLES.transition} cursor-pointer`} onClick={() => open({ type: 'income', onSuccess: refreshData })}>
          <CardContent className={`${UTILITY_CLASSES.spacing.card} text-center`}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <h3 className={`font-medium ${STYLES.text.primary} mb-2 ${UTILITY_CLASSES.text.body}`}>Registrar Ingreso</h3>
            <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary}`}>Añade un nuevo ingreso a tu cuenta</p>
          </CardContent>
        </Card>

        <Card className={`${STYLES.effects.shadow} ${STYLES.effects.hoverShadow} ${STYLES.transition} cursor-pointer`}>
          <CardContent className={`${UTILITY_CLASSES.spacing.card} text-center`}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <h3 className={`font-medium ${STYLES.text.primary} mb-2 ${UTILITY_CLASSES.text.body}`}>Ver Reportes</h3>
            <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary}`}>Analiza tus patrones de gasto</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
