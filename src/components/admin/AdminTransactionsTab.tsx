import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: number;
  user: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'commission' | 'vip' | 'platform_fee';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface AdminTransactionsTabProps {
  transactions: Transaction[];
}

export const AdminTransactionsTab = ({ transactions }: AdminTransactionsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История транзакций</CardTitle>
        <CardDescription>Все финансовые операции платформы</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{tx.user}</h3>
                  <Badge variant={
                    tx.type === 'deposit' ? 'default' :
                    tx.type === 'withdrawal' ? 'secondary' :
                    tx.type === 'payment' ? 'outline' :
                    'destructive'
                  }>
                    {tx.type === 'deposit' ? 'Пополнение' :
                     tx.type === 'withdrawal' ? 'Вывод' :
                     tx.type === 'payment' ? 'Оплата' :
                     'Комиссия'}
                  </Badge>
                  <Badge variant={
                    tx.status === 'completed' ? 'default' :
                    tx.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {tx.status === 'completed' ? 'Завершена' :
                     tx.status === 'pending' ? 'В обработке' :
                     'Ошибка'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{tx.date}</span>
                  <span className="font-semibold text-foreground">{tx.amount} {tx.currency}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="FileText" size={16} className="mr-2" />
                Детали
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
