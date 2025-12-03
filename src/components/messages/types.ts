export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
  attachment?: {
    type: 'image' | 'file' | 'audio' | 'location';
    name: string;
    url: string;
    size?: string;
    duration?: string;
    location?: { lat: number; lng: number };
  };
}

export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}
