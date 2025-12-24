import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { pushNotificationService } from '@/utils/pushNotifications';

export const NotificationPermissionPrompt = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      const hasAsked = localStorage.getItem('notification-permission-asked');
      const permission = pushNotificationService.getPermissionStatus();
      
      if (!hasAsked && permission === 'default' && pushNotificationService.isSupported()) {
        setTimeout(() => setShow(true), 3000);
      }
    };

    checkPermission();
  }, []);

  const handleAllow = async () => {
    const granted = await pushNotificationService.requestPermission();
    localStorage.setItem('notification-permission-asked', 'true');
    
    if (granted) {
      await pushNotificationService.showNotification('🎉 Уведомления включены!', {
        body: 'Теперь вы не пропустите новые сообщения и совпадения',
        silent: false,
      });
    }
    
    setShow(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-permission-asked', 'true');
    setShow(false);
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-8 md:max-w-sm animate-slide-up">
      <Card className="p-4 shadow-2xl border-2 border-primary/20">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <Icon name="Bell" size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">Включить уведомления?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Получайте мгновенные оповещения о новых сообщениях и совпадениях
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleAllow}
                size="sm"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                <Icon name="Check" size={16} className="mr-1" />
                Включить
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="flex-1"
              >
                Не сейчас
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
