import { Booking, Transaction, AdminUser, ReferralUser, ReferralTransaction } from '@/types';

// Тестовые пользователи
export const testUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Елена Романова',
    email: 'elena.romanova@elite.ru',
    role: 'buyer',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2024-01-15',
    lastActive: '2024-11-28',
    totalBookings: 23,
    totalSpent: 485000,
    status: 'active'
  },
  {
    id: 2,
    name: 'Дмитрий Ковалёв',
    email: 'dmitry.kovalev@gmail.com',
    role: 'buyer',
    verified: true,
    vipStatus: 'none',
    registeredDate: '2024-03-20',
    lastActive: '2024-11-27',
    totalBookings: 12,
    totalSpent: 215000,
    status: 'active'
  },
  {
    id: 3,
    name: 'Александр Морозов',
    email: 'alex.morozov@business.ru',
    role: 'buyer',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2024-02-10',
    lastActive: '2024-11-28',
    totalBookings: 45,
    totalSpent: 980000,
    status: 'active'
  },
  {
    id: 4,
    name: 'Анна Соколова',
    email: 'anna@elite-service.ru',
    role: 'seller',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2023-11-05',
    lastActive: '2024-11-28',
    totalBookings: 156,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 5,
    name: 'Мария Волкова',
    email: 'maria.volkova@elite.ru',
    role: 'seller',
    verified: true,
    vipStatus: 'vip',
    registeredDate: '2023-12-20',
    lastActive: '2024-11-28',
    totalBookings: 134,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 6,
    name: 'Виктория Петрова',
    email: 'victoria.petrova@gmail.com',
    role: 'seller',
    verified: false,
    vipStatus: 'none',
    registeredDate: '2024-06-12',
    lastActive: '2024-11-25',
    totalBookings: 34,
    totalSpent: 0,
    status: 'active'
  },
  {
    id: 7,
    name: 'Сергей Лебедев',
    email: 'sergey.lebedev@corp.ru',
    role: 'buyer',
    verified: true,
    vipStatus: 'none',
    registeredDate: '2024-08-03',
    lastActive: '2024-11-26',
    totalBookings: 7,
    totalSpent: 142000,
    status: 'active'
  },
  {
    id: 8,
    name: 'Ольга Новикова',
    email: 'olga.novikova@mail.ru',
    role: 'buyer',
    verified: false,
    vipStatus: 'none',
    registeredDate: '2024-10-15',
    lastActive: '2024-11-20',
    totalBookings: 2,
    totalSpent: 38000,
    status: 'active'
  },
  {
    id: 9,
    name: 'Игорь Смирнов',
    email: 'igor.smirnov@banned.ru',
    role: 'buyer',
    verified: false,
    vipStatus: 'none',
    registeredDate: '2024-09-01',
    lastActive: '2024-09-15',
    totalBookings: 1,
    totalSpent: 15000,
    status: 'banned'
  },
  {
    id: 10,
    name: 'Екатерина Белова',
    email: 'ekaterina.belova@elite.ru',
    role: 'seller',
    verified: true,
    vipStatus: 'none',
    registeredDate: '2024-07-08',
    lastActive: '2024-11-10',
    totalBookings: 18,
    totalSpent: 0,
    status: 'suspended'
  }
];

