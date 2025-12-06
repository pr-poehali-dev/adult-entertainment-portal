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
    <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30">
      <div className="max-w-wide mx-auto">
        <Card className="overflow-hidden border-2 border-purple-300 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Левая часть - контент */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block mb-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    <Icon name="Sparkles" size={18} />
                    <span>Новые возможности</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Откройте своё агентство
                </h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Начните зарабатывать на управлении командой моделей. Полный контроль, статистика и автоматизация бизнеса.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Управление анкетами</h4>
                      <p className="text-xs text-muted-foreground">Добавляйте и редактируйте профили моделей</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="BarChart3" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Аналитика</h4>
                      <p className="text-xs text-muted-foreground">Просмотры, бронирования, доходы</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Wallet" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Финансы</h4>
                      <p className="text-xs text-muted-foreground">Прозрачная система выплат</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Защита</h4>
                      <p className="text-xs text-muted-foreground">Верификация и безопасность</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => setCurrentPage('agency-register')}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all text-lg py-6"
                  >
                    <Icon name="Building2" size={22} className="mr-2" />
                    Открыть агентство
                  </Button>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Icon name="DollarSign" size={18} />
                      <span className="font-bold">10,000 ₽</span>
                    </div>
                    <span className="text-muted-foreground">или 1,000 💗 LOVE</span>
                  </div>
                </div>
              </div>

              {/* Правая часть - визуальное оформление */}
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 md:p-12 flex items-center justify-center overflow-hidden">
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="Building2" size={64} className="text-white drop-shadow-lg" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-4xl font-bold mb-1">500+</div>
                      <div className="text-sm opacity-90">Успешных агентств</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-4xl font-bold mb-1">2,000+</div>
                      <div className="text-sm opacity-90">Моделей в каталоге</div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-4xl font-bold mb-1">24/7</div>
                      <div className="text-sm opacity-90">Поддержка</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Zap" size={20} className="text-purple-600" />
              <h4 className="font-semibold">Быстрый старт</h4>
            </div>
            <p className="text-sm text-muted-foreground">Регистрация за 5 минут, начните работать сразу</p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="TrendingUp" size={20} className="text-pink-600" />
              <h4 className="font-semibold">Рост дохода</h4>
            </div>
            <p className="text-sm text-muted-foreground">Увеличьте прибыль с помощью аналитики</p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Award" size={20} className="text-rose-600" />
              <h4 className="font-semibold">Престиж</h4>
            </div>
            <p className="text-sm text-muted-foreground">VIP статус и особые привилегии</p>
          </div>
        </div>
      </div>
    </section>
  );
};
