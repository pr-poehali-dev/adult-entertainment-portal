import { useState } from 'react';
import { Page, UserRole, Profile, Notification, Wallet, CatalogItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';

export const useIndexState = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [agencyGirls, setAgencyGirls] = useState<CatalogItem[]>([]);
  const [showAgencyPayment, setShowAgencyPayment] = useState(false);
  const [pendingAgencyName, setPendingAgencyName] = useState('');
  const [showGirlForm, setShowGirlForm] = useState(false);
  const [editingGirl, setEditingGirl] = useState<CatalogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('1');
  const [bookingNote, setBookingNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedHeight, setSelectedHeight] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewServiceName, setReviewServiceName] = useState('');
  const { toast } = useToast();
  const { playNotificationSound, playBalanceSound, soundEnabled, setSoundEnabled } = useNotificationSound();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'referral',
      title: 'Новый реферал!',
      text: 'Мария зарегистрировалась по вашей ссылке (1 линия)',
      time: '2 мин назад',
      read: false,
      referralLevel: 1
    },
    {
      id: 2,
      type: 'referral',
      title: 'Комиссия получена',
      text: 'Вы заработали 500 ₽ с транзакции реферала',
      time: '15 мин назад',
      read: false,
      amount: 500,
      currency: 'RUB',
      referralLevel: 1
    },
    {
      id: 3,
      type: 'message',
      title: 'Новое сообщение',
      text: 'Анна ответила на ваш запрос',
      time: '1 час назад',
      read: false
    },
    {
      id: 4,
      type: 'booking',
      title: 'Бронирование подтверждено',
      text: 'Встреча 28 ноября в 18:00',
      time: '2 часа назад',
      read: false
    },
    {
      id: 5,
      type: 'referral',
      title: 'Реферал 2 линии',
      text: 'Елена присоединилась через вашего реферала (2 линия)',
      time: '3 часа назад',
      read: true,
      referralLevel: 2
    },
    {
      id: 6,
      type: 'review',
      title: 'Новый отзыв',
      text: 'Вы получили 5 звёзд от клиента',
      time: '5 часов назад',
      read: true
    },
    {
      id: 7,
      type: 'referral',
      title: 'Комиссия 5%',
      text: 'Заработано 250 ₽ с реферала 2 линии',
      time: '6 часов назад',
      read: true,
      amount: 250,
      currency: 'RUB',
      referralLevel: 2
    },
    {
      id: 8,
      type: 'system',
      title: 'Верификация завершена',
      text: 'Ваш профиль успешно проверен',
      time: 'Вчера',
      read: true
    }
  ]);
  const [profile, setProfile] = useState<Profile>({
    name: 'Елена Романова',
    role: 'buyer',
    avatar: '',
    rating: 4.8,
    verified: true,
    vipStatus: 'none',
    vipExpiry: null
  });

  const [wallet, setWallet] = useState<Wallet>({
    balances: [
      { currency: 'RUB', amount: 150000, symbol: '₽' },
      { currency: 'USD', amount: 5000, symbol: '$' },
      { currency: 'EUR', amount: 3000, symbol: '€' },
      { currency: 'BTC', amount: 0.5, symbol: '₿' },
      { currency: 'ETH', amount: 2, symbol: 'Ξ' },
      { currency: 'USDT', amount: 10000, symbol: '₮' },
    ]
  });

  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  return {
    currentPage,
    setCurrentPage,
    userRole,
    setUserRole,
    searchQuery,
    setSearchQuery,
    favorites,
    setFavorites,
    selectedServiceId,
    setSelectedServiceId,
    showBookingModal,
    setShowBookingModal,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    bookingDuration,
    setBookingDuration,
    bookingNote,
    setBookingNote,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedCountry,
    setSelectedCountry,
    selectedLocation,
    setSelectedLocation,
    selectedAge,
    setSelectedAge,
    selectedHeight,
    setSelectedHeight,
    selectedBodyType,
    setSelectedBodyType,
    selectedSellerId,
    setSelectedSellerId,
    selectedPartyId,
    setSelectedPartyId,
    selectedApplicationId,
    setSelectedApplicationId,
    isDarkTheme,
    setIsDarkTheme,
    showReviewModal,
    setShowReviewModal,
    reviewServiceName,
    setReviewServiceName,
    toast,
    playNotificationSound,
    playBalanceSound,
    soundEnabled,
    setSoundEnabled,
    showNotifications,
    setShowNotifications,
    notifications,
    setNotifications,
    profile,
    setProfile,
    wallet,
    setWallet,
    walletTransactions,
    setWalletTransactions,
    agencyGirls,
    setAgencyGirls,
    showAgencyPayment,
    setShowAgencyPayment,
    pendingAgencyName,
    setPendingAgencyName,
    showGirlForm,
    setShowGirlForm,
    editingGirl,
    setEditingGirl,
  };
};