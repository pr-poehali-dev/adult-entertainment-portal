import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { WalletBalance } from '@/types';

interface AgencyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirm: (currency: string) => void;
  agencyName: string;
  walletBalances: WalletBalance[];
}

const AgencyPaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentConfirm, 
  agencyName,
  walletBalances 
}: AgencyPaymentModalProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('RUB');

  const paymentAmount = 10000;

  const currencyRates: Record<string, number> = {
    'RUB': 1,
    'USD': 100,
    'EUR': 110,
    'BTC': 0.00012,
    'ETH': 0.003,
    'USDT': 100,
  };

  const getAmountInCurrency = (currency: string) => {
    return paymentAmount / currencyRates[currency];
  };

  const getBalance = (currency: string) => {
    return walletBalances.find(b => b.currency === currency);
  };

  const hasEnoughBalance = (currency: string) => {
    const balance = getBalance(currency);
    if (!balance) return false;
    return balance.amount >= getAmountInCurrency(currency);
  };

  const handlePayment = () => {
    if (hasEnoughBalance(selectedCurrency)) {
      onPaymentConfirm(selectedCurrency);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="CreditCard" size={24} />
            Оплата регистрации агентства
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Название агентства</p>
            <p className="font-semibold text-lg">{agencyName}</p>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Выберите валюту для оплаты:</p>
            
            <div className="space-y-2">
              {walletBalances.map((balance) => {
                const amountRequired = getAmountInCurrency(balance.currency);
                const hasBalance = hasEnoughBalance(balance.currency);
                
                return (
                  <Card
                    key={balance.currency}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedCurrency === balance.currency
                        ? 'border-primary bg-primary/5'
                        : hasBalance
                        ? 'hover:border-primary/50'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => hasBalance && setSelectedCurrency(balance.currency)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedCurrency === balance.currency
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedCurrency === balance.currency && (
                            <Icon name="Check" size={12} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{balance.currency}</p>
                          <p className="text-sm text-muted-foreground">
                            Баланс: {balance.amount.toLocaleString()} {balance.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {amountRequired.toLocaleString(undefined, {
                            minimumFractionDigits: balance.currency === 'BTC' || balance.currency === 'ETH' ? 4 : 2,
                            maximumFractionDigits: balance.currency === 'BTC' || balance.currency === 'ETH' ? 6 : 2,
                          })} {balance.symbol}
                        </p>
                        {!hasBalance && (
                          <p className="text-xs text-destructive">Недостаточно средств</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Стоимость регистрации:</span>
              <span className="font-medium">10 000 ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>К оплате:</span>
              <span className="font-semibold text-lg">
                {getAmountInCurrency(selectedCurrency).toLocaleString(undefined, {
                  minimumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 4 : 2,
                  maximumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 6 : 2,
                })} {getBalance(selectedCurrency)?.symbol}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!hasEnoughBalance(selectedCurrency)}
              className="flex-1"
            >
              <Icon name="Check" size={18} />
              <span className="ml-2">Оплатить</span>
            </Button>
          </div>

          {!hasEnoughBalance(selectedCurrency) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded">
              <Icon name="Info" size={16} className="mt-0.5" />
              <p>
                Пополните баланс кошелька для оплаты регистрации агентства
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgencyPaymentModal;
