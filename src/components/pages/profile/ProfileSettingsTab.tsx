import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Profile, WorkSchedule } from '@/types';
import { VerificationModal } from '@/components/VerificationModal';
import { WorkScheduleManager } from '@/components/WorkScheduleManager';
import { VIPStatus } from '@/components/vip/VIPStatus';
import { VIPBadge } from '@/components/vip/VIPBadge';
import { VIPUpgradeModal } from '@/components/vip/VIPUpgradeModal';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsTabProps {
  profile: Profile;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  workSchedule: WorkSchedule;
  setWorkSchedule: (schedule: WorkSchedule) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
}

export const ProfileSettingsTab = ({
  profile,
  isVerified,
  setIsVerified,
  workSchedule,
  setWorkSchedule,
  isActive,
  setIsActive,
  onProfileUpdate,
}: ProfileSettingsTabProps) => {
  const { toast } = useToast();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);

  const handleVerificationSubmit = (files: File[]) => {
    setIsVerified(true);
    onProfileUpdate?.({ verified: true });
    toast({
      title: "Документы отправлены",
      description: "Верификация будет завершена в течение 24 часов",
    });
  };

  const handleVIPPurchase = (planId: string, months: number, price: number) => {
    const now = new Date();
    const currentExpiry = profile.vipExpiry ? new Date(profile.vipExpiry) : now;
    const startDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(startDate);
    newExpiry.setMonth(newExpiry.getMonth() + months);

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

  const isVIP = profile.vipStatus === 'vip';
  const isVIPExpired = profile.vipExpiry ? new Date(profile.vipExpiry) < new Date() : true;

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-primary" />
              Верификация профиля
            </CardTitle>
            <CardDescription>
              Подтвердите свою личность для повышения доверия
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={isVerified ? "default" : "secondary"} className="text-sm">
                  {isVerified ? (
                    <>
                      <Icon name="CheckCircle" size={16} className="mr-1" />
                      Верифицирован
                    </>
                  ) : (
                    <>
                      <Icon name="Clock" size={16} className="mr-1" />
                      Не верифицирован
                    </>
                  )}
                </Badge>
              </div>
              {!isVerified && (
                <Button onClick={() => setShowVerificationModal(true)} variant="outline">
                  <Icon name="Upload" size={16} />
                  Пройти верификацию
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Crown" size={24} className="text-yellow-500" />
              VIP статус
              {isVIP && !isVIPExpired && <VIPBadge size="sm" />}
            </CardTitle>
            <CardDescription>
              Получите эксклюзивные преимущества и приоритетную поддержку
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVIP && profile.vipExpiry && (
              <VIPStatus expiry={profile.vipExpiry} />
            )}
            <Button 
              onClick={() => setShowVIPModal(true)} 
              variant={isVIP && !isVIPExpired ? "outline" : "default"}
              className="w-full"
            >
              <Icon name="Crown" size={16} />
              {isVIP && !isVIPExpired ? 'Продлить VIP' : 'Улучшить до VIP'}
            </Button>
          </CardContent>
        </Card>

        {profile.role === 'seller' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Clock" size={24} className="text-primary" />
                  График работы
                </CardTitle>
                <CardDescription>
                  Укажите время, когда вы доступны для клиентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkScheduleManager
                  schedule={workSchedule}
                  onChange={setWorkSchedule}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Power" size={24} className="text-primary" />
                  Видимость профиля
                </CardTitle>
                <CardDescription>
                  Управляйте доступностью вашего профиля в каталоге
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="active-status">Активный профиль</Label>
                    <p className="text-sm text-muted-foreground">
                      {isActive ? 'Ваш профиль виден в каталоге' : 'Ваш профиль скрыт'}
                    </p>
                  </div>
                  <Switch
                    id="active-status"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleVerificationSubmit}
      />

      <VIPUpgradeModal
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        currentStatus={profile.vipStatus}
        currentExpiry={profile.vipExpiry}
        onPurchase={handleVIPPurchase}
      />
    </>
  );
};
