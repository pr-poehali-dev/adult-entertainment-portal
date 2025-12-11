import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export const HeartbeatWelcome = () => {
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 300);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      <div className="relative">
        <Icon 
          name="Heart" 
          size={120}
          className={`text-red-500 fill-red-500 transition-transform duration-300 ${
            beat ? 'scale-125' : 'scale-100'
          }`}
        />
      </div>
    </div>
  );
};