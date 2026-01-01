import Icon from '@/components/ui/icon';

type BusinessNavTab = 'services' | 'profile' | 'messages' | 'ads' | 'balance' | 'settings' | 'notifications';

interface BusinessBottomNavProps {
  activeTab: BusinessNavTab;
  onTabChange: (tab: BusinessNavTab) => void;
  unreadMessages?: number;
  unreadNotifications?: number;
}

export const BusinessBottomNav = ({ 
  activeTab, 
  onTabChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}: BusinessBottomNavProps) => {
  const navItems = [
    { id: 'profile' as BusinessNavTab, icon: 'User', label: 'Профиль' },
    { id: 'messages' as BusinessNavTab, icon: 'MessageSquare', label: 'Сообщения', badge: unreadMessages },
    { id: 'ads' as BusinessNavTab, icon: 'Megaphone', label: 'Объявления' },
    { id: 'balance' as BusinessNavTab, icon: 'Wallet', label: 'Баланс' },
    { id: 'settings' as BusinessNavTab, icon: 'Settings', label: 'Настройки' },
    { id: 'notifications' as BusinessNavTab, icon: 'Bell', label: 'Уведомления', badge: unreadNotifications },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-2 py-2">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 relative ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="relative">
                <Icon 
                  name={item.icon as any} 
                  size={20}
                  className={activeTab === item.id ? 'text-white' : ''}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${activeTab === item.id ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
