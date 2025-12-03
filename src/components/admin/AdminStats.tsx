import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    moderationQueue: number;
    totalTransactions: number;
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего пользователей</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">Активных: {stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Общий доход</p>
              <p className="text-3xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}К ₽</p>
              <p className="text-xs text-green-600 mt-1">+12% за месяц</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">На модерации</p>
              <p className="text-3xl font-bold">{stats.moderationQueue}</p>
              <p className="text-xs text-orange-600 mt-1">Требует внимания</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Транзакции</p>
              <p className="text-3xl font-bold">{stats.totalTransactions}</p>
              <p className="text-xs text-purple-600 mt-1">За весь период</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
