'use client'

import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[100dvh]">
        {/* Columna izquierda: Branding */}
        <motion.div
          className="relative overflow-hidden flex items-center justify-center p-8 md:p-12 lg:p-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 -z-10 opacity-80">
            <div className="absolute -top-28 -left-28 w-[26rem] h-[26rem] md:w-[30rem] md:h-[30rem] rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 w-[26rem] h-[26rem] md:w-[30rem] md:h-[30rem] rounded-full bg-indigo-400/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.06),transparent_30%)]" />
          </div>
          <div className="max-w-xl text-center">
            <motion.div
              className="mb-8 md:mb-10 flex md:block items-center justify-center md:justify-start"
              initial={{ scale: 0.9, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.2 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-white/10 ring-2 ring-white/40 dark:ring-black/30">
                <Coins className="text-white dark:text-black w-9 h-9 md:w-11 md:h-11 lg:w-14 lg:h-14" strokeWidth={2.2} />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              nndsk Finance
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Tu gestor personal de finanzas
            </motion.p>

            <motion.p
              className="mt-7 text-base md:text-lg text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Administra tus ingresos y gastos, visualiza tendencias y toma decisiones informadas con una interfaz moderna y amigable.
            </motion.p>
          </div>
        </motion.div>

        {/* Columna derecha: Formulario (contenido de la página) */}
        <motion.div
          className="flex items-center justify-center p-6 md:p-8 lg:p-12"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-sm sm:max-w-md">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
