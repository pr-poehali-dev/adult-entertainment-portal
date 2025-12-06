import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Transaction } from '@/types';

interface AgencyDashboardTransactionsProps {
  transactions: Transaction[];
}

export const AgencyDashboardTransactions = ({
  transactions,
}: AgencyDashboardTransactionsProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'booking_received':
        return 'ArrowDownLeft';
      case 'vip_payment':
        return 'Crown';
      case 'referral_commission':
        return 'Users';
      default:
        return 'Receipt';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'booking_received':
      case 'referral_commission':
        return 'text-green-600';
      case 'vip_payment':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Icon name="Receipt" size={20} className="text-primary" />
          История транзакций
        </h3>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Receipt" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет транзакций</h3>
          <p className="text-muted-foreground">
            История финансовых операций появится здесь
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                  <Icon name={getTransactionIcon(transaction.type)} size={20} />
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === 'booking_received' || transaction.type === 'referral_commission'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'booking_received' || transaction.type === 'referral_commission' ? '+' : '-'}
                  {transaction.amount.toLocaleString()} {transaction.currency === 'RUB' ? '₽' : transaction.currency}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {transaction.status === 'completed' ? 'Завершено' : transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
