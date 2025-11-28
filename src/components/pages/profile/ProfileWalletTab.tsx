import { useState } from 'react';
import { WalletCard } from '@/components/wallet/WalletCard';
import { DepositModal } from '@/components/wallet/DepositModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Wallet, Currency, Transaction } from '@/types';
import { createDepositTransaction, createWithdrawTransaction } from '@/utils/transactionManager';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProfileWalletTabProps {
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export const ProfileWalletTab = ({
  wallet,
  setWallet,
  transactions,
  setTransactions,
}: ProfileWalletTabProps) => {
  const { toast } = useToast();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const handleDeposit = (currency: Currency, amount: number) => {
    const transaction = createDepositTransaction(amount, currency);
    setTransactions([transaction, ...transactions]);

    setWallet({
      ...wallet,
      balances: wallet.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount + amount }
          : b
      )
    });

    toast({
      title: "Пополнение успешно",
      description: `Счет ${currency} пополнен на ${amount}`,
    });

    setShowDepositModal(false);
  };

  const handleWithdraw = (currency: Currency, amount: number, address: string) => {
    const balance = wallet.balances.find(b => b.currency === currency);
    
    if (!balance || balance.amount < amount) {
      toast({
        title: "Ошибка",
        description: "Недостаточно средств",
        variant: "destructive",
      });
      return;
    }

    const transaction = createWithdrawTransaction(amount, currency, address);
    setTransactions([transaction, ...transactions]);

    setWallet({
      ...wallet,
      balances: wallet.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount - amount }
          : b
      )
    });

    toast({
      title: "Вывод оформлен",
      description: `Заявка на вывод ${amount} ${currency} создана`,
    });

    setShowWithdrawModal(false);
  };

  const handleDepositClick = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowDepositModal(true);
  };

  const handleWithdrawClick = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowWithdrawModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <WalletCard
          balances={wallet.balances}
          onDeposit={handleDepositClick}
          onWithdraw={handleWithdrawClick}
        />
        
        <TransactionHistory transactions={transactions} />
      </div>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        currency={selectedCurrency}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        currency={selectedCurrency}
        balance={selectedCurrency ? wallet.balances.find(b => b.currency === selectedCurrency)?.amount || 0 : 0}
        onWithdraw={handleWithdraw}
      />
    </>
  );
};