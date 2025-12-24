export class PushNotificationService {
  private static instance: PushNotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Браузер не поддерживает уведомления');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  async showNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      badge?: string;
      image?: string;
      tag?: string;
      data?: any;
      requireInteraction?: boolean;
      silent?: boolean;
    }
  ): Promise<Notification | null> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      return null;
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200],
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        if (options?.data?.url) {
          window.location.href = options.data.url;
        }
      };

      return notification;
    } catch (error) {
      console.error('Ошибка создания уведомления:', error);
      return null;
    }
  }

  showMessageNotification(
    senderName: string,
    message: string,
    senderPhoto?: string
  ): Promise<Notification | null> {
    return this.showNotification(`💬 ${senderName}`, {
      body: message,
      icon: senderPhoto || '/icon-192x192.png',
      tag: `message-${senderName}`,
      requireInteraction: true,
      data: {
        url: '/matches',
      },
    });
  }

  showMatchNotification(
    matchName: string,
    matchPhoto?: string
  ): Promise<Notification | null> {
    return this.showNotification(`💕 Новое совпадение!`, {
      body: `Вы понравились друг другу с ${matchName}`,
      icon: matchPhoto || '/icon-192x192.png',
      tag: `match-${matchName}`,
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 400],
      data: {
        url: '/matches',
      },
    });
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}

export const pushNotificationService = PushNotificationService.getInstance();