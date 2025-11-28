import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface WithdrawFormProps {
  rubBalance: number;
  onSuccess: () => void;
}

export const WithdrawForm = ({ rubBalance, onSuccess }: WithdrawFormProps) => {
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');

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
    onSuccess();
  };

  return (
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
  );
};
