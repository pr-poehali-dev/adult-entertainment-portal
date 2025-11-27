import { Button } from '@/components/ui/button';
import { Page } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeHeroSectionProps {
  setCurrentPage: (page: Page) => void;
}

export const HomeHeroSection = ({ setCurrentPage }: HomeHeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary animate-fade-in" style={{ whiteSpace: 'pre-line' }}>
          {t.home.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
          {t.home.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Button size="lg" onClick={() => setCurrentPage('catalog')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-transform hover:scale-105">
            {t.home.viewCatalog}
          </Button>
          <Button size="lg" variant="outline" onClick={() => setCurrentPage('register')} className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-transform hover:scale-105">
            {t.home.register}
          </Button>
        </div>
      </div>
    </section>
  );
};
