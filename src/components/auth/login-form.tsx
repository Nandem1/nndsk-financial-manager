'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { STYLES } from '@/lib/constants/styles'
import { loginSchema, LoginFormData } from '@/lib/constants/schemas'
import { useFormHandler } from '@/hooks/use-form-handler'

export function LoginForm() {
  const router = useRouter()
  
  const {
    form,
    loading,
    error,
    showPassword,
    handleSubmit,
    togglePasswordVisibility
  } = useFormHandler<LoginFormData>(loginSchema)

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw error
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleFormSubmit = form.handleSubmit((data) => {
    handleSubmit(() => onSubmit(data as unknown as LoginFormData))
  })

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
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
