'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading')

  const checkAuthStatus = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user)
      setAuthStatus(user ? 'authenticated' : 'unauthenticated')
    } catch (err) {
      console.error('Error verificando autenticación:', err)
      setAuthStatus('unauthenticated')
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setAuthStatus('unauthenticated')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return {
    user,
    authStatus,
    checkAuthStatus,
    signOut,
    isLoading: authStatus === 'loading',
    isAuthenticated: authStatus === 'authenticated',
    isUnauthenticated: authStatus === 'unauthenticated'
  }
}
