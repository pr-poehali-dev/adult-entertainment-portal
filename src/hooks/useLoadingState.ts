import { useState, useCallback } from 'react';
import { offlineDetector } from '@/utils/offlineDetector';

interface LoadingState {
  isLoading: boolean;
  message: string;
}

export const useLoadingState = () => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    message: 'Загрузка...'
  });

  const startLoading = useCallback((message = 'Загрузка...') => {
    if (!offlineDetector.getStatus()) {
      setState({ isLoading: true, message: 'Нет подключения к интернету' });
      setTimeout(() => {
        setState({ isLoading: false, message: '' });
      }, 2000);
      return false;
    }
    setState({ isLoading: true, message });
    return true;
  }, []);

  const stopLoading = useCallback(() => {
    setState({ isLoading: false, message: '' });
  }, []);

  const withLoading = useCallback(
    async <T>(
      action: () => Promise<T>,
      message = 'Загрузка...'
    ): Promise<T | null> => {
      if (!startLoading(message)) {
        return null;
      }

      try {
        const result = await action();
        stopLoading();
        return result;
      } catch (error) {
        stopLoading();
        throw error;
      }
    },
    [startLoading, stopLoading]
  );

  return {
    ...state,
    startLoading,
    stopLoading,
    withLoading
  };
};
