import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { AgencyType } from '@/types';

interface AgencyTypeOption {
  id: AgencyType;
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface AgencyRegisterProps {
  onBack: () => void;
  onPayment: (agencyName: string, agencyType: AgencyType) => void;
}

const AgencyRegister = ({ onBack, onPayment }: AgencyRegisterProps) => {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<AgencyType | null>(null);
  const [agencyName, setAgencyName] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const agencyTypes: AgencyTypeOption[] = [
    {
      id: 'escort',
      icon: 'Users',
      title: 'Эскорт агентство',
      description: 'Управление моделями, каталог услуг, бронирования',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'massage',
      icon: 'Sparkles',
      title: 'Массажный салон',
      description: 'Мастера массажа, расписание, онлайн-запись',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'striptease',
      icon: 'Music',
      title: 'Стриптиз клуб',
      description: 'Танцовщицы и танцоры, выступления, мероприятия',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'virtual',
      icon: 'Smartphone',
      title: 'Агентство виртуальных услуг',
      description: 'Видео-звонки, онлайн общение, контент',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      id: 'realestate',
      icon: 'Building2',
      title: 'Агентство недвижимости',
      description: 'Аренда апартаментов, каталог объектов',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'online-school',
      icon: 'GraduationCap',
      title: 'Онлайн школа',
      description: 'Образовательные курсы, преподаватели, расписание занятий',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AgencyRegister handleSubmit', { agencyName });
    
    if (!agencyName.trim()) {
      setError('Введите название агентства');
      return;
    }

    if (agencyName.trim().length < 3) {
      setError('Название должно содержать минимум 3 символа');
      return;
    }

    if (!selectedType) {
      setError('Выберите тип агентства');
      return;
    }

    console.log('Calling onPayment with:', agencyName.trim(), selectedType);
    onPayment(agencyName.trim(), selectedType);
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-8 space-y-6 bg-card/90 backdrop-blur-sm">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>

          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                <Icon name="Building2" size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Выберите тип агентства
            </h1>
            <p className="text-muted-foreground text-lg">
              Выберите специализацию вашего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agencyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setStep('details');
                }}
                className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-6 text-left bg-card hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon name={type.icon} size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-6">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Все типы агентств включают:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ Личный кабинет с полной аналитикой</li>
                  <li>✓ Неограниченное количество анкет сотрудников</li>
                  <li>✓ Управление бронированиями и финансами</li>
                  <li>✓ Приоритетная поддержка</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const selectedTypeData = agencyTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6 bg-card/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => setStep('type')}
          className="mb-4"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="ml-2">Назад к выбору типа</span>
        </Button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className={`bg-gradient-to-br ${selectedTypeData?.gradient || 'from-purple-500 to-pink-500'} p-4 rounded-full shadow-lg`}>
              <Icon name={selectedTypeData?.icon || 'Building2'} size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedTypeData?.title || 'Открыть Агентство'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Получите полноценный личный кабинет для управления бизнесом
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-purple-600" />
            Что входит в личный кабинет агентства:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>Дашборд с аналитикой</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>Управление моделями</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>Финансовые отчеты</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>Календарь бронирований</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>История транзакций</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" className="text-purple-600" size={16} />
              <span>Настройки агентства</span>
            </div>
          </div>
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

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700 p-6 rounded-lg text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">10,000 ₽</p>
                <p className="text-xs text-muted-foreground">или</p>
              </div>
              <div className="text-3xl">💗</div>
              <div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">1,000 LOVE</p>
                <p className="text-xs text-muted-foreground">внутренняя валюта</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Единоразовая оплата • Полный доступ навсегда
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg" 
            size="lg"
          >
            <Icon name="CreditCard" size={20} />
            <span className="ml-2">Перейти к оплате и создать кабинет</span>
          </Button>
        </form>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Что произойдет после оплаты:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Автоматическое создание личного кабинета агентства</li>
                <li>✓ Доступ к панели управления и статистике</li>
                <li>✓ Возможность добавлять неограниченное количество моделей</li>
                <li>✓ Все функции доступны сразу после оплаты</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgencyRegister;