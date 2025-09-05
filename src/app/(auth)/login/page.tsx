import { LoginForm } from '@/components/auth/login-form'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { PiggyBank } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className={UTILITY_CLASSES.spacing.section}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-6">
          <PiggyBank className="w-16 h-16 sm:w-20 sm:h-20 text-gray-900 dark:text-white" strokeWidth={1.8} />
        </div>
        <h1 className={`text-2xl font-semibold ${STYLES.text.primary}`}>
          Bienvenido de vuelta
        </h1>
        <p className={`text-sm ${STYLES.text.secondary}`}>
          Inicia sesión en tu cuenta para continuar
        </p>
      </div>

      {/* Form */}
      <LoginForm />

      {/* Footer */}
      <div className="text-center">
        <p className={`text-xs ${STYLES.text.tertiary}`}>
          Al continuar, aceptas nuestros{' '}
          <a href="#" className={`${STYLES.text.secondary} hover:${STYLES.hover.text} underline`}>
            términos de servicio
          </a>
        </p>
      </div>
    </div>
  )
}
