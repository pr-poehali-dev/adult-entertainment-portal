import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Page, UserRole } from '@/types';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useToast } from '@/hooks/use-toast';
import { telegramAuthApi } from '@/lib/api';

interface UnifiedAuthPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const UnifiedAuthPage = ({ setUserRole, setCurrentPage }: UnifiedAuthPageProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tgId = params.get('tg_id');
    const tgHash = params.get('tg_hash');
    const tgAuthDate = params.get('tg_auth_date');
    const tgFirstName = params.get('tg_first_name');
    const tgUsername = params.get('tg_username');

    if (tgId && tgHash && tgAuthDate) {
      const authData = {
        id: tgId,
        first_name: tgFirstName || '',
        username: tgUsername || '',
        auth_date: tgAuthDate,
        hash: tgHash
      };

      telegramAuthApi.authenticate(authData)
        .then((response) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          const role: UserRole = response.user.role === 'seller' ? 'seller' : 'buyer';
          setUserRole(role);
          setCurrentPage('home');
          
          window.history.replaceState({}, '', window.location.pathname);
          
          toast({
            title: response.new_user ? "Добро пожаловать!" : "Вход выполнен!",
            description: response.new_user 
              ? "Аккаунт создан автоматически через Telegram" 
              : `Добро пожаловать, ${response.user.username}`,
          });
        })
        .catch((error) => {
          console.error('Telegram auth error:', error);
          toast({
            title: "Ошибка авторизации",
            description: error instanceof Error ? error.message : "Не удалось войти через Telegram",
            variant: "destructive",
          });
          window.history.replaceState({}, '', window.location.pathname);
        });
    }
  }, [setUserRole, setCurrentPage, toast]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
        <CardHeader>
          <CardTitle className="text-3xl text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            LOVE IS
          </CardTitle>
          <CardDescription className="text-center text-base">
            Портал знакомств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm 
                setUserRole={setUserRole}
                setCurrentPage={setCurrentPage}
              />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm 
                setUserRole={setUserRole}
                setCurrentPage={setCurrentPage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};