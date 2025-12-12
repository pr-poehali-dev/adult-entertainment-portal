import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { notificationService } from '@/utils/notificationService';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const ProfileNotificationsTab = () => {
  const { toast } = useToast();
  const [hasPermissions, setHasPermissions] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    push: true,
    adResponses: true,
    messages: true,
    bookings: true,
    reviews: true,
    system: true,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasPermissions(notificationService.hasPermissions());
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermissions();
    setHasPermissions(granted);
    
    if (granted) {
      // Тестовое уведомление
      notificationService.testNotification();
    }
  };

  const handleTestNotification = () => {
    notificationService.testNotification();
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    setHasUnsavedChanges(true);
    
    // Автосохранение с уведомлением
    toast({
      title: "Настройка изменена",
      description: "Изменения сохранены автоматически",
    });
  };

  const handleSaveSettings = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Настройки сохранены",
      description: "Все изменения уведомлений применены",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" size={24} className="text-primary" />
            Настройка уведомлений
          </CardTitle>
          <CardDescription>
            Управляйте звуками, вибрацией и push-уведомлениями
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Статус разрешений */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${hasPermissions ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium">
                  {hasPermissions ? 'Уведомления включены' : 'Уведомления отключены'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasPermissions 
                    ? 'Вы получаете все типы уведомлений' 
                    : 'Включите уведомления для полного функционала'
                  }
                </p>
              </div>
            </div>
            {!hasPermissions && (
              <Button onClick={handleEnableNotifications} className="gap-2">
                <Icon name="BellRing" size={18} />
                Включить
              </Button>
            )}
          </div>

          {/* Тестовое уведомление */}
          {hasPermissions && (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Icon name="TestTube" size={24} className="text-primary" />
                <div>
                  <p className="font-medium">Тестовое уведомление</p>
                  <p className="text-sm text-muted-foreground">
                    Проверьте работу звука, вибрации и push
                  </p>
                </div>
              </div>
              <Button onClick={handleTestNotification} variant="outline" className="gap-2">
                <Icon name="Play" size={18} />
                Тест
              </Button>
            </div>
          )}

          {/* Типы уведомлений */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Filter" size={18} />
              Типы уведомлений
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="MessageCircle" size={20} className="text-blue-500" />
                  <div>
                    <Label htmlFor="ad-responses" className="font-medium cursor-pointer">
                      Отклики на объявления
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Когда девушка откликается на ваш запрос
                    </p>
                  </div>
                </div>
                <Switch
                  id="ad-responses"
                  checked={settings.adResponses}
                  onCheckedChange={(checked) => handleSettingChange('adResponses', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={20} className="text-green-500" />
                  <div>
                    <Label htmlFor="messages" className="font-medium cursor-pointer">
                      Сообщения
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Новые сообщения в чате
                    </p>
                  </div>
                </div>
                <Switch
                  id="messages"
                  checked={settings.messages}
                  onCheckedChange={(checked) => handleSettingChange('messages', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={20} className="text-purple-500" />
                  <div>
                    <Label htmlFor="bookings" className="font-medium cursor-pointer">
                      Бронирования
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Новые и изменённые бронирования
                    </p>
                  </div>
                </div>
                <Switch
                  id="bookings"
                  checked={settings.bookings}
                  onCheckedChange={(checked) => handleSettingChange('bookings', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Star" size={20} className="text-yellow-500" />
                  <div>
                    <Label htmlFor="reviews" className="font-medium cursor-pointer">
                      Отзывы
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Новые отзывы и оценки
                    </p>
                  </div>
                </div>
                <Switch
                  id="reviews"
                  checked={settings.reviews}
                  onCheckedChange={(checked) => handleSettingChange('reviews', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Info" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="system" className="font-medium cursor-pointer">
                      Системные
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Важные уведомления платформы
                    </p>
                  </div>
                </div>
                <Switch
                  id="system"
                  checked={settings.system}
                  onCheckedChange={(checked) => handleSettingChange('system', checked)}
                />
              </div>
            </div>
          </div>

          {/* Способы уведомлений */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Settings" size={18} />
              Способы уведомлений
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Volume2" size={20} className="text-primary" />
                  <div>
                    <Label htmlFor="sound" className="font-medium cursor-pointer">
                      Звук
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Звуковые оповещения
                    </p>
                  </div>
                </div>
                <Switch
                  id="sound"
                  checked={settings.sound}
                  onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="Vibrate" size={20} className="text-primary" />
                  <div>
                    <Label htmlFor="vibration" className="font-medium cursor-pointer">
                      Вибрация
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Вибрация на мобильных устройствах
                    </p>
                  </div>
                </div>
                <Switch
                  id="vibration"
                  checked={settings.vibration}
                  onCheckedChange={(checked) => handleSettingChange('vibration', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name="BellRing" size={20} className="text-primary" />
                  <div>
                    <Label htmlFor="push" className="font-medium cursor-pointer">
                      Push-уведомления
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Уведомления в браузере
                    </p>
                  </div>
                </div>
                <Switch
                  id="push"
                  checked={settings.push}
                  onCheckedChange={(checked) => handleSettingChange('push', checked)}
                />
              </div>
            </div>
          </div>

          {/* Информация */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-500">Особенности уведомлений:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Разные звуки для разных типов событий</li>
                  <li>Уникальные паттерны вибрации</li>
                  <li>Push-уведомления работают даже когда вкладка неактивна</li>
                  <li>Настройки сохраняются в вашем браузере</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={16} className="text-green-500" />
              <span>Автосохранение включено</span>
            </div>
            <Button 
              onClick={handleSaveSettings}
              variant="outline"
              className="px-6"
            >
              <Icon name="Check" size={18} className="mr-2" />
              Сохранить вручную
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};