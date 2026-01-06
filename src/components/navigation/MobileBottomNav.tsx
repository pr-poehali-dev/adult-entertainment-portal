import Icon from '@/components/ui/icon';
import { Page } from '@/types';

interface MobileBottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  messageCount?: number;
  isAuthenticated?: boolean;
}

export const MobileBottomNav = ({ currentPage, setCurrentPage, messageCount = 0, isAuthenticated = false }: MobileBottomNavProps) => {
  if (!isAuthenticated || currentPage === 'login' || currentPage === 'register') {
    return null;
  }

  const navItems = [
    { page: 'online-search' as Page, icon: 'Search', label: 'Поиск' },
    { page: 'catalog' as Page, icon: 'Grid3x3', label: 'Объявления' },
    { page: 'swipe' as Page, icon: 'Heart', label: 'Свайп' },
    { page: 'matches' as Page, icon: 'MessageCircle', label: 'Чаты', badge: messageCount },
    { page: 'profile' as Page, icon: 'User', label: 'Профиль' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-6 px-1 py-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
              currentPage === item.page
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Icon name={item.icon} size={20} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage('premium')}
          className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all text-yellow-600 hover:text-yellow-700"
        >
          <Icon name="Crown" size={20} />
          <span className="text-[9px] font-medium">Premium</span>
        </button>
      </div>
    </div>
  );
};