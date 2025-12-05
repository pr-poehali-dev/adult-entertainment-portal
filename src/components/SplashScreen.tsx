import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('hasLoadedBefore');
    setIsInitialLoad(!hasLoadedBefore);
    
    if (!hasLoadedBefore) {
      sessionStorage.setItem('hasLoadedBefore', 'true');
    }

    const standalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    const isPWA = standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isPWA);

    if (isPWA || !hasLoadedBefore) {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsVisible(false), 300);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    } else {
      setIsVisible(false);
    }
  }, []);

  if ((!isStandalone && !isInitialLoad) || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ 
        animation: isVisible ? 'none' : 'fadeOut 0.5s ease-out forwards',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="text-center px-4" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        <div 
          className="w-48 h-48 mx-auto mb-8 relative flex items-center justify-center"
          style={{ 
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <img 
            src="https://cdn.poehali.dev/files/eb44749d-b270-4ce8-8ff5-baa7f8487a4a.png" 
            alt="Love is..."
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="w-full max-w-xs mx-auto mt-10 px-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
              }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            {Math.round(Math.min(progress, 100))}%
          </p>
        </div>
      </div>
    </div>
  );
};