import { useTelegram } from '@/contexts/TelegramProvider';

const TELEGRAM_BOT_URL = 'https://functions.poehali.dev/05a886f0-8259-4934-933b-0f3e1e110704';

export interface TelegramPaymentOptions {
  chatId: number;
  amount: number;
  currency?: string;
  title: string;
  description: string;
  payload?: Record<string, any>;
}

export interface TelegramPaymentResult {
  success: boolean;
  message_id?: number;
  error?: string;
}

export const createTelegramInvoice = async (
  options: TelegramPaymentOptions
): Promise<TelegramPaymentResult> => {
  try {
    const response = await fetch(TELEGRAM_BOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create_invoice',
        chatId: options.chatId,
        amount: options.amount,
        currency: options.currency || 'RUB',
        title: options.title,
        description: options.description,
        payload: options.payload || {}
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to create invoice'
      };
    }

    const result = await response.json();
    return {
      success: true,
      message_id: result.message_id
    };
  } catch (error) {
    console.error('Error creating Telegram invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const checkTelegramPaymentsAvailability = (): boolean => {
  try {
    return !!window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  } catch {
    return false;
  }
};

export const getTelegramUserId = (): number | null => {
  try {
    return window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || null;
  } catch {
    return null;
  }
};

export const useTelegramPayments = () => {
  const { userId, isTelegramEnv } = useTelegram();

  const createInvoice = async (
    amount: number,
    title: string,
    description: string,
    payload?: Record<string, any>
  ) => {
    if (!isTelegramEnv || !userId) {
      return {
        success: false,
        error: 'Not running in Telegram environment'
      };
    }

    return createTelegramInvoice({
      chatId: userId,
      amount,
      title,
      description,
      payload
    });
  };

  return {
    isAvailable: isTelegramEnv && !!userId,
    createInvoice,
    userId
  };
};
