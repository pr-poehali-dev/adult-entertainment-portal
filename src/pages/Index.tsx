import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import BookingModal from '@/components/BookingModal';
import ReviewModal from '@/components/ReviewModal';
import PageTransition from '@/components/PageTransition';
import { Toaster } from '@/components/ui/toaster';
import Icon from '@/components/ui/icon';
import { useAppPages } from '@/components/AppPages';
import { catalogItems, reviews } from '@/data/mockData';
import { Page, UserRole, Profile, Notification, Wallet } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { InstallPrompt } from '@/components/InstallPrompt';
import { SplashScreen } from '@/components/SplashScreen';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
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

  const toggleFavorite = (id: number) => {
    const isAdding = !favorites.includes(id);
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    
    if (isAdding) {
      toast({
        title: "Добавлено в избранное",
        description: "Услуга добавлена в ваш список избранного",
      });
    } else {
      toast({
        title: "Удалено из избранного",
        description: "Услуга удалена из списка избранного",
      });
    }
  };

  const addNotification = (type: 'message' | 'booking' | 'review' | 'system' | 'referral', title: string, text: string, options?: { amount?: number; currency?: string; referralLevel?: 1 | 2 | 3 }) => {
    const newNotif: Notification = {
      id: Date.now(),
      type,
      title,
      text,
      time: 'Только что',
      read: false,
      amount: options?.amount,
      currency: options?.currency as any,
      referralLevel: options?.referralLevel
    };
    setNotifications([newNotif, ...notifications]);
    playNotificationSound(type);
    
    if (type === 'referral' && options?.amount) {
      toast({
        title: title,
        description: text,
        duration: 5000,
      });
    }
  };

  const handleBookingSubmit = () => {
    if (!bookingDate || !bookingTime) {
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, выберите дату и время встречи',
        variant: 'destructive',
      });
      return;
    }
    
    const formattedDate = new Date(bookingDate).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long' 
    });
    
    addNotification(
      'booking',
      'Бронирование создано',
      `Ожидается подтверждение встречи на ${formattedDate} в ${bookingTime}`
    );
    
    toast({
      title: "Бронирование отправлено",
      description: `Ваша заявка на ${formattedDate} в ${bookingTime} отправлена исполнителю`,
    });
    
    setShowBookingModal(false);
    
    setTimeout(() => {
      const service = catalogItems.find(item => item.id === selectedServiceId);
      if (service) {
        setReviewServiceName(service.title);
        setShowReviewModal(true);
      }
    }, 2000);
    setBookingDate('');
    setBookingTime('');
    setBookingDuration('1');
    setBookingNote('');
    setCurrentPage('profile');
  };

  const handleSubmitReview = (rating: number, text: string) => {
    addNotification(
      'review',
      'Отзыв отправлен',
      `Ваша оценка: ${rating}/5. Спасибо за отзыв!`
    );
    
    toast({
      title: "Отзыв опубликован",
      description: `Спасибо за ваш отзыв о ${reviewServiceName}!`,
    });
  };

  const handleProfileUpdate = (updatedProfile: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  useEffect(() => {
    if (!userRole) return;

    const simulateNotifications = () => {
      const notificationTypes: Array<'message' | 'booking' | 'review' | 'system' | 'referral'> = ['message', 'booking', 'review', 'system', 'referral'];
      const messages = {
        message: ['У вас новое сообщение от клиента', 'Продавец ответил на ваш вопрос', 'Новое сообщение в чате'],
        booking: ['Новое бронирование получено', 'Бронирование подтверждено', 'Изменение в расписании'],
        review: ['Вы получили новый отзыв', 'Клиент оставил 5 звёзд', 'Новая оценка вашего сервиса'],
        system: ['Обновление системы', 'Ваш профиль просмотрели', 'Новые функции доступны'],
        referral: [
          { text: 'зарегистрировался по вашей ссылке', level: 1, hasAmount: false },
          { text: 'присоединился через вашего реферала', level: 2, hasAmount: false },
          { text: 'стал вашим рефералом 3 линии', level: 3, hasAmount: false }
        ]
      };

      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      if (randomType === 'referral') {
        const referralData = messages.referral[Math.floor(Math.random() * messages.referral.length)];
        const names = ['Анна', 'Мария', 'Елена', 'Ольга', 'Дарья', 'Алексей', 'Дмитрий'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const hasCommission = Math.random() > 0.5;
        
        if (hasCommission) {
          const amounts = [100, 250, 500, 800, 1200, 1500, 2000];
          const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
          const commission = referralData.level === 1 ? '10%' : referralData.level === 2 ? '5%' : '1%';
          
          setWallet(prev => ({
            ...prev,
            balances: prev.balances.map(b => 
              b.currency === 'RUB' ? { ...b, amount: b.amount + randomAmount } : b
            )
          }));

          const newTransaction = {
            id: Date.now(),
            type: 'referral_commission',
            amount: randomAmount,
            currency: 'RUB',
            status: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            description: `Комиссия ${commission} с реферала ${referralData.level} линии`,
            referralLevel: referralData.level
          };
          setWalletTransactions(prev => [newTransaction, ...prev]);
          
          playBalanceSound();
          
          addNotification(
            'referral',
            `Комиссия ${commission}`,
            `Заработано ${randomAmount} ₽ с реферала ${referralData.level} линии`,
            { amount: randomAmount, currency: 'RUB', referralLevel: referralData.level }
          );
        } else {
          const title = referralData.level === 1 ? 'Новый реферал!' : `Реферал ${referralData.level} линии`;
          addNotification(
            'referral',
            title,
            `${randomName} ${referralData.text} (${referralData.level} линия)`,
            { referralLevel: referralData.level }
          );
        }
      } else {
        const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];
        addNotification(randomType, randomType === 'message' ? 'Новое сообщение' : randomType === 'booking' ? 'Бронирование' : randomType === 'review' ? 'Новый отзыв' : 'Системное уведомление', randomMessage);
      }
    };

    const intervalId = setInterval(simulateNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [userRole, notifications]);

  const { renderPage } = useAppPages({
    currentPage,
    setCurrentPage,
    userRole,
    setUserRole,
    profile,
    catalogItems,
    reviews,
    favorites,
    toggleFavorite,
    selectedServiceId,
    setSelectedServiceId,
    setShowBookingModal,
    searchQuery,
    setSearchQuery,
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
    onProfileUpdate: handleProfileUpdate,
    wallet,
  });

  return (
    <div className={isDarkTheme ? 'dark' : ''} data-theme={isDarkTheme ? 'dark' : 'light'}>
    <SplashScreen />
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-full">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        setUserRole={setUserRole}
        profile={profile}
        notifications={notifications}
        setNotifications={setNotifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        wallet={wallet}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      
      <main>
        <PageTransition pageKey={currentPage}>
          {renderPage()}
        </PageTransition>
      </main>

      <BookingModal 
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        bookingDate={bookingDate}
        setBookingDate={setBookingDate}
        bookingTime={bookingTime}
        setBookingTime={setBookingTime}
        bookingDuration={bookingDuration}
        setBookingDuration={setBookingDuration}
        bookingNote={bookingNote}
        setBookingNote={setBookingNote}
        handleBookingSubmit={handleBookingSubmit}
        servicePrice={selectedServiceId ? parseInt(catalogItems.find(item => item.id === selectedServiceId)?.price.replace(/\D/g, '') || '25000') : 25000}
        serviceName={selectedServiceId ? catalogItems.find(item => item.id === selectedServiceId)?.title : 'Услуга'}
        isServiceActive={selectedServiceId ? (() => {
          const item = catalogItems.find(item => item.id === selectedServiceId);
          if (!item) return true;
          const { isCurrentlyActive } = require('@/utils/scheduleChecker');
          return item.isActive !== false && isCurrentlyActive(item.workSchedule);
        })() : true}
      />

      <ReviewModal
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
        serviceName={reviewServiceName}
        onSubmitReview={handleSubmitReview}
      />

      <footer className="border-t border-border/50 mt-20 py-16 bg-gradient-to-b from-card/30 to-card/80 backdrop-blur-sm">
        <div className="max-w-wide mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon name="Crown" size={40} className="text-primary" />
              <h2 className="text-5xl font-bold gold-shimmer">Elite</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Премиальная платформа эскорт-услуг для взыскательных клиентов
            </p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8 text-foreground/80">
            <button onClick={() => setCurrentPage('rules')} className="hover:text-primary transition-colors font-medium">
              Правила платформы
            </button>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium">Конфиденциальность</a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium">Поддержка 24/7</a>
          </div>
          
          <div className="pt-8 border-t border-border/30">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 <span className="font-semibold text-primary">Elite</span>. Все права защищены. 18+
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
      <InstallPrompt />
    </div>
    </div>
  );
};

export default Index;