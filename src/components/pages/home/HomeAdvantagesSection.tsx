import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeAdvantagesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-muted/30 to-background w-full overflow-x-hidden">
      <div className="max-w-wide mx-auto w-full">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gold-shimmer">{t.home.advantagesTitle}</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ваш комфорт и безопасность — наш главный приоритет
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: 'Shield', data: t.home.advantages.security, color: 'from-green-500 to-emerald-600' },
            { icon: 'Lock', data: t.home.advantages.privacy, color: 'from-blue-500 to-cyan-600' },
            { icon: 'Star', data: t.home.advantages.premium, color: 'from-primary to-yellow-500' },
            { icon: 'CheckCircle', data: t.home.advantages.guarantees, color: 'from-purple-500 to-pink-600' }
          ].map((item, i) => (
            <div key={i} className="text-center group animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={item.icon as any} size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.data.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.data.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};