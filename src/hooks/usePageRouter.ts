import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Page } from '@/types';

const pageToRoute: Record<Page, string> = {
  'home': '/',
  'catalog': '/catalog',
  'profile': '/profile',
  'register': '/register',
  'login': '/login',
  'search': '/search',
  'favorites': '/favorites',
  'messages': '/messages',
  'rules': '/rules',
  'service': '/service',
  'seller-profile': '/seller-profile',
  'work': '/work',
  'admin': '/admin',
  'referral': '/referral',
  'category': '/category',
  'invitations': '/invitations',
  'raffle': '/raffle',
  'dating': '/dating',
  'wallet': '/wallet',
  'online-search': '/online-search',
  'parties': '/parties',
  'party-detail': '/party-detail',
  'party-chat': '/party-chat',
  'organizer-dashboard': '/organizer-dashboard',
  'my-ads': '/my-ads',
  'user-guide': '/user-guide',
  'agency-register': '/agency-register',
  'agency-dashboard': '/agency-dashboard',
  'settings': '/settings',
  'bookings': '/bookings',
  'my-orders': '/my-orders',
  'order-chat': '/order-chat',
  'swipe': '/swipe',
  'premium': '/premium',
  'matches': '/matches',
  'business-services': '/business-services',
  'all-ads': '/all-ads',
  'agency-services': '/agency-services',
};

const routeToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToRoute).map(([page, route]) => [route, page as Page])
);

export const usePageRouter = (currentPage: Page, setCurrentPage: (page: Page) => void) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pageFromUrl = routeToPage[location.pathname];
    if (pageFromUrl && pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
      return;
    }
  }, [location.pathname, setCurrentPage]);

  useEffect(() => {
    const route = pageToRoute[currentPage];
    const currentRoute = location.pathname;
    
    if (route && currentRoute !== route) {
      navigate(route, { replace: false });
    }
  }, [currentPage, navigate]);

  return {
    navigateToPage: (page: Page) => {
      setCurrentPage(page);
    }
  };
};