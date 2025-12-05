import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { UserAd } from '@/types';
import { Badge } from '@/components/ui/badge';

interface AdRespondModalProps {
  ad: UserAd;
  onClose: () => void;
  onRespond: (message: string) => void;
}

export const AdRespondModal = ({ ad, onClose, onRespond }: AdRespondModalProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert('Напишите сообщение');
      return;
    }

    // Имитируем отправку уведомления автору объявления
    // В реальном приложении это будет через API
    setTimeout(() => {
      // Создаем уведомление для автора объявления
      const notification = {
        id: Date.now(),
        type: 'ad_response' as const,
        title: 'Новый отклик на объявление!',
        text: `Девушка откликнулась на "${ad.title}". Посмотрите профиль и примите решение.`,
        time: new Date().toISOString(),
        read: false,
        adId: ad.id,
        responseId: Date.now()
      };

      // Отправляем уведомление через сервис (звук, вибрация, push)
      if (typeof window !== 'undefined') {
        const { notificationService } = require('@/utils/notificationService');
        notificationService.notify(notification);
      }
    }, 500);

    onRespond(message.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Откликнуться на запрос</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Информация об объявлении */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Badge variant="outline">{ad.category}</Badge>
              <Badge className="bg-gradient-to-r from-primary to-primary/90">
                {ad.price} ₽ {ad.duration && `• ${ad.duration} ч`}
              </Badge>
            </div>
            <h3 className="font-semibold mb-2">{ad.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
            
            {ad.lookingFor && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Ищет:</p>
                <p className="text-sm">{ad.lookingFor}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">
                Ваше сообщение <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Представьтесь и расскажите почему вы подходите для этого запроса. Опишите свой опыт и условия..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">{message.length}/1000</p>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-4 text-sm space-y-2 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-blue-500">Что произойдёт дальше:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Ваш отклик получит {ad.authorName}</li>
                    <li>Он сможет посмотреть ваш профиль</li>
                    <li>Если ему понравится — он примет отклик</li>
                    <li>После этого вы сможете обсудить детали встречи</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
              <Button type="submit" className="flex-1 gap-2">
                <Icon name="Send" size={18} />
                Отправить отклик
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};