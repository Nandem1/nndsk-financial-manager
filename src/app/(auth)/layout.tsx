'use client'

import { motion } from 'framer-motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div 
      className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header simplificado */}
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center justify-center mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-12 h-12 sm:w-16 sm:h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white dark:text-black text-xl sm:text-2xl font-bold">$</span>
          </motion.div>
        </motion.div>
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          nndsk Finance
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Tu gestor personal de finanzas
        </motion.p>
      </motion.div>
      
      {/* Formulario */}
      <motion.div 
        className="w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
