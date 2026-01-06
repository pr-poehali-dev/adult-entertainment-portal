import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Page, UserRole } from '@/types';
import { TelegramLoginButton } from '@/components/extensions/telegram-auth/TelegramLoginButton';

interface LoginPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const LoginPage = ({ setUserRole, setCurrentPage, setIsAuthenticated }: LoginPageProps) => {
  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram login:', userData);
    setIsAuthenticated(true);
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
                <Icon name="LogIn" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Вход</CardTitle>
            <CardDescription>
              Войдите в аккаунт для продолжения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Telegram авторизация */}
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

            {/* Email вход (можно добавить позже) */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Временный вход для тестирования
                setIsAuthenticated(true);
                setUserRole('buyer');
                setCurrentPage('home');
              }}
            >
              <Icon name="Mail" size={18} className="mr-2" />
              Войти через Email
            </Button>

            {/* Разделитель */}
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-primary hover:underline font-medium"
              >
                Зарегистрироваться
              </button>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;