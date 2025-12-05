import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { ReferralStats, ReferralUser, ReferralTransaction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { testReferrals, testReferralTransactions, getReferralStats } from '@/data/testDatabase';

export const ReferralPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'transactions'>('overview');
  
  const referralCode = 'ELITE2024XYZ';
  const referralLink = `https://elite.app/ref/${referralCode}`;
  
  const stats: ReferralStats = getReferralStats();
  
  const referralUsers: ReferralUser[] = testReferrals;
  
  const transactions: ReferralTransaction[] = testReferralTransactions;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Реферальная ссылка скопирована в буфер обмена',
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-12 px-4 animate-fade-in">
      <div className="max-w-wide mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gold-shimmer">Партнёрская программа</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Приглашайте друзей и получайте до 10% с каждой их транзакции
          </p>
        </div>
        
        <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Ваша реферальная ссылка</h3>
                <p className="text-muted-foreground mb-4">Поделитесь ссылкой и зарабатывайте</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 bg-card/80 backdrop-blur-sm text-center md:text-left"
                  />
                  <Button 
                    onClick={() => copyToClipboard(referralLink)}
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  >
                    <Icon name="Copy" size={20} className="mr-2" />
                    Копировать
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Присоединяйся к Elite!`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Icon name="MessageCircle" size={20} />
                  Telegram
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Присоединяйся к Elite! ' + referralLink)}`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Icon name="MessageSquare" size={20} />
                  WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalReferrals}</h3>
              <p className="text-muted-foreground">Всего рефералов</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Icon name="UserCheck" size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.activeReferrals}</h3>
              <p className="text-muted-foreground">Активных</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-yellow-500/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center">
                <Icon name="Wallet" size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalEarned.toLocaleString()} ₽</h3>
              <p className="text-muted-foreground">Всего заработано</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Icon name="TrendingUp" size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">10%</h3>
              <p className="text-muted-foreground">Макс. комиссия</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-300 dark:border-pink-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                <Icon name="Heart" size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  Валюта LOVE 💗
                </h3>
                <p className="text-muted-foreground mb-4">
                  Внутренняя валюта платформы, которую можно зарабатывать и использовать для оплаты услуг
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Gift" size={20} className="text-pink-600 dark:text-pink-400" />
                      <h4 className="font-semibold text-pink-600 dark:text-pink-400">Зарабатывайте</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• +100 💗 за реферала 1 линии</li>
                      <li>• +50 💗 за реферала 2 линии</li>
                      <li>• +25 💗 за реферала 3 линии</li>
                      <li>• Ежедневные бонусы</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="ShoppingBag" size={20} className="text-pink-600 dark:text-pink-400" />
                      <h4 className="font-semibold text-pink-600 dark:text-pink-400">Используйте</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Оплата услуг</li>
                      <li>• VIP статус</li>
                      <li>• Открытие агентства</li>
                      <li>• Эксклюзивный контент</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="TrendingUp" size={20} className="text-pink-600 dark:text-pink-400" />
                      <h4 className="font-semibold text-pink-600 dark:text-pink-400">Курс обмена</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 1 💗 = 10 ₽</li>
                      <li>• 100 💗 = 1000 ₽</li>
                      <li>• 1000 💗 = 10 000 ₽</li>
                      <li className="text-pink-600 dark:text-pink-400 font-semibold">Без комиссий!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Уровни комиссии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-5xl font-bold text-primary mb-2">10%</div>
                <h4 className="text-xl font-semibold mb-2">1 линия</h4>
                <p className="text-muted-foreground mb-4">Ваши прямые рефералы</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span className="font-medium">{stats.level1Count} человек</span>
                </div>
                <div className="mt-2 text-lg font-bold text-primary">
                  {stats.level1Earned.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="text-5xl font-bold text-blue-500 mb-2">5%</div>
                <h4 className="text-xl font-semibold mb-2">2 линия</h4>
                <p className="text-muted-foreground mb-4">Рефералы ваших рефералов</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Icon name="Users" size={16} className="text-blue-500" />
                  <span className="font-medium">{stats.level2Count} человек</span>
                </div>
                <div className="mt-2 text-lg font-bold text-blue-500">
                  {stats.level2Earned.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                <div className="text-5xl font-bold text-purple-500 mb-2">1%</div>
                <h4 className="text-xl font-semibold mb-2">3 линия</h4>
                <p className="text-muted-foreground mb-4">Третий уровень рефералов</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Icon name="Users" size={16} className="text-purple-500" />
                  <span className="font-medium">{stats.level3Count} человек</span>
                </div>
                <div className="mt-2 text-lg font-bold text-purple-500">
                  {stats.level3Earned.toLocaleString()} ₽
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl">Детализация</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('overview')}
                  className="flex-1 sm:flex-none"
                >
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Обзор
                </Button>
                <Button 
                  variant={activeTab === 'referrals' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('referrals')}
                  className="flex-1 sm:flex-none"
                >
                  <Icon name="Users" size={16} className="mr-2" />
                  Рефералы
                </Button>
                <Button 
                  variant={activeTab === 'transactions' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('transactions')}
                  className="flex-1 sm:flex-none"
                >
                  <Icon name="Receipt" size={16} className="mr-2" />
                  История
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                      Последние 7 дней
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Новых рефералов:</span>
                        <span className="font-bold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Заработано:</span>
                        <span className="font-bold text-primary">8,500 ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Конверсия:</span>
                        <span className="font-bold">68%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Award" size={20} className="text-primary" />
                      Топ реферал
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Имя:</span>
                        <span className="font-bold">Анна Смирнова</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Потрачено:</span>
                        <span className="font-bold">45,000 ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ваш доход:</span>
                        <span className="font-bold text-primary">4,500 ₽</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'referrals' && (
              <div className="space-y-4">
                {referralUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Регистрация: {new Date(user.registeredDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.level === 1 ? 'bg-primary/20 text-primary' :
                        user.level === 2 ? 'bg-blue-500/20 text-blue-500' :
                        'bg-purple-500/20 text-purple-500'
                      }`}>
                        {user.level} линия ({user.level === 1 ? '10%' : user.level === 2 ? '5%' : '1%'})
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Потрачено</p>
                        <p className="font-bold">{user.totalSpent.toLocaleString()} ₽</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Ваш доход</p>
                        <p className="font-bold text-primary">{user.yourEarnings.toLocaleString()} ₽</p>
                      </div>
                      
                      {user.isActive && (
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Активен" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'transactions' && (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="ArrowDownLeft" size={16} className="text-primary" />
                        <span className="font-semibold">{transaction.fromUser}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          transaction.level === 1 ? 'bg-primary/20 text-primary' :
                          transaction.level === 2 ? 'bg-blue-500/20 text-blue-500' :
                          'bg-purple-500/20 text-purple-500'
                        }`}>
                          {transaction.level} линия
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.type} • {new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Сумма транзакции</p>
                      <p className="font-medium">{transaction.amount.toLocaleString()} ₽</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Ваш доход</p>
                      <p className="font-bold text-primary text-lg">+{transaction.commission.toLocaleString()} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};