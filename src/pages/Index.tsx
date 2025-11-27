import { useState } from 'react';
import Navigation from '@/components/Navigation';
import BookingModal from '@/components/BookingModal';
import ReviewModal from '@/components/ReviewModal';
import PageTransition from '@/components/PageTransition';
import { Toaster } from '@/components/ui/toaster';
import { useAppPages } from '@/components/AppPages';
import { catalogItems, reviews } from '@/data/mockData';
import { Page, UserRole, Profile, Notification } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
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
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedHeight, setSelectedHeight] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewServiceName, setReviewServiceName] = useState('');
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'message',
      title: 'Новое сообщение',
      text: 'Анна ответила на ваш запрос',
      time: '5 мин назад',
      read: false
    },
    {
      id: 2,
      type: 'booking',
      title: 'Бронирование подтверждено',
      text: 'Встреча 28 ноября в 18:00',
      time: '1 час назад',
      read: false
    },
    {
      id: 3,
      type: 'review',
      title: 'Новый отзыв',
      text: 'Вы получили 5 звёзд от клиента',
      time: '3 часа назад',
      read: true
    },
    {
      id: 4,
      type: 'system',
      title: 'Верификация завершена',
      text: 'Ваш профиль успешно проверен',
      time: 'Вчера',
      read: true
    }
  ]);
  const [profile] = useState<Profile>({
    name: 'Елена Романова',
    role: 'buyer',
    avatar: '',
    rating: 4.8,
    verified: true
  });

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

  const addNotification = (type: 'message' | 'booking' | 'review' | 'system', title: string, text: string) => {
    const newNotif: Notification = {
      id: Date.now(),
      type,
      title,
      text,
      time: 'Только что',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
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
  });

  return (
    <div className={isDarkTheme ? 'dark' : ''} data-theme={isDarkTheme ? 'dark' : 'light'}>
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        profile={profile}
        notifications={notifications}
        setNotifications={setNotifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
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

      <footer className="border-t border-border mt-20 py-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">ÉLITE</h2>
          <p className="text-muted-foreground mb-6">Премиальная платформа для взрослых</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => setCurrentPage('rules')} className="hover:text-primary transition-colors">
              Правила
            </button>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Конфиденциальность</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Поддержка</a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">© 2024 ÉLITE. Все права защищены.</p>
        </div>
      </footer>
      
      <Toaster />
    </div>
    </div>
  );
};

export default Index;