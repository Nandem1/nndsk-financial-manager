'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Loading } from '@/components/ui/loading'
import { AuthError } from '@/components/ui/auth-error'
import { STYLES, UTILITY_CLASSES } from '@/lib/constants/styles'
import { useAuth } from '@/hooks/use-auth'
import { useTransactions } from '@/hooks/use-transactions'
import type { CreateTransactionDTO, TransactionWithRelations } from '@/types'
import { useFormData } from '@/hooks/use-form-data'
import { formatCurrency } from '@/utils/format'

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false)
  const { user, isLoading, isUnauthenticated } = useAuth()
  const {
    createTransaction,
    getTransactionsPaginated,
    loading: transactionLoading,
    error,
  } = useTransactions()

  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<TransactionWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const { categories } = useFormData()
  const [categoryId, setCategoryId] = useState<string>('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Debounce para búsqueda
  useEffect(() => {
    const h = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(h)
  }, [searchInput])

  const loadPage = useCallback(async (p: number) => {
    const res = await getTransactionsPaginated(p, PAGE_SIZE, {
      category_id: categoryId || undefined,
      search: search || undefined,
    })
    if (res?.success && res.data) {
      setItems(res.data.items)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
      setPage(res.data.page)
    }
  }, [getTransactionsPaginated, categoryId, search])

  useEffect(() => {
    // cargar página actual cuando cambia page o la función de carga
    void loadPage(page)
  }, [page, loadPage])

  // Refrescar cuando cambian los filtros (aunque la página ya sea 1)
  useEffect(() => {
    // Forzar recarga a la página 1 con los filtros actuales
    void loadPage(1)
    if (page !== 1) setPage(1)
  }, [categoryId, search, loadPage, page])

  const handleCreateTransaction = async (data: CreateTransactionDTO) => {
    const result = await createTransaction(data)
    if (result.success) {
      setShowForm(false)
      // Volver a página 1 para ver la transacción más reciente
      await loadPage(1)
      setPage(1)
    }
  }

  if (isLoading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (isUnauthenticated) {
    return <AuthError />
  }

  return (
    <motion.div 
      className={UTILITY_CLASSES.spacing.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h1 className={`text-2xl font-bold ${STYLES.text.primary}`}>
            Transacciones
          </h1>
          <p className={`${STYLES.text.secondary}`}>
            Gestiona tus gastos e ingresos
          </p>
          {user && (
            <p className={`text-sm ${STYLES.text.tertiary} mt-1`}>
              Usuario: {user.email}
            </p>
          )}
        </div>
        <motion.div
          className="sm:self-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            className={`${STYLES.button.primary} w-full sm:w-auto`}
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </Button>
        </motion.div>
      </motion.div>

      {/* Formulario Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <TransactionForm
              onSubmit={handleCreateTransaction}
              onCancel={() => setShowForm(false)}
              loading={transactionLoading}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Manejo de Errores */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className={`text-sm ${STYLES.text.error}`}>
            Error: {error}
          </p>
        </motion.div>
      )}

      {/* Contenido Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Barra de filtros - Mobile first */}
        <Card className={`${STYLES.background.primary} ${STYLES.border.primary} mb-4`}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="col-span-1">
                <label className={`mb-1 block text-sm ${STYLES.text.secondary}`}>Buscar</label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Descripción o notas"
                  className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                />
              </div>
              <div className="col-span-1">
                <label className={`mb-1 block text-sm ${STYLES.text.secondary}`}>Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 flex items-end gap-2 md:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryId('')
                    setSearchInput('')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
          <CardHeader>
            <CardTitle className={STYLES.text.primary}>
              Lista de Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactionLoading && (
              <div className="py-6">
                <Loading message="Cargando transacciones..." />
              </div>
            )}

            {!transactionLoading && items.length === 0 && (
              <div className={`text-center py-8 ${STYLES.text.secondary}`}>
                <p>
                  Aún no hay transacciones.
                  <br />
                  Haz clic en &quot;Nueva Transacción&quot; para comenzar.
                </p>
              </div>
            )}

            {!transactionLoading && items.length > 0 && (
              <div className="space-y-3">
                {items.map((t) => {
                  const isExpense = t.transaction_type === 'expense'
                  const amountText = `${isExpense ? '-' : '+'}${formatCurrency(Math.abs(t.amount))}`
                  const amountClass = isExpense ? 'text-red-500' : 'text-green-500'
                  const date = new Date(t.transaction_date).toLocaleDateString()
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between rounded-md border px-3 py-2 ${STYLES.border.secondary} ${STYLES.background.secondary}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground min-w-[80px]">{date}</div>
                        <div>
                          <div className={`text-sm ${STYLES.text.primary}`}>{t.description}</div>
                          <div className={`text-xs ${STYLES.text.tertiary}`}>
                            {t.category?.name} • {t.payment_method?.name}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${amountClass}`}>{amountText}</div>
                    </div>
                  )
                })}

                {/* Controles de paginación */}
                <div className="mt-4 flex items-center justify-between">
                  <div className={`text-xs ${STYLES.text.tertiary}`}>
                    Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
                    {Math.min(page * PAGE_SIZE, total)} de {total}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || transactionLoading}
                    >
                      Anterior
                    </Button>
                    <div className={`text-sm ${STYLES.text.secondary}`}>
                      Página {page} de {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || transactionLoading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
