import { Button } from '@/components/ui/button';
import { Page, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeartbeatWelcome } from '@/components/animations/HeartbeatWelcome';
import Icon from '@/components/ui/icon';

interface HomeHeroSectionProps {
  setCurrentPage: (page: Page) => void;
  userRole?: UserRole;
}

export const HomeHeroSection = ({ setCurrentPage, userRole }: HomeHeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background w-full">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full mx-auto text-center relative z-10 px-4">
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in text-center px-4" style={{ animationDelay: '200ms' }}>
          {t.home.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in mb-10" style={{ animationDelay: '300ms' }}>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="group bg-gradient-to-br from-card/80 to-card/40 hover:from-purple-500/10 hover:to-pink-500/10 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/60 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
                <Icon name="Sparkles" size={18} />
                Новые возможности
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 h-[96px] flex items-center justify-center text-center">
              Откройте своё агентство
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed h-[84px]">
              Начните зарабатывать на управлении командой моделей. Полный контроль, статистика и автоматизация бизнеса.
            </p>
            
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Управление анкетами</h3>
                  <p className="text-sm text-muted-foreground">Добавляйте и редактируйте профили моделей</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Аналитика</h3>
                  <p className="text-sm text-muted-foreground">Просмотры, бронирования, доходы</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Icon name="Wallet" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Финансы</h3>
                  <p className="text-sm text-muted-foreground">Прозрачная система выплат</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Защита</h3>
                  <p className="text-sm text-muted-foreground">Верификация и безопасность</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setCurrentPage('agency-register')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all h-[64px]"
            >
              <Icon name="Building2" size={20} className="mr-2" />
              Открыть агентство
            </Button>
            
            <div className="mt-4 text-center h-[56px] flex items-center justify-center">
              <span className="text-2xl font-bold text-primary"></span>
              <span className="text-muted-foreground mx-2"></span>
              <span className="text-2xl font-bold text-pink-500"></span>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-card/80 to-card/40 hover:from-pink-500/10 hover:to-rose-500/10 backdrop-blur-sm border-2 border-secondary/20 hover:border-pink-500/60 rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
                <Icon name="Heart" size={18} />
                Бесплатно навсегда
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4 h-[96px] flex items-center justify-center text-center">
              Знакомства
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed h-[84px]">
              Найдите свою половинку без скрытых платежей. Общайтесь, знакомьтесь и встречайтесь абсолютно бесплатно.
            </p>
            
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Icon name="Search" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Умный поиск</h3>
                  <p className="text-sm text-muted-foreground">Фильтры по интересам, возрасту, городу</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Неограниченные сообщения</h3>
                  <p className="text-sm text-muted-foreground">Общайтесь без лимитов</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon name="Video" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Видеозвонки</h3>
                  <p className="text-sm text-muted-foreground">Познакомьтесь лично онлайн</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Безопасность</h3>
                  <p className="text-sm text-muted-foreground">Проверенные анкеты, конфиденциальность</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setCurrentPage('online-search')}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all h-[64px]"
            >
              <Icon name="Heart" size={20} className="mr-2" />
              Начать знакомство
            </Button>
            
            <div className="mt-4 text-center h-[56px] flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"></span>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-card/80 to-card/40 hover:from-green-500/10 hover:to-emerald-500/10 backdrop-blur-sm border-2 border-green-500/20 hover:border-green-500/60 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
                <Icon name="TrendingUp" size={18} />
                Увеличьте доход
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 h-[96px] flex items-center justify-center text-center">
              Разместить объявление
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed h-[84px]">
              Предложите свои услуги тысячам клиентов. Получайте заявки напрямую и зарабатывайте больше без посредников.
            </p>
            
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Простое размещение</h3>
                  <p className="text-sm text-muted-foreground">Создайте объявление за 2 минуты</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Тысячи клиентов</h3>
                  <p className="text-sm text-muted-foreground">Доступ к огромной аудитории</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Icon name="Bell" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Мгновенные уведомления</h3>
                  <p className="text-sm text-muted-foreground">Получайте отклики сразу</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Без комиссий</h3>
                  <p className="text-sm text-muted-foreground">Все деньги остаются у вас</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setCurrentPage('my-ads')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all h-[64px]"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Создать объявление
            </Button>
            
            <div className="mt-4 text-center h-[56px] flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent"></span>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-card/80 to-card/40 hover:from-amber-500/10 hover:to-yellow-500/10 backdrop-blur-sm border-2 border-amber-500/20 hover:border-amber-500/60 rounded-3xl p-8 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
                <Icon name="Crown" size={18} />
                Премиум статус
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 h-[96px] flex items-center justify-center text-center">
              Купить VIP
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed h-[84px]">
              Получите максимум от платформы. Приоритет в поиске, эксклюзивные <br />функции и больше клиентов.
            </p>
            
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Топ выдачи</h3>
                  <p className="text-sm text-muted-foreground">Ваш профиль всегда на первых местах</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <Icon name="Zap" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Выделение</h3>
                  <p className="text-sm text-muted-foreground">Золотая рамка и значок VIP</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Icon name="BarChart" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Статистика</h3>
                  <p className="text-sm text-muted-foreground">Подробная аналитика просмотров</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Icon name="Headphones" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-1">Поддержка VIP</h3>
                  <p className="text-sm text-muted-foreground">Приоритетная помощь 24/7</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setCurrentPage('profile')}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-lg py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all h-[64px]"
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Активировать VIP
            </Button>
            
            <div className="mt-4 text-center h-[56px] flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-500"></span>
              <span className="text-muted-foreground mx-2"></span>
              <span className="text-2xl font-bold text-yellow-500"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};