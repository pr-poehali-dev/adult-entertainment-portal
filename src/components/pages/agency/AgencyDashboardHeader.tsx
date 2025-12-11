import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { AgencyType } from '@/types';

interface AgencyDashboardHeaderProps {
  agencyName: string;
  agencyType?: AgencyType;
  onBack: () => void;
  onAddGirl: () => void;
}

export const AgencyDashboardHeader = ({
  agencyName,
  agencyType,
  onBack,
  onAddGirl,
}: AgencyDashboardHeaderProps) => {
  const getAgencyTypeConfig = (type?: AgencyType) => {
    const configs = {
      escort: {
        label: 'Эскорт агентство',
        icon: 'Users',
        addButtonLabel: 'Добавить модель',
        gradient: 'from-purple-600 via-pink-600 to-rose-600'
      },
      massage: {
        label: 'Массажный салон',
        icon: 'Sparkles',
        addButtonLabel: 'Добавить мастера',
        gradient: 'from-blue-600 via-cyan-600 to-teal-600'
      },
      striptease: {
        label: 'Стриптиз клуб',
        icon: 'Music',
        addButtonLabel: 'Добавить танцора',
        gradient: 'from-pink-600 via-rose-600 to-red-600'
      },
      virtual: {
        label: 'Агентство виртуальных услуг',
        icon: 'Smartphone',
        addButtonLabel: 'Добавить модель',
        gradient: 'from-violet-600 via-purple-600 to-indigo-600'
      },
      realestate: {
        label: 'Агентство недвижимости',
        icon: 'Building2',
        addButtonLabel: 'Добавить объект',
        gradient: 'from-orange-600 via-amber-600 to-yellow-600'
      }
    };
    return type ? configs[type] : {
      label: 'Агентство',
      icon: 'Building2',
      addButtonLabel: 'Добавить модель',
      gradient: 'from-purple-600 via-pink-600 to-rose-600'
    };
  };

  const config = getAgencyTypeConfig(agencyType);
  return (
    <div className={`border-b bg-gradient-to-r ${config.gradient} text-white sticky top-0 z-10 shadow-lg`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name={config.icon} size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">
                  {agencyName}
                </h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {config.label}
                </Badge>
              </div>
              <p className="text-sm text-white/80">Личный кабинет • Полный контроль бизнеса</p>
            </div>
          </div>
          <Button 
            onClick={onAddGirl} 
            size="lg" 
            className="bg-white hover:bg-white/90 font-bold shadow-xl"
            style={{ color: config.gradient.split(' ')[1].replace('via-', '') }}
          >
            <Icon name="UserPlus" size={20} />
            <span className="ml-2">{config.addButtonLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};