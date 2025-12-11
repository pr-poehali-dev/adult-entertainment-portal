import { Button } from '@/components/ui/button';
import { Page, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { LipstickText } from '@/components/animations/LipstickText';
import Icon from '@/components/ui/icon';

interface HomeHeroSectionProps {
  setCurrentPage: (page: Page) => void;
  userRole?: UserRole;
}

export const HomeHeroSection = ({ setCurrentPage, userRole }: HomeHeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-40 px-4 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background w-full">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full mx-auto text-center relative z-10 px-4">
        <div className="mb-6 animate-fade-in">
          <span className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold tracking-wider text-sm uppercase">
            Премиум услуги
          </span>
        </div>
        
        <div className="mb-8 animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '100ms' }}>
          <LipstickText text="LOVE IS" className="w-full" />
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in text-center px-4" style={{ animationDelay: '200ms' }}>
          {t.home.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in mb-16" style={{ animationDelay: '300ms' }}>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button
            onClick={() => setCurrentPage('agency-register')}
            className="group relative bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-2 border-primary/20 hover:border-primary/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Icon name="Building2" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Откройте своё агентство</h3>
              <p className="text-sm text-muted-foreground">Начните зарабатывать с командой</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('online-search')}
            className="group relative bg-gradient-to-br from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 border-2 border-secondary/20 hover:border-secondary/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                <Icon name="Heart" size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Бесплатные знакомства</h3>
              <p className="text-sm text-muted-foreground">Найдите свою половинку</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('my-ads')}
            className="group relative bg-gradient-to-br from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 border-2 border-green-500/20 hover:border-green-500/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                <Icon name="FileText" size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Разместить объявление</h3>
              <p className="text-sm text-muted-foreground">Предложите свои услуги</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('profile')}
            className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 border-2 border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                <Icon name="Crown" size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Купить VIP</h3>
              <p className="text-sm text-muted-foreground">Получите больше возможностей</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};