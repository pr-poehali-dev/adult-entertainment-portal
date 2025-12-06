import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CatalogItem } from '@/types';

interface AgencyDashboardOverviewProps {
  agencyGirls: CatalogItem[];
  activeGirls: number;
  totalViews: number;
  totalBookings: number;
  totalRevenue: number;
  onAddGirl: () => void;
}

export const AgencyDashboardOverview = ({
  agencyGirls,
  activeGirls,
  totalViews,
  totalBookings,
  totalRevenue,
  onAddGirl,
}: AgencyDashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={24} className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{agencyGirls.length}</p>
          <p className="text-sm text-muted-foreground">Всего моделей</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold">{activeGirls}</p>
          <p className="text-sm text-muted-foreground">Активных</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Eye" size={24} className="text-orange-600" />
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Просмотров</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Calendar" size={24} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{totalBookings}</p>
          <p className="text-sm text-muted-foreground">Бронирований</p>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Общий доход</p>
              <p className="text-4xl font-bold text-emerald-600">{totalRevenue.toLocaleString()} ₽</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Icon name="Download" size={16} />
            <span className="ml-2">Скачать отчет</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Топ моделей по просмотрам
          </h3>
          <div className="space-y-3">
            {agencyGirls
              .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
              .slice(0, 5)
              .map((girl) => (
                <div key={girl.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {girl.title.charAt(0)}
                    </div>
                    <span className="font-medium">{girl.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{girl.stats?.views || 0} просм.</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Icon name="Star" size={20} className="text-primary" />
            Быстрые действия
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onAddGirl}
            >
              <Icon name="UserPlus" size={18} />
              <span className="ml-2">Добавить новую модель</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Settings" size={18} />
              <span className="ml-2">Настройки агентства</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="FileText" size={18} />
              <span className="ml-2">Сгенерировать отчет</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="HelpCircle" size={18} />
              <span className="ml-2">Помощь и поддержка</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
