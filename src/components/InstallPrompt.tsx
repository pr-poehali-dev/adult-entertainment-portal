import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);

    if (isIOSDevice && !isInStandaloneMode) {
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  if (!isIOS || isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
      <Card className="bg-gradient-to-r from-primary/90 to-secondary/90 border-2 border-white/20 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Icon name="Crown" size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">
                Установите Elite на iPhone
              </h3>
              <p className="text-white/90 text-sm mb-3">
                Откройте приложение одним касанием с домашнего экрана
              </p>
              <div className="flex items-center gap-2 text-white/90 text-xs mb-3">
                <span>1. Нажмите</span>
                <Icon name="Share" size={16} className="text-white" />
                <span>внизу экрана</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <span>2. Выберите "На экран домой"</span>
                <Icon name="Plus" size={16} className="text-white" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
