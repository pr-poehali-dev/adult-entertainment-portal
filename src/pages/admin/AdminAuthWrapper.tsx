import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminPasswordRecovery } from '@/components/admin/AdminPasswordRecovery';
import { Admin2FAVerification } from '@/components/admin/Admin2FAVerification';
import { validateAdminLogin, getAdminEmail } from '@/utils/adminAuth';

interface AdminAuthWrapperProps {
  children: (props: {
    isAuthenticated: boolean;
    is2FAEnabled: boolean;
    handleLogout: () => void;
    handle2FAToggle: (enabled: boolean) => void;
  }) => React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [showRecovery, setShowRecovery] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    const saved2FA = sessionStorage.getItem('admin2FA');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
    if (saved2FA === 'true') {
      setIs2FAEnabled(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAdminLogin(loginForm.login, loginForm.password)) {
      if (is2FAEnabled) {
        setShow2FA(true);
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminSession', 'true');
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель",
        });
      }
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  const handle2FAVerify = (code: string) => {
    if (code.length === 6) {
      setIsAuthenticated(true);
      setShow2FA(false);
      sessionStorage.setItem('adminSession', 'true');
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Ошибка 2FA",
        description: "Неверный код подтверждения",
        variant: "destructive",
      });
    }
  };

  const handle2FAToggle = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    sessionStorage.setItem('admin2FA', enabled ? 'true' : 'false');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminSession');
    navigate('/');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели",
    });
  };

  if (showRecovery) {
    return (
      <AdminPasswordRecovery
        onBack={() => setShowRecovery(false)}
        recoveryEmail={getAdminEmail()}
      />
    );
  }

  if (show2FA) {
    return (
      <Admin2FAVerification
        onVerify={handle2FAVerify}
        onBack={() => setShow2FA(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        onForgotPassword={() => setShowRecovery(true)}
      />
    );
  }

  return <>{children({ isAuthenticated, is2FAEnabled, handleLogout, handle2FAToggle })}</>;
};
