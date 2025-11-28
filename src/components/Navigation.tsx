import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userRole: UserRole;
  profile: Profile;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
}

const Navigation = ({
  currentPage,
  setCurrentPage,
  userRole,
  profile,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  isDarkTheme,
  setIsDarkTheme,
}: NavigationProps) => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
  <nav className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-lg">
    <div className="container mx-auto px-4 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          <Icon name="Crown" size={32} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="gold-shimmer">Elite</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
            {t.nav.home}
          </button>
          <button onClick={() => setCurrentPage('catalog')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
            {t.nav.catalog}
          </button>
          <button onClick={() => setCurrentPage('work')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
            Работа
          </button>
          {userRole && (
            <>
              <button onClick={() => setCurrentPage('favorites')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
                {t.nav.favorites}
              </button>
              <button 
                onClick={() => setCurrentPage('messages')} 
                className="text-foreground font-medium hover:text-primary transition-colors relative tracking-wide"
              >
                {t.nav.messages}
                {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-gradient-to-r from-secondary to-secondary/90 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {notifications.filter(n => !n.read && n.type === 'message').length}
                  </span>
                )}
              </button>
            </>
          )}
          <button onClick={() => setCurrentPage('rules')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
            {t.nav.rules}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="text-foreground/80 hover:text-primary"
          >
            {isDarkTheme ? <Icon name="Sun" size={20} /> : <Icon name="Moon" size={20} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentPage('catalog')}
            className="text-foreground/80 hover:text-primary"
          >
            <Icon name="Search" size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentPage('catalog')}
            className="text-foreground/80 hover:text-primary"
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={language === 'ru' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setLanguage('ru')}
              className="h-8 w-8 p-0 text-xl"
              title="Русский"
            >
              🇷🇺
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setLanguage('en')}
              className="h-8 w-8 p-0 text-xl"
              title="English"
            >
              🇬🇧
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="text-foreground/80 hover:text-primary"
          >
            {isDarkTheme ? <Icon name="Sun" size={20} /> : <Icon name="Moon" size={20} />}
          </Button>
          {userRole && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Icon name="Bell" size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 animate-fade-in">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Уведомления</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                    >
                      Прочитать все
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Icon name="BellOff" size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Нет уведомлений</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => {
                            setNotifications(
                              notifications.map(n =>
                                n.id === notif.id ? { ...n, read: true } : n
                              )
                            );
                            if (notif.type === 'message') setCurrentPage('messages');
                            if (notif.type === 'booking') setCurrentPage('profile');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              notif.type === 'message' ? 'bg-blue-500/20' :
                              notif.type === 'booking' ? 'bg-green-500/20' :
                              notif.type === 'review' ? 'bg-yellow-500/20' :
                              'bg-purple-500/20'
                            }`}>
                              <Icon 
                                name={
                                  notif.type === 'message' ? 'MessageCircle' :
                                  notif.type === 'booking' ? 'Calendar' :
                                  notif.type === 'review' ? 'Star' :
                                  'Bell'
                                } 
                                size={20}
                                className={
                                  notif.type === 'message' ? 'text-blue-500' :
                                  notif.type === 'booking' ? 'text-green-500' :
                                  notif.type === 'review' ? 'text-yellow-500' :
                                  'text-purple-500'
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-sm">{notif.title}</h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notif.text}</p>
                              <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {userRole ? (
            <Button variant="ghost" onClick={() => setCurrentPage('profile')}>
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{t.nav.profile}</span>
            </Button>
          ) : (
            <Button onClick={() => setCurrentPage('register')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t.nav.login}
            </Button>
          )}
        </div>
      </div>
    </div>
  </nav>
  );
};

export default Navigation;