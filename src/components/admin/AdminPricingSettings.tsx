import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PriceSettings {
  vipWeek: number;
  vipMonth: number;
  vipYear: number;
  profileBoost: number;
  top3Week: number;
  top3Month: number;
  highlightAd: number;
  premiumSupport: number;
  verificationBadge: number;
}

interface AdminPricingSettingsProps {
  prices: PriceSettings;
  onUpdatePrices: (prices: PriceSettings) => void;
}

export const AdminPricingSettings = ({ prices, onUpdatePrices }: AdminPricingSettingsProps) => {
  const [editedPrices, setEditedPrices] = useState<PriceSettings>(prices);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handlePriceChange = (key: keyof PriceSettings, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedPrices(prev => ({ ...prev, [key]: numValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdatePrices(editedPrices);
    setHasChanges(false);
    toast({
      title: 'Цены обновлены',
      description: 'Новые цены успешно сохранены',
    });
  };

  const handleReset = () => {
    setEditedPrices(prices);
    setHasChanges(false);
    toast({
      title: 'Изменения отменены',
      description: 'Цены возвращены к сохраненным значениям',
    });
  };

  const PriceCard = ({ 
    title, 
    description, 
    priceKey, 
    icon 
  }: { 
    title: string; 
    description: string; 
    priceKey: keyof PriceSettings;
    icon: string;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name={icon as any} size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={priceKey}>Цена (₽)</Label>
          <div className="flex items-center gap-2">
            <Input
              id={priceKey}
              type="number"
              value={editedPrices[priceKey]}
              onChange={(e) => handlePriceChange(priceKey, e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">₽</span>
          </div>
          {editedPrices[priceKey] !== prices[priceKey] && (
            <p className="text-xs text-yellow-600">
              Было: {prices[priceKey]} ₽
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Управление ценами</h3>
          <p className="text-sm text-muted-foreground">
            Настройка стоимости всех платных услуг платформы
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleReset}>
                <Icon name="X" size={16} className="mr-2" />
                Отменить
              </Button>
              <Button onClick={handleSave}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="vip" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vip">
            <Icon name="Crown" size={16} className="mr-2" />
            VIP-статусы
          </TabsTrigger>
          <TabsTrigger value="promotion">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Продвижение
          </TabsTrigger>
          <TabsTrigger value="additional">
            <Icon name="Sparkles" size={16} className="mr-2" />
            Дополнительно
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vip" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PriceCard
              title="VIP на неделю"
              description="Доступ к премиум-функциям на 7 дней"
              priceKey="vipWeek"
              icon="Crown"
            />
            <PriceCard
              title="VIP на месяц"
              description="Доступ к премиум-функциям на 30 дней"
              priceKey="vipMonth"
              icon="Crown"
            />
            <PriceCard
              title="VIP на год"
              description="Доступ к премиум-функциям на 365 дней"
              priceKey="vipYear"
              icon="Crown"
            />
          </div>
        </TabsContent>

        <TabsContent value="promotion" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PriceCard
              title="Поднятие анкеты"
              description="Подъем анкеты в списке на 24 часа"
              priceKey="profileBoost"
              icon="ArrowUp"
            />
            <PriceCard
              title="ТОП-3 на неделю"
              description="Размещение в ТОП-3 на доске объявлений (7 дней)"
              priceKey="top3Week"
              icon="Award"
            />
            <PriceCard
              title="ТОП-3 на месяц"
              description="Размещение в ТОП-3 на доске объявлений (30 дней)"
              priceKey="top3Month"
              icon="Award"
            />
            <PriceCard
              title="Выделение объявления"
              description="Цветное выделение на 7 дней"
              priceKey="highlightAd"
              icon="Highlighter"
            />
          </div>
        </TabsContent>

        <TabsContent value="additional" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PriceCard
              title="Премиум поддержка"
              description="Приоритетная поддержка 24/7"
              priceKey="premiumSupport"
              icon="Headphones"
            />
            <PriceCard
              title="Значок верификации"
              description="Подтверждение подлинности аккаунта"
              priceKey="verificationBadge"
              icon="CheckCircle"
            />
          </div>
        </TabsContent>
      </Tabs>

      {hasChanges && (
        <Card className="border-yellow-500 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Есть несохраненные изменения
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Не забудьте сохранить изменения цен, чтобы они вступили в силу
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Статистика продаж</CardTitle>
          <CardDescription>Информация о проданных услугах за последний месяц</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">VIP-статусы</p>
              <p className="text-2xl font-bold">342</p>
              <p className="text-xs text-muted-foreground">
                ~{((editedPrices.vipWeek + editedPrices.vipMonth + editedPrices.vipYear) / 3 * 342).toLocaleString()} ₽
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Продвижение</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">
                ~{((editedPrices.profileBoost + editedPrices.top3Week + editedPrices.highlightAd) / 3 * 156).toLocaleString()} ₽
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Доп. услуги</p>
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-muted-foreground">
                ~{((editedPrices.premiumSupport + editedPrices.verificationBadge) / 2 * 89).toLocaleString()} ₽
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
