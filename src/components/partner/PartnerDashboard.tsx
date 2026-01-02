import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { usePartnerProgram } from '@/contexts/PartnerProgramContext';
import { useToast } from '@/hooks/use-toast';
import { Currency } from '@/types';

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" size={20} />
                Многоуровневая программа
              </CardTitle>
              <CardDescription>
                Получайте комиссию с покупок ваших рефералов и их рефералов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerLevels.map((level) => (
                  <div key={level.level} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        level.level === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                        level.level === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                        'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                      }`}>
                        {level.level}
                      </div>
                      <div>
                        <h4 className="font-semibold">{level.level} линия</h4>
                        <p className="text-sm text-muted-foreground">
                          {stats[`level${level.level}Count` as keyof PartnerStats]} рефералов
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{level.percentage}%</div>
                      <div className="text-sm text-muted-foreground">+{level.loveBonus} 💗</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-800">
                <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-2">
                  <Icon name="Sparkles" size={18} />
                  Как это работает?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>1 линия:</strong> Ваши прямые рефералы — 10% от их покупок</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>2 линия:</strong> Рефералы ваших рефералов — 5%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>3 линия:</strong> Третий уровень — 2.5%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Heart" size={16} className="text-pink-600 mt-0.5 flex-shrink-0" />
                    <span>+ Бонусные LOVE токены за каждого приведённого реферала</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">1 линия</span>
                  <Icon name="Users" size={18} className="text-yellow-600" />
                </div>
                <div className="text-2xl font-bold">{stats.level1Earned.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.level1Count} рефералов</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">2 линия</span>
                  <Icon name="Users" size={18} className="text-gray-600" />
                </div>
                <div className="text-2xl font-bold">{stats.level2Earned.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.level2Count} рефералов</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">3 линия</span>
                  <Icon name="Users" size={18} className="text-orange-600" />
                </div>
                <div className="text-2xl font-bold">{stats.level3Earned.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.level3Count} рефералов</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" size={20} />
                Мои рефералы ({referrals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      {referral.userAvatar ? (
                        <img src={referral.userAvatar} alt={referral.userName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                          {referral.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{referral.userName}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            referral.level === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
                            referral.level === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          }`}>
                            {referral.level} линия
                          </span>
                          {referral.isActive && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Зарегистрирован {new Date(referral.registeredAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">+{referral.yourEarnings.toLocaleString()} ₽</div>
                      <p className="text-xs text-muted-foreground">Потрачено: {referral.totalSpent.toLocaleString()} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                История заработка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{earning.fromUserName}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          earning.level === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
                          earning.level === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        }`}>
                          {earning.level} линия
                        </span>
                        {getStatusBadge(earning.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(earning.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-muted-foreground">Транзакция: {earning.amount.toLocaleString()} {earning.currency}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+{earning.commission.toLocaleString()} ₽</div>
                      <p className="text-xs text-muted-foreground">{partnerLevels.find(l => l.level === earning.level)?.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="DollarSign" size={20} />
                  Запросить вывод средств
                </CardTitle>
                <CardDescription>
                  Доступно для вывода: <span className="font-bold text-primary">{stats.availableForWithdrawal.toLocaleString()} ₽</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Сумма</Label>
                  <Input 
                    id="amount"
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Введите сумму"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Валюта</Label>
                  <Select value={withdrawalCurrency} onValueChange={(v) => setWithdrawalCurrency(v as Currency)}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">RUB (₽)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="method">Способ вывода</Label>
                  <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                    <SelectTrigger id="method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Банковская карта</SelectItem>
                      <SelectItem value="crypto">Криптовалюта</SelectItem>
                      <SelectItem value="wallet">Электронный кошелёк</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="details">Реквизиты</Label>
                  <Input 
                    id="details"
                    value={withdrawalDetails}
                    onChange={(e) => setWithdrawalDetails(e.target.value)}
                    placeholder="Номер карты / адрес кошелька"
                  />
                </div>

                <Button onClick={handleWithdrawalRequest} className="w-full">
                  <Icon name="Send" size={18} className="mr-2" />
                  Запросить вывод
                </Button>

                <p className="text-xs text-muted-foreground">
                  Минимальная сумма вывода: 1000 ₽. Обработка заявки: 1-3 рабочих дня.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История выводов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {withdrawalRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Пока нет заявок на вывод</p>
                    </div>
                  ) : (
                    withdrawalRequests.map((request) => (
                      <div key={request.id} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{request.amount.toLocaleString()} {request.currency}</h4>
                            <p className="text-sm text-muted-foreground">{request.details}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>Запрошено: {new Date(request.requestedAt).toLocaleDateString('ru-RU')}</p>
                          {request.completedAt && (
                            <p>Выполнено: {new Date(request.completedAt).toLocaleDateString('ru-RU')}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
