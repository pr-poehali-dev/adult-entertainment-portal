import { catalogItems } from '@/data/mockData';
import { Profile, Notification } from '@/types';
import { notificationService } from '@/utils/notificationService';

interface HandlersProps {
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
  toast: any;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  playNotificationSound: (type: string) => void;
  bookingDate: string;
  bookingTime: string;
  setShowBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServiceId: number | null;
  setReviewServiceName: React.Dispatch<React.SetStateAction<string>>;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBookingDate: React.Dispatch<React.SetStateAction<string>>;
  setBookingTime: React.Dispatch<React.SetStateAction<string>>;
  setBookingDuration: React.Dispatch<React.SetStateAction<string>>;
  setBookingNote: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: (page: any) => void;
  reviewServiceName: string;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export const useIndexHandlers = (props: HandlersProps) => {
  const {
    favorites,
    setFavorites,
    toast,
    notifications,
    setNotifications,
    playNotificationSound,
    bookingDate,
    bookingTime,
    setShowBookingModal,
    selectedServiceId,
    setReviewServiceName,
    setShowReviewModal,
    setBookingDate,
    setBookingTime,
    setBookingDuration,
    setBookingNote,
    setCurrentPage,
    reviewServiceName,
    setProfile,
  } = props;

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

  const addNotification = (type: 'message' | 'booking' | 'review' | 'system' | 'referral' | 'ad_response', title: string, text: string, options?: { amount?: number; currency?: string; referralLevel?: 1 | 2 | 3; adId?: number; responseId?: number }) => {
    const newNotif: Notification = {
      id: Date.now(),
      type,
      title,
      text,
      time: 'Только что',
      read: false,
      amount: options?.amount,
      currency: options?.currency as any,
      referralLevel: options?.referralLevel,
      adId: options?.adId,
      responseId: options?.responseId
    };
    setNotifications([newNotif, ...notifications]);
    playNotificationSound(type);
    
    // Используем новый сервис уведомлений
    notificationService.notify(newNotif);
    
    if (type === 'referral' && options?.amount) {
      toast({
        title: title,
        description: text,
        duration: 5000,
      });
    }
    
    if (type === 'ad_response') {
      toast({
        title: title,
        description: text,
        duration: 7000,
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

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermissions();
    if (granted) {
      toast({
        title: "Уведомления включены",
        description: "Вы будете получать звуковые, вибро и push-уведомления",
      });
      // Тестовое уведомление
      notificationService.testNotification();
    } else {
      toast({
        title: "Разрешения не предоставлены",
        description: "Включите уведомления в настройках браузера",
        variant: "destructive",
      });
    }
  };

  return {
    toggleFavorite,
    addNotification,
    handleBookingSubmit,
    handleSubmitReview,
    handleProfileUpdate,
    handleEnableNotifications,
  };
};
