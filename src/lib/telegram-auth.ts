import FUNC_URLS from '../../backend/func2url.json';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramAuthResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    telegram_id: number;
    avatar_url?: string;
  };
  new_user?: boolean;
}

export const telegramAuthApi = {
  async authenticate(telegramData: TelegramUser): Promise<TelegramAuthResponse> {
    const response = await fetch(FUNC_URLS['telegram-auth'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка авторизации через Telegram');
    }

    return response.json();
  },
};

export const loadTelegramWidget = (
  botUsername: string,
  onAuth: (user: TelegramUser) => void
) => {
  if ((window as any).Telegram?.Login) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.async = true;
  script.setAttribute('data-telegram-login', botUsername);
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-radius', '8');
  script.setAttribute('data-request-access', 'write');
  script.setAttribute('data-userpic', 'true');
  script.setAttribute('data-onauth', 'onTelegramAuth(user)');

  (window as any).onTelegramAuth = onAuth;

  return script;
};
