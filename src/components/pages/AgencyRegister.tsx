import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

interface AgencyRegisterProps {
  onBack: () => void;
  onPayment: (agencyName: string) => void;
}

const AgencyRegister = ({ onBack, onPayment }: AgencyRegisterProps) => {
  const [agencyName, setAgencyName] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agencyName.trim()) {
      setError('Введите название агентства');
      return;
    }

    if (agencyName.trim().length < 3) {
      setError('Название должно содержать минимум 3 символа');
      return;
    }

    onPayment(agencyName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6 bg-card/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="ml-2">Назад</span>
        </Button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Icon name="Building2" size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Открыть Агентство</h1>
          <p className="text-muted-foreground">
            Создайте своё агентство и управляйте анкетами девушек
          </p>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <Icon name="Check" className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Админ-панель агентства</h3>
              <p className="text-sm text-muted-foreground">
                Полный контроль над анкетами и заказами
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="Check" className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Неограниченное количество анкет</h3>
              <p className="text-sm text-muted-foreground">
                Создавайте профили для всех ваших сотрудниц
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="Check" className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Статистика и аналитика</h3>
              <p className="text-sm text-muted-foreground">
                Отслеживайте доходы и популярность каждой анкеты
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="Check" className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Приоритетная поддержка</h3>
              <p className="text-sm text-muted-foreground">
                Быстрая помощь и консультации для агентств
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Название агентства <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="Например: Elite Models Agency"
              value={agencyName}
              onChange={(e) => {
                setAgencyName(e.target.value);
                setError('');
              }}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {error}
              </p>
            )}
          </div>

          <div className="bg-primary/10 p-6 rounded-lg text-center space-y-2">
            <p className="text-2xl font-bold">10 000 ₽</p>
            <p className="text-sm text-muted-foreground">
              Единоразовая оплата за открытие агентства
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Icon name="CreditCard" size={20} />
            <span className="ml-2">Перейти к оплате</span>
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>После оплаты вы получите доступ к админ-панели агентства</p>
        </div>
      </Card>
    </div>
  );
};

export default AgencyRegister;
