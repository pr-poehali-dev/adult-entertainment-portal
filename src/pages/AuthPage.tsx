import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="relative w-full max-w-4xl">
          <img
            src="https://cdn.poehali.dev/files/IMG_5135.jpeg"
            alt="Love is"
            className="w-full h-auto"
          />
          
          <button
            onClick={() => setShowRegisterModal(true)}
            className="absolute cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              left: '29%',
              bottom: '8.5%',
              width: '38%',
              height: '9.5%',
            }}
            aria-label="Зарегистрироваться"
          />
          
          <button
            onClick={() => setShowLoginModal(true)}
            className="absolute cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              right: '11%',
              bottom: '8.5%',
              width: '23%',
              height: '9.5%',
            }}
            aria-label="Войти"
          />
        </div>
      </div>

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Регистрация</h2>
              <p className="text-gray-600 mt-2">Создайте аккаунт</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Введите email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">Реферальная ссылка или промокод</Label>
                <Input
                  id="referral"
                  type="text"
                  placeholder="Необязательно"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Зарегистрироваться
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Вход</h2>
              <p className="text-gray-600 mt-2">Войдите в свой аккаунт</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Введите email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Войти
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}