import { useState, useEffect } from 'react';
import { offlineDetector } from '@/utils/offlineDetector';
import Icon from '@/components/ui/icon';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(offlineDetector.getStatus());
  const [showOffline, setShowOffline] = useState(false);
  const [manuallyHidden, setManuallyHidden] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineDetector.subscribe((online) => {
      setIsOnline(online);
      if (!online) {
        setShowOffline(true);
        setManuallyHidden(false);
      } else {
        setTimeout(() => setShowOffline(false), 3000);
      }
    });

    return unsubscribe;
  }, []);

  if (manuallyHidden || (!showOffline && isOnline)) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isOnline
          ? 'translate-y-0'
          : 'translate-y-0 animate-fade-out'
      }`}
      style={{
        animation: !isOnline ? 'none' : 'slideUp 0.3s ease-out 2.7s forwards'
      }}
    >
      <div
        className={`${
          !isOnline
            ? 'bg-red-500'
            : 'bg-green-500'
        } text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg relative`}
      >
        <Icon 
          name={!isOnline ? 'WifiOff' : 'Wifi'} 
          size={18} 
          className={!isOnline ? '' : 'animate-pulse'}
        />
        {!isOnline ? (
          <>
            <span>Нет подключения к интернету</span>
            <span className="text-xs opacity-90">• Работа в offline-режиме</span>
          </>
        ) : (
          <span>Подключение восстановлено ✓</span>
        )}
        {!isOnline && (
          <button
            onClick={() => setManuallyHidden(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Скрыть уведомление"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};