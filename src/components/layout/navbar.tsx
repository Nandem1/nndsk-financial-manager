'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogOut, User, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { motion } from 'framer-motion'
import { STYLES } from '@/lib/constants/styles'
import { TRANSITIONS } from '@/lib/constants/animations'

export function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <motion.nav 
      className={`${STYLES.background.primary} ${STYLES.effects.backdrop} ${STYLES.border.primary} px-4 sm:px-6 py-3 ${STYLES.transition}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={TRANSITIONS.smooth}
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={TRANSITIONS.fast}
        >
          <motion.div 
            className="w-6 h-6 sm:w-8 sm:h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={TRANSITIONS.fast}
          >
            <span className="text-white dark:text-black text-sm sm:text-lg font-bold">$</span>
          </motion.div>
          <motion.span 
            className={`ml-2 text-lg sm:text-xl font-semibold ${STYLES.text.primary}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TRANSITIONS.smooth, delay: 0.1 }}
          >
            ExpenseTracker
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 sm:gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...TRANSITIONS.smooth, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ThemeToggle 
              variant="ghost" 
              size="sm" 
              className={STYLES.button.ghost}
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className={`${STYLES.button.ghost} p-1.5 sm:p-2`}>
              <Bell className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300"
            whileHover={{ scale: 1.02 }}
          >
            <User className="h-4 w-4" />
            <span className="truncate max-w-24">{user?.user_metadata?.name || 'Usuario'}</span>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className={`text-xs sm:text-sm ${STYLES.button.outline}`}
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className={STYLES.text.secondary}>
                <span className="hidden sm:inline">Salir</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
