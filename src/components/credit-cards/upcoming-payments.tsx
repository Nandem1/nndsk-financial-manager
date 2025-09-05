'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CreditCard } from 'lucide-react'
import { STYLES } from '@/lib/constants/styles'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { UpcomingPayment } from '@/types'
import { TransactionService } from '@/lib/services/transaction-service'

interface UpcomingPaymentsProps {
  userId: string;
  limit?: number;
}

export function UpcomingPayments({ userId, limit = 5 }: UpcomingPaymentsProps) {
  const [payments, setPayments] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const paymentsData = await TransactionService.getUpcomingPayments(limit);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error loading upcoming payments:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [userId, limit]);

  if (loading) {
    return (
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
            <Calendar className="h-5 w-5" />
            Próximos Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${STYLES.text.tertiary}`}>Cargando próximos pagos...</div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
            <Calendar className="h-5 w-5" />
            Próximos Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${STYLES.text.tertiary}`}>No hay pagos próximos</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${STYLES.background.primary} ${STYLES.border.primary}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${STYLES.text.primary}`}>
          <Calendar className="h-5 w-5" />
          Próximos Pagos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.map((payment) => (
          <div 
            key={payment.id} 
            className={`flex items-center justify-between p-3 ${STYLES.border.primary} rounded-lg hover:${STYLES.background.secondary} transition-colors`}
          >
            <div>
              <div className={`font-medium ${STYLES.text.primary}`}>{payment.description}</div>
              <div className={`text-sm ${STYLES.text.tertiary} flex items-center gap-1`}>
                <CreditCard className="h-3 w-3" />
                {payment.payment_methods.name} (****{payment.payment_methods.last_four_digits})
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${STYLES.text.primary}`}>
                {formatCurrency(payment.amount)}
              </div>
              <div className={`text-sm ${STYLES.text.tertiary}`}>
                Vence {format(new Date(payment.due_date), 'dd MMM', { locale: es })}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
