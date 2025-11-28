import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { serviceCategories, getCategoryName, getSubcategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeCategoriesSection = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            <span className="gold-shimmer">{t.home.categoriesTitle}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите категорию премиум-услуг для незабываемого опыта
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, i) => (
            <Card 
              key={category.id} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-slide-in-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <div className="h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-xl mb-6 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <Icon name={category.icon as any} size={64} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl text-center mb-4 font-bold tracking-tight">{getCategoryName(category.id, language)}</CardTitle>
                {category.subcategories.length > 0 && (
                  <div className="text-sm text-muted-foreground text-center space-y-2">
                    {category.subcategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-center gap-2 py-1">
                        <Icon name={sub.icon as any} size={16} className="text-primary" />
                        <span className="font-medium">{getSubcategoryName(sub.id, language)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};