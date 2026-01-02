import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { usePartnerProgram } from '@/contexts/PartnerProgramContext';
import { useState } from 'react';

export const AdminPartnerProgram = () => {
  const { stats, referrals, earnings, withdrawalRequests, partnerLevels } = usePartnerProgram();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'referrals' | 'earnings' | 'withdrawals'>('overview');

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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Партнерская программа (MLM)</h2>
        <p className="text-muted-foreground">Управление многоуровневой партнерской программой</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего партнеров
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <Icon name="Users" size={20} className="text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">Активных: {stats.activeReferrals}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/10 to-yellow-500/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Общий оборот
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="DollarSign" size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.totalEarned.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">Выплачено партнерам</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-pink-500/10 to-rose-600/10 border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              LOVE токены
            </CardTitle>
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Icon name="Heart" size={20} className="text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.loveBalance * stats.totalReferrals} 💗</div>
            <p className="text-xs text-muted-foreground">Распределено</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              На выплату
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Icon name="Banknote" size={20} className="text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.pendingWithdrawal.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">Доступно: {stats.availableForWithdrawal.toLocaleString()} ₽</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {partnerLevels.map((level) => (
          <Card key={level.level}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  level.level === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                  level.level === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                  'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                }`}>
                  {level.level}
                </div>
                {level.level} линия
              </CardTitle>
              <CardDescription>
                Комиссия: {level.percentage}% + {level.loveBonus} 💗
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Партнеров:</span>
                  <span className="font-semibold">{stats[`level${level.level}Count` as keyof typeof stats]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Заработано:</span>
                  <span className="font-semibold text-green-600">{stats[`level${level.level}Earned` as keyof typeof stats].toLocaleString()} ₽</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 border-b border-border">
        <Button
          variant={selectedTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('overview')}
          className="rounded-b-none"
        >
          <Icon name="BarChart3" size={16} className="mr-2" />
          Обзор
        </Button>
        <Button
          variant={selectedTab === 'referrals' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('referrals')}
          className="rounded-b-none"
        >
          <Icon name="Users" size={16} className="mr-2" />
          Партнеры
        </Button>
        <Button
          variant={selectedTab === 'earnings' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('earnings')}
          className="rounded-b-none"
        >
          <Icon name="TrendingUp" size={16} className="mr-2" />
          Транзакции
        </Button>
        <Button
          variant={selectedTab === 'withdrawals' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('withdrawals')}
          className="rounded-b-none"
        >
          <Icon name="Wallet" size={16} className="mr-2" />
          Выплаты
        </Button>
      </div>

      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                Динамика роста
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="BarChart3" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>График роста партнерской сети</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={20} className="text-primary" />
                Распределение по линиям
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerLevels.map((level) => {
                  const count = stats[`level${level.level}Count` as keyof typeof stats] as number;
                  const percentage = ((count / stats.totalReferrals) * 100).toFixed(1);
                  return (
                    <div key={level.level} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${
                          level.level === 1 ? 'bg-yellow-500' :
                          level.level === 2 ? 'bg-gray-500' :
                          'bg-orange-500'
                        }`}></div>
                        <span className="text-sm">{level.level} линия</span>
                      </div>
                      <span className="font-semibold">{count} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'referrals' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Список партнеров
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
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Активен
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Регистрация: {new Date(referral.registeredAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">Потрачено: {referral.totalSpent.toLocaleString()} ₽</div>
                    <p className="text-sm text-green-600">Заработано: +{referral.yourEarnings.toLocaleString()} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'earnings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              История транзакций
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
                      {new Date(earning.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Транзакция: {earning.amount.toLocaleString()} {earning.currency} • {earning.transactionType}
                    </p>
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
      )}

      {selectedTab === 'withdrawals' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Wallet" size={20} />
              Заявки на вывод средств
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawalRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Заявка #{request.id}</h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Создана: {new Date(request.requestedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Метод: {request.method === 'card' ? 'Карта' : request.method === 'crypto' ? 'Криптовалюта' : 'Электронный кошелек'} • {request.details}
                    </p>
                    {request.completedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Выполнена: {new Date(request.completedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{request.amount.toLocaleString()} {request.currency}</div>
                    {request.status === 'processing' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default">
                          <Icon name="Check" size={14} className="mr-1" />
                          Одобрить
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Icon name="X" size={14} className="mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
