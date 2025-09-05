import { SignupForm } from '@/components/auth/signup-form'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { Wallet } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className={UTILITY_CLASSES.spacing.section}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-6">
          <Wallet className="w-16 h-16 sm:w-20 sm:h-20 text-gray-900 dark:text-white" strokeWidth={1.8} />
        </div>
        <h1 className={`text-2xl font-semibold ${STYLES.text.primary}`}>
          Crear cuenta
        </h1>
        <p className={`text-sm ${STYLES.text.secondary}`}>
          Comienza a rastrear tus gastos de manera inteligente
        </p>
      </div>

      {/* Form */}
      <SignupForm />

      {/* Footer */}
      <div className="text-center">
        <p className={`text-xs ${STYLES.text.tertiary}`}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className={`${STYLES.text.secondary} hover:${STYLES.hover.text} underline`}>
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
