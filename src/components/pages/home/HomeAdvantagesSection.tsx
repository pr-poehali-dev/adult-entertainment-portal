import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeAdvantagesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background w-full overflow-x-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-10 right-1/4 text-4xl animate-pulse">💝</div>
        <div className="absolute bottom-20 left-1/3 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
        <div className="absolute top-1/3 left-10 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>💫</div>
        <div className="absolute bottom-1/3 right-10 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>🌺</div>
      </div>
      
      <div className="max-w-wide mx-auto w-full relative z-10">
        <div className="text-center mb-16 px-4">
          <div className="relative inline-block mb-6">
            <div className="comic-bubble mx-auto animate-bounce">
              ✨ Гарантия качества!
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 comic-text">
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