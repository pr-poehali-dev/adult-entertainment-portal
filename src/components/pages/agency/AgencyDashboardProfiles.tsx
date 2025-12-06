import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { CatalogItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AgencyDashboardProfilesProps {
  agencyGirls: CatalogItem[];
  onEditGirl: (girlId: number) => void;
  onDeleteGirl: (girlId: number) => void;
  onToggleActive: (girlId: number) => void;
}

export const AgencyDashboardProfiles = ({
  agencyGirls,
  onEditGirl,
  onDeleteGirl,
  onToggleActive,
}: AgencyDashboardProfilesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGirl, setSelectedGirl] = useState<CatalogItem | null>(null);

  const filteredGirls = agencyGirls.filter(girl =>
    girl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    girl.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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
              {searchQuery ? 'Анкеты не найдены' : 'Пока нет анкет'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Добавьте первую анкету, чтобы начать работу'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Анкета</th>
                  <th className="text-left py-3 px-2">Статус</th>
                  <th className="text-left py-3 px-2">Просмотры</th>
                  <th className="text-left py-3 px-2">Бронирования</th>
                  <th className="text-left py-3 px-2">Доход</th>
                  <th className="text-right py-3 px-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredGirls.map((girl) => (
                  <tr key={girl.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{girl.title}</p>
                          <p className="text-sm text-muted-foreground">{girl.seller}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        girl.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${girl.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {girl.isActive ? 'Активна' : 'Неактивна'}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" size={16} className="text-muted-foreground" />
                        <span>{girl.stats?.views || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={16} className="text-muted-foreground" />
                        <span>{girl.stats?.bookings || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-semibold text-green-600">
                        {(girl.stats?.revenue || 0).toLocaleString()} ₽
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedGirl(girl)}
                        >
                          <Icon name="Eye" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditGirl(girl.id)}
                        >
                          <Icon name="Edit" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleActive(girl.id)}
                        >
                          <Icon name={girl.isActive ? 'EyeOff' : 'Eye'} size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteGirl(girl.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedGirl} onOpenChange={(open) => !open && setSelectedGirl(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали анкеты</DialogTitle>
          </DialogHeader>
          {selectedGirl && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Основная информация</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Имя:</span>
                    <p className="font-medium">{selectedGirl.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Категория:</span>
                    <p className="font-medium">{selectedGirl.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Цена:</span>
                    <p className="font-medium">{selectedGirl.price}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Локация:</span>
                    <p className="font-medium">{selectedGirl.location || 'Не указано'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Статистика</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Icon name="Eye" className="mx-auto mb-2 text-orange-500" size={24} />
                    <p className="text-2xl font-bold">{selectedGirl.stats?.views || 0}</p>
                    <p className="text-xs text-muted-foreground">Просмотров</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Icon name="Calendar" className="mx-auto mb-2 text-blue-500" size={24} />
                    <p className="text-2xl font-bold">{selectedGirl.stats?.bookings || 0}</p>
                    <p className="text-xs text-muted-foreground">Бронирований</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Icon name="DollarSign" className="mx-auto mb-2 text-green-500" size={24} />
                    <p className="text-2xl font-bold">{(selectedGirl.stats?.revenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Доход, ₽</p>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
