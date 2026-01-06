import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CatalogItem, Page, Profile } from '@/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AgencyServicesPageProps {
  setCurrentPage: (page: Page) => void;
  profile: Profile;
  categoryId: string;
  categoryName: string;
  agencyGirls: CatalogItem[];
  setSelectedServiceId: (id: number | null) => void;
  setShowBookingModal: (show: boolean) => void;
}

export const AgencyServicesPage = ({ 
  setCurrentPage, 
  profile, 
  categoryId,
  categoryName,
  agencyGirls,
  setSelectedServiceId,
  setShowBookingModal,
}: AgencyServicesPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');

  const filteredServices = agencyGirls.filter(item => {
    if (!item.agencyId) return false;
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.agencyName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = item.category === categoryName;
    
    return matchesSearch && matchesCategory && item.isActive !== false;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'price_asc':
        return (typeof a.price === 'number' ? a.price : 0) - (typeof b.price === 'number' ? b.price : 0);
      case 'price_desc':
        return (typeof b.price === 'number' ? b.price : 0) - (typeof a.price === 'number' ? a.price : 0);
      default:
        return 0;
    }
  });

  const handleBooking = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentPage('home')}
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Услуги от агентств платформы
            </p>
          </div>
        </div>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Поиск по названию, описанию или агентству..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('rating')}
                >
                  <Icon name="Star" size={16} className="mr-2" />
                  По рейтингу
                </Button>
                <Button
                  variant={sortBy === 'price_asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('price_asc')}
                >
                  <Icon name="ArrowUp" size={16} className="mr-2" />
                  Дешевле
                </Button>
                <Button
                  variant={sortBy === 'price_desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('price_desc')}
                >
                  <Icon name="ArrowDown" size={16} className="mr-2" />
                  Дороже
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.length === 0 ? (
            <Card className="border-2 md:col-span-2 lg:col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Inbox" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Услуги не найдены</h3>
                <p className="text-muted-foreground text-center">
                  В категории "{categoryName}" пока нет доступных услуг от агентств
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedServices.map(service => (
              <Card 
                key={service.id} 
                className="border-2 hover:shadow-lg transition-all group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {service.verified && (
                      <Badge className="bg-blue-500">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        Проверено
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/70 text-white">
                      {service.agencyName || 'Агентство'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{service.rating || 5.0}</span>
                    </div>
                  </div>

                  {service.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {service.age && (
                      <Badge variant="outline" className="text-xs">
                        {service.age} лет
                      </Badge>
                    )}
                    {service.location && (
                      <Badge variant="outline" className="text-xs">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {service.location}
                      </Badge>
                    )}
                    {service.duration && (
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {service.duration}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {typeof service.price === 'number' ? `${service.price} ₽` : service.price}
                      </div>
                      {service.duration && (
                        <div className="text-xs text-muted-foreground">
                          за {service.duration}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleBooking(service.id)}
                    >
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Забронировать
                    </Button>
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
