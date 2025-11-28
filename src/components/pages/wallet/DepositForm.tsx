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

interface DepositFormProps {
  onSuccess: () => void;
}

export const DepositForm = ({ onSuccess }: DepositFormProps) => {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'card' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');

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
    onSuccess();
  };

  return (
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
  );
};
