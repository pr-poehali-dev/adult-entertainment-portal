import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Currency } from '@/types';
import Icon from '@/components/ui/icon';

interface WalletCardProps {
  wallet: Wallet;
  onDeposit: (currency: Currency) => void;
  onWithdraw: (currency: Currency) => void;
}

const currencyIcons: Record<Currency, string> = {
  RUB: 'Banknote',
  USD: 'DollarSign',
  EUR: 'Euro',
  BTC: 'Bitcoin',
  ETH: 'Coins',
  USDT: 'Wallet',
  LOVE: 'Heart',
};

export const WalletCard = ({ wallet, onDeposit, onWithdraw }: WalletCardProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Wallet" size={24} className="text-primary" />
          Мой кошелек
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallet.balances.map((balance) => (
            <div 
              key={balance.currency}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                balance.currency === 'LOVE' 
                  ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-300 dark:border-pink-800' 
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  balance.currency === 'LOVE' 
                    ? 'bg-pink-500/20' 
                    : 'bg-primary/10'
                }`}>
                  <Icon 
                    name={currencyIcons[balance.currency]} 
                    size={20} 
                    className={balance.currency === 'LOVE' ? 'text-pink-600 dark:text-pink-400' : 'text-primary'} 
                  />
                </div>
                <div>
                  <div className={`font-semibold ${balance.currency === 'LOVE' ? 'text-pink-600 dark:text-pink-400' : ''}`}>
                    {balance.currency}
                    {balance.currency === 'LOVE' && <span className="ml-2 text-xs opacity-70">(Внутренняя валюта)</span>}
                  </div>
                  <div className={`text-2xl font-bold ${balance.currency === 'LOVE' ? 'text-pink-600 dark:text-pink-400' : 'text-primary'}`}>
                    {balance.amount.toLocaleString()} {balance.symbol}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {balance.currency === 'LOVE' ? (
                  <Button 
                    size="sm" 
                    onClick={() => onDeposit(balance.currency)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
                  >
                    <Icon name="ShoppingCart" size={16} />
                    Купить LOVE
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeposit(balance.currency)}
                      className="border-green-500 text-green-600 hover:bg-green-500/10"
                    >
                      <Icon name="Plus" size={16} />
                      Пополнить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onWithdraw(balance.currency)}
                      disabled={balance.amount === 0}
                      className="border-red-500 text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Icon name="Minus" size={16} />
                      Вывести
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};