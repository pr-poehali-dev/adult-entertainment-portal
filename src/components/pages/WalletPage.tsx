import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page, Wallet, Currency } from '@/types';
import { TransactionHistory } from './wallet/TransactionHistory';
import { DepositForm } from './wallet/DepositForm';
import { CryptoDepositForm } from './wallet/CryptoDepositForm';
import { WithdrawForm } from './wallet/WithdrawForm';
import { mockTransactions } from './wallet/mockTransactions';
import { WalletCard } from '@/components/wallet/WalletCard';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';

interface WalletPageProps {
  setCurrentPage: (page: Page) => void;
  wallet: Wallet;
  onOpenLovePurchase?: () => void;
}

export const WalletPage = ({ setCurrentPage, wallet, onOpenLovePurchase }: WalletPageProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'crypto-deposit' | 'withdraw' | 'balances'>('balances');
  const [transactions] = useState(mockTransactions);

  const rubBalance = wallet.balances.find(b => b.currency === 'RUB')?.amount || 0;
  const btcBalance = wallet.balances.find(b => b.currency === 'BTC')?.amount || 0;

  const handleFormSuccess = () => {
    setActiveTab('overview');
  };

  const handleDeposit = (currency: Currency) => {
    if (currency === 'LOVE' && onOpenLovePurchase) {
      onOpenLovePurchase();
    } else {
      setActiveTab('deposit');
    }
  };

  const handleWithdraw = (currency: Currency) => {
    setActiveTab('withdraw');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/20 dark:via-green-950/10 to-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <PageBreadcrumb currentPage="wallet" setCurrentPage={setCurrentPage} />

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
              variant={activeTab === 'balances' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('balances')}
              className="rounded-lg"
            >
              <Icon name="Wallet" size={18} className="mr-2" />
              Балансы
            </Button>
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
              <Icon name="CreditCard" size={18} className="mr-2" />
              Карта
            </Button>
            <Button
              variant={activeTab === 'crypto-deposit' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('crypto-deposit')}
              className="rounded-lg"
            >
              <Icon name="Bitcoin" size={18} className="mr-2" />
              Крипта
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

        {activeTab === 'balances' && (
          <WalletCard wallet={wallet} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />
        )}

        {activeTab === 'overview' && (
          <TransactionHistory transactions={transactions} />
        )}

        {activeTab === 'deposit' && (
          <DepositForm onSuccess={handleFormSuccess} />
        )}

        {activeTab === 'crypto-deposit' && (
          <CryptoDepositForm onSuccess={handleFormSuccess} />
        )}

        {activeTab === 'withdraw' && (
          <WithdrawForm rubBalance={rubBalance} onSuccess={handleFormSuccess} />
        )}
      </div>
    </div>
  );
};