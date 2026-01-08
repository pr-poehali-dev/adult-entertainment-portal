import { useState } from 'react';
import { Page, UserRole } from '@/types';

const getPageFromUrl = (): Page => {
  const path = window.location.pathname;
  const pathToPage: Record<string, Page> = {
    '/': 'home',
    '/catalog': 'catalog',
    '/profile': 'profile',
    '/register': 'register',
    '/login': 'login',
    '/search': 'search',
    '/favorites': 'favorites',
    '/messages': 'messages',
    '/rules': 'rules',
    '/service': 'service',
    '/seller-profile': 'seller-profile',
    '/work': 'work',
    '/referral': 'referral',
    '/category': 'category',
    '/invitations': 'invitations',
    '/raffle': 'raffle',
    '/dating': 'dating',
    '/wallet': 'wallet',
    '/online-search': 'online-search',
    '/parties': 'parties',
    '/party-detail': 'party-detail',
    '/party-chat': 'party-chat',
    '/organizer-dashboard': 'organizer-dashboard',
    '/my-ads': 'my-ads',
    '/user-guide': 'user-guide',
    '/agency-register': 'agency-register',
    '/agency-dashboard': 'agency-dashboard',
    '/settings': 'settings',
    '/bookings': 'bookings',
    '/my-orders': 'my-orders',
    '/order-chat': 'order-chat',
    '/swipe': 'swipe',
    '/premium': 'premium',
    '/matches': 'matches',
    '/business-services': 'business-services',
    '/all-ads': 'all-ads',
    '/agency-services': 'agency-services',
  };
  return pathToPage[path] || 'home';
};

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(() => {
    const authFlag = localStorage.getItem('isAuthenticated') === 'true';
    const hasUserData = localStorage.getItem('userProfile') !== null || 
                        localStorage.getItem('user') !== null ||
                        localStorage.getItem('access_token') !== null;
    
    // Если флаг авторизации установлен, но нет данных пользователя - очищаем
    if (authFlag && !hasUserData) {
      localStorage.clear();
      return false;
    }
    
    return authFlag && hasUserData;
  });

  const setIsAuthenticated = (value: boolean) => {
    setIsAuthenticatedState(value);
    localStorage.setItem('isAuthenticated', value.toString());
  };

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const authFlag = localStorage.getItem('isAuthenticated') === 'true';
    const hasUserData = localStorage.getItem('userProfile') !== null || 
                        localStorage.getItem('user') !== null ||
                        localStorage.getItem('access_token') !== null;
    
    const isActuallyAuthenticated = authFlag && hasUserData;
    const pageFromUrl = getPageFromUrl();
    
    // Если не авторизован и пытается зайти не на login/register - редирект на login
    if (!isActuallyAuthenticated && pageFromUrl !== 'login' && pageFromUrl !== 'register') {
      return 'login';
    }
    
    return pageFromUrl;
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