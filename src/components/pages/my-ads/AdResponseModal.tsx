import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { UserAd, AdResponse, Page } from '@/types';

interface AdResponseModalProps {
  ad: UserAd;
  response: AdResponse;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  setCurrentPage: (page: Page) => void;
}

export const AdResponseModal = ({ 
  ad, 
  response, 
  onClose, 
  onAccept, 
  onReject,
  setCurrentPage 
}: AdResponseModalProps) => {
  
  const handleViewProfile = () => {
    onClose();
    setCurrentPage('seller-profile');
  };

  const handleSendMessage = () => {
    onClose();
    setCurrentPage('messages');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Отклик на объявление</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Объявление */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="outline">{ad.category}</Badge>
              <Badge variant={ad.type === 'service_offer' ? 'default' : 'secondary'}>
                {ad.type === 'service_offer' ? 'Предложение' : 'Запрос'}
              </Badge>
            </div>
            <h3 className="font-semibold mb-2">{ad.title}</h3>
            <p className="text-sm text-muted-foreground">{ad.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="font-bold text-primary">{ad.price} ₽</div>
              {ad.duration && <div className="text-muted-foreground">{ad.duration} ч</div>}
            </div>
          </div>

          {/* Профиль откликнувшегося */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/20 text-primary text-xl">
                  {response.responderName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{response.responderName}</h3>
                  <Badge variant="outline">Девушка</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Icon name="Star" size={14} className="text-yellow-500" />
                  <span>4.8</span>
                  <span className="mx-2">•</span>
                  <span>24 года</span>
                </div>
              </div>
              <Badge variant={
                response.status === 'pending' ? 'outline' :
                response.status === 'accepted' ? 'default' :
                'destructive'
              }>
                {response.status === 'pending' ? 'Новый' :
                 response.status === 'accepted' ? 'Принят' :
                 'Отклонен'}
              </Badge>
            </div>

            {/* Сообщение */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Сообщение:</p>
              <p className="text-sm">{response.message}</p>
            </div>

            {/* Информация о профиле */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                <Icon name="Info" size={14} className="inline mr-1" />
                Дополнительная информация о девушке
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Услуг выполнено</p>
                  <p className="font-semibold">127</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Время ответа</p>
                  <p className="font-semibold">15 мин</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Повторных клиентов</p>
                  <p className="font-semibold">65%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">На платформе</p>
                  <p className="font-semibold">8 мес</p>
                </div>
              </div>
            </div>
          </div>

          {/* Дата отклика */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Отклик получен: {new Date(response.createdAt).toLocaleString('ru-RU')}</span>
          </div>

          {/* Действия */}
          {response.status === 'pending' ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={handleViewProfile} variant="outline" className="flex-1 gap-2">
                  <Icon name="User" size={18} />
                  Профиль
                </Button>
                <Button onClick={handleSendMessage} variant="outline" className="flex-1 gap-2">
                  <Icon name="MessageCircle" size={18} />
                  Написать
                </Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={onReject} variant="outline" className="flex-1 gap-2">
                  <Icon name="X" size={18} />
                  Отклонить
                </Button>
                <Button onClick={onAccept} className="flex-1 gap-2">
                  <Icon name="Check" size={18} />
                  Принять отклик
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {response.status === 'accepted' 
                    ? 'Вы приняли этот отклик. Теперь вы можете связаться с девушкой.'
                    : 'Вы отклонили этот отклик.'
                  }
                </p>
              </div>
              {response.status === 'accepted' && (
                <div className="flex gap-3">
                  <Button onClick={handleViewProfile} variant="outline" className="flex-1 gap-2">
                    <Icon name="User" size={18} />
                    Смотреть профиль
                  </Button>
                  <Button onClick={handleSendMessage} className="flex-1 gap-2">
                    <Icon name="MessageCircle" size={18} />
                    Написать
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
