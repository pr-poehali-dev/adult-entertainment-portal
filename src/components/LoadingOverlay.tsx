import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay = ({ isLoading, message = 'Загрузка...' }: LoadingOverlayProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-card rounded-lg shadow-2xl p-6 flex flex-col items-center gap-4 min-w-[200px] animate-scale-in">
        <div className="relative">
          <Icon 
            name="Loader2" 
            size={40} 
            className="text-primary animate-spin"
          />
        </div>
        <p className="text-foreground font-medium text-center">{message}</p>
      </div>
    </div>
  );
};
