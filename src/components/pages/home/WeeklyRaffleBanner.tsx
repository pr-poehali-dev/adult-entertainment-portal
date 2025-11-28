import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';

interface WeeklyRaffleBannerProps {
  setCurrentPage: (page: Page) => void;
}

export const WeeklyRaffleBanner = ({ setCurrentPage }: WeeklyRaffleBannerProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0tOCAwSDBoMnYzMEgwVjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 left-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-8 py-12 md:px-16 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
                <Icon name="Sparkles" size={16} className="animate-pulse" />
                <span>Еженедельный розыгрыш</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Выиграй встречу с VIP-спутницей
              </h2>
              
              <p className="text-white/90 text-lg leading-relaxed">
                Каждую неделю мы разыгрываем встречу с любой VIP-спутницей на выбор победителя. 
                Участвуйте абсолютно бесплатно!
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  onClick={() => setCurrentPage('raffle')}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg px-8 py-6 h-auto"
                >
                  <Icon name="Gift" size={20} className="mr-2" />
                  Участвовать бесплатно
                </Button>
                
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Icon name="Users" size={16} />
                  <span>Уже <span className="font-bold text-white">1,247</span> участников</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/30 p-8 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-primary rounded-full p-4 shadow-xl animate-bounce">
                  <Icon name="Trophy" size={32} />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Calendar" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Следующий розыгрыш</p>
                      <p className="text-xl font-bold">1 декабря, 20:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Gift" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Приз</p>
                      <p className="text-xl font-bold">Встреча на сумму до 200,000 ₽</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Zap" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Шанс победы</p>
                      <p className="text-xl font-bold">1 из 1,247</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Полностью бесплатно</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Честный и прозрачный розыгрыш</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Результаты в прямом эфире</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-2 -left-2 w-full h-full bg-white/5 rounded-2xl -z-10"></div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">23</p>
                  <p className="text-sm text-white/80">победителя</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">2.8M ₽</p>
                  <p className="text-sm text-white/80">разыграно</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-sm text-white/80">честность</p>
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentPage('raffle')}
                variant="ghost"
                className="text-white hover:bg-white/10 gap-2"
              >
                Правила розыгрыша
                <Icon name="ArrowRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
