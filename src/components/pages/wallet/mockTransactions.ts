import { Transaction } from '@/types';

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'deposit',
    amount: 5000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-27T10:30:00Z',
    completedAt: '2024-11-27T10:31:00Z',
    description: 'Пополнение через банковскую карту'
  },
  {
    id: 2,
    type: 'booking_payment',
    amount: 1500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-26T15:20:00Z',
    completedAt: '2024-11-26T15:20:30Z',
    description: 'Оплата бронирования #12345',
    relatedBookingId: 12345,
    toUser: 'Мария С.'
  },
  {
    id: 3,
    type: 'vip_payment',
    amount: 500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-25T09:15:00Z',
    completedAt: '2024-11-25T09:15:10Z',
    description: 'Оплата VIP статуса на 1 месяц'
  },
  {
    id: 4,
    type: 'withdraw',
    amount: 2000,
    currency: 'RUB',
    status: 'pending',
    createdAt: '2024-11-24T14:00:00Z',
    description: 'Вывод на карту **** 1234'
  },
  {
    id: 5,
    type: 'booking_received',
    amount: 3000,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-23T18:45:00Z',
    completedAt: '2024-11-23T20:50:00Z',
    description: 'Получение оплаты за бронирование #12340',
    relatedBookingId: 12340,
    fromUser: 'Александр П.',
    fee: 300
  },
  {
    id: 6,
    type: 'tip_received',
    amount: 500,
    currency: 'RUB',
    status: 'completed',
    createdAt: '2024-11-22T12:30:00Z',
    completedAt: '2024-11-22T12:30:05Z',
    description: 'Чаевые от клиента',
    fromUser: 'Дмитрий К.'
  }
];
