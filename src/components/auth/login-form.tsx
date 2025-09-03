'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { VALIDATION_CONFIG, ERROR_MESSAGES } from '@/lib/constants/validation'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'

const loginSchema = z.object({
  email: z.string()
    .min(VALIDATION_CONFIG.email.minLength, ERROR_MESSAGES.required)
    .max(VALIDATION_CONFIG.email.maxLength, ERROR_MESSAGES.required)
    .email(ERROR_MESSAGES.invalidEmail),
  password: z.string()
    .min(VALIDATION_CONFIG.password.minLength, ERROR_MESSAGES.passwordTooShort)
    .max(VALIDATION_CONFIG.password.maxLength, ERROR_MESSAGES.passwordTooLong),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          className={`h-10 sm:h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
          {...register('email')}
        />
        {errors.email && (
          <p className={`text-sm ${STYLES.text.error}`}>{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`h-10 sm:h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500 pr-10`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${STYLES.text.tertiary} hover:${STYLES.hover.text}`}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className={`text-sm ${STYLES.text.error}`}>{errors.password.message}</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className={`p-3 ${STYLES.background.secondary} ${STYLES.border.primary} rounded-lg`}>
          <p className={`text-sm ${STYLES.text.error}`}>{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className={`w-full h-10 sm:h-11 ${STYLES.button.primary}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>

      {/* Links */}
      <div className="text-center space-y-2">
        <a
          href="/signup"
          className={`text-sm ${STYLES.text.secondary} hover:${STYLES.hover.text} underline`}
        >
          ¿No tienes cuenta? Regístrate
        </a>
      </div>
    </form>
  )
}
