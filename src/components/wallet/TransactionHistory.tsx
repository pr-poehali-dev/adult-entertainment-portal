import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, TransactionType, TransactionStatus, Currency } from '@/types';
import Icon from '@/components/ui/icon';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const getTransactionIcon = (type: TransactionType): string => {
  const icons: Record<TransactionType, string> = {
    deposit: 'ArrowDownToLine',
    withdraw: 'ArrowUpFromLine',
    booking_payment: 'CreditCard',
    booking_refund: 'RefreshCw',
    booking_received: 'DollarSign',
    booking_extend: 'Clock',
    vip_payment: 'Crown',
    tip_sent: 'Heart',
    tip_received: 'Gift',
  };
  return icons[type];
};

const getTransactionLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    deposit: 'Пополнение',
    withdraw: 'Вывод средств',
    booking_payment: 'Оплата встречи',
    booking_refund: 'Возврат средств',
    booking_received: 'Получение оплаты',
    booking_extend: 'Продление встречи',
    vip_payment: 'Оплата VIP',
    tip_sent: 'Чаевые отправлены',
    tip_received: 'Чаевые получены',
  };
  return labels[type];
};

const getTransactionColor = (type: TransactionType): string => {
  const colors: Record<TransactionType, string> = {
    deposit: 'text-green-500',
    withdraw: 'text-red-500',
    booking_payment: 'text-blue-500',
    booking_refund: 'text-cyan-500',
    booking_received: 'text-green-500',
    booking_extend: 'text-purple-500',
    vip_payment: 'text-yellow-500',
    tip_sent: 'text-pink-500',
    tip_received: 'text-pink-500',
  };
  return colors[type];
};

const getStatusBadge = (status: TransactionStatus) => {
  const variants: Record<TransactionStatus, { text: string; class: string }> = {
    pending: { text: 'В обработке', class: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
    completed: { text: 'Завершено', class: 'bg-green-500/20 text-green-600 border-green-500/30' },
    failed: { text: 'Не удалось', class: 'bg-red-500/20 text-red-600 border-red-500/30' },
    cancelled: { text: 'Отменено', class: 'bg-gray-500/20 text-gray-600 border-gray-500/30' },
  };
  const variant = variants[status];
  return <Badge className={variant.class}>{variant.text}</Badge>;
};

const isIncoming = (type: TransactionType): boolean => {
  return ['deposit', 'booking_refund', 'booking_received', 'tip_received'].includes(type);
};

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCurrency, setFilterCurrency] = useState<Currency | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterCurrency === 'all' || t.currency === filterCurrency)
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalIncome = transactions
    .filter(t => isIncoming(t.type) && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => !isIncoming(t.type) && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" size={24} className="text-primary" />
            История транзакций
          </CardTitle>
          <div className="flex gap-4 text-sm">
            <div className="text-right">
              <div className="text-muted-foreground">Поступления</div>
              <div className="text-green-500 font-bold">+{totalIncome.toLocaleString()} ₽</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Расходы</div>
              <div className="text-red-500 font-bold">-{totalExpense.toLocaleString()} ₽</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as TransactionType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Тип операции" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все операции</SelectItem>
                <SelectItem value="deposit">Пополнения</SelectItem>
                <SelectItem value="withdraw">Выводы</SelectItem>
                <SelectItem value="booking_payment">Оплата встреч</SelectItem>
                <SelectItem value="booking_received">Получение оплаты</SelectItem>
                <SelectItem value="booking_extend">Продления</SelectItem>
                <SelectItem value="vip_payment">VIP оплаты</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filterCurrency} onValueChange={(v) => setFilterCurrency(v as Currency | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Валюта" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все валюты</SelectItem>
                <SelectItem value="RUB">RUB (₽)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TransactionStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="pending">В обработке</SelectItem>
                <SelectItem value="failed">Не удалось</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Список транзакций */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Receipt" size={64} className="mx-auto mb-4 opacity-50" />
              <p>Транзакций не найдено</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const incoming = isIncoming(transaction.type);
              const icon = getTransactionIcon(transaction.type);
              const color = getTransactionColor(transaction.type);
              const label = getTransactionLabel(transaction.type);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  {/* Иконка */}
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${color}`}>
                    <Icon name={icon} size={24} />
                  </div>

                  {/* Информация */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{label}</span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                    {(transaction.fromUser || transaction.toUser) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {transaction.fromUser && `От: ${transaction.fromUser}`}
                        {transaction.toUser && `Кому: ${transaction.toUser}`}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>

                  {/* Сумма */}
                  <div className="text-right">
                    <div className={`text-xl font-bold ${incoming ? 'text-green-500' : 'text-red-500'}`}>
                      {incoming ? '+' : '-'}{transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                    {transaction.fee && transaction.fee > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Комиссия: {transaction.fee} {transaction.currency}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Кнопка загрузить еще */}
        {filteredTransactions.length > 0 && filteredTransactions.length >= 10 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full md:w-auto">
              <Icon name="ChevronDown" size={18} />
              Загрузить еще
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
