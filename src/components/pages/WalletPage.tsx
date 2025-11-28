import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Page, Wallet, Transaction, Currency } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface WalletPageProps {
  setCurrentPage: (page: Page) => void;
  wallet: Wallet;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'deposit',
    amount: 5000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-27T10:30:00Z',
    completedAt: '2024-11-27T10:31:00Z',
    description: 'Пополнение через банковскую карту'
  },
  {
    id: 2,
    type: 'booking_payment',
    amount: 1500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-26T15:20:00Z',
    completedAt: '2024-11-26T15:20:30Z',
    description: 'Оплата бронирования #12345',
    relatedBookingId: 12345,
    toUser: 'Мария С.'
  },
  {
    id: 3,
    type: 'vip_payment',
    amount: 500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T09:15:00Z',
    completedAt: '2024-11-25T09:15:10Z',
    description: 'Оплата VIP статуса на 1 месяц'
  },
  {
    id: 4,
    type: 'withdraw',
    amount: 2000,
    currency: 'RUB',
    status: 'pending',
    createdAt: '2024-11-24T14:00:00Z',
    description: 'Вывод на карту **** 1234'
  },
  {
    id: 5,
    type: 'booking_received',
    amount: 3000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-23T18:45:00Z',
    completedAt: '2024-11-23T20:50:00Z',
    description: 'Получение оплаты за бронирование #12340',
    relatedBookingId: 12340,
    fromUser: 'Александр П.',
    fee: 300
  },
  {
    id: 6,
    type: 'tip_received',
    amount: 500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-22T12:30:00Z',
    completedAt: '2024-11-22T12:30:05Z',
    description: 'Чаевые от клиента',
    fromUser: 'Дмитрий К.'
  }
];

export const WalletPage = ({ setCurrentPage, wallet }: WalletPageProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'card' | 'crypto'>('card');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const rubBalance = wallet.balances.find(b => b.currency === 'RUB')?.amount || 0;
  const btcBalance = wallet.balances.find(b => b.currency === 'BTC')?.amount || 0;

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

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму пополнения',
        variant: 'destructive',
      });
      return;
    }

    if (depositMethod === 'card' && !cardNumber) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер карты',
        variant: 'destructive',
      });
      return;
    }

    if (depositMethod === 'crypto' && !cryptoAddress) {
      toast({
        title: 'Ошибка',
        description: 'Введите адрес кошелька',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✅ Пополнение в обработке',
      description: `Пополнение на ${amount.toLocaleString('ru-RU')} ₽ принято в обработку`,
      duration: 5000,
    });

    setDepositAmount('');
    setCardNumber('');
    setCryptoAddress('');
    setActiveTab('overview');
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму вывода',
        variant: 'destructive',
      });
      return;
    }

    if (amount > rubBalance) {
      toast({
        title: 'Ошибка',
        description: 'Недостаточно средств',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawMethod === 'card' && !cardNumber) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер карты',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawMethod === 'crypto' && !cryptoAddress) {
      toast({
        title: 'Ошибка',
        description: 'Введите адрес кошелька',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✅ Заявка на вывод создана',
      description: `Вывод ${amount.toLocaleString('ru-RU')} ₽ будет обработан в течение 24 часов`,
      duration: 5000,
    });

    setWithdrawAmount('');
    setCardNumber('');
    setCryptoAddress('');
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/20 dark:via-green-950/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('home')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Wallet" size={48} className="text-green-600 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Мой кошелёк
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Управляйте своими финансами: пополняйте баланс, выводите средства и отслеживайте все операции
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Wallet" size={24} />
                Баланс RUB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{rubBalance.toLocaleString('ru-RU')} ₽</p>
              <p className="text-sm text-white/80 mt-2">Основной баланс</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Bitcoin" size={24} />
                Баланс BTC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{btcBalance.toFixed(6)} ₿</p>
              <p className="text-sm text-white/80 mt-2">Криптовалюта</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                Всего операций
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{transactions.length}</p>
              <p className="text-sm text-white/80 mt-2">За всё время</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 p-1 bg-muted rounded-xl">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="rounded-lg"
            >
              <Icon name="List" size={18} className="mr-2" />
              История
            </Button>
            <Button
              variant={activeTab === 'deposit' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('deposit')}
              className="rounded-lg"
            >
              <Icon name="ArrowDownToLine" size={18} className="mr-2" />
              Пополнить
            </Button>
            <Button
              variant={activeTab === 'withdraw' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('withdraw')}
              className="rounded-lg"
            >
              <Icon name="ArrowUpFromLine" size={18} className="mr-2" />
              Вывести
            </Button>
          </div>
        </div>

        {activeTab === 'overview' && (
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
        )}

        {activeTab === 'deposit' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ArrowDownToLine" size={24} className="text-green-600" />
                Пополнить баланс
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="deposit-amount">Сумма пополнения</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-lg h-14 mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Минимальная сумма: 100 ₽
                </p>
              </div>

              <div>
                <Label>Способ пополнения</Label>
                <Select value={depositMethod} onValueChange={(value: 'card' | 'crypto') => setDepositMethod(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <Icon name="CreditCard" size={16} />
                        Банковская карта
                      </div>
                    </SelectItem>
                    <SelectItem value="crypto">
                      <div className="flex items-center gap-2">
                        <Icon name="Bitcoin" size={16} />
                        Криптовалюта
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {depositMethod === 'card' && (
                <div>
                  <Label htmlFor="card-number">Номер карты</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              {depositMethod === 'crypto' && (
                <div>
                  <Label htmlFor="crypto-address">Адрес криптокошелька</Label>
                  <Input
                    id="crypto-address"
                    type="text"
                    placeholder="bc1q..."
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Важная информация:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Средства поступят в течение 5-10 минут</li>
                      <li>Комиссия не взимается</li>
                      <li>Минимальная сумма пополнения: 100 ₽</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Icon name="ArrowDownToLine" size={20} className="mr-2" />
                Пополнить баланс
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'withdraw' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ArrowUpFromLine" size={24} className="text-red-600" />
                Вывести средства
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Доступно для вывода:</p>
                <p className="text-2xl font-bold">{rubBalance.toLocaleString('ru-RU')} ₽</p>
              </div>

              <div>
                <Label htmlFor="withdraw-amount">Сумма вывода</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="1000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="text-lg h-14 mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Минимальная сумма: 500 ₽
                </p>
              </div>

              <div>
                <Label>Способ вывода</Label>
                <Select value={withdrawMethod} onValueChange={(value: 'card' | 'crypto') => setWithdrawMethod(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <Icon name="CreditCard" size={16} />
                        Банковская карта
                      </div>
                    </SelectItem>
                    <SelectItem value="crypto">
                      <div className="flex items-center gap-2">
                        <Icon name="Bitcoin" size={16} />
                        Криптовалюта
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawMethod === 'card' && (
                <div>
                  <Label htmlFor="withdraw-card">Номер карты для вывода</Label>
                  <Input
                    id="withdraw-card"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              {withdrawMethod === 'crypto' && (
                <div>
                  <Label htmlFor="withdraw-crypto">Адрес криптокошелька для вывода</Label>
                  <Input
                    id="withdraw-crypto"
                    type="text"
                    placeholder="bc1q..."
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Условия вывода:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Обработка заявки: до 24 часов</li>
                      <li>Комиссия: 2% (минимум 50 ₽)</li>
                      <li>Минимальная сумма вывода: 500 ₽</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                className="w-full h-14 text-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              >
                <Icon name="ArrowUpFromLine" size={20} className="mr-2" />
                Создать заявку на вывод
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
