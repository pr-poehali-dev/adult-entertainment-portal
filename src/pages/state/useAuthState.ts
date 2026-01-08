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

  const [userRole, setUserRole] = useState<UserRole>('buyer');

  return {
    isAuthenticated,
    setIsAuthenticated,
    currentPage,
    setCurrentPage,
    userRole,
    setUserRole,
  };
};
