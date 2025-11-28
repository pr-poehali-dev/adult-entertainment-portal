import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Transaction } from '@/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'deposit': return 'ArrowDownToLine';
    case 'withdraw': return 'ArrowUpFromLine';
    case 'booking_payment': return 'ShoppingCart';
    case 'booking_received': return 'DollarSign';
    case 'vip_payment': return 'Crown';
    case 'tip_sent': return 'Gift';
    case 'tip_received': return 'Gift';
    default: return 'ArrowRightLeft';
  }
};

const getTransactionColor = (type: Transaction['type']) => {
  if (type === 'deposit' || type === 'booking_received' || type === 'tip_received') {
    return 'text-green-600 bg-green-500/10';
  }
  return 'text-red-600 bg-red-500/10';
};

const getStatusBadge = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500">Завершено</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">В обработке</Badge>;
    case 'failed':
      return <Badge className="bg-red-500">Ошибка</Badge>;
    case 'cancelled':
      return <Badge variant="outline">Отменено</Badge>;
  }
};

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Receipt" size={24} />
          История операций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                  <Icon name={getTransactionIcon(transaction.type)} size={20} />
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleString('ru-RU')}
                    </p>
                    {transaction.fromUser && (
                      <span className="text-xs text-muted-foreground">
                        от {transaction.fromUser}
                      </span>
                    )}
                    {transaction.toUser && (
                      <span className="text-xs text-muted-foreground">
                        для {transaction.toUser}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'deposit' || transaction.type === 'booking_received' || transaction.type === 'tip_received'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'booking_received' || transaction.type === 'tip_received' ? '+' : '-'}
                    {transaction.amount.toLocaleString('ru-RU')} {transaction.currency}
                  </p>
                  {transaction.fee && (
                    <p className="text-xs text-muted-foreground">
                      Комиссия: {transaction.fee} ₽
                    </p>
                  )}
                </div>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
