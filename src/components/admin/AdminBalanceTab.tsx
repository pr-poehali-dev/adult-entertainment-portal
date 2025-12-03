import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PlatformBalance {
  currency: 'RUB' | 'USD' | 'TON' | 'USDT';
  balance: number;
  symbol: string;
  icon: string;
  color: string;
}

interface BalanceTransaction {
  id: number;
  type: 'vip_purchase' | 'commission' | 'withdrawal';
  amount: number;
  currency: string;
  user: string;
  date: string;
  description: string;
}

interface AdminBalanceTabProps {
  platformBalances: PlatformBalance[];
  balanceTransactions: BalanceTransaction[];
}

export const AdminBalanceTab = ({ platformBalances, balanceTransactions }: AdminBalanceTabProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {platformBalances.map((balance) => (
          <Card key={balance.currency} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${balance.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon name={balance.icon as any} size={24} className={`text-${balance.color}-600`} />
                </div>
                <Badge variant="outline">{balance.currency}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Баланс площадки</p>
              <p className="text-3xl font-bold">
                {balance.balance.toLocaleString()} {balance.symbol}
              </p>
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="ArrowUpRight" size={14} className="mr-1" />
                  Вывести
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Eye" size={14} className="mr-1" />
                  История
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История поступлений</CardTitle>
          <CardDescription>Все поступления от пользователей и комиссии площадки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {balanceTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'vip_purchase' ? 'bg-purple-100' :
                    tx.type === 'commission' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <Icon 
                      name={tx.type === 'vip_purchase' ? 'Crown' : tx.type === 'commission' ? 'Percent' : 'ArrowDownLeft'} 
                      size={20} 
                      className={`${
                        tx.type === 'vip_purchase' ? 'text-purple-600' :
                        tx.type === 'commission' ? 'text-green-600' :
                        'text-red-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{tx.user}</h4>
                      <Badge variant={tx.type === 'vip_purchase' ? 'default' : tx.type === 'commission' ? 'secondary' : 'destructive'}>
                        {tx.type === 'vip_purchase' ? 'VIP' : tx.type === 'commission' ? 'Комиссия' : 'Вывод'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
