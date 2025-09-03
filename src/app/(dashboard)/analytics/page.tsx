'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'

export default function AnalyticsPage() {
  const { user, isLoading, isUnauthenticated } = useAuth()

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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className={`text-2xl font-bold ${STYLES.text.primary}`}>
          Análisis
        </h1>
        <p className={`${STYLES.text.secondary}`}>
          Visualiza tus patrones de gasto
        </p>
        {user && (
          <p className={`text-sm ${STYLES.text.tertiary} mt-1`}>
            Usuario: {user.email}
          </p>
        )}
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
            <CardHeader>
              <CardTitle className={STYLES.text.primary}>
                Gastos por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-center py-8 ${STYLES.text.secondary}`}>
                <p>
                  Gráfico de gastos por categoría
                  <br />
                  Funcionalidad en desarrollo...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
            <CardHeader>
              <CardTitle className={STYLES.text.primary}>
                Tendencia Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-center py-8 ${STYLES.text.secondary}`}>
                <p>
                  Gráfico de tendencia mensual
                  <br />
                  Funcionalidad en desarrollo...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