// Тестовые бронирования
export const testBookings: Booking[] = [
  {
    id: 1001,
    serviceId: 1,
    serviceName: 'Премиум сопровождение',
    serviceCategory: 'VIP',
    sellerId: 4,
    sellerName: 'Анна Соколова',
    buyerId: 1,
    buyerName: 'Елена Романова',
    date: '2024-11-28',
    time: '19:00',
    duration: 3,
    pricePerHour: 25000,
    totalPrice: 75000,
    currency: 'RUB',
    status: 'confirmed',
    createdAt: '2024-11-26T10:30:00Z',
    confirmedAt: '2024-11-26T10:45:00Z',
    expiresAt: '2024-11-28T19:00:00Z'
  },
  {
    id: 1002,
    serviceId: 2,
    serviceName: 'Индивидуальные встречи',
    serviceCategory: 'Премиум',
    sellerId: 5,
    sellerName: 'Мария Волкова',
    buyerId: 2,
    buyerName: 'Дмитрий Ковалёв',
    date: '2024-11-27',
    time: '20:00',
    duration: 2,
    pricePerHour: 15000,
    totalPrice: 30000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T14:20:00Z',
    confirmedAt: '2024-11-25T14:25:00Z',
    startedAt: '2024-11-27T20:00:00Z',
    completedAt: '2024-11-27T22:00:00Z'
  },
  {
    id: 1003,
    serviceId: 7,
    serviceName: 'Театральный вечер',
    serviceCategory: 'VIP',
    sellerId: 4,
    sellerName: 'Анна Соколова',
    buyerId: 3,
    buyerName: 'Александр Морозов',
    date: '2024-11-29',
    time: '18:00',
    duration: 5,
    pricePerHour: 24000,
    totalPrice: 120000,
    currency: 'RUB',
    status: 'confirmed',
    createdAt: '2024-11-24T09:15:00Z',
    confirmedAt: '2024-11-24T09:30:00Z',
    expiresAt: '2024-11-29T18:00:00Z'
  },
  {
    id: 1004,
    serviceId: 3,
    serviceName: 'Деловое сопровождение',
    serviceCategory: 'Бизнес',
    sellerId: 6,
    sellerName: 'Виктория Петрова',
    buyerId: 3,
    buyerName: 'Александр Морозов',
    date: '2024-11-30',
    time: '15:00',
    duration: 4,
    pricePerHour: 20000,
    totalPrice: 80000,
    currency: 'RUB',
    status: 'pending_seller_confirmation',
    createdAt: '2024-11-28T08:00:00Z',
    expiresAt: '2024-11-28T08:15:00Z'
  },
  {
    id: 1005,
    serviceId: 9,
    serviceName: 'Дневные встречи',
    serviceCategory: 'Стандарт',
    sellerId: 10,
    sellerName: 'Екатерина Белова',
    buyerId: 7,
    buyerName: 'Сергей Лебедев',
    date: '2024-11-26',
    time: '14:00',
    duration: 2,
    pricePerHour: 14000,
    totalPrice: 28000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T10:00:00Z',
    confirmedAt: '2024-11-25T10:10:00Z',
    startedAt: '2024-11-26T14:00:00Z',
    completedAt: '2024-11-26T16:00:00Z'
  },
  {
    id: 1006,
    serviceId: 1,
    serviceName: 'Премиум сопровождение',
    serviceCategory: 'VIP',
    sellerId: 4,
    sellerName: 'Анна Соколова',
    buyerId: 1,
    buyerName: 'Елена Романова',
    date: '2024-11-25',
    time: '19:30',
    duration: 4,
    pricePerHour: 25000,
    totalPrice: 100000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-23T11:00:00Z',
    confirmedAt: '2024-11-23T11:12:00Z',
    startedAt: '2024-11-25T19:30:00Z',
    completedAt: '2024-11-25T23:30:00Z'
  },
  {
    id: 1007,
    serviceId: 5,
    serviceName: 'Светское сопровождение',
    serviceCategory: 'VIP',
    sellerId: 5,
    sellerName: 'Мария Волкова',
    buyerId: 2,
    buyerName: 'Дмитрий Ковалёв',
    date: '2024-11-22',
    time: '21:00',
    duration: 3,
    pricePerHour: 22000,
    totalPrice: 66000,
    currency: 'RUB',
    status: 'cancelled',
    createdAt: '2024-11-20T16:00:00Z',
    confirmedAt: '2024-11-20T16:08:00Z'
  },
  {
    id: 1008,
    serviceId: 12,
    serviceName: 'Бизнес-форумы',
    serviceCategory: 'Бизнес',
    sellerId: 4,
    sellerName: 'Анна Соколова',
    buyerId: 3,
    buyerName: 'Александр Морозов',
    date: '2024-11-20',
    time: '10:00',
    duration: 6,
    pricePerHour: 21000,
    totalPrice: 126000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-18T12:00:00Z',
    confirmedAt: '2024-11-18T12:05:00Z',
    startedAt: '2024-11-20T10:00:00Z',
    completedAt: '2024-11-20T16:00:00Z'
  }
];

