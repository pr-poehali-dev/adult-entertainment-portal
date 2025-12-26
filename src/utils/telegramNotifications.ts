import { Notification } from '@/types';

const TELEGRAM_NOTIFY_URL = 'https://functions.poehali.dev/5980907d-bf59-4a27-8437-bf63085bc1b6';

export interface TelegramNotificationOptions {
  chatId: number;
  notification: Omit<Notification, 'id' | 'time' | 'read'>;
  actionUrl?: string;
}

export const sendTelegramNotification = async (options: TelegramNotificationOptions): Promise<boolean> => {
  try {
    const { chatId, notification, actionUrl } = options;
    
    let message = `<b>${notification.title}</b>\n${notification.text}`;
    
    if (notification.amount && notification.currency) {
      message += `\n\n💰 Сумма: ${notification.amount} ${notification.currency}`;
    }
    
    if (notification.moderatorNote) {
      message += `\n\n📝 Примечание: ${notification.moderatorNote}`;
    }
    
    const response = await fetch(TELEGRAM_NOTIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
        type: notification.type,
        actionUrl: actionUrl || getDefaultActionUrl(notification)
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

function getDefaultActionUrl(notification: Omit<Notification, 'id' | 'time' | 'read'>): string | undefined {
  switch (notification.type) {
    case 'message':
      return '#messages';
    case 'booking':
      return '#bookings';
    case 'review':
      return '#profile';
    case 'referral':
      return '#referral';
    case 'party_application':
      return notification.partyId ? `#party-detail/${notification.partyId}` : '#parties';
    case 'ad_response':
      return notification.adId ? `#my-ads/${notification.adId}` : '#my-ads';
    case 'audio_approved':
    case 'audio_rejected':
    case 'photo_approved':
    case 'photo_rejected':
      return '#profile';
    case 'system':
    default:
      return undefined;
  }
}

export const checkTelegramAvailability = (): boolean => {
  try {
    return window?.Telegram?.WebApp !== undefined;
  } catch {
    return false;
  }
};

export const getTelegramChatId = (): number | null => {
  try {
    return window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || null;
  } catch {
    return null;
  }
};
