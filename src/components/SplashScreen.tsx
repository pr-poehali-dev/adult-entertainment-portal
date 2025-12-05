import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
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
          className="w-32 h-32 mx-auto mb-8 relative"
          style={{ 
            animation: 'pulse 2s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))'
          }}
        >
          <Icon name="Crown" size={128} className="text-primary" />
        </div>
        
        <h1 
          className="text-6xl font-bold text-primary mb-3"
          style={{ 
            letterSpacing: '2px',
            animation: 'fadeIn 1s ease-out 0.3s both'
          }}
        >
          Elite
        </h1>
        
        <p 
          className="text-lg text-gray-500"
          style={{ animation: 'fadeIn 1s ease-out 0.6s both' }}
        >
          Premium Services
        </p>
        
        <div 
          className="w-12 h-12 mx-auto mt-10 border-3 border-primary/20 border-t-primary rounded-full"
          style={{ 
            animation: 'spin 1s linear infinite, fadeIn 1s ease-out 0.9s both',
            borderWidth: '3px'
          }}
        />
      </div>
    </div>
  );
};