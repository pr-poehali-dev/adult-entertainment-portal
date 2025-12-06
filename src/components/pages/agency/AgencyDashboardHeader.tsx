import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AgencyDashboardHeaderProps {
  agencyName: string;
  onBack: () => void;
  onAddGirl: () => void;
}

export const AgencyDashboardHeader = ({
  agencyName,
  onBack,
  onAddGirl,
}: AgencyDashboardHeaderProps) => {
  return (
    <div className="border-b bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name="Building2" size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">
                  {agencyName}
                </h1>
              </div>
              <p className="text-sm text-white/80">Личный кабинет агентства • Полный контроль бизнеса</p>
            </div>
          </div>
          <Button 
            onClick={onAddGirl} 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-white/90 font-bold shadow-xl"
          >
            <Icon name="UserPlus" size={20} />
            <span className="ml-2">Добавить модель</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
