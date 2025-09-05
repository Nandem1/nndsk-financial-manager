'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NAVIGATION_ITEMS } from '@/lib/constants/app'
import { STYLES } from '@/lib/constants/styles'
import { ANIMATIONS, TRANSITIONS } from '@/lib/constants/animations'
import { motion } from 'framer-motion'
import { useTransactionModal } from '@/contexts/transaction-modal-context'
import { useDashboard } from '@/hooks/use-dashboard'
import { formatCurrency } from '@/utils/format'

// Mapeo de iconos por nombre
const iconMap = {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
}

const navigation = NAVIGATION_ITEMS.map(item => ({
  ...item,
  icon: iconMap[item.icon as keyof typeof iconMap]
}))

export function Sidebar() {
  const pathname = usePathname()
  const { open } = useTransactionModal()
  const { stats, loading, refreshData } = useDashboard()

  return (
    <motion.div 
      className={`w-full lg:w-64 ${STYLES.background.primary} ${STYLES.effects.backdrop} border-b lg:border-r lg:border-b-0 ${STYLES.border.primary} min-h-0 lg:min-h-screen ${STYLES.transition}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...TRANSITIONS.smooth, delay: 0.1 }}
    >
      <motion.div 
        className="p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...TRANSITIONS.smooth, delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className={`w-full ${STYLES.button.primary}`}
            size="sm"
            onClick={() => open({ type: 'expense', onSuccess: () => { refreshData() } })}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nuevo Gasto</span>
            <span className="sm:hidden">+ Gasto</span>
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.nav 
        className="px-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...TRANSITIONS.smooth, delay: 0.3 }}
      >
        <motion.ul 
          className="flex lg:flex-col lg:space-y-1 space-x-2 lg:space-x-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
          variants={ANIMATIONS.list.container}
          initial="initial"
          animate="animate"
        >
          {navigation.map((item, index) => (
            <motion.li 
              key={item.name} 
              className="flex-shrink-0 lg:flex-shrink"
              variants={ANIMATIONS.list.item}
              custom={index}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITIONS.fast}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 lg:gap-3 rounded-lg px-3 py-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap',
                    pathname === item.href
                      ? `${STYLES.background.tertiary} ${STYLES.text.primary}`
                      : `${STYLES.text.secondary} ${STYLES.hover.primary} ${STYLES.hover.text}`
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.name.split(' ')[0]}</span>
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>

      {/* Quick Stats - Solo visible en desktop */}
      <motion.div 
        className="hidden lg:block mt-8 px-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...TRANSITIONS.smooth, delay: 0.4 }}
      >
        <motion.div 
          className={`${STYLES.background.secondary} rounded-lg p-4 space-y-3`}
          whileHover={{ scale: 1.02 }}
          transition={TRANSITIONS.fast}
        >
          <h3 className={`text-sm font-medium ${STYLES.text.primary}`}>Resumen Rápido</h3>
          <div className="space-y-2">
            <motion.div 
              className="flex items-center justify-between text-sm"
              whileHover={{ x: 5 }}
              transition={TRANSITIONS.fast}
            >
              <span className={STYLES.text.secondary}>Gastos del mes</span>
              <span className={`font-medium ${STYLES.text.error}`}>
                {loading ? '—' : formatCurrency(stats.expenses)}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between text-sm"
              whileHover={{ x: 5 }}
              transition={TRANSITIONS.fast}
            >
              <span className={STYLES.text.secondary}>Ingresos del mes</span>
              <span className={`font-medium ${STYLES.text.success}`}>
                {loading ? '—' : formatCurrency(stats.income)}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
