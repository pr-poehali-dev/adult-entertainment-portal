import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Page, Profile } from '@/types';

interface AgencyBannerProps {
  setCurrentPage: (page: Page) => void;
  profile: Profile;
}

export const AgencyBanner = ({ setCurrentPage, profile }: AgencyBannerProps) => {
  // Не показываем баннер, если пользователь уже владелец агентства
  if (profile.isAgencyOwner) {
    return null;
  }

  return (
    <section className="py-6 md:py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 w-full overflow-x-hidden">
      <div className="max-w-wide mx-auto w-full">
        <Card className="overflow-hidden border-2 border-purple-300 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/50 shadow-2xl w-full">
          <CardContent className="p-0 w-full">
            <div className="grid md:grid-cols-2 gap-0 w-full">
              {/* Левая часть - контент */}
              <div className="p-4 sm:p-6 md:p-12 flex flex-col justify-center w-full">
                <div className="inline-block mb-3 md:mb-4">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                    <Icon name="Sparkles" size={16} />
                    <span className="whitespace-nowrap">Новые возможности</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight">
                  Откройте своё агентство
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                  Начните зарабатывать на управлении командой моделей. Полный контроль, статистика и автоматизация бизнеса.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={16} className="text-white md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm mb-0.5 md:mb-1">Управление анкетами</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">Добавляйте и редактируйте профили моделей</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="BarChart3" size={16} className="text-white md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm mb-0.5 md:mb-1">Аналитика</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">Просмотры, бронирования, доходы</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Wallet" size={16} className="text-white md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm mb-0.5 md:mb-1">Финансы</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">Прозрачная система выплат</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" size={16} className="text-white md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm mb-0.5 md:mb-1">Защита</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">Верификация и безопасность</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button
                    size="lg"
                    onClick={() => setCurrentPage('agency-register')}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 w-full sm:w-auto"
                  >
                    <Icon name="Building2" size={18} className="mr-2 sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                    <span className="whitespace-nowrap">Открыть агентство</span>
                  </Button>

                  <div className="flex items-center gap-2 text-xs sm:text-sm justify-center sm:justify-start">
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Icon name="DollarSign" size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="font-bold whitespace-nowrap">10,000 ₽</span>
                    </div>
                    <span className="text-muted-foreground whitespace-nowrap">или 1,000 💗</span>
                  </div>
                </div>
              </div>

              {/* Правая часть - визуальное оформление */}
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-6 md:p-12 flex items-center justify-center overflow-hidden">
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 text-center text-white w-full">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="Building2" size={40} className="text-white drop-shadow-lg sm:w-12 sm:h-12 md:w-16 md:h-16" />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 md:mb-1">500+</div>
                      <div className="text-xs md:text-sm opacity-90">Успешных агентств</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 md:mb-1">2,000+</div>
                      <div className="text-xs md:text-sm opacity-90">Моделей в каталоге</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 md:mb-1">24/7</div>
                      <div className="text-xs md:text-sm opacity-90">Поддержка</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <div className="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto w-full">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
              <Icon name="Zap" size={18} className="text-purple-600 flex-shrink-0 sm:w-5 sm:h-5" />
              <h4 className="font-semibold text-sm md:text-base">Быстрый старт</h4>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Регистрация за 5 минут, начните работать сразу</p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
              <Icon name="TrendingUp" size={18} className="text-pink-600 flex-shrink-0 sm:w-5 sm:h-5" />
              <h4 className="font-semibold text-sm md:text-base">Рост дохода</h4>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Увеличьте прибыль с помощью аналитики</p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
              <Icon name="Award" size={18} className="text-rose-600 flex-shrink-0 sm:w-5 sm:h-5" />
              <h4 className="font-semibold text-sm md:text-base">Престиж</h4>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">VIP статус и особые привилегии</p>
          </div>
        </div>
      </div>
    </section>
  );
};