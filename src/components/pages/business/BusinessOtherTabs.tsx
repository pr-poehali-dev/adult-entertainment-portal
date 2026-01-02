import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type BusinessNavTab = 'services' | 'profile' | 'messages' | 'ads' | 'balance' | 'settings' | 'notifications';

interface BusinessOtherTabsProps {
  activeTab: BusinessNavTab;
}

export const BusinessOtherTabs = ({ activeTab }: BusinessOtherTabsProps) => {
  if (activeTab === 'messages') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" size={24} />
            Сообщения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нет новых сообщений</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'balance') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Wallet" size={24} />
            Баланс и выплаты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white">
              <p className="text-sm opacity-90 mb-1">Доступно к выводу</p>
              <p className="text-4xl font-bold">0 ₽</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Заработано всего</p>
                <p className="text-2xl font-bold">0 ₽</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Выведено</p>
                <p className="text-2xl font-bold">0 ₽</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'settings') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Настройки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Settings" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Настройки в разработке</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" size={24} />
            Уведомления
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Bell" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нет новых уведомлений</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
