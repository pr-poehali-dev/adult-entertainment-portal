import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Page, UserRole } from '@/types';
import { TelegramLoginButton } from '@/components/extensions/telegram-auth/TelegramLoginButton';

interface RegisterPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage }: RegisterPageProps) => {
  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram registration:', userData);
    // Здесь можно обработать данные от Telegram
    setUserRole('buyer');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Icon name="UserPlus" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Регистрация</CardTitle>
            <CardDescription>
              Создайте аккаунт для начала работы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Telegram регистрация */}
            <div className="space-y-3">
              <TelegramLoginButton 
                onAuth={handleTelegramLogin}
                buttonSize="large"
                requestAccess="write"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">или</span>
                </div>
              </div>
            </div>

            {/* Email регистрация (можно добавить позже) */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Временная регистрация для тестирования
                setUserRole('buyer');
                setCurrentPage('home');
              }}
            >
              <Icon name="Mail" size={18} className="mr-2" />
              Зарегистрироваться через Email
            </Button>

            {/* Информация */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <Icon name="Shield" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>Конфиденциальность и безопасность гарантированы</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon name="Lock" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>Верификация для защиты пользователей</span>
              </p>
            </div>

            {/* Разделитель */}
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-primary hover:underline font-medium"
              >
                Войти
              </button>
            </div>

            {/* Кнопка назад */}
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setCurrentPage('home')}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
