import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';

export const useAppSettingsState = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewServiceName, setReviewServiceName] = useState('');
  const [showLovePurchase, setShowLovePurchase] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { toast } = useToast();
  const { playNotificationSound, playBalanceSound, soundEnabled, setSoundEnabled } = useNotificationSound();

  return {
    isDarkTheme,
    setIsDarkTheme,
    showReviewModal,
    setShowReviewModal,
    reviewServiceName,
    setReviewServiceName,
    showLovePurchase,
    setShowLovePurchase,
    showPremiumModal,
    setShowPremiumModal,
    showNotifications,
    setShowNotifications,
    toast,
    playNotificationSound,
    playBalanceSound,
    soundEnabled,
    setSoundEnabled,
  };
};
