import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { serviceCategories, getCategoryName, getSubcategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeCategoriesSection = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">{t.home.categoriesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, i) => (
            <Card 
              key={category.id} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary animate-slide-in-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name={category.icon as any} size={48} className="text-primary" />
                </div>
                <CardTitle className="text-xl text-center mb-3">{getCategoryName(category.id, language)}</CardTitle>
                {category.subcategories.length > 0 && (
                  <div className="text-sm text-muted-foreground text-center space-y-2">
                    {category.subcategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-center gap-2">
                        <Icon name={sub.icon as any} size={14} />
                        <span>{getSubcategoryName(sub.id, language)}</span>
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
