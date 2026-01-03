import { createContext, useContext, ReactNode } from 'react';

interface TelegramContextType {
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
  const contextValue: TelegramContextType = {
    isReady: true,
    isTelegramEnv: false,
    userId: null,
    username: null,
    firstName: null,
    lastName: null,
    showBackButton: () => {},
    hideBackButton: () => {},
    showMainButton: () => {},
    hideMainButton: () => {},
    impactOccurred: () => {},
    notificationOccurred: () => {},
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
};