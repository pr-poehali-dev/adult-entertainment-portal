import { useState } from 'react';
import { Profile, Notification, Wallet } from '@/types';

export const useUserDataState = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
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

  const [wallet, setWallet] = useState<Wallet>(() => {
    const saved = localStorage.getItem('userWallet');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      balances: [
        { currency: 'RUB', amount: 0, symbol: '₽' },
        { currency: 'USD', amount: 0, symbol: '$' },
        { currency: 'EUR', amount: 0, symbol: '€' },
        { currency: 'BTC', amount: 0, symbol: '₿' },
        { currency: 'ETH', amount: 0, symbol: 'Ξ' },
        { currency: 'USDT', amount: 0, symbol: '₮' },
        { currency: 'LOVE', amount: 0, symbol: '💗' },
      ]
    };
  });

  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  const setWalletWithSave = (updater: Wallet | ((prev: Wallet) => Wallet)) => {
    setWallet((prev) => {
      const newWallet = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('userWallet', JSON.stringify(newWallet));
      return newWallet;
    });
  };

  return {
    notifications,
    setNotifications,
    profile,
    setProfile: setProfileWithSave,
    wallet,
    setWallet: setWalletWithSave,
    walletTransactions,
    setWalletTransactions,
  };
};