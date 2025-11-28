import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { testBookings } from '@/data/testDatabase';

interface ProfileBookingsTabProps {
  onShowTipModal?: (booking: any) => void;
}

export const ProfileBookingsTab = ({ onShowTipModal }: ProfileBookingsTabProps) => {
  const mockBookings = testBookings.slice(0, 5).map(b => ({
    id: b.id,
    serviceName: b.serviceName,
    sellerName: b.sellerName,
    date: b.date,
    time: b.time,
    duration: b.duration,
    status: b.status,
  }));

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending_seller_confirmation: { label: 'Ожидает подтверждения', className: 'bg-yellow-500/20 text-yellow-600' },
      confirmed: { label: 'Подтверждено', className: 'bg-blue-500/20 text-blue-600' },
      in_progress: { label: 'В процессе', className: 'bg-green-500/20 text-green-600' },
      completed: { label: 'Завершено', className: 'bg-gray-500/20 text-gray-600' },
      cancelled: { label: 'Отменено', className: 'bg-red-500/20 text-red-600' },
    };
    return statusMap[status] || { label: status, className: 'bg-gray-500/20' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-primary" />
            Мои бронирования
          </CardTitle>
          <CardDescription>
            История и активные бронирования
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
              <p>У вас пока нет бронирований</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockBookings.map((booking) => {
                const statusInfo = getStatusBadge(booking.status);
                return (
                  <div key={booking.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{booking.serviceName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.sellerName}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        {new Date(booking.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Clock" size={16} />
                        {booking.time} ({booking.duration}ч)
                      </div>
                    </div>

                    {booking.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onShowTipModal?.(booking)}
                      >
                        <Icon name="Heart" size={16} />
                        Оставить чаевые
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};