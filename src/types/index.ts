export type Page = 'home' | 'catalog' | 'profile' | 'register' | 'search' | 'favorites' | 'messages' | 'rules' | 'service' | 'seller-profile';
export type UserRole = 'buyer' | 'seller' | null;
export type VIPStatus = 'none' | 'vip';

export interface Profile {
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
  verified: boolean;
  vipStatus: VIPStatus;
  vipExpiry: string | null;
}

export type WorkScheduleType = '24/7' | 'custom' | 'inactive';

export interface WorkSchedule {
  type: WorkScheduleType;
  customHours?: {
    [key: string]: { start: string; end: string; enabled: boolean };
  };
}

export interface CatalogItem {
  id: number;
  title: string;
  seller: string;
  rating: number;
  price: string;
  category: string;
  image: string;
  verified: boolean;
  description?: string;
  features?: string[];
  duration?: string;
  location?: string;
  sellerId?: number;
  age?: number;
  height?: number;
  bodyType?: string;
  workSchedule?: WorkSchedule;
  isActive?: boolean;
}

export interface SellerProfile {
  id: number;
  name: string;
  rating: number;
  verified: boolean;
  avatar: string;
  coverImage: string;
  age: number;
  location: string;
  languages: string[];
  about: string;
  services: string[];
  portfolio: { id: number; image: string; title: string; }[];
  stats: {
    bookings: number;
    responseTime: string;
    repeatClients: number;
  };
  availability: string[];
  workSchedule?: WorkSchedule;
  isActive?: boolean;
  vipStatus: VIPStatus;
  vipExpiry: string | null;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

export interface Notification {
  id: number;
  type: 'message' | 'booking' | 'review' | 'system';
  title: string;
  text: string;
  time: string;
  read: boolean;
}

export interface VIPPlan {
  id: string;
  duration: number;
  price: number;
  discount?: number;
}

export type Currency = 'RUB' | 'USD' | 'EUR' | 'BTC' | 'ETH' | 'USDT';

export interface WalletBalance {
  currency: Currency;
  amount: number;
  symbol: string;
}

export interface Wallet {
  balances: WalletBalance[];
}

export type BookingStatus = 
  | 'pending_seller_confirmation'  // Ожидает подтверждения продавца (15 мин)
  | 'confirmed'                     // Подтверждено, деньги на эскроу
  | 'seller_ready'                  // Продавец нажал "Готова"
  | 'buyer_ready'                   // Покупатель нажал "Готов"
  | 'in_progress'                   // Встреча идет, таймер
  | 'completed'                     // Завершено
  | 'cancelled'                     // Отменено
  | 'rejected';                     // Отклонено продавцом

export interface Booking {
  id: number;
  serviceId: number;
  serviceName: string;
  sellerId: number;
  sellerName: string;
  buyerId: number;
  buyerName: string;
  date: string;
  time: string;
  duration: number; // в часах
  pricePerHour: number;
  totalPrice: number;
  currency: Currency;
  status: BookingStatus;
  createdAt: string;
  confirmedAt?: string;
  sellerReadyAt?: string;
  buyerReadyAt?: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string; // Для таймера подтверждения
  remainingTime?: number; // Оставшееся оплаченное время в секундах
  escrowAmount?: number; // Сумма на эскроу
}

export type TransactionType = 
  | 'deposit'           // Пополнение
  | 'withdraw'          // Вывод
  | 'booking_payment'   // Оплата бронирования
  | 'booking_refund'    // Возврат за отмененное бронирование
  | 'booking_received'  // Получение оплаты (продавец)
  | 'booking_extend'    // Продление встречи
  | 'vip_payment'       // Оплата VIP
  | 'tip_sent'          // Отправленные чаевые
  | 'tip_received';     // Полученные чаевые

export type TransactionStatus = 
  | 'pending'     // В обработке
  | 'completed'   // Завершено
  | 'failed'      // Не удалось
  | 'cancelled';  // Отменено

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  createdAt: string;
  completedAt?: string;
  description: string;
  relatedBookingId?: number;
  fromUser?: string;
  toUser?: string;
  fee?: number;
}