// Тестовые транзакции
export const testTransactions: Transaction[] = [
  {
    id: 5001,
    type: 'deposit',
    amount: 200000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-01T10:00:00Z',
    completedAt: '2024-11-01T10:01:00Z',
    description: 'Пополнение кошелька через банковскую карту'
  },
  {
    id: 5002,
    type: 'booking_payment',
    amount: 75000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-26T10:30:00Z',
    completedAt: '2024-11-26T10:30:30Z',
    description: 'Оплата бронирования #1001',
    relatedBookingId: 1001,
    fromUser: 'Елена Романова',
    toUser: 'Анна Соколова',
    fee: 3750
  },
  {
    id: 5003,
    type: 'booking_received',
    amount: 71250,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-27T22:00:00Z',
    completedAt: '2024-11-27T22:01:00Z',
    description: 'Получение оплаты за бронирование #1002',
    relatedBookingId: 1002,
    fromUser: 'Дмитрий Ковалёв',
    toUser: 'Мария Волкова',
    fee: 1500
  },
  {
    id: 5004,
    type: 'vip_payment',
    amount: 15000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-15T14:20:00Z',
    completedAt: '2024-11-15T14:20:15Z',
    description: 'Оплата VIP-статуса на 1 месяц'
  },
  {
    id: 5005,
    type: 'tip_sent',
    amount: 5000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T23:35:00Z',
    completedAt: '2024-11-25T23:35:10Z',
    description: 'Чаевые для исполнителя',
    fromUser: 'Елена Романова',
    toUser: 'Анна Соколова',
    fee: 250
  },
  {
    id: 5006,
    type: 'tip_received',
    amount: 4750,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T23:35:00Z',
    completedAt: '2024-11-25T23:35:10Z',
    description: 'Получены чаевые от клиента',
    fromUser: 'Елена Романова',
    toUser: 'Анна Соколова',
    fee: 250
  },
  {
    id: 5007,
    type: 'booking_payment',
    amount: 30000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T14:20:00Z',
    completedAt: '2024-11-25T14:20:20Z',
    description: 'Оплата бронирования #1002',
    relatedBookingId: 1002,
    fromUser: 'Дмитрий Ковалёв',
    toUser: 'Мария Волкова',
    fee: 1500
  },
  {
    id: 5008,
    type: 'booking_payment',
    amount: 120000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-24T09:15:00Z',
    completedAt: '2024-11-24T09:15:25Z',
    description: 'Оплата бронирования #1003',
    relatedBookingId: 1003,
    fromUser: 'Александр Морозов',
    toUser: 'Анна Соколова',
    fee: 6000
  },
  {
    id: 5009,
    type: 'withdraw',
    amount: 150000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-20T15:00:00Z',
    completedAt: '2024-11-20T16:30:00Z',
    description: 'Вывод средств на банковскую карту',
    fee: 3000
  },
  {
    id: 5010,
    type: 'booking_refund',
    amount: 66000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-22T19:00:00Z',
    completedAt: '2024-11-22T19:00:15Z',
    description: 'Возврат за отмененное бронирование #1007',
    relatedBookingId: 1007,
    fromUser: 'Мария Волкова',
    toUser: 'Дмитрий Ковалёв'
  },
  {
    id: 5011,
    type: 'deposit',
    amount: 5000,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-11-10T12:00:00Z',
    completedAt: '2024-11-10T12:02:00Z',
    description: 'Пополнение в долларах через Crypto'
  },
  {
    id: 5012,
    type: 'booking_extend',
    amount: 25000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T22:30:00Z',
    completedAt: '2024-11-25T22:30:10Z',
    description: 'Продление встречи на 1 час',
    relatedBookingId: 1006,
    fromUser: 'Елена Романова',
    toUser: 'Анна Соколова',
    fee: 1250
  }
];

// Тестовые рефералы (3 уровня)
export const testReferrals: ReferralUser[] = [
  // 1 линия
  {
    id: 101,
    name: 'Мария Захарова',
    registeredDate: '2024-10-15',
    level: 1,
    totalSpent: 85000,
    yourEarnings: 8500,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  },
  {
    id: 102,
    name: 'Иван Петров',
    registeredDate: '2024-09-20',
    level: 1,
    totalSpent: 120000,
    yourEarnings: 12000,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan'
  },
  {
    id: 103,
    name: 'Ольга Смирнова',
    registeredDate: '2024-11-05',
    level: 1,
    totalSpent: 45000,
    yourEarnings: 4500,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga'
  },
  {
    id: 104,
    name: 'Павел Кузнецов',
    registeredDate: '2024-08-12',
    level: 1,
    totalSpent: 0,
    yourEarnings: 0,
    isActive: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavel'
  },
  // 2 линия
  {
    id: 201,
    name: 'Елена Васильева',
    registeredDate: '2024-10-28',
    level: 2,
    totalSpent: 62000,
    yourEarnings: 3100,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: 202,
    name: 'Андрей Соколов',
    registeredDate: '2024-10-22',
    level: 2,
    totalSpent: 48000,
    yourEarnings: 2400,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrey'
  },
  {
    id: 203,
    name: 'Татьяна Морозова',
    registeredDate: '2024-11-10',
    level: 2,
    totalSpent: 35000,
    yourEarnings: 1750,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tatiana'
  },
  // 3 линия
  {
    id: 301,
    name: 'Виктор Новиков',
    registeredDate: '2024-11-01',
    level: 3,
    totalSpent: 28000,
    yourEarnings: 280,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victor'
  },
  {
    id: 302,
    name: 'Светлана Федорова',
    registeredDate: '2024-11-12',
    level: 3,
    totalSpent: 18000,
    yourEarnings: 180,
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Svetlana'
  },
  {
    id: 303,
    name: 'Максим Лебедев',
    registeredDate: '2024-11-15',
    level: 3,
    totalSpent: 0,
    yourEarnings: 0,
    isActive: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxim'
  }
];

