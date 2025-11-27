import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Currency, WalletBalance } from '@/types';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency | null;
  balance: WalletBalance | null;
  onWithdraw: (currency: Currency, amount: number, address: string) => void;
}

export const WithdrawModal = ({ isOpen, onClose, currency, balance, onWithdraw }: WithdrawModalProps) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const { toast } = useToast();

  const handleWithdraw = () => {
    if (!currency || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Ошибка",
        description: "Введите адрес получателя",
        variant: "destructive",
      });
      return;
    }

    if (balance && parseFloat(amount) > balance.amount) {
      toast({
        title: "Ошибка",
        description: "Недостаточно средств",
        variant: "destructive",
      });
      return;
    }

    onWithdraw(currency, parseFloat(amount), address);
    setAmount('');
    setAddress('');
    onClose();
    
    toast({
      title: "Заявка на вывод создана",
      description: `${amount} ${currency} будет отправлено в течение 24 часов`,
    });
  };

  if (!currency || !balance) return null;

  const isCrypto = ['BTC', 'ETH', 'USDT'].includes(currency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Minus" size={24} className="text-red-500" />
            Вывод средств
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Доступно</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {balance.amount.toLocaleString()} {balance.symbol}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Сумма вывода</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
              min="0"
              step="0.01"
              max={balance.amount}
            />
            <button
              type="button"
              onClick={() => setAmount(balance.amount.toString())}
              className="text-sm text-primary hover:underline mt-1"
            >
              Вывести всё
            </button>
          </div>

          <div>
            <Label htmlFor="address">
              {isCrypto ? 'Адрес кошелька' : 'Номер карты / Счет'}
            </Label>
            <Input
              id="address"
              placeholder={isCrypto ? '0x...' : '1234 5678 9012 3456'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm text-yellow-600">
                <p className="font-semibold mb-1">Важно:</p>
                <p className="text-xs">
                  Проверьте правильность реквизитов. Мы не несем ответственности за ошибки при вводе данных. 
                  Обработка заявок: 1-24 часа.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleWithdraw} className="bg-red-500 hover:bg-red-600">
              <Icon name="ArrowRight" size={18} />
              Вывести
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
