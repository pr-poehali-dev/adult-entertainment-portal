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
    <div className="relative flex flex-col items-center justify-center gap-8 py-12">
      <div className="relative">
        <Icon 
          name="Heart" 
          size={120}
          className={`text-red-500 fill-red-500 transition-transform duration-300 ${
            beat ? 'scale-125' : 'scale-100'
          }`}
        />
      </div>
      
      <h1 
        className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
        style={{
          textShadow: '0 2px 10px rgba(234, 179, 8, 0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.05em'
        }}
      >
        WELCOME
      </h1>
    </div>
  );
};
