import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeAdvantagesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">{t.home.advantagesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: 'Shield', data: t.home.advantages.security },
            { icon: 'Lock', data: t.home.advantages.privacy },
            { icon: 'Star', data: t.home.advantages.premium },
            { icon: 'CheckCircle', data: t.home.advantages.guarantees }
          ].map((item, i) => (
            <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name={item.icon as any} size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.data.title}</h3>
              <p className="text-muted-foreground">{item.data.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
