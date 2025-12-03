import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AdminLoginProps {
  loginForm: { login: string; password: string };
  setLoginForm: (form: { login: string; password: string }) => void;
  handleLogin: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const AdminLogin = ({ loginForm, setLoginForm, handleLogin, onForgotPassword }: AdminLoginProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl">Админ-панель</CardTitle>
          <CardDescription>Введите учетные данные для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                placeholder="admin"
                value={loginForm.login}
                onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={onForgotPassword}
            >
              <Icon name="HelpCircle" size={18} className="mr-2" />
              Забыли пароль?
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};