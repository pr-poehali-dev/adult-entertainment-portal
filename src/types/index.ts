export type Page = 'home' | 'catalog' | 'profile' | 'register' | 'search' | 'favorites' | 'messages' | 'rules' | 'service' | 'seller-profile';
export type UserRole = 'buyer' | 'seller' | null;

export interface Profile {
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
  verified: boolean;
}

export interface CatalogItem {
  id: number;
  title: string;
  seller: string;
  rating: number;
  price: string;
  category: string;
  image: string;
  verified: boolean;
  description?: string;
  features?: string[];
  duration?: string;
  location?: string;
  sellerId?: number;
}

export interface SellerProfile {
  id: number;
  name: string;
  rating: number;
  verified: boolean;
  avatar: string;
  coverImage: string;
  age: number;
  location: string;
  languages: string[];
  about: string;
  services: string[];
  portfolio: { id: number; image: string; title: string; }[];
  stats: {
    bookings: number;
    responseTime: string;
    repeatClients: number;
  };
  availability: string[];
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

export interface Notification {
  id: number;
  type: 'message' | 'booking' | 'review' | 'system';
  title: string;
  text: string;
  time: string;
  read: boolean;
}