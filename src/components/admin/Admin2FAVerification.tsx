import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Admin2FAVerificationProps {
  onVerify: (code: string) => void;
  onBack: () => void;
}

export const Admin2FAVerification = ({ onVerify, onBack }: Admin2FAVerificationProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
            <Icon name="Smartphone" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl">Двухфакторная аутентификация</CardTitle>
          <CardDescription>Введите код из Google Authenticator</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="2fa-code">6-значный код</Label>
              <Input
                id="2fa-code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                Откройте приложение Google Authenticator на телефоне
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={code.length !== 6}>
              <Icon name="Check" size={18} className="mr-2" />
              Подтвердить
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">или</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={onBack}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад к входу
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Нет доступа к телефону?</p>
              <p className="text-xs mt-1">Используйте резервный код из настроек</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
