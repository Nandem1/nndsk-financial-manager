'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard } from 'lucide-react'
import { STYLES } from '@/lib/constants/styles'

interface InstallmentSelectorProps {
  value: number;
  onChange: (value: number) => void;
  maxInstallments?: number;
  cardId?: string;
  disabled?: boolean;
}

export function InstallmentSelector({ 
  value, 
  onChange, 
  maxInstallments = 36,
  cardId,
  disabled = false
}: InstallmentSelectorProps) {
  const [interestRates, setInterestRates] = useState<Record<number, number>>({});
  
  // Cargar tasas de interés según la tarjeta (simulado)
  useEffect(() => {
    if (cardId) {
      // En una implementación real, esto vendría de la base de datos
      const mockRates: Record<number, number> = {
        1: 0,
        3: 0,
        6: 2.5,
        12: 3.5,
        18: 4.5,
        24: 5.5,
        36: 6.5
      };
      setInterestRates(mockRates);
    }
  }, [cardId]);

  return (
    <div className="space-y-2">
      <Label className={`text-sm font-medium ${STYLES.text.secondary}`}>
        Número de Cuotas
      </Label>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(Number(val))}
        disabled={disabled}
      >
        <SelectTrigger className={`h-11 ${STYLES.border.primary} focus:${STYLES.border.focus} focus:ring-2 focus:ring-blue-500`}>
          <SelectValue placeholder="Selecciona el número de cuotas" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: maxInstallments }, (_, i) => {
            const installments = i + 1;
            const interest = interestRates[installments] || 0;
            return (
              <SelectItem 
                key={installments} 
                value={installments.toString()}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {installments} {installments > 1 ? 'cuotas' : 'cuota'}
                    {interest > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({interest}% interés)
                      </span>
                    )}
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
