import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CatalogItem, Page } from '@/types';
import { isCurrentlyActive, getNextAvailableTime } from '@/utils/scheduleChecker';
import { useLanguage } from '@/contexts/LanguageContext';

interface CatalogGridProps {
  filteredItems: CatalogItem[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSelectedServiceId: (id: number | null) => void;
  setCurrentPage: (page: Page) => void;
}

export const CatalogGrid = ({
  filteredItems,
  favorites,
  toggleFavorite,
  setSelectedServiceId,
  setCurrentPage,
}: CatalogGridProps) => {
  const { t } = useLanguage();

  return (
    <>
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Search" size={48} className="text-primary/50" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Ничего не найдено</h3>
          <p className="text-muted-foreground">Попробуйте изменить фильтры поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isActive = isCurrentlyActive(item.workSchedule);
            const isFavorite = favorites.includes(item.id);

            return (
              <Card 
                key={item.id} 
                className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Icon 
                      name="Heart" 
                      size={20} 
                      className={isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground/60'}
                    />
                  </button>
                </div>

                <div 
                  onClick={() => {
                    setSelectedServiceId(item.id);
                    setCurrentPage('service-detail');
                  }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-primary text-primary-foreground w-fit">{item.category}</Badge>
                      {isActive ? (
                        <Badge className="bg-green-500 text-white w-fit flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          {t.catalog.available}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-fit">
                          {t.catalog.availableFrom} {getNextAvailableTime(item.workSchedule)}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="MapPin" size={16} className="text-primary" />
                        <span className="text-sm text-muted-foreground">{item.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-1">{item.seller}</CardTitle>
                        <CardDescription className="text-base">{item.title}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <Icon name="Star" size={18} className="fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">({item.reviews} {t.catalog.reviews})</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {item.age && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Calendar" size={16} className="text-muted-foreground" />
                          <span>{item.age} лет</span>
                        </div>
                      )}
                      {item.height && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Ruler" size={16} className="text-muted-foreground" />
                          <span>{item.height} см</span>
                        </div>
                      )}
                      {item.bodyType && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="User" size={16} className="text-muted-foreground" />
                          <span>{item.bodyType}</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 pt-4 border-t border-border">
                        <span className="text-3xl font-bold text-primary">{item.price}</span>
                        <span className="text-sm text-muted-foreground">{t.catalog.perHour}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};
