import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { WalletBalance } from '@/types';

interface AgencyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirm: (currency: string) => void;
  agencyName: string;
  walletBalances: WalletBalance[];
  onTopUp?: (currency: string, amount: number) => void;
}

const AgencyPaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentConfirm, 
  agencyName,
  walletBalances,
  onTopUp
}: AgencyPaymentModalProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('RUB');
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

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
    if (!hasEnoughBalance(selectedCurrency)) {
      console.warn('Not enough balance', {
        currency: selectedCurrency,
        balance: getBalance(selectedCurrency)?.amount,
        required: getAmountInCurrency(selectedCurrency)
      });
      return;
    }
    onPaymentConfirm(selectedCurrency);
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0 && onTopUp) {
      onTopUp(selectedCurrency, amount);
      setTopUpAmount('');
      setShowTopUp(false);
    }
  };

  const getShortage = (currency: string) => {
    const balance = getBalance(currency);
    const required = getAmountInCurrency(currency);
    if (!balance) return required;
    return Math.max(0, required - balance.amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="CreditCard" size={24} />
            Оплата регистрации агентства
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-primary/5 p-3 md:p-4 rounded-lg">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Название агентства</p>
            <p className="font-semibold text-base md:text-lg break-words">{agencyName}</p>
          </div>

          <div className="space-y-2 md:space-y-3">
            <p className="font-medium text-sm md:text-base">Выберите валюту для оплаты:</p>
            
            <div className="space-y-2">
              {walletBalances.map((balance) => {
                const amountRequired = getAmountInCurrency(balance.currency);
                const hasBalance = hasEnoughBalance(balance.currency);
                
                return (
                  <Card
                    key={balance.currency}
                    className={`p-3 md:p-4 cursor-pointer transition-all ${
                      selectedCurrency === balance.currency
                        ? 'border-primary bg-primary/5'
                        : hasBalance
                        ? 'hover:border-primary/50 active:bg-primary/5'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => hasBalance && setSelectedCurrency(balance.currency)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedCurrency === balance.currency
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedCurrency === balance.currency && (
                            <Icon name="Check" size={14} className="text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm md:text-base">{balance.currency}</p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            Баланс: {balance.amount.toLocaleString()} {balance.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm md:text-base">
                          {amountRequired.toLocaleString(undefined, {
                            minimumFractionDigits: balance.currency === 'BTC' || balance.currency === 'ETH' ? 4 : 2,
                            maximumFractionDigits: balance.currency === 'BTC' || balance.currency === 'ETH' ? 6 : 2,
                          })} {balance.symbol}
                        </p>
                        {!hasBalance && (
                          <p className="text-xs text-destructive">Недостаточно</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-muted p-3 md:p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-xs md:text-sm">
              <span>Стоимость регистрации:</span>
              <span className="font-medium">10 000 ₽</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span>К оплате:</span>
              <span className="font-semibold text-base md:text-lg">
                {getAmountInCurrency(selectedCurrency).toLocaleString(undefined, {
                  minimumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 4 : 2,
                  maximumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 6 : 2,
                })} {getBalance(selectedCurrency)?.symbol}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <Button variant="outline" onClick={onClose} className="w-full md:flex-1">
              Отмена
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!hasEnoughBalance(selectedCurrency)}
              className="w-full md:flex-1"
              type="button"
            >
              <Icon name="Check" size={18} />
              <span className="ml-2">
                {hasEnoughBalance(selectedCurrency) ? 'Оплатить' : 'Недостаточно средств'}
              </span>
            </Button>
          </div>

          {!hasEnoughBalance(selectedCurrency) && (
            <div className="space-y-3">
              {!showTopUp ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="mb-1">
                        Недостаточно средств для оплаты
                      </p>
                      <p className="font-semibold text-destructive">
                        Не хватает: {getShortage(selectedCurrency).toLocaleString(undefined, {
                          minimumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 4 : 2,
                          maximumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 6 : 2,
                        })} {getBalance(selectedCurrency)?.symbol}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowTopUp(true)}
                  >
                    <Icon name="Plus" size={18} />
                    <span className="ml-2">Пополнить баланс {selectedCurrency}</span>
                  </Button>
                </div>
              ) : (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Icon name="Wallet" size={20} className="text-primary" />
                        Пополнение {selectedCurrency}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowTopUp(false);
                          setTopUpAmount('');
                        }}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Сумма пополнения ({getBalance(selectedCurrency)?.symbol})
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder={`Минимум ${getShortage(selectedCurrency).toFixed(2)}`}
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className="flex-1"
                          min={getShortage(selectedCurrency)}
                          step={selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? '0.0001' : '1'}
                        />
                        <Button
                          onClick={() => setTopUpAmount(getShortage(selectedCurrency).toFixed(
                            selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 6 : 2
                          ))}
                          variant="outline"
                          size="sm"
                        >
                          Нужная сумма
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Текущий баланс:</span>
                        <span className="font-medium">{getBalance(selectedCurrency)?.amount.toLocaleString()} {getBalance(selectedCurrency)?.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">После пополнения:</span>
                        <span className="font-semibold text-primary">
                          {((getBalance(selectedCurrency)?.amount || 0) + parseFloat(topUpAmount || '0')).toLocaleString(undefined, {
                            minimumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 4 : 2,
                            maximumFractionDigits: selectedCurrency === 'BTC' || selectedCurrency === 'ETH' ? 6 : 2,
                          })} {getBalance(selectedCurrency)?.symbol}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleTopUp}
                      disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                      className="w-full"
                    >
                      <Icon name="CreditCard" size={18} />
                      <span className="ml-2">Пополнить на {topUpAmount || '0'} {getBalance(selectedCurrency)?.symbol}</span>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      После пополнения вы сможете оплатить регистрацию агентства
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgencyPaymentModal;