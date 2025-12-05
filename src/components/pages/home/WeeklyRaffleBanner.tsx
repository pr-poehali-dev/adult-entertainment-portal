import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';

interface WeeklyRaffleBannerProps {
  setCurrentPage: (page: Page) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const WeeklyRaffleBanner = ({ setCurrentPage }: WeeklyRaffleBannerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ticketsSold, setTicketsSold] = useState(47);
  const [isQuickDraw, setIsQuickDraw] = useState(false);
  const [quickDrawSeconds, setQuickDrawSeconds] = useState(60);

  useEffect(() => {
    if (ticketsSold < 100) {
      setIsQuickDraw(true);
    }
  }, [ticketsSold]);

  useEffect(() => {
    if (isQuickDraw && quickDrawSeconds > 0) {
      const timer = setInterval(() => {
        setQuickDrawSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isQuickDraw, quickDrawSeconds]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      const moscowOffset = 3 * 60;
      const localOffset = now.getTimezoneOffset();
      const moscowTime = new Date(now.getTime() + (moscowOffset + localOffset) * 60 * 1000);
      
      const nextDraw = new Date(moscowTime);
      nextDraw.setHours(12, 0, 0, 0);
      
      const currentDay = moscowTime.getDay();
      const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
      nextDraw.setDate(moscowTime.getDate() + daysUntilSunday);
      
      if (currentDay === 0 && moscowTime.getHours() >= 12) {
        nextDraw.setDate(nextDraw.getDate() + 7);
      }
      
      const difference = nextDraw.getTime() - moscowTime.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicketsSold(prev => {
        const newValue = prev + Math.floor(Math.random() * 3);
        return newValue > 100 ? 100 : newValue;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-wide mx-auto px-4 py-12 w-full overflow-x-hidden">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-2xl comic-shadow">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0tOCAwSDBoMnYzMEgwVjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-10 text-5xl animate-wiggle">🎁</div>
          <div className="absolute top-10 right-16 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute bottom-10 left-1/4 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>🎉</div>
          <div className="absolute bottom-4 right-10 text-4xl animate-wiggle" style={{ animationDelay: '1.5s' }}>🌟</div>
        </div>
        
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
                Выиграй новенький iPhone 17
              </h2>
              
              <p className="text-white/90 text-lg leading-relaxed">
                Каждое воскресенье в 12:00 МСК мы разыгрываем новый iPhone 17 среди участников. 
                Билет всего 100 ₽. Один аккаунт = один билет.
              </p>

              {isQuickDraw ? (
                <div className="bg-red-500/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-400/50">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon name="Zap" size={20} className="text-yellow-300 animate-pulse" />
                    <p className="text-white font-bold text-lg">БЫСТРЫЙ РОЗЫГРЫШ!</p>
                    <Icon name="Zap" size={20} className="text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-white/90 text-sm mb-3 text-center">
                    Участников меньше 100! Розыгрыш через:
                  </p>
                  <div className="flex justify-center">
                    <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm min-w-[120px]">
                      <p className="text-6xl font-bold text-white animate-pulse">{quickDrawSeconds}</p>
                      <p className="text-sm text-white/90 mt-2">секунд</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-xs text-center mt-4">
                    Успейте купить билет и получить VIP!
                  </p>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
                  <p className="text-white/90 text-sm mb-3 text-center">До следующего розыгрыша:</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <p className="text-3xl font-bold text-white">{timeLeft.days}</p>
                      <p className="text-xs text-white/80 mt-1">дней</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <p className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</p>
                      <p className="text-xs text-white/80 mt-1">часов</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <p className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</p>
                      <p className="text-xs text-white/80 mt-1">минут</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <p className="text-3xl font-bold text-white animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</p>
                      <p className="text-xs text-white/80 mt-1">секунд</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                  <p className="text-white/95 text-sm">
                    <span className="font-bold">Правила участия:</span> Один аккаунт = один билет. 
                    В розыгрыше участвуют только VIP-пользователи с купленным билетом.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  onClick={() => setCurrentPage('raffle')}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg px-8 py-6 h-auto"
                >
                  <Icon name="Ticket" size={20} className="mr-2" />
                  Купить билет 100 ₽
                </Button>
                
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Icon name="Users" size={16} />
                  <span>Куплено <span className="font-bold text-white">{ticketsSold.toLocaleString('ru-RU')}</span> билетов</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/30 p-8 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 shadow-xl animate-bounce border-2 border-white/20">
                  <Icon name="Smartphone" size={32} />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Calendar" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Следующий розыгрыш</p>
                      <p className="text-xl font-bold">Воскресенье, 12:00 МСК</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Gift" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Приз</p>
                      <p className="text-xl font-bold">iPhone 17 (256GB)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Ticket" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Стоимость билета</p>
                      <p className="text-xl font-bold">100 ₽</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Icon name="Zap" size={24} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm opacity-80">Шанс победы</p>
                      <p className="text-xl font-bold">1 из {ticketsSold.toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Честный и прозрачный розыгрыш</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Результаты в прямом эфире</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                      <Icon name="CheckCircle2" size={16} className="text-green-300" />
                      <span>Доставка по всей России</span>
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
                  <p className="text-3xl font-bold text-white">{ticketsSold.toLocaleString('ru-RU')}</p>
                  <p className="text-sm text-white/80">билетов продано</p>
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