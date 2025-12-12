import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page, RealMeetingOrder, OrderStatus } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MyOrdersPageProps {
  setCurrentPage: (page: Page) => void;
  bookings?: any[];
  orderChats?: any[];
  setOrderChats?: (chats: any[]) => void;
  setSelectedOrderChatId?: (id: number) => void;
  currentUserId?: number;
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

export const MyOrdersPage = ({ 
  setCurrentPage, 
  bookings = [], 
  orderChats = [],
  setOrderChats,
  setSelectedOrderChatId,
  currentUserId = 1,
}: MyOrdersPageProps) => {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const realMeetingOrders: RealMeetingOrder[] = bookings.filter(
    (b) => b.meetingType && (b.meetingType === 'outcall' || b.meetingType === 'apartment')
  );

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: {
        label: 'Ожидание',
        className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        icon: 'Clock' as const,
      },
      confirmed: {
        label: 'Подтверждено',
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        icon: 'CheckCircle' as const,
      },
      paid: {
        label: 'Оплачено',
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
        icon: 'CreditCard' as const,
      },
      completed: {
        label: 'Завершено',
        className: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        icon: 'Check' as const,
      },
      cancelled: {
        label: 'Отменено',
        className: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: 'X' as const,
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders =
    filter === 'all'
      ? realMeetingOrders
      : realMeetingOrders.filter((order) => order.status === filter);

  const getStats = () => {
    return {
      total: realMeetingOrders.length,
      pending: realMeetingOrders.filter((o) => o.status === 'pending').length,
      confirmed: realMeetingOrders.filter((o) => o.status === 'confirmed').length,
      paid: realMeetingOrders.filter((o) => o.status === 'paid').length,
      completed: realMeetingOrders.filter((o) => o.status === 'completed').length,
      cancelled: realMeetingOrders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const stats = getStats();

  const handleOpenChat = (order: RealMeetingOrder) => {
    if (!setOrderChats || !setSelectedOrderChatId) return;

    // Проверяем, существует ли уже чат для этого заказа
    let existingChat = orderChats.find((c) => c.orderId === order.id);

    if (!existingChat && order.chatId) {
      // Создаем новый чат
      const newChat = {
        id: order.chatId,
        orderId: order.id,
        providerId: order.providerId,
        providerName: order.providerName,
        providerAvatar: order.providerAvatar,
        buyerId: order.buyerId,
        buyerName: order.buyerName,
        buyerAvatar: order.buyerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer',
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      };
      setOrderChats([...orderChats, newChat]);
      existingChat = newChat;
    }

    if (existingChat) {
      setSelectedOrderChatId(existingChat.id);
      setCurrentPage('order-chat' as Page);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('profile')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад в профиль
          </Button>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Icon name="ShoppingBag" size={36} className="text-primary" />
            Мои заказы
          </h1>
          <p className="text-muted-foreground text-lg">
            История заказов и активные встречи
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-2">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>
              Все <Badge className="ml-2">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setFilter('pending')}>
              Ожидание <Badge className="ml-2">{stats.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed" onClick={() => setFilter('confirmed')}>
              Подтверждено <Badge className="ml-2">{stats.confirmed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="paid" onClick={() => setFilter('paid')}>
              Оплачено <Badge className="ml-2">{stats.paid}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
              Завершено <Badge className="ml-2">{stats.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled" onClick={() => setFilter('cancelled')}>
              Отменено <Badge className="ml-2">{stats.cancelled}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon
                    name="ShoppingBag"
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <p className="text-muted-foreground text-lg">Заказов не найдено</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.providerAvatar}
                          alt={order.providerName}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <CardTitle className="text-xl mb-1">
                            {order.providerName}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <Badge variant="secondary">
                              <Icon
                                name={
                                  order.meetingType === 'outcall' ? 'Car' : 'Home'
                                }
                                size={12}
                                className="mr-1"
                              />
                              {meetingTypeNames[order.meetingType]}
                            </Badge>
                            <span>•</span>
                            <Icon name="Calendar" size={14} />
                            {new Date(order.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                            })}
                            <span>•</span>
                            <Icon name="Clock" size={14} />
                            {order.time}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Программа</p>
                        <p className="font-semibold">{programNames[order.program]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Длительность
                        </p>
                        <p className="font-semibold">
                          {order.hours}{' '}
                          {order.hours === 1
                            ? 'час'
                            : order.hours < 5
                            ? 'часа'
                            : 'часов'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Стоимость</p>
                        <p className="font-semibold text-primary">
                          {order.price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Создан</p>
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {order.meetingType === 'outcall' && order.address && (
                      <div className="bg-muted/30 p-3 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <Icon
                            name="MapPin"
                            size={16}
                            className="text-primary mt-0.5"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Адрес выезда:</p>
                            <p className="text-sm text-muted-foreground">
                              {order.address}
                            </p>
                            {order.phone && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Тел: {order.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {(order.status === 'paid' || order.status === 'confirmed') && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenChat(order)}
                        >
                          <Icon name="MessageCircle" size={16} className="mr-1" />
                          Обсудить встречу
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Icon name="X" size={16} className="mr-1" />
                          Отменить
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Icon name="Star" size={16} className="mr-1" />
                          Оставить отзыв
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};