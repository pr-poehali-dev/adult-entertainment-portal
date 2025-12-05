import { useEffect } from 'react';
import { UserRole, Notification, Wallet } from '@/types';
import { notificationService } from '@/utils/notificationService';

interface EffectsProps {
  userRole: UserRole;
  notifications: Notification[];
  wallet: Wallet;
  setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
  walletTransactions: any[];
  setWalletTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  playBalanceSound: () => void;
  addNotification: (type: any, title: string, text: string, options?: any) => void;
  setCurrentPage: (page: any) => void;
  toast: any;
  selectedPartyId: number | null;
  setSelectedApplicationId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const useIndexEffects = (props: EffectsProps) => {
  const {
    userRole,
    notifications,
    wallet,
    setWallet,
    walletTransactions,
    setWalletTransactions,
    playBalanceSound,
    addNotification,
    setCurrentPage,
    toast,
    selectedPartyId,
    setSelectedApplicationId,
  } = props;

  // Инициализация сервиса уведомлений
  useEffect(() => {
    notificationService.initialize();
  }, []);

  // Симуляция уведомлений
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
          
          const loveBonus = referralData.level === 1 ? 100 : referralData.level === 2 ? 50 : 25;
          
          setWallet(prev => ({
            ...prev,
            balances: prev.balances.map(b => {
              if (b.currency === 'RUB') return { ...b, amount: b.amount + randomAmount };
              if (b.currency === 'LOVE') return { ...b, amount: b.amount + loveBonus };
              return b;
            })
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
            `Заработано ${randomAmount} ₽ + ${loveBonus} 💗 с реферала ${referralData.level} линии`,
            { amount: randomAmount, currency: 'RUB', referralLevel: referralData.level }
          );
          
          toast({
            title: "💗 LOVE бонус получен!",
            description: `+${loveBonus} LOVE за реферала ${referralData.level} линии`,
            duration: 5000,
          });
        } else {
          const title = referralData.level === 1 ? 'Новый реферал!' : 
                       referralData.level === 2 ? 'Реферал 2 линии' : 
                       'Реферал 3 линии';
          
          const loveBonus = referralData.level === 1 ? 100 : referralData.level === 2 ? 50 : 25;
          
          setWallet(prev => ({
            ...prev,
            balances: prev.balances.map(b => 
              b.currency === 'LOVE' ? { ...b, amount: b.amount + loveBonus } : b
            )
          }));
          
          addNotification(
            'referral',
            title,
            `${randomName} ${referralData.text} (${referralData.level} линия) +${loveBonus} 💗`,
            { referralLevel: referralData.level }
          );
          
          toast({
            title: "💗 Новый реферал!",
            description: `${randomName} присоединился! Вы получили ${loveBonus} LOVE`,
            duration: 5000,
          });
        }
      } else {
        const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];
        addNotification(randomType, randomType === 'message' ? 'Новое сообщение' : randomType === 'booking' ? 'Бронирование' : randomType === 'review' ? 'Новый отзыв' : 'Системное уведомление', randomMessage);
      }
    };

    const intervalId = setInterval(simulateNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [userRole, notifications]);

  // Обработка уведомлений о заявках на вечеринку
  useEffect(() => {
    const handlePartyApplication = (notification: Notification) => {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      toast({
        title: notification.title,
        description: notification.text,
        duration: 7000,
        action: notification.type === 'party_application' ? {
          label: 'Перейти',
          onClick: () => {
            setCurrentPage('organizer-dashboard');
          },
        } : undefined,
      });
    };

    // В реальном приложении здесь была бы подписка на события
    // Сейчас просто держим функцию готовой к использованию
  }, [selectedPartyId, toast, setCurrentPage]);
};