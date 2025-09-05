'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Plus } from 'lucide-react'
import { PaymentMethod } from '@/types'
import { STYLES } from '@/lib/constants/styles'
import { formatCurrency } from '@/utils/format'

interface CreditCardsSummaryProps {
  cards: PaymentMethod[];
  onCardClick?: (cardId: string) => void;
}

export function CreditCardsSummary({ cards, onCardClick }: CreditCardsSummaryProps) {
  if (cards.length === 0) {
    return (
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
            <CreditCard className="h-5 w-5" />
            Tarjetas de Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${STYLES.text.tertiary} mb-4`}>No tienes tarjetas de crédito registradas.</p>
          <Button 
            className={`${STYLES.button.primary}`} 
            onClick={() => onCardClick?.('new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Tarjeta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
          <CreditCard className="h-5 w-5" />
          Tarjetas de Crédito
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${STYLES.button.outline}`}
          onClick={() => onCardClick?.('new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className={`flex items-center justify-between p-4 rounded-lg ${STYLES.border.primary} cursor-pointer hover:${STYLES.background.secondary} transition-colors`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div>
              <h4 className={`font-medium ${STYLES.text.primary}`}>{card.name}</h4>
              <p className={`text-sm ${STYLES.text.tertiary}`}>
                **** {card.last_four_digits}
              </p>
            </div>
            <div className="text-right">
              <div className={`font-medium ${STYLES.text.primary}`}>
                {formatCurrency(card.available_credit || 0)} / {formatCurrency(card.credit_limit || 0)}
              </div>
              <div className={`w-full ${STYLES.background.secondary} rounded-full h-2 mt-1`}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{
                    width: `${Math.min((1 - ((card.available_credit || 0) / (card.credit_limit || 1))) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
