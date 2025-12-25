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
import { HealthCertificateBadge } from '@/components/health/HealthCertificateBadge';
import { HealthCertificateStatus } from '@/components/health/HealthCertificateStatus';
import { HealthCertificateUploadModal } from '@/components/health/HealthCertificateUploadModal';
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
  const [showHealthCertModal, setShowHealthCertModal] = useState(false);

  if (!profile) {
    return <div className="p-4">Загрузка настроек...</div>;
  }

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
    
    const newExpiry = new Date(startDate.getTime());
    const targetMonth = newExpiry.getMonth() + months;
    const targetYear = newExpiry.getFullYear() + Math.floor(targetMonth / 12);
    const finalMonth = targetMonth % 12;
    
    newExpiry.setFullYear(targetYear);
    newExpiry.setMonth(finalMonth);

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
  
  const canUploadHealthCert = () => {
    if (!profile.lastHealthCertificateUpload) return true;
    const lastUpload = new Date(profile.lastHealthCertificateUpload);
    const now = new Date();
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
    return (now.getTime() - lastUpload.getTime()) >= threeMonthsInMs;
  };
  
  const getNextAvailableUpload = () => {
    if (!profile.lastHealthCertificateUpload) return null;
    const lastUpload = new Date(profile.lastHealthCertificateUpload);
    const nextDate = new Date(lastUpload);
    nextDate.setMonth(nextDate.getMonth() + 3);
    return nextDate.toISOString();
  };
  
  const handleHealthCertUpload = (file: File) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 3);
    
    const vipExpiry = new Date(now);
    vipExpiry.setMonth(vipExpiry.getMonth() + 3);
    
    onProfileUpdate?.({
      healthCertified: true,
      healthCertificateExpiry: expiry.toISOString(),
      lastHealthCertificateUpload: now.toISOString(),
      vipStatus: 'vip',
      vipExpiry: vipExpiry.toISOString(),
    });
    
    toast({
      title: "Справка загружена успешно!",
      description: "Вы получили статус 'Здоровый продавец' и бесплатный VIP на 3 месяца",
    });
    
    setShowHealthCertModal(false);
  };
  
  const isHealthCertExpired = profile.healthCertificateExpiry 
    ? new Date(profile.healthCertificateExpiry) < new Date() 
    : true;

  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Все изменения успешно применены",
    });
  };

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
                  <Icon name="Heart" size={24} className="text-green-500" />
                  Медицинская справка "СЕКС НА ПЛЯЖЕ"
                  {profile.healthCertified && !isHealthCertExpired && <HealthCertificateBadge size="sm" />}
                </CardTitle>
                <CardDescription>
                  Подтвердите здоровье и получите особый статус + бесплатный VIP на 3 месяца
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.healthCertified && profile.healthCertificateExpiry && (
                  <HealthCertificateStatus expiry={profile.healthCertificateExpiry} />
                )}
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon name="Info" size={16} className="text-primary" />
                    Что даёт справка:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Статус "Здоровый продавец" на 3 месяца</li>
                    <li>Бесплатный VIP статус на 3 месяца</li>
                    <li>Повышенное доверие клиентов</li>
                    <li>Можно загружать раз в 3 месяца</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => setShowHealthCertModal(true)} 
                  variant={profile.healthCertified && !isHealthCertExpired ? "outline" : "default"}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={!canUploadHealthCert()}
                >
                  <Icon name="Upload" size={16} />
                  {profile.healthCertified && !isHealthCertExpired 
                    ? 'Обновить справку' 
                    : 'Загрузить справку'}
                </Button>
                
                {!canUploadHealthCert() && (
                  <p className="text-xs text-muted-foreground text-center">
                    Следующая загрузка доступна {new Date(getNextAvailableUpload()!).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </CardContent>
            </Card>

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
                  workSchedule={workSchedule}
                  isActive={isActive}
                  onScheduleChange={setWorkSchedule}
                  onActiveChange={setIsActive}
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
                    onCheckedChange={(checked) => {
                      setIsActive(checked);
                      toast({
                        title: "Настройка сохранена",
                        description: checked ? "Профиль теперь виден в каталоге" : "Профиль скрыт из каталога",
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            <span>Автосохранение включено</span>
          </div>
          <Button 
            onClick={handleSaveSettings}
            variant="outline"
            className="px-6"
          >
            <Icon name="Check" size={18} className="mr-2" />
            Сохранить вручную
          </Button>
        </div>
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

      <HealthCertificateUploadModal
        isOpen={showHealthCertModal}
        onClose={() => setShowHealthCertModal(false)}
        onSubmit={handleHealthCertUpload}
        canUpload={canUploadHealthCert()}
        nextAvailableUpload={getNextAvailableUpload()}
      />
    </>
  );
};