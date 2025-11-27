import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Page, CatalogItem, Review } from '@/types';

interface ServiceDetailProps {
  catalogItems: CatalogItem[];
  reviews: Review[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  selectedServiceId: number | null;
  setCurrentPage: (page: Page) => void;
  setShowBookingModal: (show: boolean) => void;
}

export const ServiceDetailPage = ({
  catalogItems,
  reviews,
  favorites,
  toggleFavorite,
  selectedServiceId,
  setCurrentPage,
  setShowBookingModal,
}: ServiceDetailProps) => {
  const service = catalogItems.find(item => item.id === selectedServiceId);
  
  if (!service) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => setCurrentPage('catalog')}
        className="mb-6 text-primary hover:text-primary/80"
      >
        <Icon name="ArrowLeft" className="mr-2" size={20} />
        Назад к каталогу
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <Icon name="Image" size={120} className="text-muted-foreground" />
                <button 
                  onClick={() => toggleFavorite(service.id)}
                  className="absolute top-4 right-4 p-3 bg-background/80 rounded-full hover:bg-background transition-colors"
                >
                  <Icon 
                    name="Heart"
                    size={24} 
                    className={favorites.includes(service.id) ? "fill-red-500 text-red-500" : "text-foreground"}
                  />
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-4xl mb-2">{service.title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={20} />
                      {service.seller}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Star" size={20} className="text-primary fill-primary" />
                      {service.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={20} />
                      {service.duration}
                    </span>
                  </div>
                </div>
                {service.verified && (
                  <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
                    <Icon name="CheckCircle" size={18} className="mr-2" />
                    Проверено
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Описание</h3>
                <p className="text-foreground/80 leading-relaxed text-lg">{service.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-2xl font-semibold mb-3">Что входит в услугу</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-foreground/80">
                      <Icon name="CheckCircle" size={20} className="text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-2xl font-semibold mb-4">Отзывы клиентов</h3>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <Card 
                      key={review.id} 
                      className="bg-muted/30 border-border animate-slide-in-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {review.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.author}</h4>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Icon key={i} name="Star" size={16} className="text-primary fill-primary" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                            <p className="text-foreground/80">{review.text}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">{service.price}</CardTitle>
              <p className="text-muted-foreground">За час услуг</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                onClick={() => setShowBookingModal(true)}
              >
                <Icon name="Calendar" className="mr-2" size={20} />
                Забронировать
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6"
                onClick={() => setCurrentPage('messages')}
              >
                <Icon name="MessageCircle" className="mr-2" size={20} />
                Написать
              </Button>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Icon name="Shield" size={18} className="text-primary" />
                  <span>Защита платежей</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Icon name="Lock" size={18} className="text-primary" />
                  <span>Конфиденциальность</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Icon name="RefreshCw" size={18} className="text-primary" />
                  <span>Гибкая отмена</span>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Info" size={18} className="text-primary" />
                  Важная информация
                </h4>
                <ul className="space-y-1 text-sm text-foreground/80">
                  <li>• Минимальное бронирование: {service.duration?.replace('От ', '')}</li>
                  <li>• Предоплата: 30%</li>
                  <li>• Отмена за 24 часа без штрафа</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};