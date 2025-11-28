import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold mb-2">Настройки платформы</h2>
        <p className="text-muted-foreground">Управление системными параметрами</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" size={20} />
            Общие настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Регистрация новых пользователей</div>
              <div className="text-sm text-muted-foreground">Разрешить регистрацию на платформе</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Модерация объявлений</div>
              <div className="text-sm text-muted-foreground">Требовать одобрение админа для новых объявлений</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Автоматическая верификация</div>
              <div className="text-sm text-muted-foreground">Автоматически верифицировать новых продавцов</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Режим обслуживания</div>
              <div className="text-sm text-muted-foreground">Показывать страницу технических работ</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="DollarSign" size={20} />
            Финансовые настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Комиссия платформы (%)</label>
            <Input type="number" defaultValue="15" />
            <p className="text-xs text-muted-foreground">Процент комиссии с каждого бронирования</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Минимальная сумма вывода (₽)</label>
            <Input type="number" defaultValue="1000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Стоимость VIP статуса (₽/месяц)</label>
            <Input type="number" defaultValue="5000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Стоимость Premium объявления (₽)</label>
            <Input type="number" defaultValue="5000" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mail" size={20} />
            Email уведомления
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Уведомления о новых регистрациях</div>
              <div className="text-sm text-muted-foreground">Отправлять email при регистрации пользователя</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Уведомления о новых бронированиях</div>
              <div className="text-sm text-muted-foreground">Отправлять email при создании бронирования</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Ежедневные отчеты</div>
              <div className="text-sm text-muted-foreground">Получать ежедневную статистику на email</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Двухфакторная аутентификация</div>
              <div className="text-sm text-muted-foreground">Требовать 2FA для админов</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Логирование действий</div>
              <div className="text-sm text-muted-foreground">Сохранять логи всех админских действий</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Время сессии (минут)</label>
            <Input type="number" defaultValue="60" />
            <p className="text-xs text-muted-foreground">Автоматический выход после неактивности</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Icon name="Save" size={18} />
          Сохранить изменения
        </Button>
        <Button variant="outline" className="gap-2">
          <Icon name="RotateCcw" size={18} />
          Сбросить
        </Button>
      </div>
    </div>
  );
};
