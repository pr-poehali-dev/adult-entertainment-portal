import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://cdn.poehali.dev/files/IMG_5134.jpeg"
            alt="Love is..."
            className="w-full max-w-2xl h-auto rounded-lg shadow-2xl"
          />
        </div>

        <Card className="w-full lg:w-1/2 max-w-md p-8 bg-white/95 backdrop-blur">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRegister ? 'Регистрация' : 'Вход'}
              </h1>
              <p className="text-gray-600">
                {isRegister ? 'Создайте аккаунт для продолжения' : 'Войдите в свой аккаунт'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="referral">Реферальная ссылка или промокод (необязательно)</Label>
                  <Input
                    id="referral"
                    type="text"
                    placeholder="Введите код или оставьте пустым"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {isRegister ? 'Зарегистрироваться' : 'Войти'}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-primary hover:underline"
              >
                {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
