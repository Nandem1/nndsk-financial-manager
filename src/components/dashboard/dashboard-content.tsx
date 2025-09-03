'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { ANIMATIONS, TRANSITIONS } from '@/lib/constants/animations'
import { motion } from 'framer-motion'

export function DashboardContent() {
  // Datos de ejemplo - después se conectarán con Supabase
  const stats = {
    balance: 1250.50,
    expenses: 850.30,
    income: 2100.80,
    transactions: 24
  }

  const recentTransactions = [
    { id: 1, description: 'Almuerzo en restaurant', amount: 25.50, type: 'expense', date: '2024-01-15' },
    { id: 2, description: 'Salario', amount: 2500.00, type: 'income', date: '2024-01-14' },
    { id: 3, description: 'Gasolina', amount: 45.00, type: 'expense', date: '2024-01-13' },
    { id: 4, description: 'Supermercado', amount: 120.75, type: 'expense', date: '2024-01-12' },
  ]

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
            Dashboard
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={TRANSITIONS.fast}
        >
          <Button className={`${STYLES.button.primary} w-full sm:w-auto`}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nueva Transacción</span>
            <span className="sm:hidden">+ Transacción</span>
          </Button>
        </motion.div>
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
              ${stats.balance.toLocaleString()}
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
              ${stats.expenses.toLocaleString()}
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
              ${stats.income.toLocaleString()}
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-6">
          <CardTitle className={`flex items-center gap-2 ${UTILITY_CLASSES.text.body}`}>
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Transacciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${STYLES.text.primary} ${UTILITY_CLASSES.text.body} truncate`}>{transaction.description}</p>
                    <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.tertiary}`}>{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-semibold ${UTILITY_CLASSES.text.body} ${
                  transaction.type === 'income' ? STYLES.text.success : STYLES.text.error
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full">
              Ver todas las transacciones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={UTILITY_CLASSES.grid.actions}>
        <Card className={`${STYLES.effects.shadow} ${STYLES.effects.hoverShadow} ${STYLES.transition} cursor-pointer`}>
          <CardContent className={`${UTILITY_CLASSES.spacing.card} text-center`}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h3 className={`font-medium ${STYLES.text.primary} mb-2 ${UTILITY_CLASSES.text.body}`}>Agregar Gasto</h3>
            <p className={`${UTILITY_CLASSES.text.small} ${STYLES.text.secondary}`}>Registra un nuevo gasto rápidamente</p>
          </CardContent>
        </Card>

        <Card className={`${STYLES.effects.shadow} ${STYLES.effects.hoverShadow} ${STYLES.transition} cursor-pointer`}>
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
