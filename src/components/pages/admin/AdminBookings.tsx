import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export const AdminBookings = () => {
  const bookings = [
    { id: 1, user: 'Дмитрий С.', seller: 'Анна', service: 'VIP сопровождение', date: '2024-11-28', time: '18:00', price: 75000, status: 'confirmed' },
    { id: 2, user: 'Александр В.', seller: 'Мария', service: 'Индивидуальная встреча', date: '2024-11-29', time: '20:00', price: 30000, status: 'pending_seller_confirmation' },
    { id: 3, user: 'Игорь М.', seller: 'Елена', service: 'Деловая встреча', date: '2024-11-28', time: '14:00', price: 50000, status: 'in_progress' },
    { id: 4, user: 'Сергей К.', seller: 'Анна', service: 'Светское мероприятие', date: '2024-11-30', time: '19:00', price: 100000, status: 'confirmed' },
    { id: 5, user: 'Михаил П.', seller: 'Мария', service: 'Вечерний досуг', date: '2024-11-27', time: '21:00', price: 45000, status: 'completed' }
  ];

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { label: string; variant: any; icon: string }> = {
      pending_seller_confirmation: { label: 'Ожидает подтверждения', variant: 'secondary', icon: 'Clock' },
      confirmed: { label: 'Подтверждено', variant: 'default', icon: 'CheckCircle' },
      in_progress: { label: 'В процессе', variant: 'default', icon: 'Play' },
      completed: { label: 'Завершено', variant: 'outline', icon: 'Check' },
      cancelled: { label: 'Отменено', variant: 'destructive', icon: 'X' }
    };
    return statuses[status] || statuses.pending_seller_confirmation;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Управление бронированиями</h2>
        <p className="text-muted-foreground">Все бронирования на платформе</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего', value: bookings.length, icon: 'Calendar', color: 'text-blue-500' },
          { label: 'Активных', value: bookings.filter(b => b.status === 'in_progress').length, icon: 'Play', color: 'text-green-500' },
          { label: 'В ожидании', value: bookings.filter(b => b.status === 'pending_seller_confirmation').length, icon: 'Clock', color: 'text-orange-500' },
          { label: 'Завершенных', value: bookings.filter(b => b.status === 'completed').length, icon: 'CheckCircle', color: 'text-purple-500' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon name={stat.icon as any} size={32} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список бронирований</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Calendar" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{booking.service}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.user} → {booking.seller}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Дата и время</div>
                      <div className="font-medium">{booking.date} в {booking.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Сумма</div>
                      <div className="font-bold text-primary">{booking.price.toLocaleString()} ₽</div>
                    </div>
                    <Badge variant={statusInfo.variant} className="gap-1">
                      <Icon name={statusInfo.icon as any} size={12} />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
