import { useState } from 'react';
import Navigation from '@/components/Navigation';
import BookingModal from '@/components/BookingModal';
import { useAppPages } from '@/components/AppPages';
import { catalogItems, reviews } from '@/data/mockData';
import { Page, UserRole, Profile, Notification } from '@/types';

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
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
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
      alert('Пожалуйста, выберите дату и время');
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
    
    setShowBookingModal(false);
    setBookingDate('');
    setBookingTime('');
    setBookingDuration('1');
    setBookingNote('');
    setCurrentPage('profile');
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
  });

  return (
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
      />
      
      <main>
        {renderPage()}
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
    </div>
  );
};

export default Index;
