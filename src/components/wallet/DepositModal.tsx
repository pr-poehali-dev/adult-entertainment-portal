import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Currency } from '@/types';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency | null;
  onDeposit: (currency: Currency, amount: number) => void;
}

const currencyNames: Record<Currency, string> = {
  RUB: 'Российский рубль',
  USD: 'Доллар США',
  EUR: 'Евро',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether',
};

export const DepositModal = ({ isOpen, onClose, currency, onDeposit }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleDeposit = () => {
    if (!currency || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму",
        variant: "destructive",
      });
      return;
    }

    onDeposit(currency, parseFloat(amount));
    setAmount('');
    onClose();
    
    toast({
      title: "Пополнение успешно",
      description: `На ваш счет зачислено ${amount} ${currency}`,
    });
  };

  if (!currency) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Plus" size={24} className="text-green-500" />
            Пополнить счет
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Валюта</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="font-semibold">{currency}</div>
              <div className="text-sm text-muted-foreground">{currencyNames[currency]}</div>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Сумма пополнения</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
              min="0"
              step="0.01"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={18} className="text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-600">
                <p className="font-semibold mb-1">Как пополнить:</p>
                <p className="text-xs">После подтверждения вы получите реквизиты для перевода. Средства зачисляются автоматически в течение 1-10 минут.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleDeposit} className="bg-green-500 hover:bg-green-600">
              <Icon name="Check" size={18} />
              Пополнить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
