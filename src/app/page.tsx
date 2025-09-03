import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Si no está autenticado, redirigir al login
  redirect('/login')
}
