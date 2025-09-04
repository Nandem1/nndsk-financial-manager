'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { STYLES } from '@/lib/constants/styles'
import { signupSchema, SignupFormData } from '@/lib/constants/schemas'
import { useFormHandler } from '@/hooks/use-form-handler'

export function SignupForm() {
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    form,
    loading,
    error,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility
  } = useFormHandler<SignupFormData>(signupSchema)

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (error) {
      throw error
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  const handleFormSubmit = form.handleSubmit((data) => {
    handleSubmit(() => onSubmit(data as unknown as SignupFormData))
  })

  if (success) {
    return (
      <div className={`text-center space-y-4 p-6`}>
        <CheckCircle className={`w-16 h-16 ${STYLES.text.success} mx-auto`} />
        <h3 className={`text-lg font-medium ${STYLES.text.primary}`}>¡Cuenta creada exitosamente!</h3>
        <p className={STYLES.text.secondary}>
          Te hemos enviado un email de confirmación. 
          Serás redirigido al login en unos segundos...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Nombre completo
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Tu nombre completo"
          className={`h-10 sm:h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.name.message}</p>
        )}
      </div>

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
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.email.message}</p>
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
            {...form.register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${STYLES.text.tertiary} hover:${STYLES.hover.text}`}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={`text-sm font-medium ${STYLES.text.secondary}`}>
          Confirmar contraseña
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`h-10 sm:h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500 pr-10`}
            {...form.register('confirmPassword')}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${STYLES.text.tertiary} hover:${STYLES.hover.text}`}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className={`text-sm ${STYLES.text.error}`}>{form.formState.errors.confirmPassword.message}</p>
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
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </Button>

      {/* Links */}
      <div className="text-center space-y-2">
        <a
          href="/login"
          className={`text-sm ${STYLES.text.secondary} hover:${STYLES.hover.text} underline`}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </div>
    </form>
  )
}
