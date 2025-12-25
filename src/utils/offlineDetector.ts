export class OfflineDetector {
  private static instance: OfflineDetector;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.init();
  }

  static getInstance(): OfflineDetector {
    if (!OfflineDetector.instance) {
      OfflineDetector.instance = new OfflineDetector();
    }
    return OfflineDetector.instance;
  }

  private init() {
    window.addEventListener('online', () => {
      console.log('🟢 Online');
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      console.log('🔴 Offline');
      this.isOnline = false;
      this.notifyListeners(false);
    });

    this.checkConnection();
    setInterval(() => this.checkConnection(), 30000);
  }

  private async checkConnection() {
    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      const online = response.ok;
      if (this.isOnline !== online) {
        this.isOnline = online;
        this.notifyListeners(online);
      }
    } catch {
      if (this.isOnline) {
        this.isOnline = false;
        this.notifyListeners(false);
      }
    }
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => listener(isOnline));
  }

  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isOnline);
    return () => this.listeners.delete(listener);
  }

  getStatus(): boolean {
    return this.isOnline;
  }
}

export const offlineDetector = OfflineDetector.getInstance();
