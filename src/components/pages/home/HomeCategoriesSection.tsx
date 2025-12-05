import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { serviceCategories, getCategoryName, getSubcategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Page } from '@/types';

interface HomeCategoriesSectionProps {
  setCurrentPage: (page: Page) => void;
  setSelectedCategory: (categoryId: string) => void;
}

export const HomeCategoriesSection = ({ setCurrentPage, setSelectedCategory }: HomeCategoriesSectionProps) => {
  const { t, language } = useLanguage();
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage('category');
  };
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30 w-full overflow-x-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-5 text-5xl animate-float">🎀</div>
        <div className="absolute top-10 right-1/4 text-4xl animate-wiggle" style={{ animationDelay: '0.5s' }}>💐</div>
        <div className="absolute bottom-1/4 right-10 text-5xl animate-float" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute bottom-10 left-1/3 text-4xl animate-wiggle" style={{ animationDelay: '1.5s' }}>🌹</div>
      </div>
      
      <div className="max-w-wide mx-auto w-full relative z-10">
        <div className="text-center mb-16 px-4">
          <div className="relative inline-block mb-6">
            <div className="comic-starburst mx-auto animate-pulse">
              ⭐ VIP ⭐
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 comic-text">
            <span className="gold-shimmer">{t.home.categoriesTitle}</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите категорию премиум-услуг для незабываемого опыта
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, i) => (
            <Card 
              key={category.id} 
              onClick={() => handleCategoryClick(category.id)}
              className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-slide-in-left overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={getCategoryName(category.id, language)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <CardTitle className="text-2xl text-white font-bold tracking-tight drop-shadow-lg">
                    {getCategoryName(category.id, language)}
                  </CardTitle>
                </div>
              </div>
              {category.subcategories.length > 0 && (
                <CardHeader>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {category.subcategories.map(sub => (
                      <div key={sub.id} className="flex items-center gap-2 py-1">
                        <Icon name={sub.icon as any} size={16} className="text-primary" />
                        <span className="font-medium">{getSubcategoryName(sub.id, language)}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};