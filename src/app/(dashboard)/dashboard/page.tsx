'use client'

import { Suspense } from 'react'
import { Loading } from '@/components/ui/loading'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useAuth } from '@/hooks/use-auth'

export default function DashboardPage() {
  const { isLoading, isUnauthenticated } = useAuth()

  if (isLoading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (isUnauthenticated) {
    return <Loading message="Redirigiendo al login..." />
  }

  return (
    <Suspense fallback={<Loading message="Cargando dashboard..." />}>
      <DashboardContent />
    </Suspense>
  )
}
