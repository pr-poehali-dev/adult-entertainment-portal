import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page, CatalogItem } from '@/types';

interface FavoritesPageProps {
  catalogItems: CatalogItem[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSelectedServiceId: (id: number | null) => void;
  setCurrentPage: (page: Page) => void;
}

export const FavoritesPage = ({
  catalogItems,
  favorites,
  toggleFavorite,
  setSelectedServiceId,
  setCurrentPage,
}: FavoritesPageProps) => {
  const favoriteItems = catalogItems.filter(item => favorites.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Избранное</h1>
      
      {favoriteItems.length === 0 ? (
        <Card>
          <CardContent className="py-20">
            <div className="text-center text-muted-foreground">
              <Icon name="Heart" size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl mb-2">У вас пока нет избранного</p>
              <p className="mb-6">Добавляйте понравившиеся услуги в избранное</p>
              <Button onClick={() => setCurrentPage('catalog')}>
                Перейти в каталог
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <Card 
              key={item.id} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Icon 
                    name="Heart" 
                    size={20} 
                    className="fill-red-500 text-red-500"
                  />
                </Button>
                {item.verified && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    <Icon name="CheckCircle" size={14} className="mr-1" />
                    Проверено
                  </Badge>
                )}
              </div>
              
              <CardHeader onClick={() => {
                setSelectedServiceId(item.id);
                setCurrentPage('service');
              }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Icon name="User" size={14} />
                      {item.seller}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent onClick={() => {
                setSelectedServiceId(item.id);
                setCurrentPage('service');
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Icon name="Star" size={16} />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{item.price}</div>
                    <div className="text-xs text-muted-foreground">за час</div>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-3">
                  {item.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};