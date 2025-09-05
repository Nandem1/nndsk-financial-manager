'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Palette, Shield } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'
import { PaymentMethodsSection } from '@/components/settings/payment-methods-section'
import { useState, useEffect, useCallback } from 'react'

export default function SettingsPage() {
  const { user, isLoading, isUnauthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false)
  const [isFirstTimeOpening, setIsFirstTimeOpening] = useState(true)

  // Función helper para hacer scroll suave después de que el contenido esté cargado
  const scrollToSection = useCallback((elementId: string, delay: number = 400) => {
    const performScroll = () => {
      const element = document.getElementById(elementId)
      if (element) {
        // Verificar que el elemento esté completamente renderizado
        const checkAndScroll = () => {
          if (element.offsetHeight > 0 && element.offsetWidth > 0) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          } else {
            // Si aún no está renderizado, esperar un poco más
            setTimeout(checkAndScroll, 50)
          }
        }
        checkAndScroll()
      }
    }

    // Si es la primera vez abriendo, esperar más tiempo para que el componente se monte
    if (isFirstTimeOpening) {
      setTimeout(() => {
        // Después del delay inicial, verificar si hay loading
        if (isPaymentMethodsLoading) {
          const checkLoading = () => {
            if (!isPaymentMethodsLoading) {
              setTimeout(performScroll, 100) // Pequeño delay adicional después del loading
            } else {
              setTimeout(checkLoading, 100) // Revisar cada 100ms
            }
          }
          checkLoading()
        } else {
          performScroll()
        }
      }, delay)
    } else if (isPaymentMethodsLoading) {
      // Si hay loading activo, esperar a que termine
      const checkLoading = () => {
        if (!isPaymentMethodsLoading) {
          setTimeout(performScroll, 100) // Pequeño delay adicional después del loading
        } else {
          setTimeout(checkLoading, 100) // Revisar cada 100ms
        }
      }
      setTimeout(checkLoading, delay)
    } else {
      setTimeout(performScroll, delay)
    }
  }, [isPaymentMethodsLoading, isFirstTimeOpening])

  const settingsCards = [
    {
      id: 'profile',
      icon: User,
      title: 'Perfil de Usuario',
      description: 'Actualiza tu información personal',
      buttonText: 'Editar Perfil'
    },
    {
      id: 'payment-methods',
      icon: CreditCard,
      title: 'Métodos de Pago',
      description: 'Gestiona tus métodos de pago y tarjetas de crédito',
      buttonText: 'Gestionar'
    },
    {
      id: 'appearance',
      icon: Palette,
      title: 'Apariencia',
      description: 'Personaliza el tema y colores',
      buttonText: 'Configurar'
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacidad',
      description: 'Configuración de privacidad y seguridad',
      buttonText: 'Configurar'
    }
  ]

  const handleCardClick = (cardId: string) => {
    if (cardId === 'payment-methods') {
      const newSection = activeSection === 'payment-methods' ? null : 'payment-methods'
      setActiveSection(newSection)
      
      // Si se está abriendo la sección, hacer scroll suave después de que cargue
      if (newSection === 'payment-methods') {
        // Cuando se abre por primera vez, esperar más tiempo para que el componente se monte
        // y empiece el loading
        scrollToSection('payment-methods-section', 600)
        // Marcar que ya no es la primera vez
        setIsFirstTimeOpening(false)
      }
    } else {
      // TODO: Implementar otras secciones
      console.log(`Abrir sección: ${cardId}`)
    }
  }

  // Verificar si hay hash en la URL para abrir automáticamente la sección
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'payment-methods') {
        setActiveSection('payment-methods')
        // Scroll automático cuando se navega desde el dashboard
        // Esperar más tiempo para que la página se cargue completamente
        scrollToSection('payment-methods-section', 600)
        // Marcar que ya no es la primera vez
        setIsFirstTimeOpening(false)
      }
    }
  }, [scrollToSection])

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
                  className={`${STYLES.button.secondary} hover:${STYLES.hover.background} ${
                    activeSection === card.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {activeSection === card.id ? 'Cerrar' : card.buttonText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Sección de Métodos de Pago */}
      {activeSection === 'payment-methods' && (
        <motion.div
          id="payment-methods-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h2 className={`text-lg font-semibold ${STYLES.text.primary}`}>
              Métodos de Pago
            </h2>
          </div>
          <PaymentMethodsSection onLoadingChange={setIsPaymentMethodsLoading} />
        </motion.div>
      )}
    </motion.div>
  )
}
