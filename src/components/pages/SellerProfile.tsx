import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Page, SellerProfile, PriceListItem, Wallet, Currency, CustomMediaOrder } from '@/types';
import { VIPBadge } from '@/components/vip/VIPBadge';
import { HealthCertificateBadge } from '@/components/health/HealthCertificateBadge';
import PriceList from '@/components/pages/seller-profile/PriceList';
import BookingModal from '@/components/pages/seller-profile/BookingModal';
import PrivateAlbums from '@/components/pages/seller-profile/PrivateAlbums';
import CustomMediaOrders from '@/components/pages/seller-profile/CustomMediaOrders';
import { useToast } from '@/hooks/use-toast';

interface SellerProfilePageProps {
  seller: SellerProfile;
  setCurrentPage: (page: Page) => void;
  wallet: Wallet;
}

export const SellerProfilePage = ({ seller, setCurrentPage, wallet }: SellerProfilePageProps) => {
  const [selectedPriceItem, setSelectedPriceItem] = useState<PriceListItem | null>(null);
  const { toast } = useToast();

  const handlePriceItemClick = (item: PriceListItem) => {
    setSelectedPriceItem(item);
  };

  const handleBookingConfirm = (item: PriceListItem, duration: number, totalPrice: number) => {
    console.log('Booking confirmed:', { item, duration, totalPrice });
    toast({
      title: 'Бронирование создано',
      description: `Заказ на ${duration} ч оформлен на сумму ${totalPrice.toLocaleString()}`,
    });
    setSelectedPriceItem(null);
  };

  const handleAlbumPurchase = (albumId: number, price: number, currency: Currency) => {
    console.log('Album purchased:', { albumId, price, currency });
    toast({
      title: 'Альбом куплен',
      description: 'PIN-код отправлен в сообщения',
    });
  };

  const handleCustomOrderSubmit = (order: CustomMediaOrder, requirements: string) => {
    console.log('Custom order submitted:', { order, requirements });
    toast({
      title: 'Заказ оформлен',
      description: `Ваш заказ на ${order.price.toLocaleString()} отправлен продавцу`,
    });
  };
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

      <div className="space-y-6">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={seller.coverImage} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {seller.name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-white mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{seller.name}</h1>
                {seller.vipStatus === 'vip' && <VIPBadge size="md" />}
                {seller.healthCertified && seller.healthCertificateExpiry && new Date(seller.healthCertificateExpiry) > new Date() && (
                  <HealthCertificateBadge size="md" />
                )}
                {seller.verified ? (
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-lg animate-pulse">
                    <Icon name="ShieldCheck" size={16} className="mr-1" />
                    Проверено
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-white/50 text-white/80">
                    <Icon name="Shield" size={16} className="mr-1" />
                    Не верифицирован
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="Star" size={16} className="text-primary fill-primary" />
                  {seller.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={16} />
                  {seller.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  {seller.age} лет
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {(seller.audioGreeting || seller.promoVideo || (seller.profilePhotos && seller.profilePhotos.length > 0)) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Play" size={24} className="text-primary" />
                    Медиа-контент
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {seller.audioGreeting && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon name="Mic" size={16} className="text-primary" />
                        Аудио приветствие
                      </div>
                      <audio controls className="w-full">
                        <source src={seller.audioGreeting} />
                      </audio>
                    </div>
                  )}
                  
                  {seller.promoVideo && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon name="Video" size={16} className="text-primary" />
                        Промо-видео
                      </div>
                      <video controls className="w-full rounded-lg max-h-96">
                        <source src={seller.promoVideo} />
                      </video>
                    </div>
                  )}
                  
                  {seller.profilePhotos && seller.profilePhotos.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon name="Image" size={16} className="text-primary" />
                        Фото профиля ({seller.profilePhotos.length})
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {seller.profilePhotos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Фото ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>О себе</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{seller.about}</p>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Languages" size={18} className="text-primary" />
                      Языки
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {seller.languages.map((lang, i) => (
                        <Badge key={i} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Briefcase" size={18} className="text-primary" />
                      Услуги
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {seller.services.map((service, i) => (
                        <Badge key={i} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {seller.priceList && seller.priceList.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <PriceList 
                    items={seller.priceList} 
                    onItemClick={handlePriceItemClick}
                  />
                </CardContent>
              </Card>
            )}

            {seller.privateAlbums && seller.privateAlbums.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <PrivateAlbums 
                    albums={seller.privateAlbums}
                    wallet={wallet}
                    onPurchase={handleAlbumPurchase}
                  />
                </CardContent>
              </Card>
            )}

            {seller.customMediaOrders && seller.customMediaOrders.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <CustomMediaOrders 
                    orders={seller.customMediaOrders}
                    wallet={wallet}
                    sellerName={seller.name}
                    onOrderSubmit={handleCustomOrderSubmit}
                  />
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Портфолио</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {seller.portfolio.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="ZoomIn" size={32} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    Бронирований
                  </span>
                  <span className="font-semibold">{seller.stats.bookings}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    Время ответа
                  </span>
                  <span className="font-semibold">{seller.stats.responseTime}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    Постоянных клиентов
                  </span>
                  <span className="font-semibold">{seller.stats.repeatClients}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Доступность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {seller.availability.map((day, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Icon name="CheckCircle" size={16} className="text-primary" />
                      <span>{day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
              onClick={() => setCurrentPage('catalog')}
            >
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Написать сообщение
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6"
              onClick={() => setCurrentPage('catalog')}
            >
              <Icon name="Calendar" className="mr-2" size={20} />
              Забронировать встречу
            </Button>
          </div>
        </div>
      </div>

      {selectedPriceItem && (
        <BookingModal
          item={selectedPriceItem}
          sellerName={seller.name}
          sellerAvatar={seller.avatar}
          wallet={wallet}
          onClose={() => setSelectedPriceItem(null)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};