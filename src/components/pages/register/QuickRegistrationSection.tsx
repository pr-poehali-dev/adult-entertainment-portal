import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { UserRole } from '@/types';

interface QuickRegistrationSectionProps {
  isBusinessMode: boolean;
  onQuickRegister: (role: UserRole) => void;
}

export const QuickRegistrationSection = ({ isBusinessMode, onQuickRegister }: QuickRegistrationSectionProps) => {
  return (
    <div className={`mb-8 p-6 rounded-lg border-2 transition-all duration-500 ${isBusinessMode ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border-pink-300/30 dark:border-pink-700/30' : 'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20'}`}>
      <div className="text-center mb-4">
        <Icon name="Zap" size={32} className={`mx-auto mb-2 transition-colors duration-500 ${isBusinessMode ? 'text-pink-600 dark:text-pink-400' : 'text-primary'}`} />
        <h3 className="text-xl font-bold text-foreground mb-1">Регистрация в 1 клик</h3>
        <p className="text-sm text-muted-foreground">Быстрый старт без заполнения формы. Профиль можно заполнить позже.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className={`h-14 border-2 hover:text-white transition-all duration-300 hover:scale-105 ${isBusinessMode ? 'border-pink-500/40 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600' : 'border-primary/40 hover:bg-primary'}`}
          onClick={() => onQuickRegister('buyer')}
        >
          <Icon name="ShoppingBag" size={20} className="mr-2" />
          Мужчина
        </Button>
        <Button
          variant="outline"
          className={`h-14 border-2 hover:text-white transition-all duration-300 hover:scale-105 ${isBusinessMode ? 'border-pink-500/40 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600' : 'border-primary/40 hover:bg-primary'}`}
          onClick={() => onQuickRegister('seller')}
        >
          <Icon name="Briefcase" size={20} className="mr-2" />
          Девушка
        </Button>
      </div>
    </div>
  );
};
