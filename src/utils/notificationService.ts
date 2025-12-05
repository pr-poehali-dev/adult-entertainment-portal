import { Notification } from '@/types';

// Звуки уведомлений
const NOTIFICATION_SOUNDS = {
  message: '/sounds/message.mp3',
  booking: '/sounds/booking.mp3',
  ad_response: '/sounds/ad_response.mp3',
  system: '/sounds/system.mp3',
};

class NotificationService {
  private audio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private permissionGranted = false;

  // Инициализация сервиса
  async initialize() {
    if (this.isInitialized) return;

    // Запрос разрешения на уведомления
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
    }

    // Запрос разрешения на вибрацию (автоматически доступно на мобильных)
    if ('vibrate' in navigator) {
      console.log('Vibration API доступен');
    }

    this.isInitialized = true;
  }

  // Воспроизведение звука
  private playSound(type: keyof typeof NOTIFICATION_SOUNDS) {
    try {
      const soundUrl = NOTIFICATION_SOUNDS[type] || NOTIFICATION_SOUNDS.system;
      this.audio = new Audio(soundUrl);
      this.audio.volume = 0.5;
      this.audio.play().catch(err => {
        console.log('Не удалось воспроизвести звук:', err);
      });
    } catch (error) {
      console.log('Ошибка воспроизведения звука:', error);
    }
  }

  // Вибрация
  private vibrate(pattern: number | number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Push-уведомление
  private showPushNotification(title: string, body: string, icon?: string) {
    if (!this.permissionGranted || !('Notification' in window)) {
      return;
    }

    try {
      const notification = new window.Notification(title, {
        body,
        icon: icon || '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        tag: 'notification-' + Date.now(),
        requireInteraction: false,
      });

      // Автоматически закрыть через 5 секунд
      setTimeout(() => notification.close(), 5000);

      // Обработчик клика
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.log('Ошибка создания push-уведомления:', error);
    }
  }

  // Главный метод для отправки уведомления
  notify(notification: Notification) {
    // Определяем тип вибрации в зависимости от типа уведомления
    let vibrationPattern: number | number[] = [200];
    let soundType: keyof typeof NOTIFICATION_SOUNDS = 'system';

    switch (notification.type) {
      case 'ad_response':
        vibrationPattern = [200, 100, 200, 100, 200]; // Длинная вибрация
        soundType = 'ad_response';
        break;
      case 'message':
        vibrationPattern = [100, 50, 100]; // Короткая вибрация
        soundType = 'message';
        break;
      case 'booking':
        vibrationPattern = [300, 100, 300]; // Средняя вибрация
        soundType = 'booking';
        break;
      case 'system':
      case 'review':
      case 'referral':
      case 'party_application':
        vibrationPattern = [200];
        soundType = 'system';
        break;
    }

    // Воспроизводим звук
    this.playSound(soundType);

    // Вибрация
    this.vibrate(vibrationPattern);

    // Push-уведомление
    this.showPushNotification(
      notification.title,
      notification.text,
      '/logo.png'
    );
  }

  // Метод для запроса разрешений при действии пользователя
  async requestPermissions() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }
    return this.permissionGranted;
  }

  // Проверка, предоставлены ли разрешения
  hasPermissions() {
    return this.permissionGranted;
  }

  // Тестовое уведомление
  testNotification() {
    this.notify({
      id: Date.now(),
      type: 'system',
      title: 'Тестовое уведомление',
      text: 'Уведомления работают! Вы услышите звук, почувствуете вибрацию и увидите push.',
      time: new Date().toISOString(),
      read: false,
    });
  }
}

// Экспортируем единственный экземпляр
export const notificationService = new NotificationService();
