import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CatalogItem } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AgencyDashboardProps {
  agencyName: string;
  agencyGirls: CatalogItem[];
  onBack: () => void;
  onAddGirl: () => void;
  onEditGirl: (girlId: number) => void;
  onDeleteGirl: (girlId: number) => void;
  onToggleActive: (girlId: number) => void;
  onIncrementViews?: (girlId: number) => void;
}

const AgencyDashboard = ({
  agencyName,
  agencyGirls,
  onBack,
  onAddGirl,
  onEditGirl,
  onDeleteGirl,
  onToggleActive,
}: AgencyDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGirl, setSelectedGirl] = useState<CatalogItem | null>(null);

  const filteredGirls = agencyGirls.filter(girl =>
    girl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    girl.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGirls = agencyGirls.filter(g => g.isActive).length;
  const totalBookings = agencyGirls.reduce((sum, g) => sum + (g.stats?.bookings || 0), 0);
  const totalRevenue = agencyGirls.reduce((sum, g) => sum + (g.stats?.revenue || 0), 0);
  const totalViews = agencyGirls.reduce((sum, g) => sum + (g.stats?.views || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="Building2" size={28} className="text-primary" />
                  {agencyName}
                </h1>
                <p className="text-sm text-muted-foreground">Панель управления агентством</p>
              </div>
            </div>
            <Button onClick={onAddGirl} size="lg">
              <Icon name="UserPlus" size={20} />
              <span className="ml-2">Добавить анкету</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <p className="text-3xl font-bold">{agencyGirls.length}</p>
            <p className="text-sm text-muted-foreground">Всего анкет</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5">
            <div className="flex items-center justify-between mb-2">
              <Icon name="CheckCircle" size={24} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold">{activeGirls}</p>
            <p className="text-sm text-muted-foreground">Активных</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Eye" size={24} className="text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Просмотров</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Calendar" size={24} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{totalBookings}</p>
            <p className="text-sm text-muted-foreground">Бронирований</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={24} className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
            <p className="text-sm text-muted-foreground">Доход</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по анкетам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredGirls.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="UserX" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'Анкеты не найдены' : 'Нет анкет'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Добавьте первую анкету девушки'}
              </p>
              {!searchQuery && (
                <Button onClick={onAddGirl}>
                  <Icon name="Plus" size={20} />
                  <span className="ml-2">Добавить анкету</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGirls.map((girl) => (
                <Card key={girl.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src={girl.image}
                      alt={girl.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{girl.title}</h3>
                          <p className="text-sm text-muted-foreground">{girl.seller}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {girl.isActive ? (
                            <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                              <Icon name="CheckCircle" size={12} />
                              Активна
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              <Icon name="XCircle" size={12} />
                              Не активна
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {girl.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-yellow-500" />
                          {girl.rating}
                        </span>
                        <span className="font-semibold text-primary">{girl.price}</span>
                        {girl.age && (
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {girl.age} лет
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedGirl(girl)}
                        >
                          <Icon name="BarChart3" size={16} />
                          <span className="ml-1">Статистика</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleActive(girl.id)}
                        >
                          <Icon name={girl.isActive ? "Pause" : "Play"} size={16} />
                          <span className="ml-1">
                            {girl.isActive ? 'Деактивировать' : 'Активировать'}
                          </span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditGirl(girl.id)}
                        >
                          <Icon name="Edit" size={16} />
                          <span className="ml-1">Редактировать</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteGirl(girl.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Icon name="Trash2" size={16} />
                          <span className="ml-1">Удалить</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={!!selectedGirl} onOpenChange={() => setSelectedGirl(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={24} className="text-primary" />
              Статистика: {selectedGirl?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedGirl && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Eye" size={20} className="text-orange-500" />
                    <span className="text-sm text-muted-foreground">Просмотры</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedGirl.stats?.views.toLocaleString() || 0}</p>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Calendar" size={20} className="text-blue-500" />
                    <span className="text-sm text-muted-foreground">Бронирования</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedGirl.stats?.bookings || 0}</p>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="DollarSign" size={20} className="text-purple-500" />
                    <span className="text-sm text-muted-foreground">Доход</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedGirl.stats?.revenue.toLocaleString() || 0} ₽</p>
                </Card>
              </div>

              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  Показатели эффективности
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Конверсия просмотров в бронирования:</span>
                    <span className="font-semibold">
                      {selectedGirl.stats?.views && selectedGirl.stats.views > 0
                        ? `${((selectedGirl.stats.bookings / selectedGirl.stats.views) * 100).toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Средний доход за бронирование:</span>
                    <span className="font-semibold">
                      {selectedGirl.stats?.bookings && selectedGirl.stats.bookings > 0
                        ? `${Math.round(selectedGirl.stats.revenue / selectedGirl.stats.bookings).toLocaleString()} ₽`
                        : '0 ₽'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Рейтинг:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Icon name="Star" size={14} className="text-yellow-500" />
                      {selectedGirl.rating}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="MapPin" size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Локация</span>
                  </div>
                  <p className="text-muted-foreground">{selectedGirl.location}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="DollarSign" size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Цена</span>
                  </div>
                  <p className="text-muted-foreground">{selectedGirl.price}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="User" size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Возраст</span>
                  </div>
                  <p className="text-muted-foreground">{selectedGirl.age} лет</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Activity" size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Статус</span>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedGirl.isActive ? 'Активна' : 'Не активна'}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyDashboard;