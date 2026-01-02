import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '@/types';

export interface PartnerLevel {
  level: 1 | 2 | 3;
  percentage: number;
  loveBonus: number;
}

export interface PartnerReferral {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  level: 1 | 2 | 3;
  registeredAt: string;
  totalSpent: number;
  yourEarnings: number;
  isActive: boolean;
  lastActivityAt?: string;
}

export interface PartnerEarning {
  id: number;
  date: string;
  fromUserId: number;
  fromUserName: string;
  amount: number;
  currency: Currency;
  commission: number;
  level: 1 | 2 | 3;
  transactionType: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface PartnerStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  loveBalance: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  level1Earned: number;
  level2Earned: number;
  level3Earned: number;
  pendingWithdrawal: number;
  availableForWithdrawal: number;
}

export interface WithdrawalRequest {
  id: number;
  amount: number;
  currency: Currency;
  method: 'card' | 'crypto' | 'wallet';
  details: string;
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  completedAt?: string;
  rejectionReason?: string;
}

interface PartnerProgramContextType {
  referralCode: string;
  referralLink: string;
  stats: PartnerStats;
  referrals: PartnerReferral[];
  earnings: PartnerEarning[];
  withdrawalRequests: WithdrawalRequest[];
  partnerLevels: PartnerLevel[];
  generateReferralCode: () => void;
  requestWithdrawal: (amount: number, currency: Currency, method: string, details: string) => void;
  getReferralsByLevel: (level: 1 | 2 | 3) => PartnerReferral[];
  getEarningsByLevel: (level: 1 | 2 | 3) => PartnerEarning[];
}

const PartnerProgramContext = createContext<PartnerProgramContextType | undefined>(undefined);

