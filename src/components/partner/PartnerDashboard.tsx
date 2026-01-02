import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { usePartnerProgram } from '@/contexts/PartnerProgramContext';
import { useToast } from '@/hooks/use-toast';
import { Currency } from '@/types';
import { PartnerOverviewTab } from './PartnerOverviewTab';
import { PartnerReferralsTab } from './PartnerReferralsTab';
import { PartnerEarningsTab } from './PartnerEarningsTab';
import { PartnerWithdrawalTab } from './PartnerWithdrawalTab';

export const PartnerDashboard = () => {
  const { 
    referralCode, 
    referralLink, 
    stats, 
    referrals, 
    earnings, 
    withdrawalRequests,
    partnerLevels,
    requestWithdrawal 
  } = usePartnerProgram();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalCurrency, setWithdrawalCurrency] = useState<Currency>('RUB');
  const [withdrawalMethod, setWithdrawalMethod] = useState('card');
  const [withdrawalDetails, setWithdrawalDetails] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Реферальная ссылка скопирована в буфер обмена',
    });
  };

  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Укажите корректную сумму',
        variant: 'destructive',
      });
      return;
    }

    if (amount > stats.availableForWithdrawal) {
      toast({
        title: 'Ошибка',
        description: 'Недостаточно средств для вывода',
        variant: 'destructive',
      });
      return;
    }

    requestWithdrawal(amount, withdrawalCurrency, withdrawalMethod, withdrawalDetails);
    toast({
      title: 'Заявка отправлена',
      description: 'Ваша заявка на вывод средств принята в обработку',
    });
    setWithdrawalAmount('');
    setWithdrawalDetails('');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300', label: 'Ожидает', icon: 'Clock' },
      processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', label: 'В обработке', icon: 'Loader' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300', label: 'Выполнено', icon: 'CheckCircle' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300', label: 'Отклонено', icon: 'XCircle' },
      cancelled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300', label: 'Отменено', icon: 'X' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon name={badge.icon as any} size={12} />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                <Icon name="Link" size={20} className="text-primary" />
                Ваша реферальная ссылка
              </h3>
              <p className="text-muted-foreground mb-4">Код: <span className="font-mono font-bold text-primary">{referralCode}</span></p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="flex-1 bg-card/80 backdrop-blur-sm"
                />
                <Button 
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Icon name="Copy" size={18} className="mr-2" />
                  Копировать
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Присоединяйся!`, '_blank')}
              >
                <Icon name="MessageCircle" size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(referralLink)}`, '_blank')}
              >
                <Icon name="MessageSquare" size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Icon name="Users" size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalReferrals}</h3>
            <p className="text-sm text-muted-foreground">Всего рефералов</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Icon name="UserCheck" size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.activeReferrals}</h3>
            <p className="text-sm text-muted-foreground">Активных</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-yellow-500/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center">
              <Icon name="Wallet" size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalEarned.toLocaleString()} ₽</h3>
            <p className="text-sm text-muted-foreground">Заработано</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-600/10 border-pink-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Icon name="Heart" size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.loveBalance} 💗</h3>
            <p className="text-sm text-muted-foreground">LOVE токенов</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <Icon name="Users" size={16} className="mr-2" />
            Рефералы
          </TabsTrigger>
          <TabsTrigger value="earnings">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Заработок
          </TabsTrigger>
          <TabsTrigger value="withdrawal">
            <Icon name="Banknote" size={16} className="mr-2" />
            Вывод
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <PartnerOverviewTab stats={stats} partnerLevels={partnerLevels} />
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <PartnerReferralsTab referrals={referrals} />
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <PartnerEarningsTab 
            earnings={earnings} 
            partnerLevels={partnerLevels}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="withdrawal" className="mt-6">
          <PartnerWithdrawalTab
            stats={stats}
            withdrawalRequests={withdrawalRequests}
            withdrawalAmount={withdrawalAmount}
            setWithdrawalAmount={setWithdrawalAmount}
            withdrawalCurrency={withdrawalCurrency}
            setWithdrawalCurrency={setWithdrawalCurrency}
            withdrawalMethod={withdrawalMethod}
            setWithdrawalMethod={setWithdrawalMethod}
            withdrawalDetails={withdrawalDetails}
            setWithdrawalDetails={setWithdrawalDetails}
            handleWithdrawalRequest={handleWithdrawalRequest}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
