import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminStats } from '@/data/adminData';
import Icon from '@/components/ui/icon';

export const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Всего пользователей', 
      value: adminStats.totalUsers, 
      icon: 'Users', 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      change: `+${adminStats.newUsersToday} сегодня`
    },
    { 
      title: 'Продавцы', 
      value: adminStats.totalSellers, 
      icon: 'Store', 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      title: 'Покупатели', 
      value: adminStats.totalBuyers, 
      icon: 'ShoppingBag', 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      title: 'Всего бронирований', 
      value: adminStats.totalBookings, 
      icon: 'Calendar', 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      change: `${adminStats.activeBookings} активных`
    },
    { 
      title: 'Общий доход', 
      value: `${(adminStats.totalRevenue / 1000000).toFixed(1)}М ₽`, 
      icon: 'DollarSign', 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    { 
      title: 'Платные объявления', 
      value: adminStats.totalAds, 
      icon: 'Megaphone', 
      color: 'text-pink-500',
      bg: 'bg-pink-500/10'
    },
    { 
      title: 'Аудио на модерации', 
      value: 2, 
      icon: 'Volume2', 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      change: 'Требуют проверки'
    },
    { 
      title: 'Фото на модерации', 
      value: 3, 
      icon: 'Image', 
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      change: 'Требуют проверки'
    },
    { 
      title: 'Отклики на вакансии', 
      value: adminStats.totalWorkApplications, 
      icon: 'Briefcase', 
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    { 
      title: 'Premium пользователи', 
      value: adminStats.premiumUsers, 
      icon: 'Crown', 
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Обзор платформы</h2>
        <p className="text-muted-foreground">Основные метрики и статистика</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon name={stat.icon as any} size={20} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              Активность за последние 7 дней
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Icon name="BarChart3" size={64} className="mx-auto mb-4 opacity-50" />
                <p>График будет здесь</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="PieChart" size={20} className="text-primary" />
              Распределение пользователей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500"></div>
                  <span className="text-sm">Продавцы</span>
                </div>
                <span className="font-semibold">{adminStats.totalSellers} ({((adminStats.totalSellers / adminStats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm">Покупатели</span>
                </div>
                <span className="font-semibold">{adminStats.totalBuyers} ({((adminStats.totalBuyers / adminStats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500"></div>
                  <span className="text-sm">VIP пользователи</span>
                </div>
                <span className="font-semibold">{adminStats.premiumUsers} ({((adminStats.premiumUsers / adminStats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-primary" />
            Последняя активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: 'UserPlus', text: 'Новый пользователь зарегистрировался', time: '5 минут назад', color: 'text-green-500' },
              { icon: 'Calendar', text: 'Создано новое бронирование', time: '12 минут назад', color: 'text-blue-500' },
              { icon: 'Megaphone', text: 'Опубликовано платное объявление', time: '1 час назад', color: 'text-purple-500' },
              { icon: 'Crown', text: 'Пользователь приобрел VIP статус', time: '2 часа назад', color: 'text-amber-500' },
              { icon: 'Send', text: 'Новый отклик на вакансию', time: '3 часа назад', color: 'text-cyan-500' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg bg-accent ${activity.color}`}>
                  <Icon name={activity.icon as any} size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};