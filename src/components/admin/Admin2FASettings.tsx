import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Admin2FASettingsProps {
  is2FAEnabled: boolean;
  on2FAToggle: (enabled: boolean) => void;
}

export const Admin2FASettings = ({ is2FAEnabled, on2FAToggle }: Admin2FASettingsProps) => {
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes] = useState([
    'A7B2-C9D4-E1F6',
    'G3H8-J5K2-L9M4',
    'N1P6-Q8R3-S5T7',
    'U2V9-W4X6-Y1Z8',
    'A5B3-C7D9-E2F4',
  ]);

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AdminPanel:admin@kinderdealer?secret=${secretKey}&issuer=AdminPanel`;

  const handleEnable2FA = () => {
    setShowSetup(true);
  };

  const handleVerify2FA = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Введите 6-значный код",
        variant: "destructive",
      });
      return;
    }

    on2FAToggle(true);
    setShowSetup(false);
    toast({
      title: "2FA включена",
      description: "Двухфакторная аутентификация успешно активирована",
    });
  };

  const handleDisable2FA = () => {
    on2FAToggle(false);
    toast({
      title: "2FA отключена",
      description: "Двухфакторная аутентификация деактивирована",
      variant: "destructive",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  if (showSetup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Shield" size={24} className="text-primary" />
            Настройка Google Authenticator
          </CardTitle>
          <CardDescription>
            Отсканируйте QR-код в приложении Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src={qrCodeUrl} 
                alt="QR Code"
                className="mx-auto border-4 border-border rounded-lg"
              />
              <p className="text-sm text-muted-foreground mt-4">
                Отсканируйте QR-код в приложении
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Или введите код вручную:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background rounded border text-center font-mono">
                  {secretKey}
                </code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(secretKey)}
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification">Код подтверждения из приложения</Label>
            <Input
              id="verification"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSetup(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleVerify2FA}
              className="flex-1"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Подтвердить
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Shield" size={24} className="text-primary" />
          Двухфакторная аутентификация (2FA)
          {is2FAEnabled && (
            <Badge variant="default" className="ml-auto">
              <Icon name="CheckCircle" size={12} className="mr-1" />
              Активна
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Дополнительная защита входа с помощью Google Authenticator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Smartphone" size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Google Authenticator</p>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled ? 'Защита активна' : 'Защита отключена'}
              </p>
            </div>
          </div>
          <Switch
            checked={is2FAEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEnable2FA();
              } else {
                handleDisable2FA();
              }
            }}
          />
        </div>

        {is2FAEnabled && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <Icon name="Info" size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Резервные коды</p>
                  <p className="text-blue-800 dark:text-blue-200">
                    Сохраните эти коды в безопасном месте. Они помогут войти, если вы потеряете доступ к телефону.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Резервные коды для входа:</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                >
                  <Icon name="Copy" size={14} className="mr-2" />
                  Копировать все
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted rounded-lg font-mono text-sm text-center cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => copyToClipboard(code)}
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!is2FAEnabled && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Как это работает:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Установите приложение Google Authenticator на телефон</li>
                <li>Отсканируйте QR-код для связи с админ-панелью</li>
                <li>При входе вводите код из приложения</li>
              </ol>
            </div>

            <Button 
              onClick={handleEnable2FA}
              className="w-full"
            >
              <Icon name="Lock" size={16} className="mr-2" />
              Включить 2FA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
