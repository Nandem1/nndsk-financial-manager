import { Button } from '@/components/ui/button'
import { STYLES } from '@/lib/constants/styles'

interface AuthErrorProps {
  message?: string
  buttonText?: string
  onRetry?: () => void
}

export function AuthError({ 
  message = 'Necesitas estar autenticado para acceder a esta página',
  buttonText = 'Ir al Login',
  onRetry
}: AuthErrorProps) {
  const handleAction = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className={`text-lg ${STYLES.text.error} mb-4`}>
          {message}
        </p>
        <Button 
          onClick={handleAction} 
          className={STYLES.button.primary}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
