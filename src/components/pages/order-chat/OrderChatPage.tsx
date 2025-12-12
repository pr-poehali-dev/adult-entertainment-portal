import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page, OrderChat, ChatMessage, RealMeetingOrder } from '@/types';

interface OrderChatPageProps {
  chatId: number;
  setCurrentPage: (page: Page) => void;
  orderChats: OrderChat[];
  setOrderChats: (chats: OrderChat[]) => void;
  bookings: RealMeetingOrder[];
  currentUserId: number;
}

const meetingTypeNames = {
  outcall: 'Выезд',
  apartment: 'Апартаменты',
};

const programNames = {
  classic: 'Классика',
  standard: 'Стандарт',
  exclusive: 'Эксклюзив',
};

export const OrderChatPage = ({
  chatId,
  setCurrentPage,
  orderChats,
  setOrderChats,
  bookings,
  currentUserId,
}: OrderChatPageProps) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = orderChats.find((c) => c.id === chatId);
  const order = bookings.find((b) => b.chatId === chatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="MessageCircleOff" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Чат не найден</p>
            <Button onClick={() => setCurrentPage('my-orders')} className="mt-4">
              Вернуться к заказам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isProvider = currentUserId === order.providerId;
  const otherUser = isProvider
    ? { name: order.buyerName, avatar: order.buyerAvatar }
    : { name: order.providerName, avatar: order.providerAvatar };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: isProvider ? order.providerName : order.buyerName,
      senderAvatar: isProvider ? order.providerAvatar : order.buyerAvatar,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedChats = orderChats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessageAt: new Date().toISOString(),
        };
      }
      return c;
    });

    setOrderChats(updatedChats);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="rounded-none border-b border-x-0 border-t-0">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage('my-orders')}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-bold">{otherUser.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Icon
                      name={order.meetingType === 'outcall' ? 'Car' : 'Home'}
                      size={12}
                    />
                    {meetingTypeNames[order.meetingType]} •{' '}
                    {new Date(order.date).toLocaleDateString('ru-RU')} {order.time}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                Оплачено
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Order Info */}
        <Card className="rounded-none border-b border-x-0 border-t-0">
          <CardContent className="py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Программа</p>
                <p className="font-semibold">{programNames[order.program]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Длительность</p>
                <p className="font-semibold">
                  {order.hours}{' '}
                  {order.hours === 1 ? 'час' : order.hours < 5 ? 'часа' : 'часов'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Стоимость</p>
                <p className="font-semibold text-primary">
                  {order.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              {order.meetingType === 'outcall' && order.address && (
                <div className="col-span-2 md:col-span-1">
                  <p className="text-muted-foreground">Адрес</p>
                  <p className="font-semibold text-xs">{order.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="h-[calc(100vh-340px)] overflow-y-auto bg-muted/20 p-4">
          {chat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Начните обсуждение встречи</p>
              <p className="text-sm text-muted-foreground mt-2">
                Договоритесь о деталях и уточните важные моменты
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chat.messages.map((message) => {
                const isOwn = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div
                      className={`flex flex-col max-w-[70%] ${
                        isOwn ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <Card className="rounded-none border-t border-x-0 border-b-0">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
