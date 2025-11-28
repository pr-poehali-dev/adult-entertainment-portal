import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ServiceProvider, TravelDestination, ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TravelInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ServiceProvider;
  destination: TravelDestination;
}

export const TravelInvitationDialog = ({
  isOpen,
  onClose,
  provider,
  destination,
}: TravelInvitationDialogProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = 100;
  const currentUserName = 'Вы';

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = calculateDays(destination.startDate, destination.endDate);
  const totalPrice = days * destination.pricePerDay;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: 1,
        senderId: currentUserId,
        senderName: currentUserName,
        text: `Здравствуйте! Хочу пригласить вас в ${destination.resort} с ${new Date(destination.startDate).toLocaleDateString('ru-RU')} по ${new Date(destination.endDate).toLocaleDateString('ru-RU')}. Готовы обсудить детали?`,
        timestamp: new Date().toISOString(),
        read: true,
      };
      setMessages([initialMessage]);

      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      setTimeout(() => {
        const response: ChatMessage = {
          id: 2,
          senderId: provider.id,
          senderName: provider.name,
          senderAvatar: provider.avatar,
          text: 'Здравствуйте! Да, конечно! Этот курорт один из моих любимых. Давайте обсудим детали путешествия. Что вас интересует?',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, response]);
        setIsTyping(false);
      }, 3000);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      senderId: currentUserId,
      senderName: currentUserName,
      text: messageText,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    setIsTyping(true);

    const responses = [
      'Отличный вопрос! Давайте обсудим это подробнее.',
      'Да, конечно. Все детали можно согласовать.',
      'Хорошо, я могу организовать это.',
      'Согласна, это важный момент. Обязательно учтем.',
      'Прекрасно! Я с удовольствием вам помогу с этим.',
    ];

    setTimeout(() => {
      const response: ChatMessage = {
        id: messages.length + 2,
        senderId: provider.id,
        senderName: provider.name,
        senderAvatar: provider.avatar,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmBooking = () => {
    toast({
      title: 'Приглашение отправлено!',
      description: `${provider.name} рассмотрит ваше предложение в течение 24 часов`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {provider.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{provider.name}</DialogTitle>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="font-semibold">
                    {destination.resort}, {destination.country}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span>
                    {new Date(destination.startDate).toLocaleDateString('ru-RU')} -{' '}
                    {new Date(destination.endDate).toLocaleDateString('ru-RU')}
                  </span>
                  <Badge variant="outline">{days} дней</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Стоимость: </span>
                    <span className="font-bold text-primary text-lg">
                      {totalPrice.toLocaleString('ru-RU')} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isOwnMessage && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {message.senderName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-2">
                    {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {provider.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2 mb-3">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
              <Icon name="Send" size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              После обсуждения всех деталей подтвердите бронирование
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Отменить
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
              >
                <Icon name="CheckCircle2" size={18} className="mr-2" />
                Подтвердить бронирование
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
