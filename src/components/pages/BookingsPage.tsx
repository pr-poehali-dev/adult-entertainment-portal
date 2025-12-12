import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page, UserRole } from '@/types';

interface BookingHistoryItem {
  id: number;
  performerName: string;
  performerAvatar: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'waiting' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface BookingsPageProps {
  setCurrentPage: (page: Page) => void;
  userRole?: UserRole;
  bookings: BookingHistoryItem[];
  setBookings: (bookings: BookingHistoryItem[]) => void;
}

export const BookingsPage = ({ setCurrentPage, userRole, bookings, setBookings }: BookingsPageProps) => {
  const [filter, setFilter] = useState<'all' | 'waiting' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const mockBookings: BookingHistoryItem[] = bookings.length > 0 ? bookings : [
    {
      id: 1,
      performerName: 'Анастасия',
      performerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia',
      category: 'Стриптиз',
      date: '2024-12-20',
      time: '20:00',
      duration: 2,
      price: 12000,
      status: 'confirmed',
      createdAt: '2024-12-10T14:30:00Z',
    },
    {
      id: 2,
      performerName: 'Виктория',
      performerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
      category: 'Стриптиз',
      date: '2024-12-15',
      time: '19:00',
      duration: 1,
      price: 6000,
      status: 'completed',
      createdAt: '2024-12-08T10:15:00Z',
    },
    {
      id: 3,
      performerName: 'Елена',
      performerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      category: 'Массаж',
      date: '2024-12-18',
      time: '15:30',
      duration: 2,
      price: 4500,
      status: 'waiting',
      createdAt: '2024-12-12T09:20:00Z',
    },
    {
      id: 4,
      performerName: 'Алексей',
      performerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey',
      category: 'Стриптиз',
      date: '2024-12-05',
      time: '21:00',
      duration: 1,
      price: 5500,
      status: 'cancelled',
      createdAt: '2024-12-04T16:45:00Z',
    },
  ];

  const getStatusBadge = (status: BookingHistoryItem['status']) => {
    const statusConfig = {
      waiting: {
        label: 'Ожидание',
        className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        icon: 'Clock' as const,
      },
      confirmed: {
        label: 'Подтверждено',
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
        icon: 'CheckCircle' as const,
      },
      completed: {
        label: 'Завершено',
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
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

  const allBookings = bookings.length > 0 ? bookings : mockBookings;
  
  const filteredBookings = allBookings.filter(
    (booking) => filter === 'all' || booking.status === filter
  );

  const getStats = () => {
    return {
      total: allBookings.length,
      waiting: allBookings.filter((b) => b.status === 'waiting').length,
      confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
      completed: allBookings.filter((b) => b.status === 'completed').length,
      cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
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
            <Icon name="History" size={36} className="text-primary" />
            История бронирований
          </h1>
          <p className="text-muted-foreground text-lg">
            Все ваши заказы и их статусы
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <Card
            className={`cursor-pointer transition-all ${
              filter === 'all' ? 'border-primary shadow-lg' : 'hover:border-primary/50'
            }`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Все</div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              filter === 'waiting' ? 'border-amber-500 shadow-lg' : 'hover:border-amber-500/50'
            }`}
            onClick={() => setFilter('waiting')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-amber-600">{stats.waiting}</div>
              <div className="text-sm text-muted-foreground">Ожидание</div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              filter === 'confirmed' ? 'border-green-500 shadow-lg' : 'hover:border-green-500/50'
            }`}
            onClick={() => setFilter('confirmed')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-muted-foreground">Подтверждено</div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              filter === 'completed' ? 'border-blue-500 shadow-lg' : 'hover:border-blue-500/50'
            }`}
            onClick={() => setFilter('completed')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-blue-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Завершено</div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              filter === 'cancelled' ? 'border-red-500 shadow-lg' : 'hover:border-red-500/50'
            }`}
            onClick={() => setFilter('cancelled')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-muted-foreground">Отменено</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="CalendarOff" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Бронирований не найдено</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.performerAvatar}
                        alt={booking.performerName}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-xl mb-1">{booking.performerName}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{booking.category}</Badge>
                          <span>•</span>
                          <Icon name="Calendar" size={14} />
                          {new Date(booking.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                          })}
                          <span>•</span>
                          <Icon name="Clock" size={14} />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Длительность</p>
                      <p className="font-semibold">{booking.duration} час(а)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Стоимость</p>
                      <p className="font-semibold text-primary">
                        {booking.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Создано</p>
                      <p className="text-sm">
                        {new Date(booking.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-end justify-end gap-2">
                      {booking.status === 'waiting' && (
                        <Button variant="outline" size="sm">
                          <Icon name="X" size={16} className="mr-1" />
                          Отменить
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button variant="default" size="sm">
                          <Icon name="MessageCircle" size={16} className="mr-1" />
                          Связаться
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Icon name="Star" size={16} className="mr-1" />
                          Оставить отзыв
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};