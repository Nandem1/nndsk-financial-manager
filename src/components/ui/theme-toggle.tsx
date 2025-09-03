'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export function ThemeToggle({ 
  className, 
  variant = 'ghost', 
  size = 'sm' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // Efecto para hidratación del lado del cliente
  useEffect(() => {
    setMounted(true)
    // Obtener tema del localStorage o usar light por defecto
    const savedTheme = localStorage.getItem('expense-tracker-theme') as 'light' | 'dark'
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    }
  }, [])

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('expense-tracker-theme', newTheme)
    
    // Aplicar tema al DOM
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
  }

  // Evitar hidratación incorrecta
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(
          'transition-all duration-200',
          className
        )}
        disabled
      >
        <Moon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleTheme}
      className={cn(
        'transition-all duration-200 hover:scale-105',
        className
      )}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
