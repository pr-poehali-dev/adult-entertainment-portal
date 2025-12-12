import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';

interface CoinHistoryPageProps {
  setCurrentPage: (page: Page) => void;
}

export type CoinTransactionType = 
  | 'purchase'           // Покупка монет
  | 'referral_earned'    // Заработано с реферала
  | 'ad_boost'           // Поднятие объявления
  | 'vip_purchase'       // Покупка VIP
  | 'gift_sent'          // Отправлен подарок
  | 'gift_received'      // Получен подарок
  | 'raffle_ticket'      // Билет на розыгрыш
  | 'reward'             // Награда/бонус
  | 'refund';            // Возврат

interface CoinTransaction {
  id: number;
  type: CoinTransactionType;
  amount: number;
  balance: number;
  description: string;
  date: string;
  relatedUser?: string;
  relatedUserId?: number;
}

const CoinHistoryPage = ({ setCurrentPage }: CoinHistoryPageProps) => {
  const [transactions] = useState<CoinTransaction[]>([
    {
      id: 1,
      type: 'purchase',
      amount: 1000,
      balance: 1050,
      description: 'Покупка 1000 монет',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: 'ad_boost',
      amount: -50,
      balance: 1000,
      description: 'Поднятие объявления в топ',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: 'referral_earned',
      amount: 25,
      balance: 1025,
      description: 'Реферальная комиссия (1 линия)',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      relatedUser: 'Анна',
    },
    {
      id: 4,
      type: 'gift_sent',
      amount: -100,
      balance: 925,
      description: 'Отправлен подарок "Роза"',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      relatedUser: 'Мария',
    },
    {
      id: 5,
      type: 'reward',
      amount: 50,
      balance: 975,
      description: 'Бонус за ежедневный вход (5 дней)',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 6,
      type: 'raffle_ticket',
      amount: -100,
      balance: 875,
      description: 'Билет на розыгрыш iPhone 17',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const currentBalance = transactions[0]?.balance || 0;
  
  const earningsTransactions = transactions.filter(t => t.amount > 0);
  const expensesTransactions = transactions.filter(t => t.amount < 0);

  const totalEarnings = earningsTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(expensesTransactions.reduce((sum, t) => sum + t.amount, 0));

  const getTransactionIcon = (type: CoinTransactionType): string => {
    switch (type) {
      case 'purchase': return 'ShoppingCart';
      case 'referral_earned': return 'Users';
      case 'ad_boost': return 'TrendingUp';
      case 'vip_purchase': return 'Crown';
      case 'gift_sent': return 'Gift';
      case 'gift_received': return 'Gift';
      case 'raffle_ticket': return 'Ticket';
      case 'reward': return 'Award';
      case 'refund': return 'RotateCcw';
      default: return 'Circle';
    }
  };

  const getTransactionColor = (type: CoinTransactionType): string => {
    switch (type) {
      case 'purchase': return 'text-green-500';
      case 'referral_earned': return 'text-blue-500';
      case 'ad_boost': return 'text-purple-500';
      case 'vip_purchase': return 'text-yellow-500';
      case 'gift_sent': return 'text-pink-500';
      case 'gift_received': return 'text-pink-500';
      case 'raffle_ticket': return 'text-orange-500';
      case 'reward': return 'text-emerald-500';
      case 'refund': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const renderTransaction = (transaction: CoinTransaction) => {
    const isPositive = transaction.amount > 0;
    const iconName = getTransactionIcon(transaction.type);
    const colorClass = getTransactionColor(transaction.type);

    return (
      <div
        key={transaction.id}
        className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors rounded-lg border-b last:border-b-0"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <Icon name={iconName} size={20} className={colorClass} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{transaction.description}</p>
              {transaction.relatedUser && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transaction.relatedUser}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-bold text-base ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{transaction.amount} 💗
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {transaction.balance} 💗
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageBreadcrumb 
        currentPage="coin-history" 
        setCurrentPage={setCurrentPage}
        customBreadcrumbs={[
          { label: 'Главная', page: 'home' },
          { label: 'Профиль', page: 'profile' },
          { label: 'История монет' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">История транзакций</h1>
        <p className="text-sm text-muted-foreground">
          Все операции с монетами 💗
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-pink-500/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="Wallet" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Текущий баланс</p>
                <p className="text-2xl font-bold">{currentBalance} 💗</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Заработано</p>
                <p className="text-2xl font-bold text-green-500">+{totalEarnings} 💗</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Icon name="TrendingDown" size={24} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Потрачено</p>
                <p className="text-2xl font-bold text-red-500">-{totalExpenses} 💗</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Транзакции */}
      <Card>
        <CardHeader>
          <CardTitle>Транзакции</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="gap-2">
                  <Icon name="List" size={16} />
                  Все ({transactions.length})
                </TabsTrigger>
                <TabsTrigger value="earnings" className="gap-2">
                  <Icon name="Plus" size={16} />
                  Поступления ({earningsTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="expenses" className="gap-2">
                  <Icon name="Minus" size={16} />
                  Расходы ({expensesTransactions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="divide-y">
                {transactions.length > 0 ? (
                  transactions.map(transaction => renderTransaction(transaction))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет транзакций</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="mt-0">
              <div className="divide-y">
                {earningsTransactions.length > 0 ? (
                  earningsTransactions.map(transaction => renderTransaction(transaction))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет поступлений</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="mt-0">
              <div className="divide-y">
                {expensesTransactions.length > 0 ? (
                  expensesTransactions.map(transaction => renderTransaction(transaction))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет расходов</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinHistoryPage;
