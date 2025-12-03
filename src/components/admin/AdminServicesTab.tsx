import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Service {
  id: number;
  title: string;
  seller: string;
  price: number;
  status: 'active' | 'moderation' | 'blocked';
  reports: number;
}

interface AdminServicesTabProps {
  services: Service[];
  approveService: (serviceId: number) => void;
}

export const AdminServicesTab = ({ services, approveService }: AdminServicesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Модерация услуг</CardTitle>
        <CardDescription>Список услуг требующих проверки</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{service.title}</h3>
                  <Badge variant={
                    service.status === 'active' ? 'default' : 
                    service.status === 'moderation' ? 'secondary' : 
                    'destructive'
                  }>
                    {service.status === 'active' ? 'Активна' : 
                     service.status === 'moderation' ? 'На модерации' : 
                     'Заблокирована'}
                  </Badge>
                  {service.reports > 0 && (
                    <Badge variant="destructive">{service.reports} жалоб</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Продавец: {service.seller}</p>
                <p className="text-sm font-semibold mt-2">{service.price} ₽</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Просмотр
                </Button>
                {service.status === 'moderation' && (
                  <Button variant="default" size="sm" onClick={() => approveService(service.id)}>
                    <Icon name="Check" size={16} className="mr-2" />
                    Одобрить
                  </Button>
                )}
                <Button variant="destructive" size="sm">
                  <Icon name="X" size={16} className="mr-2" />
                  Отклонить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
