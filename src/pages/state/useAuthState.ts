import { useState } from 'react';
import { Page, UserRole } from '@/types';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const setIsAuthenticated = (value: boolean) => {
    setIsAuthenticatedState(value);
    localStorage.setItem('isAuthenticated', value.toString());
  };

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return isAuth ? 'home' : 'login';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const authUser = localStorage.getItem('user');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        return (userData.role as UserRole) || 'buyer';
      } catch (e) {
        console.error('Failed to parse user role:', e);
      }
    }
    return 'buyer';
  });

  return {
    isAuthenticated,
    setIsAuthenticated,
    currentPage,
    setCurrentPage,
    userRole,
    setUserRole,
  };
};