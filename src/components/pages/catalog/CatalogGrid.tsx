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
                className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in relative overflow-hidden backdrop-blur-sm"
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
                    setCurrentPage('service');
                  }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={item.images && item.images[0] ? item.images[0] : item.image || '/placeholder-service.jpg'} 
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white border-0 shadow-lg w-fit font-semibold">{item.category}</Badge>
                      {isActive ? (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg w-fit flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          {t.catalog.available}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="glass-effect w-fit">
                          {t.catalog.availableFrom} {getNextAvailableTime(item.workSchedule)}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="MapPin" size={18} className="text-primary" />
                        <span className="text-sm text-white/90 font-medium">{item.location}</span>
                      </div>
                      {item.agencyName && (
                        <div className="flex items-center gap-2 mt-2">
                          <Icon name="Building2" size={16} className="text-primary" />
                          <span className="text-xs text-white/80 font-medium">{item.agencyName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2 font-bold tracking-tight">{item.seller}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground/80">{item.title}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 bg-gradient-to-r from-primary/10 to-transparent px-3 py-2 rounded-lg w-fit">
                      <Icon name="Star" size={18} className="fill-primary text-primary" />
                      <span className="font-bold text-lg">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">({item.reviews} {t.catalog.reviews})</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {item.age && (
                          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                            <Icon name="Calendar" size={18} className="text-primary mb-1" />
                            <span className="text-sm font-semibold">{item.age} лет</span>
                          </div>
                        )}
                        {item.height && (
                          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                            <Icon name="Ruler" size={18} className="text-primary mb-1" />
                            <span className="text-sm font-semibold">{item.height} см</span>
                          </div>
                        )}
                        {item.bodyType && (
                          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                            <Icon name="User" size={18} className="text-primary mb-1" />
                            <span className="text-sm font-semibold">{item.bodyType}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 pt-4 border-t-2 border-primary/20">
                        <span className="text-4xl font-bold gold-shimmer">{item.price}</span>
                        <span className="text-sm text-muted-foreground font-medium">{t.catalog.perHour}</span>
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