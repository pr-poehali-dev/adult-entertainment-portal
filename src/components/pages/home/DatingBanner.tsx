import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';

interface DatingBannerProps {
  setCurrentPage: (page: Page) => void;
}

export const DatingBanner = ({ setCurrentPage }: DatingBannerProps) => {
  return (
    <div className="max-w-wide mx-auto px-4 py-12 w-full overflow-x-hidden">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0tOCAwSDBoMnYzMEgwVjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 left-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-8 py-12 md:px-16 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
                <Icon name="Heart" size={16} className="animate-pulse" />
                <span>Бесплатные знакомства</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Найди свою половинку
              </h2>
              
              <p className="text-white/90 text-lg leading-relaxed">
                Знакомься с интересными людьми рядом с тобой. Полностью бесплатно, без скрытых платежей. 
                Реальные анкеты, фото и общение.
              </p>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
                    <p className="text-xs md:text-sm text-white/80 mt-1">анкет</p>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-white">120+</p>
                    <p className="text-xs md:text-sm text-white/80 mt-1">онлайн</p>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-white">89%</p>
                    <p className="text-xs md:text-sm text-white/80 mt-1">матчей</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Sparkles" size={20} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                  <p className="text-white/95 text-sm">
                    <span className="font-bold">Полностью бесплатно:</span> Все функции доступны всем пользователям. 
                    Никаких скрытых платежей или ограничений.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setCurrentPage('dating')}
                size="lg"
                className="bg-white text-pink-600 hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg px-8 py-6 h-auto"
              >
                <Icon name="Heart" size={20} className="mr-2" />
                Начать знакомство
              </Button>
            </div>
            
            <div className="relative hidden md:block">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-rose-600/30 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center text-3xl">
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/40 rounded w-24 mb-2"></div>
                        <div className="h-2 bg-white/30 rounded w-32"></div>
                      </div>
                      <Icon name="Heart" size={24} className="text-white" />
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center text-3xl">
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/40 rounded w-28 mb-2"></div>
                        <div className="h-2 bg-white/30 rounded w-36"></div>
                      </div>
                      <Icon name="Heart" size={24} className="text-white" />
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-green-400/40">
                      <div className="flex -space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center text-2xl border-2 border-white">
                          👤
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center text-2xl border-2 border-white">
                          👤
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Icon name="Sparkles" size={20} className="text-green-300" />
                        <span className="text-white font-bold text-sm">Взаимная симпатия!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose-400 rounded-full opacity-20 animate-pulse delay-75"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};