import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Currency, WalletBalance } from '@/types';
import { useState } from 'react';

interface LovePackage {
  id: string;
  price: number;
  tokens: number;
  popular?: boolean;
  bonus?: string;
}

const packages: LovePackage[] = [
  { id: '500', price: 500, tokens: 35 },
  { id: '1000', price: 1000, tokens: 75, bonus: '+5 бонус' },
  { id: '2500', price: 2500, tokens: 188, popular: true, bonus: '+13 бонус' },
  { id: '5000', price: 5000, tokens: 390, bonus: '+40 бонус' },
  { id: '10000', price: 10000, tokens: 1000, bonus: '+100 бонус' },
];

interface LovePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalances: WalletBalance[];
  onPurchase: (currency: Currency, amount: number, loveAmount: number) => void;
}

export const LovePurchaseModal = ({ isOpen, onClose, walletBalances, onPurchase }: LovePurchaseModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<LovePackage | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('RUB');

  const currencyRates: Record<string, number> = {
    'RUB': 1,
    'USD': 100,
    'EUR': 110,
    'BTC': 0.00012,
    'ETH': 0.003,
    'USDT': 100,
  };

  const handlePurchase = () => {
    if (!selectedPackage) return;

    const amountInCurrency = selectedPackage.price / currencyRates[selectedCurrency];
    const balance = walletBalances.find(b => b.currency === selectedCurrency);

    if (!balance || balance.amount < amountInCurrency) {
      alert('Недостаточно средств на балансе');
      return;
    }

    onPurchase(selectedCurrency, amountInCurrency, selectedPackage.tokens);
    onClose();
    setSelectedPackage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="ShoppingCart" size={28} className="text-pink-500" />
            Купить LOVE токены
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 p-4 rounded-lg border border-pink-300 dark:border-pink-800">
            <p className="text-sm text-pink-600 dark:text-pink-400">
              💗 LOVE токены можно использовать для оплаты всех услуг на платформе
            </p>
            <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-1">
              1 LOVE = 10 ₽ • Специальные предложения с бонусами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`relative cursor-pointer transition-all hover:scale-105 p-6 ${
                  selectedPackage?.id === pkg.id
                    ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 shadow-lg'
                    : 'hover:border-pink-300 dark:hover:border-pink-700'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                    🔥 ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {pkg.tokens} 💗
                  </div>
                  <div className="text-2xl font-bold">
                    {pkg.price.toLocaleString()} ₽
                  </div>
                  {pkg.bonus && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      {pkg.bonus}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    ~{(pkg.price / pkg.tokens).toFixed(1)} ₽ за токен
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedPackage && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Выберите валюту оплаты:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {walletBalances
                    .filter(b => b.currency !== 'LOVE')
                    .map((balance) => {
                      const amountInCurrency = selectedPackage.price / currencyRates[balance.currency];
                      const hasBalance = balance.amount >= amountInCurrency;
                      
                      return (
                        <button
                          key={balance.currency}
                          onClick={() => setSelectedCurrency(balance.currency)}
                          disabled={!hasBalance}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedCurrency === balance.currency
                              ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                              : hasBalance
                              ? 'border-border hover:border-pink-300'
                              : 'border-border opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-semibold">{balance.currency}</div>
                          <div className="text-sm">
                            {amountInCurrency.toLocaleString(undefined, { 
                              maximumFractionDigits: balance.currency.startsWith('BTC') || balance.currency === 'ETH' ? 6 : 2 
                            })} {balance.symbol}
                          </div>
                          <div className={`text-xs mt-1 ${hasBalance ? 'text-green-600' : 'text-red-600'}`}>
                            Баланс: {balance.amount.toLocaleString()} {balance.symbol}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold"
                  size="lg"
                >
                  <Icon name="ShoppingCart" size={20} />
                  Купить {selectedPackage.tokens} 💗 LOVE
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