export const PartnerProgramProvider = ({ children }: { children: ReactNode }) => {
  const [referralCode, setReferralCode] = useState('LOVE2024ABC');
  const [referralLink, setReferralLink] = useState(`https://loveis.app/ref/LOVE2024ABC`);
  
  const partnerLevels: PartnerLevel[] = [
    { level: 1, percentage: 10, loveBonus: 100 },
    { level: 2, percentage: 5, loveBonus: 50 },
    { level: 3, percentage: 2.5, loveBonus: 25 },
  ];

  const [referrals] = useState<PartnerReferral[]>([
    {
      id: 1,
      userId: 101,
      userName: 'Анна К.',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      level: 1,
      registeredAt: '2024-12-15T10:00:00Z',
      totalSpent: 45000,
      yourEarnings: 4500,
      isActive: true,
      lastActivityAt: '2025-01-01T18:30:00Z',
    },
    {
      id: 2,
      userId: 102,
      userName: 'Михаил С.',
      userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      level: 1,
      registeredAt: '2024-12-20T14:20:00Z',
      totalSpent: 28000,
      yourEarnings: 2800,
      isActive: true,
      lastActivityAt: '2024-12-30T12:00:00Z',
    },
    {
      id: 3,
      userId: 103,
      userName: 'Елена Д.',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      level: 2,
      registeredAt: '2024-12-22T09:15:00Z',
      totalSpent: 15000,
      yourEarnings: 750,
      isActive: true,
      lastActivityAt: '2024-12-28T20:45:00Z',
    },
    {
      id: 4,
      userId: 104,
      userName: 'Дмитрий В.',
      level: 2,
      registeredAt: '2024-12-25T16:40:00Z',
      totalSpent: 8500,
      yourEarnings: 425,
      isActive: false,
      lastActivityAt: '2024-12-26T11:20:00Z',
    },
    {
      id: 5,
      userId: 105,
      userName: 'Ольга М.',
      level: 3,
      registeredAt: '2024-12-28T11:30:00Z',
      totalSpent: 3200,
      yourEarnings: 80,
      isActive: true,
      lastActivityAt: '2025-01-02T09:15:00Z',
    },
  ]);

  const [earnings] = useState<PartnerEarning[]>([
    {
      id: 1,
      date: '2025-01-01T18:30:00Z',
      fromUserId: 101,
      fromUserName: 'Анна К.',
      amount: 5000,
      currency: 'RUB',
      commission: 500,
      level: 1,
      transactionType: 'booking_payment',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-12-30T12:00:00Z',
      fromUserId: 102,
      fromUserName: 'Михаил С.',
      amount: 3500,
      currency: 'RUB',
      commission: 350,
      level: 1,
      transactionType: 'vip_payment',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-12-28T20:45:00Z',
      fromUserId: 103,
      fromUserName: 'Елена Д.',
      amount: 2000,
      currency: 'RUB',
      commission: 100,
      level: 2,
      transactionType: 'booking_payment',
      status: 'completed',
    },
    {
      id: 4,
      date: '2025-01-02T10:20:00Z',
      fromUserId: 101,
      fromUserName: 'Анна К.',
      amount: 8000,
      currency: 'RUB',
      commission: 800,
      level: 1,
      transactionType: 'booking_payment',
      status: 'pending',
    },
    {
      id: 5,
      date: '2025-01-02T09:15:00Z',
      fromUserId: 105,
      fromUserName: 'Ольга М.',
      amount: 1500,
      currency: 'RUB',
      commission: 37.5,
      level: 3,
      transactionType: 'tip_sent',
      status: 'completed',
    },
  ]);

  const [withdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 1,
      amount: 5000,
      currency: 'RUB',
      method: 'card',
      details: '**** **** **** 1234',
      requestedAt: '2024-12-20T15:30:00Z',
      status: 'completed',
      completedAt: '2024-12-21T10:00:00Z',
    },
    {
      id: 2,
      amount: 3000,
      currency: 'RUB',
      method: 'card',
      details: '**** **** **** 1234',
      requestedAt: '2025-01-01T12:00:00Z',
      status: 'processing',
    },
  ]);

  const stats: PartnerStats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter(r => r.isActive).length,
    totalEarned: earnings.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.commission, 0),
    loveBalance: 425,
    level1Count: referrals.filter(r => r.level === 1).length,
    level2Count: referrals.filter(r => r.level === 2).length,
    level3Count: referrals.filter(r => r.level === 3).length,
    level1Earned: earnings.filter(e => e.level === 1 && e.status === 'completed').reduce((sum, e) => sum + e.commission, 0),
    level2Earned: earnings.filter(e => e.level === 2 && e.status === 'completed').reduce((sum, e) => sum + e.commission, 0),
    level3Earned: earnings.filter(e => e.level === 3 && e.status === 'completed').reduce((sum, e) => sum + e.commission, 0),
    pendingWithdrawal: withdrawalRequests.filter(w => w.status === 'processing').reduce((sum, w) => sum + w.amount, 0),
    availableForWithdrawal: earnings.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.commission, 0) - 
                             withdrawalRequests.filter(w => w.status !== 'rejected').reduce((sum, w) => sum + w.amount, 0),
  };

  const generateReferralCode = () => {
    const newCode = `LOVE${Date.now().toString(36).toUpperCase()}`;
    setReferralCode(newCode);
    setReferralLink(`https://loveis.app/ref/${newCode}`);
  };

  const requestWithdrawal = (amount: number, currency: Currency, method: string, details: string) => {
    console.log('Withdrawal requested:', { amount, currency, method, details });
  };

  const getReferralsByLevel = (level: 1 | 2 | 3) => {
    return referrals.filter(r => r.level === level);
  };

  const getEarningsByLevel = (level: 1 | 2 | 3) => {
    return earnings.filter(e => e.level === level);
  };

  return (
    <PartnerProgramContext.Provider
      value={{
        referralCode,
        referralLink,
        stats,
        referrals,
        earnings,
        withdrawalRequests,
        partnerLevels,
        generateReferralCode,
        requestWithdrawal,
        getReferralsByLevel,
        getEarningsByLevel,
      }}
    >
      {children}
    </PartnerProgramContext.Provider>
  );
};

export const usePartnerProgram = () => {
  const context = useContext(PartnerProgramContext);
  if (!context) {
    throw new Error('usePartnerProgram must be used within PartnerProgramProvider');
  }
  return context;
};
