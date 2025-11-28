import { AdminStats, AdminUser } from '@/types';

export const adminStats: AdminStats = {
  totalUsers: 1247,
  totalSellers: 342,
  totalBuyers: 905,
  totalBookings: 3456,
  totalRevenue: 45678900,
  totalAds: 89,
  totalWorkApplications: 156,
  newUsersToday: 23,
  activeBookings: 45,
  premiumUsers: 67
};

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    email: 'anna@example.com',
    role: 'seller',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2024-01-15',
    lastActive: '2024-11-28',
    totalBookings: 145,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 2,
    name: 'Мария Петрова',
    email: 'maria@example.com',
    role: 'seller',
    verified: true,
    vipStatus: 'none',
    registeredDate: '2024-02-20',
    lastActive: '2024-11-27',
    totalBookings: 98,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 3,
    name: 'Дмитрий Смирнов',
    email: 'dmitry@example.com',
    role: 'buyer',
    verified: false,
    vipStatus: 'none',
    registeredDate: '2024-03-10',
    lastActive: '2024-11-28',
    totalBookings: 12,
    totalSpent: 250000,
    status: 'active'
  },
  {
    id: 4,
    name: 'Елена Соколова',
    email: 'elena@example.com',
    role: 'seller',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2024-01-05',
    lastActive: '2024-11-28',
    totalBookings: 203,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 5,
    name: 'Александр Волков',
    email: 'alex@example.com',
    role: 'buyer',
    verified: true,
    vipStatus: 'none',
    registeredDate: '2024-04-12',
    lastActive: '2024-11-26',
    totalBookings: 8,
    totalSpent: 180000,
    status: 'active'
  },
  {
    id: 6,
    name: 'Ольга Кузнецова',
    email: 'olga@example.com',
    role: 'seller',
    verified: false,
    vipStatus: 'none',
    registeredDate: '2024-10-01',
    lastActive: '2024-11-20',
    totalBookings: 3,
    totalSpent: 0,
    status: 'suspended'
  }
];
