import { useEffect } from 'react';
import { useTelegram } from '@/contexts/TelegramProvider';

export const TelegramThemeAdapter = () => {
  const { themeParams, isTelegramEnv } = useTelegram();

  useEffect(() => {
    if (!isTelegramEnv || !themeParams) {
      return;
    }

    const isDark = themeParams.bgColor ? 
      parseInt(themeParams.bgColor.slice(1), 16) < 0x888888 : false;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const root = document.documentElement;
    
    if (themeParams.bgColor) {
      root.style.setProperty('--background', themeParams.bgColor);
    }
    
    if (themeParams.textColor) {
      root.style.setProperty('--foreground', themeParams.textColor);
    }
    
    if (themeParams.buttonColor) {
      root.style.setProperty('--primary', themeParams.buttonColor);
    }
    
    if (themeParams.buttonTextColor) {
      root.style.setProperty('--primary-foreground', themeParams.buttonTextColor);
    }
    
    if (themeParams.hintColor) {
      root.style.setProperty('--muted-foreground', themeParams.hintColor);
    }
    
    if (themeParams.linkColor) {
      root.style.setProperty('--accent', themeParams.linkColor);
    }

    if (themeParams.secondaryBgColor) {
      root.style.setProperty('--card', themeParams.secondaryBgColor);
    }

  }, [themeParams, isTelegramEnv]);

  return null;
};
