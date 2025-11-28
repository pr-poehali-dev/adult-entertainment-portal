import { Button } from '@/components/ui/button';
import { Page, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeHeroSectionProps {
  setCurrentPage: (page: Page) => void;
  userRole?: UserRole;
}

export const HomeHeroSection = ({ setCurrentPage, userRole }: HomeHeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-40 px-4 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        <div className="mb-6 animate-fade-in">
          <span className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold tracking-wider text-sm uppercase">
            Премиум услуги
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in text-center" style={{ animationDelay: '100ms' }}>
          <span className="block mb-4">{t.home.heroTitle.split('\n')[0]}</span>
          <span className="gold-shimmer block">{t.home.heroTitle.split('\n')[1] || 'по вызову'}</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in text-center px-4" style={{ animationDelay: '200ms' }}>
          {t.home.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <Button 
            size="lg" 
            onClick={() => setCurrentPage('catalog')} 
            className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-2xl hover:shadow-primary/50 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 transition-all duration-300 hover:scale-105 font-semibold tracking-wide w-full sm:w-auto"
          >
            {t.home.viewCatalog}
          </Button>
          {!userRole && (
            <>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setCurrentPage('login')} 
                className="text-base md:text-lg px-8 md:px-12 py-6 md:py-7 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-105 font-semibold tracking-wide w-full sm:w-auto"
              >
                Войти
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setCurrentPage('register')} 
                className="text-base md:text-lg px-8 md:px-12 py-6 md:py-7 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 font-semibold tracking-wide w-full sm:w-auto"
              >
                {t.home.register}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};