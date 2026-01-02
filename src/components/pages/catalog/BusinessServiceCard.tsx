import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BusinessService } from '@/types';
import { useServiceCategories } from '@/contexts/ServiceCategoriesContext';

interface BusinessServiceCardProps {
  service: BusinessService;
  index: number;
  onContact: (serviceId: string) => void;
}

export const BusinessServiceCard = ({ service, index, onContact }: BusinessServiceCardProps) => {
  const { serviceCategories } = useServiceCategories();
  const category = serviceCategories.find(c => c.id === service.categoryId.toString());

  return (
    <Card 
      className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in relative overflow-hidden backdrop-blur-sm"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name={category?.icon as any || 'Briefcase'} size={24} className="text-white" />
            </div>
            <div>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-lg mb-2">
                {category?.name || 'Услуга'}
              </Badge>
              <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
            </div>
          </div>
          <Badge 
            variant={service.status === 'active' ? 'default' : 'secondary'}
            className={service.status === 'active' ? 'bg-green-500' : ''}
          >
            {service.status === 'active' ? 'Активно' : 'На модерации'}
          </Badge>
        </div>
        <CardDescription className="text-base">{service.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {service.images && service.images.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={service.images[0]} 
              alt={service.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Опубликовано: {new Date(service.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>

          {service.programs && service.programs.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Icon name="List" size={16} />
                Доступные программы:
              </h4>
              <div className="space-y-2">
                {service.programs.slice(0, 3).map((program) => (
                  <div 
                    key={program.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{program.name}</p>
                      {program.description && (
                        <p className="text-xs text-muted-foreground mt-1">{program.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-lg text-primary">
                        {program.price} {program.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        / {program.unit === 'hour' ? 'час' : 
                           program.unit === 'minute' ? 'мин' : 
                           program.unit === 'time' ? 'раз' : 
                           program.unit === 'piece' ? 'шт' : 'ночь'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {service.programs.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{service.programs.length - 3} ещё {service.programs.length - 3 === 1 ? 'программа' : 'программы'}
                </p>
              )}
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={() => onContact(service.id)}
          >
            <Icon name="MessageCircle" size={18} className="mr-2" />
            Связаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
