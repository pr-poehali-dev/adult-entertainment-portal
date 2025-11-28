export type Page = 'home' | 'catalog' | 'profile' | 'register' | 'login' | 'search' | 'favorites' | 'messages' | 'rules' | 'service' | 'seller-profile' | 'work' | 'admin' | 'referral';
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
  healthCertified?: boolean;
  healthCertificateExpiry?: string | null;
  lastHealthCertificateUpload?: string | null;
  audioGreeting?: string | null;
  promoVideo?: string | null;
  profilePhotos?: string[];
  gender?: 'male' | 'female' | 'other';
  age?: number;
  referrerId?: number | null;
  referralCode?: string;
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

export interface PriceListItem {
  id: number;
  title: string;
  description?: string;
  duration: number;
  price: number;
  currency: Currency;
  category: string;
}

export type MediaType = 'photo' | 'video' | 'audio';
export type MediaItemType = 'existing' | 'custom_order';

export interface MediaItem {
  id: number;
  type: MediaType;
  thumbnail: string;
  url?: string;
  duration?: string;
  locked: boolean;
}

export interface PrivateAlbum {
  id: number;
  title: string;
  description?: string;
  coverImage: string;
  price: number;
  currency: Currency;
  pinCode: string;
  mediaCount: number;
  mediaItems: MediaItem[];
  isPurchased?: boolean;
}

export interface CustomMediaOrder {
  id: number;
  type: MediaType;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  deliveryTime: string;
  exampleImage?: string;
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
  priceList?: PriceListItem[];
  privateAlbums?: PrivateAlbum[];
  customMediaOrders?: CustomMediaOrder[];
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
  healthCertified?: boolean;
  healthCertificateExpiry?: string | null;
  lastHealthCertificateUpload?: string | null;
  audioGreeting?: string | null;
  promoVideo?: string | null;
  profilePhotos?: string[];
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
  type: 'message' | 'booking' | 'review' | 'system' | 'referral';
  title: string;
  text: string;
  time: string;
  read: boolean;
  amount?: number;
  currency?: Currency;
  referralLevel?: 1 | 2 | 3;
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
  serviceCategory: string; // Категория услуги для логики продления
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

export type WorkOpportunityType = 
  | 'photo_shoot'
  | 'video_shoot'
  | 'nude_photoshoot'
  | 'porn_casting'
  | 'first_time';

export interface WorkOpportunity {
  id: number;
  type: WorkOpportunityType;
  title: string;
  description: string;
  payment: string;
  paymentAmount: number;
  currency: Currency;
  requirements: string[];
  location: string;
  duration: string;
  image: string;
  contactInfo: string;
  isVerified: boolean;
  postedDate: string;
  company?: string;
}

export interface PaidAd {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  category: string;
  images: string[];
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  location: string;
  postedDate: string;
  views: number;
  isPremium: boolean;
  contactInfo: string;
}

export type AdminStatsPeriod = 'today' | 'week' | 'month' | 'year';

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalBookings: number;
  totalRevenue: number;
  totalAds: number;
  totalWorkApplications: number;
  newUsersToday: number;
  activeBookings: number;
  premiumUsers: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  vipStatus: VIPStatus;
  registeredDate: string;
  lastActive: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'banned';
}

export interface AdminBooking extends Booking {
  userName: string;
  userEmail: string;
  sellerEmail: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  level1Earned: number;
  level2Earned: number;
  level3Earned: number;
}

export interface ReferralUser {
  id: number;
  name: string;
  registeredDate: string;
  level: 1 | 2 | 3;
  totalSpent: number;
  yourEarnings: number;
  isActive: boolean;
  avatar?: string;
}

export interface ReferralTransaction {
  id: number;
  date: string;
  fromUser: string;
  amount: number;
  currency: Currency;
  commission: number;
  level: 1 | 2 | 3;
  type: string;
}