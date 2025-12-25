import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  themeParams as tgThemeParams,
  viewport,
  backButton,
  mainButton,
  hapticFeedback,
  retrieveLaunchParams,
  type ThemeParams
} from '@telegram-apps/sdk';

interface InitDataUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface InitData {
  user?: InitDataUser;
}

interface TelegramContextType {
  initData: InitData | null;
  themeParams: ThemeParams | null;
  isReady: boolean;
  isTelegramEnv: boolean;
  userId: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  showBackButton: () => void;
  hideBackButton: () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);

  useEffect(() => {
    const initTelegram = async () => {
      try {
        const launchParams = retrieveLaunchParams();
        
        if (launchParams.platform === 'unknown') {
          console.log('Not running in Telegram environment');
          setIsTelegramEnv(false);
          setIsReady(true);
          return;
        }

        setIsTelegramEnv(true);

        if (launchParams.initData) {
          setInitData(launchParams.initData);
        }

        if (tgThemeParams.isSupported()) {
          tgThemeParams.mount();
          const params = tgThemeParams.state();
          setThemeParams(params);
          
          if (params) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', params.bgColor || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', params.textColor || '#000000');
            document.documentElement.style.setProperty('--tg-theme-hint-color', params.hintColor || '#999999');
            document.documentElement.style.setProperty('--tg-theme-link-color', params.linkColor || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-color', params.buttonColor || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', params.buttonTextColor || '#ffffff');
          }
        }

        try {
          if (viewport.isSupported()) {
            viewport.mount();
            viewport.expand();
          }
        } catch (e) {
          console.log('Viewport not available');
        }

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Telegram SDK:', error);
        setIsTelegramEnv(false);
        setIsReady(true);
      }
    };

    initTelegram();
  }, []);

  const showBackButton = () => {
    if (!isTelegramEnv) return;
    try {
      if (backButton.isSupported()) {
        backButton.mount();
        backButton.show();
      }
    } catch (e) {
      console.log('Back button not available');
    }
  };

  const hideBackButton = () => {
    if (!isTelegramEnv) return;
    try {
      if (backButton.isSupported()) {
        backButton.hide();
      }
    } catch (e) {
      console.log('Back button not available');
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (!isTelegramEnv) return;
    try {
      if (mainButton.isSupported()) {
        mainButton.mount();
        mainButton.setText(text);
        mainButton.on('click', onClick);
        mainButton.show();
      }
    } catch (e) {
      console.log('Main button not available');
    }
  };

  const hideMainButton = () => {
    if (!isTelegramEnv) return;
    try {
      if (mainButton.isSupported()) {
        mainButton.hide();
      }
    } catch (e) {
      console.log('Main button not available');
    }
  };

  const impactOccurred = (style: 'light' | 'medium' | 'heavy') => {
    if (!isTelegramEnv) return;
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.mount();
        hapticFeedback.impactOccurred(style);
      }
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  };

  const notificationOccurred = (type: 'error' | 'success' | 'warning') => {
    if (!isTelegramEnv) return;
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.mount();
        hapticFeedback.notificationOccurred(type);
      }
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  };

  const contextValue: TelegramContextType = {
    initData,
    themeParams,
    isReady,
    isTelegramEnv,
    userId: initData?.user?.id || null,
    username: initData?.user?.username || null,
    firstName: initData?.user?.firstName || null,
    lastName: initData?.user?.lastName || null,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    impactOccurred,
    notificationOccurred,
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
};