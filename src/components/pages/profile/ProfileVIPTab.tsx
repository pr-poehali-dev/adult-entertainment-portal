import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Profile } from '@/types';
import { VIPBadge } from '@/components/vip/VIPBadge';
import { VIPStatus } from '@/components/vip/VIPStatus';
import { useState } from 'react';
import { VIPUpgradeModal } from '@/components/vip/VIPUpgradeModal';
import { useToast } from '@/hooks/use-toast';

interface ProfileVIPTabProps {
  profile: Profile;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
}

export const ProfileVIPTab = ({ profile, onProfileUpdate }: ProfileVIPTabProps) => {
  const { toast } = useToast();
  const [showVIPModal, setShowVIPModal] = useState(false);

  const isVIP = profile.vipStatus === 'vip';
  const isVIPExpired = profile.vipExpiry ? new Date(profile.vipExpiry) < new Date() : true;

  const handleVIPPurchase = (plan: any) => {
    const now = new Date();
    const currentExpiry = profile.vipExpiry ? new Date(profile.vipExpiry) : now;
    const startDate = currentExpiry > now ? currentExpiry : now;
    
    const newExpiry = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    onProfileUpdate?.({
      vipStatus: 'vip',
      vipExpiry: newExpiry.toISOString(),
    });

    toast({
      title: "VIP статус активирован",
      description: `Подписка продлена до ${newExpiry.toLocaleDateString('ru-RU')}`,
    });

    setShowVIPModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Текущий VIP статус */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VIPBadge size="sm" />
              VIP Статус
            </CardTitle>
            <CardDescription>
              Премиум преимущества для вашей анкеты
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <VIPStatus 
              vipStatus={profile.vipStatus}
              vipExpiry={profile.vipExpiry}
            />

            {(!isVIP || isVIPExpired) && (
              <Button 
                onClick={() => setShowVIPModal(true)}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                <Icon name="Crown" size={18} />
                Получить VIP статус
              </Button>
            )}

            {isVIP && !isVIPExpired && (
              <Button 
                onClick={() => setShowVIPModal(true)}
                variant="outline"
                className="w-full"
              >
                <Icon name="Sparkles" size={18} />
                Продлить VIP
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Преимущества VIP */}
        <Card>
          <CardHeader>
            <CardTitle>Преимущества VIP</CardTitle>
            <CardDescription>
              Что вы получаете с VIP статусом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingUp" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Приоритет в поиске</h4>
                  <p className="text-sm text-muted-foreground">
                    Ваша анкета показывается первой в результатах поиска
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Eye" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Увеличенная видимость</h4>
                  <p className="text-sm text-muted-foreground">
                    На 300% больше просмотров вашей анкеты
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">VIP-значок</h4>
                  <p className="text-sm text-muted-foreground">
                    Золотой значок в вашем профиле выделяет вас среди других
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="BarChart" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Подробная статистика</h4>
                  <p className="text-sm text-muted-foreground">
                    Просматривайте детальную аналитику просмотров и активности
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Headphones" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Приоритетная поддержка</h4>
                  <p className="text-sm text-muted-foreground">
                    Ваши обращения обрабатываются в первую очередь
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Ban" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Без рекламы</h4>
                  <p className="text-sm text-muted-foreground">
                    Пользуйтесь платформой без отвлекающих элементов
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Сравнение тарифов */}
        <Card>
          <CardHeader>
            <CardTitle>Сравнение тарифов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Функция</th>
                    <th className="text-center py-3 px-2">Обычный</th>
                    <th className="text-center py-3 px-2 bg-gradient-to-r from-yellow-50 to-amber-50">
                      <div className="flex items-center justify-center gap-1">
                        <VIPBadge size="sm" />
                        VIP
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-2">Просмотры профиля</td>
                    <td className="text-center py-3 px-2">Базовые</td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                      <span className="ml-1">+300%</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Позиция в поиске</td>
                    <td className="text-center py-3 px-2">Обычная</td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                      <span className="ml-1">Первые места</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Значок в профиле</td>
                    <td className="text-center py-3 px-2">
                      <Icon name="X" className="inline text-gray-400" size={18} />
                    </td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Статистика</td>
                    <td className="text-center py-3 px-2">Базовая</td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                      <span className="ml-1">Подробная</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Поддержка</td>
                    <td className="text-center py-3 px-2">Обычная</td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                      <span className="ml-1">Приоритетная</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2">Реклама</td>
                    <td className="text-center py-3 px-2">Показывается</td>
                    <td className="text-center py-3 px-2 bg-yellow-50">
                      <Icon name="Check" className="inline text-green-500" size={18} />
                      <span className="ml-1">Отключена</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <VIPUpgradeModal
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        currentVipExpiry={profile.vipExpiry}
        onPurchase={handleVIPPurchase}
      />
    </>
  );
};
