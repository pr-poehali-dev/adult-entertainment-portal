import { useState, useEffect } from 'react';
import { offlineDetector } from '@/utils/offlineDetector';

interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  body?: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_queue';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(offlineDetector.getStatus());
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const unsubscribe = offlineDetector.subscribe(setIsOnline);
    updateQueueSize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline]);

  const updateQueueSize = () => {
    const queue = getQueue();
    setQueueSize(queue.length);
  };

  const getQueue = (): OfflineQueueItem[] => {
    try {
      const queue = localStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  };

  const saveQueue = (queue: OfflineQueueItem[]) => {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      updateQueueSize();
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  };

  const addToQueue = (url: string, method: string, body?: any) => {
    const queue = getQueue();
    const item: OfflineQueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      url,
      method,
      body,
      timestamp: Date.now()
    };
    queue.push(item);
    saveQueue(queue);
  };

  const processQueue = async () => {
    const queue = getQueue();
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} queued requests...`);

    const failedItems: OfflineQueueItem[] = [];

    for (const item of queue) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: item.body ? JSON.stringify(item.body) : undefined
        });
        console.log('✓ Processed queued request:', item.url);
      } catch (error) {
        console.error('✗ Failed to process queued request:', item.url, error);
        failedItems.push(item);
      }
    }

    saveQueue(failedItems);
  };

  const clearQueue = () => {
    localStorage.removeItem(QUEUE_KEY);
    updateQueueSize();
  };

  return {
    isOnline,
    queueSize,
    addToQueue,
    processQueue,
    clearQueue
  };
};
