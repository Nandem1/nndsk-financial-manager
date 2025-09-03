'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Palette, Shield } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const { user, isLoading, isUnauthenticated } = useAuth()

  const settingsCards = [
    {
      icon: User,
      title: 'Perfil de Usuario',
      description: 'Actualiza tu información personal',
      buttonText: 'Editar Perfil'
    },
    {
      icon: CreditCard,
      title: 'Métodos de Pago',
      description: 'Gestiona tus métodos de pago',
      buttonText: 'Gestionar'
    },
    {
      icon: Palette,
      title: 'Apariencia',
      description: 'Personaliza el tema y colores',
      buttonText: 'Configurar'
    },
    {
      icon: Shield,
      title: 'Privacidad',
      description: 'Configuración de privacidad y seguridad',
      buttonText: 'Configurar'
    }
  ]

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
          Configuración
        </h1>
        <p className={`${STYLES.text.secondary}`}>
          Personaliza tu experiencia
        </p>
        {user && (
          <p className={`text-sm ${STYLES.text.tertiary} mt-1`}>
            Usuario: {user.email}
          </p>
        )}
      </motion.div>

      {/* Settings Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {settingsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
              <CardHeader className="flex flex-row items-center gap-3">
                <card.icon className={`h-5 w-5 ${STYLES.text.secondary}`} />
                <CardTitle className={STYLES.text.primary}>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`mb-4 ${STYLES.text.secondary}`}>
                  {card.description}
                </p>
                <Button 
                  variant="outline" 
                  className={`${STYLES.button.secondary} hover:${STYLES.hover.background}`}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
