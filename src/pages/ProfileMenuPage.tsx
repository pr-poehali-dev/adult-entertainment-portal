import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileMenuPageProps {
  profile: any;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

export const ProfileMenuPage = ({ profile, setCurrentPage, onLogout }: ProfileMenuPageProps) => {
  const menuItems = [
    { icon: 'User', label: 'Мой профиль', page: 'profile', color: 'text-blue-500' },
    { icon: 'Heart', label: 'Избранное', page: 'favorites', color: 'text-pink-500' },
    { icon: 'Wallet', label: 'Кошелек', page: 'wallet', color: 'text-green-500' },
    { icon: 'MessageSquare', label: 'Сообщения', page: 'messages', color: 'text-purple-500' },
    { icon: 'ShoppingBag', label: 'Мои заказы', page: 'my-orders', color: 'text-orange-500' },
    { icon: 'FileText', label: 'Мои объявления', page: 'my-ads', color: 'text-indigo-500' },
    { icon: 'Calendar', label: 'Бронирования', page: 'bookings', color: 'text-cyan-500' },
    { icon: 'Settings', label: 'Настройки', page: 'settings', color: 'text-gray-500' },
  ];

  const stats = [
    { label: 'Объявлений', value: '3', icon: 'FileText' },
    { label: 'Заказов', value: '12', icon: 'ShoppingBag' },
    { label: 'Отзывов', value: '8', icon: 'Star' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          <CardContent className="relative pt-0 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                  {profile.name ? profile.name[0] : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left mt-4">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.name || 'Пользователь'}</h1>
                  {profile.verified && (
                    <Badge className="bg-blue-500 border-0">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      Верифицирован
                    </Badge>
                  )}
                  {profile.vipStatus === 'vip' && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
                      <Icon name="Crown" size={12} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profile.nickname || 'username'}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                  <Icon name="Star" size={18} className="text-yellow-500" />
                  <span className="font-semibold">{profile.rating || 0}</span>
                  <span className="text-muted-foreground text-sm">(0 отзывов)</span>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentPage('profile')}
                className="gap-2"
              >
                <Icon name="Edit" size={16} />
                Редактировать
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-accent/50">
                  <Icon name={stat.icon as any} size={24} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {menuItems.map(item => (
            <Card 
              key={item.page}
              className="hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setCurrentPage(item.page)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon name={item.icon as any} size={24} />
                </div>
                <span className="font-semibold text-lg flex-1">{item.label}</span>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Дополнительно</h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('user-guide')}
              >
                <Icon name="HelpCircle" size={18} className="mr-3" />
                Помощь и поддержка
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('rules')}
              >
                <Icon name="FileText" size={18} className="mr-3" />
                Правила и условия
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={onLogout}
              >
                <Icon name="LogOut" size={18} className="mr-3" />
                Выйти из аккаунта
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
