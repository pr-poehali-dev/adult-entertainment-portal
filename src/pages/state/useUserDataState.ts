import { useState } from 'react';
import { Profile, Notification, Wallet } from '@/types';
import { MOCK_NOTIFICATIONS } from './mockData';

export const useUserDataState = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const [profile, setProfile] = useState<Profile>(() => {
    const authUser = localStorage.getItem('user');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        return {
          name: userData.username || 'Пользователь',
          nickname: userData.username || 'User',
          role: userData.role || 'buyer',
          avatar: '',
          rating: 4.8,
          verified: userData.email_verified || false,
          vipStatus: 'none',
          vipExpiry: null,
          subscriptionType: 'free',
          subscriptionExpiry: null,
          profileCompleted: true,
          kycCompleted: false,
          contacts: {
            instagram: { value: '', forSale: false },
            telegram: { value: '', forSale: false },
            phone: { value: '', forSale: false },
          }
        };
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      name: 'Гость',
      nickname: 'Guest',
      role: 'buyer',
      avatar: '',
      rating: 0,
      verified: false,
      vipStatus: 'none',
      vipExpiry: null,
      subscriptionType: 'free',
      subscriptionExpiry: null,
      profileCompleted: false,
      kycCompleted: false,
      contacts: {
        instagram: { value: '', forSale: false },
        telegram: { value: '', forSale: false },
        phone: { value: '', forSale: false },
      }
    };
  });

  const setProfileWithSave = (updater: Profile | ((prev: Profile) => Profile)) => {
    setProfile((prev) => {
      const newProfile = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const [wallet, setWallet] = useState<Wallet>({
    balances: [
      { currency: 'RUB', amount: 150000, symbol: '₽' },
      { currency: 'USD', amount: 5000, symbol: '$' },
      { currency: 'EUR', amount: 3000, symbol: '€' },
      { currency: 'BTC', amount: 0.5, symbol: '₿' },
      { currency: 'ETH', amount: 2, symbol: 'Ξ' },
      { currency: 'USDT', amount: 10000, symbol: '₮' },
      { currency: 'LOVE', amount: 0, symbol: '💗' },
    ]
  });

  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  return {
    notifications,
    setNotifications,
    profile,
    setProfile: setProfileWithSave,
    wallet,
    setWallet,
    walletTransactions,
    setWalletTransactions,
  };
};