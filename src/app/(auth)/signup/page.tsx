import { SignupForm } from '@/components/auth/signup-form'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'

export default function SignupPage() {
  return (
    <div className={UTILITY_CLASSES.spacing.section}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-black text-lg font-bold">$</span>
          </div>
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