// Тестовые транзакции рефералов
export const testReferralTransactions: ReferralTransaction[] = [
  {
    id: 6001,
    date: '2024-11-27',
    fromUser: 'Мария Захарова',
    amount: 25000,
    currency: 'RUB',
    commission: 2500,
    level: 1,
    type: 'Бронирование услуги'
  },
  {
    id: 6002,
    date: '2024-11-26',
    fromUser: 'Иван Петров',
    amount: 40000,
    currency: 'RUB',
    commission: 4000,
    level: 1,
    type: 'Бронирование услуги'
  },
  {
    id: 6003,
    date: '2024-11-25',
    fromUser: 'Елена Васильева',
    amount: 30000,
    currency: 'RUB',
    commission: 1500,
    level: 2,
    type: 'Бронирование услуги'
  },
  {
    id: 6004,
    date: '2024-11-24',
    fromUser: 'Ольга Смирнова',
    amount: 15000,
    currency: 'RUB',
    commission: 1500,
    level: 1,
    type: 'VIP оплата'
  },
  {
    id: 6005,
    date: '2024-11-23',
    fromUser: 'Андрей Соколов',
    amount: 22000,
    currency: 'RUB',
    commission: 1100,
    level: 2,
    type: 'Бронирование услуги'
  },
  {
    id: 6006,
    date: '2024-11-22',
    fromUser: 'Виктор Новиков',
    amount: 18000,
    currency: 'RUB',
    commission: 180,
    level: 3,
    type: 'Бронирование услуги'
  },
  {
    id: 6007,
    date: '2024-11-21',
    fromUser: 'Иван Петров',
    amount: 50000,
    currency: 'RUB',
    commission: 5000,
    level: 1,
    type: 'Бронирование услуги'
  },
  {
    id: 6008,
    date: '2024-11-20',
    fromUser: 'Татьяна Морозова',
    amount: 35000,
    currency: 'RUB',
    commission: 1750,
    level: 2,
    type: 'Бронирование услуги'
  },
  {
    id: 6009,
    date: '2024-11-19',
    fromUser: 'Мария Захарова',
    amount: 30000,
    currency: 'RUB',
    commission: 3000,
    level: 1,
    type: 'Бронирование услуги'
  },
  {
    id: 6010,
    date: '2024-11-18',
    fromUser: 'Светлана Федорова',
    amount: 18000,
    currency: 'RUB',
    commission: 180,
    level: 3,
    type: 'Бронирование услуги'
  },
  {
    id: 6011,
    date: '2024-11-17',
    fromUser: 'Ольга Смирнова',
    amount: 30000,
    currency: 'RUB',
    commission: 3000,
    level: 1,
    type: 'Бронирование услуги'
  },
  {
    id: 6012,
    date: '2024-11-16',
    fromUser: 'Иван Петров',
    amount: 30000,
    currency: 'RUB',
    commission: 3000,
    level: 1,
    type: 'Бронирование услуги'
  }
];

// Функция для получения статистики рефералов
export const getReferralStats = () => {
  const totalReferrals = testReferrals.length;
  const activeReferrals = testReferrals.filter(r => r.isActive).length;
  const totalEarned = testReferrals.reduce((sum, r) => sum + r.yourEarnings, 0);
  
  const level1Count = testReferrals.filter(r => r.level === 1).length;
  const level2Count = testReferrals.filter(r => r.level === 2).length;
  const level3Count = testReferrals.filter(r => r.level === 3).length;
  
  const level1Earned = testReferrals.filter(r => r.level === 1).reduce((sum, r) => sum + r.yourEarnings, 0);
  const level2Earned = testReferrals.filter(r => r.level === 2).reduce((sum, r) => sum + r.yourEarnings, 0);
  const level3Earned = testReferrals.filter(r => r.level === 3).reduce((sum, r) => sum + r.yourEarnings, 0);
  
  return {
    totalReferrals,
    activeReferrals,
    totalEarned,
    level1Count,
    level2Count,
    level3Count,
    level1Earned,
    level2Earned,
    level3Earned
  };
};
