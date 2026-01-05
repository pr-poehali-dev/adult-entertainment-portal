import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Page, UserRole } from '@/types';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface UnifiedAuthPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const UnifiedAuthPage = ({ setUserRole, setCurrentPage }: UnifiedAuthPageProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

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