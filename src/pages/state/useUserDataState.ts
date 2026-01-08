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
          rating: 0,
          verified: userData.email_verified || false,
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
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse userProfile:', e);
      }
    }
    
    return {
      name: '',
      nickname: '',
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
      { currency: 'RUB', amount: 0, symbol: '₽' },
      { currency: 'USD', amount: 0, symbol: '$' },
      { currency: 'EUR', amount: 0, symbol: '€' },
      { currency: 'BTC', amount: 0, symbol: '₿' },
      { currency: 'ETH', amount: 0, symbol: 'Ξ' },
      { currency: 'USDT', amount: 0, symbol: '₮' },
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