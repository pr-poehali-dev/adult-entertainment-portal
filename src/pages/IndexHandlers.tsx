import { catalogItems } from '@/data/mockData';
import { Profile, Notification, CatalogItem, WalletBalance, Transaction, AgencyType } from '@/types';
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
  agencyGirls: CatalogItem[];
  setAgencyGirls: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  setShowAgencyPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingAgencyName: React.Dispatch<React.SetStateAction<string>>;
  setShowGirlForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingGirl: React.Dispatch<React.SetStateAction<CatalogItem | null>>;
  wallet: { balances: WalletBalance[] };
  setWallet: React.Dispatch<React.SetStateAction<{ balances: WalletBalance[] }>>;
  walletTransactions: Transaction[];
  setWalletTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  pendingAgencyName: string;
  pendingAgencyType: AgencyType | null;
  setPendingAgencyType: React.Dispatch<React.SetStateAction<AgencyType | null>>;
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
    agencyGirls,
    setAgencyGirls,
    setShowAgencyPayment,
    setPendingAgencyName,
    setShowGirlForm,
    setEditingGirl,
    wallet,
    setWallet,
    walletTransactions,
    setWalletTransactions,
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

  const handleAgencyRegister = (agencyName: string, agencyType: AgencyType) => {
    console.log('handleAgencyRegister called', { agencyName, agencyType });
    setPendingAgencyName(agencyName);
    props.setPendingAgencyType(agencyType);
    setShowAgencyPayment(true);
    console.log('Payment modal should open now');
  };

  const handleAgencyPayment = (currency: string) => {
    const paymentAmount = 10000;
    const currencyRates: Record<string, number> = {
      'RUB': 1,
      'USD': 100,
      'EUR': 110,
      'BTC': 0.00012,
      'ETH': 0.003,
      'USDT': 100,
      'LOVE': 1000,
    };
    
    const amountInCurrency = paymentAmount / currencyRates[currency];
    
    setWallet((prev) => ({
      balances: prev.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount - amountInCurrency }
          : b
      )
    }));
    
    const transaction: Transaction = {
      id: Date.now(),
      type: 'vip_payment',
      amount: amountInCurrency,
      currency: currency as any,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      description: `Оплата регистрации агентства "${props.pendingAgencyName}"`,
    };
    
    setWalletTransactions([transaction, ...walletTransactions]);
    
    setProfile((prev) => ({
      ...prev,
      role: 'agency',
      agencyName: props.pendingAgencyName,
      agencyType: props.pendingAgencyType || undefined,
      isAgencyOwner: true,
      agencyId: Date.now(),
    }));
    
    setShowAgencyPayment(false);
    setCurrentPage('agency-dashboard');
    
    toast({
      title: "Агентство открыто!",
      description: `Добро пожаловать в панель управления агентства "${props.pendingAgencyName}"`,
    });
  };

  const handleAddGirl = (girlData: Partial<CatalogItem>) => {
    const newGirl: CatalogItem = {
      id: Date.now(),
      title: girlData.title || '',
      seller: girlData.seller || '',
      rating: girlData.rating || 5.0,
      price: girlData.price || '25000 ₽/час',
      category: girlData.category || 'Эскорт',
      image: girlData.image || '',
      verified: true,
      description: girlData.description,
      location: girlData.location,
      age: girlData.age,
      height: girlData.height,
      bodyType: girlData.bodyType,
      isActive: true,
      agencyId: girlData.agencyId,
      agencyName: girlData.agencyName,
      stats: {
        views: 0,
        bookings: 0,
        revenue: 0,
      },
    };
    
    setAgencyGirls([...agencyGirls, newGirl]);
    
    toast({
      title: "Анкета создана",
      description: `Анкета ${newGirl.title} добавлена в каталог`,
    });
  };

  const handleEditGirl = (girlId: number) => {
    const girl = agencyGirls.find(g => g.id === girlId);
    if (girl) {
      setEditingGirl(girl);
      setShowGirlForm(true);
    }
  };

  const handleUpdateGirl = (girlData: Partial<CatalogItem>) => {
    setAgencyGirls(agencyGirls.map(g => 
      g.id === girlData.id ? { ...g, ...girlData } : g
    ));
    
    toast({
      title: "Анкета обновлена",
      description: "Изменения успешно сохранены",
    });
  };

  const handleDeleteGirl = (girlId: number) => {
    setAgencyGirls(agencyGirls.filter(g => g.id !== girlId));
    
    toast({
      title: "Анкета удалена",
      description: "Анкета была успешно удалена",
    });
  };

  const handleToggleGirlActive = (girlId: number) => {
    setAgencyGirls(agencyGirls.map(g => 
      g.id === girlId ? { ...g, isActive: !g.isActive } : g
    ));
    
    const girl = agencyGirls.find(g => g.id === girlId);
    toast({
      title: girl?.isActive ? "Анкета деактивирована" : "Анкета активирована",
      description: girl?.isActive 
        ? "Анкета больше не отображается в каталоге"
        : "Анкета снова доступна для клиентов",
    });
  };

  const handleIncrementViews = (girlId: number) => {
    setAgencyGirls(agencyGirls.map(g => 
      g.id === girlId && g.stats ? { ...g, stats: { ...g.stats, views: g.stats.views + 1 } } : g
    ));
  };

  const handleTopUpWallet = (currency: string, amount: number) => {
    setWallet((prev) => ({
      balances: prev.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount + amount }
          : b
      )
    }));
    
    const transaction: Transaction = {
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      currency: currency as any,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      description: `Пополнение баланса ${currency}`,
    };
    
    setWalletTransactions([transaction, ...walletTransactions]);
    
    toast({
      title: "Баланс пополнен!",
      description: `+${amount.toLocaleString()} ${wallet.balances.find(b => b.currency === currency)?.symbol || currency}`,
    });
  };

  const handlePurchasePremium = (duration: number, price: number, currency: string) => {
    const balance = wallet.balances.find(b => b.currency === currency);
    if (!balance || balance.amount < price) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для покупки Premium",
        variant: "destructive",
      });
      return;
    }

    setWallet((prev) => ({
      balances: prev.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount - price }
          : b
      )
    }));

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    setProfile((prev) => ({
      ...prev,
      subscriptionType: 'premium',
      subscriptionExpiry: expiryDate.toISOString(),
    }));

    const transaction: Transaction = {
      id: Date.now(),
      type: 'vip_payment',
      amount: price,
      currency: currency as any,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      description: `Подписка Premium на ${duration} мес.`,
    };

    setWalletTransactions([transaction, ...walletTransactions]);

    toast({
      title: "🎉 Premium активирован!",
      description: `Подписка действует до ${expiryDate.toLocaleDateString('ru-RU')}`,
    });
  };

  const handlePurchaseLove = (rubAmount: number, loveAmount: number) => {
    setWallet((prev) => ({
      balances: prev.balances.map(b => {
        if (b.currency === 'RUB') return { ...b, amount: b.amount - rubAmount };
        if (b.currency === 'LOVE') return { ...b, amount: b.amount + loveAmount };
        return b;
      })
    }));
    
    const transaction: Transaction = {
      id: Date.now(),
      type: 'deposit',
      amount: loveAmount,
      currency: 'LOVE',
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      description: `Покупка ${loveAmount} LOVE за ${rubAmount} ₽`,
    };
    
    setWalletTransactions([transaction, ...walletTransactions]);
    
    toast({
      title: "💗 LOVE токены получены!",
      description: `+${loveAmount} LOVE за ${rubAmount.toLocaleString()} ₽`,
      duration: 5000,
    });
  };

  return {
    toggleFavorite,
    addNotification,
    handleBookingSubmit,
    handleSubmitReview,
    handleProfileUpdate,
    handleEnableNotifications,
    handlePurchasePremium,
    handleAgencyRegister,
    handleAgencyPayment,
    handleAddGirl,
    handleEditGirl,
    handleUpdateGirl,
    handleDeleteGirl,
    handleToggleGirlActive,
    handleIncrementViews,
    handleTopUpWallet,
    handlePurchaseLove,
  };
};