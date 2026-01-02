import funcUrls from '../../func2url.json';

const API_URLS = {
  auth: funcUrls.auth,
  catalog: funcUrls.catalog,
  businessServices: funcUrls['business-services'],
  cryptoDeposit: funcUrls['crypto-deposit']
};

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

class NetworkError extends Error {
  constructor(message: string, public isNetworkError: boolean = true) {
    super(message);
    this.name = 'NetworkError';
  }
}

async function fetchApi<T = any>(
  url: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
        throw new Error(data.error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        throw new NetworkError('Превышено время ожидания. Проверьте подключение к интернету.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        throw new NetworkError('Нет подключения к интернету. Проверьте соединение.');
      }
      
      throw error;
    }
  }
  
  throw new NetworkError('Не удалось выполнить запрос после нескольких попыток');
}

export { NetworkError };

export const authApi = {
  async register(email: string, password: string, username: string, role: 'buyer' | 'seller', businessType?: string) {
    return fetchApi<{ success: boolean; token: string; user: any }>(
      API_URLS.auth,
      {
        method: 'POST',
        body: JSON.stringify({ email, password, username, role, businessType })
      }
    );
  },

  async login(email: string, password: string) {
    return fetchApi<{ success: boolean; token: string; user: any }>(
      API_URLS.auth + '?action=login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    );
  },

  async getProfile() {
    return fetchApi<{ user: any }>(API_URLS.auth + '?action=profile');
  }
};

export const catalogApi = {
  async getItems(filters?: { location?: string; category?: string; active?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.location) params.append('location', filters.location);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.active !== undefined) params.append('active', filters.active.toString());

    return fetchApi<{ items: any[] }>(
      API_URLS.catalog + (params.toString() ? '?' + params.toString() : '')
    );
  },

  async createItem(item: {
    title: string;
    description: string;
    category: string;
    location: string;
    price?: number;
    images?: string[];
  }) {
    return fetchApi<{ success: boolean; item: any }>(
      API_URLS.catalog,
      {
        method: 'POST',
        body: JSON.stringify(item)
      }
    );
  },

  async updateItem(id: number, updates: Partial<any>) {
    return fetchApi<{ success: boolean; item: any }>(
      API_URLS.catalog,
      {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates })
      }
    );
  },

  async deleteItem(id: number) {
    return fetchApi<{ success: boolean }>(
      API_URLS.catalog,
      {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }
    );
  }
};

export const cryptoDepositApi = {
  async getDepositAddress(currency: string = 'BTC') {
    return fetchApi<{ success: boolean; deposit: any }>(
      API_URLS.cryptoDeposit + `?currency=${currency}`
    );
  },

  async getAllDepositAddresses() {
    return fetchApi<{ success: boolean; addresses: Record<string, any> }>(
      API_URLS.cryptoDeposit,
      {
        method: 'POST',
        body: JSON.stringify({ action: 'get_all_addresses' })
      }
    );
  }
};

export const businessServicesApi = {
  async getServices(status: 'active' | 'pending' | 'all' = 'active') {
    return fetchApi<{ services: any[] }>(
      API_URLS.businessServices + `?status=${status}`
    );
  },

  async createService(service: {
    categoryId: number;
    title: string;
    description: string;
    images?: string[];
  }) {
    return fetchApi<{ success: boolean; service: any }>(
      API_URLS.businessServices,
      {
        method: 'POST',
        body: JSON.stringify(service)
      }
    );
  },

  async updateService(id: number, updates: Partial<any>) {
    return fetchApi<{ success: boolean; service: any }>(
      API_URLS.businessServices,
      {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates })
      }
    );
  },

  async deleteService(id: number) {
    return fetchApi<{ success: boolean }>(
      API_URLS.businessServices,
      {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }
    );
  }
};