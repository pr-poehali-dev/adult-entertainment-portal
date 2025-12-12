import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { useState, useEffect, useRef } from 'react';

interface DatingBannerProps {
  setCurrentPage: (page: Page) => void;
}

export const DatingBanner = ({ setCurrentPage }: DatingBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={bannerRef}
      className={`max-w-wide mx-auto px-4 py-6 md:py-12 w-full overflow-x-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 shadow-2xl w-full">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0tOCAwSDBoMnYzMEgwVjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 left-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 md:px-16 md:py-16 w-full">
          {/* Картинка для мобильной версии */}
          <div className="md:hidden mb-4">
            <img 
              src="https://cdn.poehali.dev/files/IMG_5135.jpeg" 
              alt="LOVE IS - Сайт знакомств" 
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center w-full">
            <div className="space-y-4 md:space-y-6 w-full">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs sm:text-sm font-medium">
                <Icon name="Heart" size={14} className="animate-pulse sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Бесплатные знакомства</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
                Найди свою половинку
              </h2>
              
              <p className="hidden md:block text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
                Знакомься с интересными людьми рядом с тобой. Полностью бесплатно, без скрытых платежей. 
                Реальные анкеты, фото и общение.
              </p>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-white/30">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
                  <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">500+</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mt-0.5 md:mt-1">анкет</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">120+</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mt-0.5 md:mt-1">онлайн</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">89%</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mt-0.5 md:mt-1">матчей</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/40 rounded-xl p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Icon name="Sparkles" size={16} className="text-yellow-300 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5" />
                  <p className="text-white/95 text-xs sm:text-sm leading-tight">
                    <span className="font-bold">Полностью бесплатно:</span> Все функции доступны всем пользователям. 
                    Никаких скрытых платежей или ограничений.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setCurrentPage('dating')}
                size="lg"
                className="bg-white text-pink-600 hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base md:text-lg px-6 py-4 sm:px-8 sm:py-5 md:py-6 h-auto w-full md:w-auto"
              >
                <Icon name="Heart" size={18} className="mr-2 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Начать знакомство</span>
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