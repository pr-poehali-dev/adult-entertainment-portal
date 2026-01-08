import { useState } from 'react';
import { Page, UserRole, Profile, Notification, Wallet, CatalogItem, AgencyType, UserAd } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';

export const useIndexState = () => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const setIsAuthenticated = (value: boolean) => {
    setIsAuthenticatedState(value);
    localStorage.setItem('isAuthenticated', value.toString());
  };
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return isAuth ? 'home' : 'login';
  });
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [agencyGirls, setAgencyGirls] = useState<CatalogItem[]>([
    {
      id: 101,
      userId: 10,
      title: 'Профессиональный массаж всего тела',
      seller: 'Анна Смирнова',
      rating: 4.9,
      price: '3500 ₽',
      category: 'Массаж',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      verified: true,
      description: 'Классический расслабляющий массаж с использованием ароматических масел. Опыт работы более 5 лет.',
      features: ['60 минут', 'Ароматерапия', 'Расслабление'],
      duration: '1 час',
      location: 'Москва, ЦАО',
      age: 28,
      height: 168,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 1,
      agencyName: 'Elite Wellness',
      createdAt: new Date().toISOString(),
      viewCount: 245,
    },
    {
      id: 102,
      userId: 11,
      title: 'Спортивный массаж для спортсменов',
      seller: 'Мария Петрова',
      rating: 4.8,
      price: '4000 ₽',
      category: 'Массаж',
      image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800',
      verified: true,
      description: 'Специализируюсь на спортивном массаже, восстановлении после тренировок и травм.',
      features: ['90 минут', 'Спортивный массаж', 'Реабилитация'],
      duration: '1.5 часа',
      location: 'Санкт-Петербург',
      age: 32,
      height: 172,
      bodyType: 'Атлетичная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 1,
      agencyName: 'Elite Wellness',
      createdAt: new Date().toISOString(),
      viewCount: 189,
    },
    {
      id: 103,
      userId: 12,
      title: 'Уход за лицом и косметология',
      seller: 'Екатерина Волкова',
      rating: 5.0,
      price: '5500 ₽',
      category: 'Косметология',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
      verified: true,
      description: 'Профессиональный косметолог с медицинским образованием. Чистки, пилинги, уходовые процедуры.',
      features: ['Медицинское образование', 'Современное оборудование', 'Индивидуальный подход'],
      duration: '2 часа',
      location: 'Москва, Пресненский район',
      age: 35,
      height: 165,
      bodyType: 'Средняя',
      workSchedule: { type: 'custom' as const, customHours: { monday: { start: '10:00', end: '20:00', enabled: true } } },
      isActive: true,
      isApproved: true,
      agencyId: 2,
      agencyName: 'Beauty Expert',
      createdAt: new Date().toISOString(),
      viewCount: 312,
    },
    {
      id: 104,
      userId: 13,
      title: 'Женская стрижка и укладка',
      seller: 'Ольга Соколова',
      rating: 4.7,
      price: '2500 ₽',
      category: 'Парикмахерские услуги',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      verified: true,
      description: 'Креативные стрижки, окрашивание, укладки на любое мероприятие. Работаю на премиальной косметике.',
      features: ['Креативные стрижки', 'Окрашивание', 'Укладки'],
      duration: '2 часа',
      location: 'Москва, Арбат',
      age: 29,
      height: 170,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 3,
      agencyName: 'Style Studio',
      createdAt: new Date().toISOString(),
      viewCount: 156,
    },
    {
      id: 105,
      userId: 14,
      title: 'Маникюр и наращивание ногтей',
      seller: 'Дарья Козлова',
      rating: 4.9,
      price: '2000 ₽',
      category: 'Маникюр и педикюр',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
      verified: true,
      description: 'Аппаратный маникюр, покрытие гель-лаком, наращивание, дизайны любой сложности.',
      features: ['Аппаратный маникюр', 'Гель-лак', 'Дизайн'],
      duration: '2 часа',
      location: 'Москва, Тверская',
      age: 26,
      height: 163,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 3,
      agencyName: 'Style Studio',
      createdAt: new Date().toISOString(),
      viewCount: 223,
    },
    {
      id: 106,
      userId: 15,
      title: 'Персональные тренировки по йоге',
      seller: 'Светлана Морозова',
      rating: 4.8,
      price: '3000 ₽',
      category: 'Фитнес и йога',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
      verified: true,
      description: 'Сертифицированный инструктор по йоге. Хатха-йога, виньяса, растяжка. Индивидуальный подход.',
      features: ['Индивидуальные занятия', 'Хатха-йога', 'Виньяса'],
      duration: '1.5 часа',
      location: 'Москва, Сокольники',
      age: 31,
      height: 168,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 4,
      agencyName: 'Fitness Pro',
      createdAt: new Date().toISOString(),
      viewCount: 178,
    },
    {
      id: 107,
      userId: 16,
      title: 'Психологическое консультирование',
      seller: 'Алина Захарова',
      rating: 5.0,
      price: '4500 ₽',
      category: 'Психология и коучинг',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
      verified: true,
      description: 'Клинический психолог. Работа со стрессом, тревогой, отношениями. Онлайн и офлайн консультации.',
      features: ['Клинический психолог', 'Онлайн/офлайн', 'Конфиденциальность'],
      duration: '1 час',
      location: 'Москва, Хамовники',
      age: 38,
      height: 167,
      bodyType: 'Средняя',
      workSchedule: { type: 'custom' as const, customHours: { monday: { start: '12:00', end: '20:00', enabled: true } } },
      isActive: true,
      isApproved: true,
      agencyId: 5,
      agencyName: 'MindCare',
      createdAt: new Date().toISOString(),
      viewCount: 267,
    },
    {
      id: 108,
      userId: 17,
      title: 'Репетитор по английскому языку',
      seller: 'Виктория Новикова',
      rating: 4.9,
      price: '2500 ₽',
      category: 'Репетиторство',
      image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800',
      verified: true,
      description: 'Преподаватель английского с опытом 7 лет. Подготовка к экзаменам, разговорная практика.',
      features: ['Подготовка к экзаменам', 'Разговорная практика', '7 лет опыта'],
      duration: '1.5 часа',
      location: 'Москва, Чистые пруды',
      age: 33,
      height: 170,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 6,
      agencyName: 'Education Plus',
      createdAt: new Date().toISOString(),
      viewCount: 198,
    },
    {
      id: 109,
      userId: 18,
      title: 'Фотосессия для портфолио',
      seller: 'Наталья Борисова',
      rating: 4.8,
      price: '8000 ₽',
      category: 'Фотография',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      verified: true,
      description: 'Профессиональный фотограф. Портретная съёмка, фэшн, портфолио для моделей и актёров.',
      features: ['Профессиональная камера', 'Обработка в подарок', 'Портфолио'],
      duration: '3 часа',
      location: 'Москва, студия в центре',
      age: 30,
      height: 165,
      bodyType: 'Средняя',
      workSchedule: { type: 'custom' as const, customHours: { saturday: { start: '10:00', end: '18:00', enabled: true } } },
      isActive: true,
      isApproved: true,
      agencyId: 7,
      agencyName: 'Creative Vision',
      createdAt: new Date().toISOString(),
      viewCount: 289,
    },
    {
      id: 110,
      userId: 19,
      title: 'Видеосъёмка мероприятий',
      seller: 'Елена Григорьева',
      rating: 4.7,
      price: '15000 ₽',
      category: 'Видеосъемка',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      verified: true,
      description: 'Видеограф с опытом съёмки свадеб, корпоративов, праздников. Профессиональная техника и монтаж.',
      features: ['4K съёмка', 'Монтаж', 'Профессиональная техника'],
      duration: 'весь день',
      location: 'Москва и МО',
      age: 27,
      height: 168,
      bodyType: 'Стройная',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 7,
      agencyName: 'Creative Vision',
      createdAt: new Date().toISOString(),
      viewCount: 234,
    },
    {
      id: 111,
      userId: 20,
      title: 'Дизайн интерьера квартиры',
      seller: 'Ирина Лебедева',
      rating: 5.0,
      price: '50000 ₽',
      category: 'Дизайн интерьера',
      image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800',
      verified: true,
      description: 'Дизайнер интерьеров с портфолио реализованных проектов. Современный стиль, скандинавский минимализм.',
      features: ['3D визуализация', 'Подбор материалов', 'Авторский надзор'],
      duration: 'проект',
      location: 'Москва',
      age: 36,
      height: 172,
      bodyType: 'Средняя',
      workSchedule: { type: 'custom' as const, customHours: { monday: { start: '10:00', end: '19:00', enabled: true } } },
      isActive: true,
      isApproved: true,
      agencyId: 8,
      agencyName: 'Interior Dreams',
      createdAt: new Date().toISOString(),
      viewCount: 412,
    },
    {
      id: 112,
      userId: 21,
      title: 'Генеральная уборка квартиры',
      seller: 'Анна Михайлова',
      rating: 4.9,
      price: '4500 ₽',
      category: 'Уборка',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      verified: true,
      description: 'Профессиональная уборка квартир и домов. Используем экологичные средства. Качество гарантируем.',
      features: ['Экологичные средства', 'Быстро и качественно', 'Все включено'],
      duration: '4 часа',
      location: 'Москва и МО',
      age: 42,
      height: 165,
      bodyType: 'Средняя',
      workSchedule: { type: '24/7' as const },
      isActive: true,
      isApproved: true,
      agencyId: 9,
      agencyName: 'Clean House',
      createdAt: new Date().toISOString(),
      viewCount: 345,
    },
    {
      id: 113,
      userId: 22,
      title: 'Ремонт квартир под ключ',
      seller: 'Ольга Семёнова',
      rating: 4.6,
      price: '150000 ₽',
      category: 'Ремонт и строительство',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      verified: true,
      description: 'Бригада профессиональных мастеров. Косметический и капитальный ремонт. Гарантия на все работы.',
      features: ['Под ключ', 'Гарантия 2 года', 'Договор'],
      duration: '1-3 месяца',
      location: 'Москва',
      age: 45,
      height: 168,
      bodyType: 'Средняя',
      workSchedule: { type: 'custom' as const, customHours: { monday: { start: '08:00', end: '20:00', enabled: true } } },
      isActive: true,
      isApproved: true,
      agencyId: 10,
      agencyName: 'Master Build',
      createdAt: new Date().toISOString(),
      viewCount: 278,
    },
  ]);
  const [userAds, setUserAds] = useState<UserAd[]>([
    {
      id: 1,
      authorId: 1,
      authorName: 'Елена Романова',
      authorAvatar: '',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Классика',
      title: 'Ищу девушку для классического свидания',
      description: 'Хочу встретиться с девушкой для приятного вечера. Возраст 20-30 лет, стройная.',
      price: 5000,
      currency: 'RUB',
      duration: 2,
      lookingFor: 'Девушка 20-30 лет, стройная, для классического свидания',
      status: 'active',
      createdAt: new Date().toISOString(),
      responses: []
    }
  ]);
  const [showAgencyPayment, setShowAgencyPayment] = useState(false);
  const [pendingAgencyName, setPendingAgencyName] = useState('');
  const [pendingAgencyType, setPendingAgencyType] = useState<AgencyType | null>(null);
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
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<{ id: string; name: string } | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewServiceName, setReviewServiceName] = useState('');
  const [showLovePurchase, setShowLovePurchase] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Елена Романова',
      nickname: 'LenaRom',
      role: 'buyer',
      avatar: '',
      rating: 4.8,
      verified: true,
      vipStatus: 'none',
      vipExpiry: null,
      subscriptionType: 'free',
      subscriptionExpiry: null,
      profileCompleted: true,
      kycCompleted: true,
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
      { currency: 'RUB', amount: 150000, symbol: '₽' },
      { currency: 'USD', amount: 5000, symbol: '$' },
      { currency: 'EUR', amount: 3000, symbol: '€' },
      { currency: 'BTC', amount: 0.5, symbol: '₿' },
      { currency: 'ETH', amount: 2, symbol: 'Ξ' },
      { currency: 'USDT', amount: 10000, symbol: '₮' },
      { currency: 'LOVE', amount: 0, symbol: '💗' },
    ]
  });

  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  const [bookings, setBookings] = useState<any[]>([]);

  const [orderChats, setOrderChats] = useState<any[]>([]);
  const [selectedOrderChatId, setSelectedOrderChatId] = useState<number | null>(null);

  return {
    isAuthenticated,
    setIsAuthenticated,
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
    setProfile: setProfileWithSave,
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
    pendingAgencyType,
    setPendingAgencyType,
    showGirlForm,
    setShowGirlForm,
    editingGirl,
    setEditingGirl,
    showLovePurchase,
    setShowLovePurchase,
    showPremiumModal,
    setShowPremiumModal,
    userAds,
    setUserAds,
    bookings,
    setBookings,
    orderChats,
    setOrderChats,
    selectedOrderChatId,
    setSelectedOrderChatId,
    selectedServiceCategory,
    setSelectedServiceCategory,
  };
};