import { useState, ReactNode } from 'react';
import { ServiceCategory } from '@/types';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'dating';
  status: 'active' | 'blocked';
  registeredAt: string;
  balance: number;
  lastActivity: string;
  isOnline: boolean;
}

export interface Service {
  id: number;
  title: string;
  seller: string;
  price: number;
  status: 'active' | 'moderation' | 'blocked';
  reports: number;
}

export interface Transaction {
  id: number;
  user: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'commission' | 'vip' | 'platform_fee';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface PlatformBalance {
  currency: 'RUB' | 'USD' | 'TON' | 'USDT';
  balance: number;
  symbol: string;
  icon: string;
  color: string;
}

export interface BalanceTransaction {
  id: number;
  type: 'vip_purchase' | 'commission' | 'withdrawal';
  amount: number;
  currency: string;
  user: string;
  date: string;
  description: string;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  balance: number;
  commission: number;
  status: 'active' | 'blocked';
  registeredAt: string;
  totalEarnings: number;
  lastActivity: string;
  isOnline: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'dating';
  balance: number;
  status: 'active' | 'blocked';
  registeredAt: string;
  lastActivity: string;
  totalSpent: number;
  isOnline: boolean;
}

export interface Ad {
  id: number;
  title: string;
  category: string;
  price: number;
  seller: string;
  status: 'active' | 'moderation' | 'blocked';
  createdAt: string;
}

export interface AdminMessage {
  id: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: string;
  isFromAdmin: boolean;
}

export interface PriceSettings {
  vipWeek: number;
  vipMonth: number;
  vipYear: number;
  profileBoost: number;
  top3Week: number;
  top3Month: number;
  highlightAd: number;
  premiumSupport: number;
  verificationBadge: number;
}

export interface AdminDataContextValue {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sellers: Seller[];
  setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  services: Service[];
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  adminMessages: AdminMessage[];
  setAdminMessages: React.Dispatch<React.SetStateAction<AdminMessage[]>>;
  transactions: Transaction[];
  stats: any;
  prices: PriceSettings;
  setPrices: React.Dispatch<React.SetStateAction<PriceSettings>>;
  platformBalances: PlatformBalance[];
  balanceTransactions: BalanceTransaction[];
  serviceCategories: ServiceCategory[];
  setServiceCategories: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
}

interface AdminDataProviderProps {
  children: (data: AdminDataContextValue) => ReactNode;
}

export const AdminDataProvider = ({ children }: AdminDataProviderProps) => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', role: 'seller', status: 'active', registeredAt: '2024-01-15', balance: 45000, lastActivity: '2024-12-04T14:30:00', isOnline: true },
    { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', role: 'buyer', status: 'active', registeredAt: '2024-02-20', balance: 12000, lastActivity: '2024-12-04T15:45:00', isOnline: true },
    { id: 3, name: 'Мария Иванова', email: 'maria@mail.ru', role: 'dating', status: 'blocked', registeredAt: '2024-03-10', balance: 0, lastActivity: '2024-11-15T10:20:00', isOnline: false },
  ]);

  const [sellers, setSellers] = useState<Seller[]>([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', balance: 45000, commission: 12500, status: 'active', registeredAt: '2024-01-15', totalEarnings: 85000, lastActivity: '2024-12-04T14:30:00', isOnline: true },
    { id: 2, name: 'Виктория Смит', email: 'victoria@mail.ru', balance: 32000, commission: 8900, status: 'active', registeredAt: '2024-02-10', totalEarnings: 62000, lastActivity: '2024-12-04T16:10:00', isOnline: true },
    { id: 3, name: 'Елена Кузнецова', email: 'elena@mail.ru', balance: 15000, commission: 4200, status: 'blocked', registeredAt: '2024-03-05', totalEarnings: 28000, lastActivity: '2024-11-20T18:30:00', isOnline: false },
    { id: 4, name: 'Ольга Петрова', email: 'olga@mail.ru', balance: 58000, commission: 18500, status: 'active', registeredAt: '2024-01-20', totalEarnings: 125000, lastActivity: '2024-12-02T20:45:00', isOnline: false },
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', phone: '+7 (999) 123-45-67', role: 'seller', balance: 45000, status: 'active', registeredAt: '2024-01-15', lastActivity: '2024-12-04T14:30:00', totalSpent: 85000, isOnline: true },
    { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', phone: '+7 (999) 234-56-78', role: 'buyer', balance: 12000, status: 'active', registeredAt: '2024-02-20', lastActivity: '2024-12-04T15:45:00', totalSpent: 32000, isOnline: true },
    { id: 3, name: 'Мария Иванова', email: 'maria@mail.ru', phone: '+7 (999) 345-67-89', role: 'dating', balance: 0, status: 'blocked', registeredAt: '2024-03-10', lastActivity: '2024-11-15T10:20:00', totalSpent: 15000, isOnline: false },
    { id: 4, name: 'Виктория Смит', email: 'victoria@mail.ru', phone: '+7 (999) 456-78-90', role: 'seller', balance: 32000, status: 'active', registeredAt: '2024-02-10', lastActivity: '2024-12-04T16:10:00', totalSpent: 62000, isOnline: true },
    { id: 5, name: 'Дмитрий Козлов', email: 'dmitry@mail.ru', phone: '+7 (999) 567-89-01', role: 'buyer', balance: 8500, status: 'active', registeredAt: '2024-04-05', lastActivity: '2024-12-03T09:15:00', totalSpent: 28000, isOnline: false },
    { id: 6, name: 'Елена Кузнецова', email: 'elena@mail.ru', phone: '+7 (999) 678-90-12', role: 'seller', balance: 15000, status: 'blocked', registeredAt: '2024-03-05', lastActivity: '2024-11-20T18:30:00', totalSpent: 45000, isOnline: false },
    { id: 7, name: 'Алексей Новиков', email: 'alexey@mail.ru', phone: '+7 (999) 789-01-23', role: 'buyer', balance: 25000, status: 'active', registeredAt: '2024-05-12', lastActivity: '2024-12-04T12:00:00', totalSpent: 75000, isOnline: true },
    { id: 8, name: 'Ольга Петрова', email: 'olga@mail.ru', phone: '+7 (999) 890-12-34', role: 'seller', balance: 58000, status: 'active', registeredAt: '2024-01-20', lastActivity: '2024-12-02T20:45:00', totalSpent: 125000, isOnline: false },
  ]);

  const [services] = useState<Service[]>([
    { id: 1, title: 'Элитный массаж', seller: 'Анна Смирнова', price: 5000, status: 'active', reports: 0 },
    { id: 2, title: 'VIP сопровождение', seller: 'Виктория Смит', price: 15000, status: 'moderation', reports: 2 },
    { id: 3, title: 'Эротический массаж', seller: 'Елена Кузнецова', price: 3500, status: 'blocked', reports: 5 },
  ]);

  const [ads, setAds] = useState<Ad[]>([
    { id: 1, title: 'Элитный массаж', category: 'massage', price: 5000, seller: 'Анна Смирнова', status: 'active', createdAt: '2024-11-28' },
    { id: 2, title: 'VIP сопровождение', category: 'escort', price: 15000, seller: 'Виктория Смит', status: 'moderation', createdAt: '2024-11-27' },
    { id: 3, title: 'Романтическое свидание', category: 'dating', price: 3500, seller: 'Мария Иванова', status: 'active', createdAt: '2024-11-26' },
    { id: 4, title: 'Фитнес тренировки', category: 'fitness', price: 2500, seller: 'Ольга Петрова', status: 'active', createdAt: '2024-11-25' },
  ]);

  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([
    { id: 1, userId: 2, userName: 'Иван Петров', message: 'Добро пожаловать на платформу!', timestamp: '2024-11-28T10:00:00', isFromAdmin: true },
    { id: 2, userId: 3, userName: 'Мария Иванова', message: 'Ваш аккаунт временно заблокирован', timestamp: '2024-11-27T15:30:00', isFromAdmin: true },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: 1, user: 'Иван Петров', type: 'deposit', amount: 10000, currency: 'RUB', date: '2024-11-28', status: 'completed' },
    { id: 2, user: 'Анна Смирнова', type: 'withdrawal', amount: 25000, currency: 'RUB', date: '2024-11-27', status: 'pending' },
    { id: 3, user: 'Мария Иванова', type: 'payment', amount: 5000, currency: 'RUB', date: '2024-11-26', status: 'completed' },
  ]);

  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 2450000,
    pendingVerifications: 23,
    activeServices: 456,
    moderationQueue: 12,
    blockedUsers: 34,
    totalTransactions: 5678,
  });

  const [prices, setPrices] = useState<PriceSettings>({
    vipWeek: 500,
    vipMonth: 1500,
    vipYear: 12000,
    profileBoost: 200,
    top3Week: 1000,
    top3Month: 3500,
    highlightAd: 300,
    premiumSupport: 2000,
    verificationBadge: 1000,
  });

  const [platformBalances] = useState<PlatformBalance[]>([
    { currency: 'RUB', balance: 2450000, symbol: '₽', icon: 'Banknote', color: 'blue' },
    { currency: 'USD', balance: 15420, symbol: '$', icon: 'DollarSign', color: 'green' },
    { currency: 'TON', balance: 8950, symbol: 'TON', icon: 'Coins', color: 'cyan' },
    { currency: 'USDT', balance: 12300, symbol: 'USDT', icon: 'Wallet', color: 'emerald' },
  ]);

  const [balanceTransactions] = useState<BalanceTransaction[]>([
    { id: 1, type: 'vip_purchase', amount: 5000, currency: 'RUB', user: 'Анна Смирнова', date: '2024-11-28 14:30', description: 'Оплата VIP-статуса на 30 дней' },
    { id: 2, type: 'commission', amount: 1500, currency: 'RUB', user: 'Иван Петров → Мария', date: '2024-11-28 12:15', description: 'Комиссия 15% за сделку' },
    { id: 3, type: 'vip_purchase', amount: 150, currency: 'USD', user: 'John Smith', date: '2024-11-27 18:45', description: 'VIP subscription renewal' },
    { id: 4, type: 'commission', amount: 45, currency: 'TON', user: 'Елена → Дмитрий', date: '2024-11-27 16:20', description: 'Комиссия 10% за бронирование' },
    { id: 5, type: 'withdrawal', amount: -50000, currency: 'RUB', user: 'Администратор', date: '2024-11-26 10:00', description: 'Вывод средств на банковский счет' },
    { id: 6, type: 'vip_purchase', amount: 3500, currency: 'RUB', user: 'Ольга Петрова', date: '2024-11-26 09:30', description: 'Оплата VIP-статуса на 14 дней' },
    { id: 7, type: 'commission', amount: 250, currency: 'USDT', user: 'Alice → Bob', date: '2024-11-25 20:15', description: 'Platform fee 5%' },
  ]);

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    { id: '1', name: 'Массаж', icon: 'Hand' },
    { id: '2', name: 'Косметология', icon: 'Sparkles' },
    { id: '3', name: 'Парикмахерские услуги', icon: 'Scissors' },
    { id: '4', name: 'Маникюр и педикюр', icon: 'PaintBucket' },
    { id: '5', name: 'Фитнес и йога', icon: 'Dumbbell' },
  ]);

  return <>{children({
    users,
    setUsers,
    sellers,
    setSellers,
    clients,
    setClients,
    services,
    ads,
    setAds,
    adminMessages,
    setAdminMessages,
    transactions,
    stats,
    serviceCategories,
    setServiceCategories,
    prices,
    setPrices,
    platformBalances,
    balanceTransactions,
  })}</>;
};