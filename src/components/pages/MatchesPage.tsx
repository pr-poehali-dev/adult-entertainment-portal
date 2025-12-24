import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface Match {
  id: number;
  name: string;
  age: number;
  photo: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  matchedAt: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  time: string;
}

const mockMatches: Match[] = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastMessage: 'Привет! Как дела?',
    lastMessageTime: '10 мин назад',
    unreadCount: 2,
    online: true,
    matchedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Мария',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    lastMessage: 'Спасибо за интересную беседу!',
    lastMessageTime: '1 час назад',
    unreadCount: 0,
    online: true,
    matchedAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'Елена',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    lastMessage: 'Увидимся завтра?',
    lastMessageTime: '3 часа назад',
    unreadCount: 1,
    online: false,
    matchedAt: '2024-01-13',
  },
  {
    id: 4,
    name: 'Ольга',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    lastMessage: 'Было приятно познакомиться',
    lastMessageTime: 'Вчера',
    unreadCount: 0,
    online: false,
    matchedAt: '2024-01-12',
  },
];

const mockMessages: { [key: number]: Message[] } = {
  1: [
    { id: 1, senderId: 1, text: 'Привет! 👋', time: '14:30' },
    { id: 2, senderId: 0, text: 'Привет! Рад знакомству', time: '14:32' },
    { id: 3, senderId: 1, text: 'Как дела?', time: '14:35' },
  ],
  2: [
    { id: 1, senderId: 0, text: 'Расскажи о себе', time: '10:15' },
    { id: 2, senderId: 2, text: 'Я художница, люблю кофе и музыку', time: '10:20' },
    { id: 3, senderId: 2, text: 'Спасибо за интересную беседу!', time: '10:45' },
  ],
  3: [
    { id: 1, senderId: 3, text: 'Привет! Может встретимся? ☕', time: '09:00' },
    { id: 2, senderId: 0, text: 'Звучит интересно! Когда тебе удобно?', time: '09:15' },
    { id: 3, senderId: 3, text: 'Увидимся завтра?', time: '09:20' },
  ],
};

interface MatchesPageProps {
  setCurrentPage?: (page: string) => void;
}

export default function MatchesPage({ setCurrentPage }: MatchesPageProps) {
  const [matches] = useState<Match[]>(mockMatches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setMessages(mockMessages[match.id] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const newMsg: Message = {
      id: messages.length + 1,
      senderId: 0,
      text: newMessage,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-24">
        <div className="max-w-2xl mx-auto h-[calc(100vh-180px)] flex flex-col">
          <div className="bg-card border-b border-border p-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMatch(null)}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div className="relative">
              <img
                src={selectedMatch.photo}
                alt={selectedMatch.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {selectedMatch.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">
                {selectedMatch.name}, {selectedMatch.age}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedMatch.online ? 'В сети' : 'Не в сети'}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Совпадение {new Date(selectedMatch.matchedAt).toLocaleDateString('ru-RU')}
              </Badge>
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.senderId === 0
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === 0 ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Совпадения
          </h1>
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени..."
              className="pl-10"
            />
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="Heart" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Пока нет совпадений</h2>
            <p className="text-muted-foreground mb-4">
              Продолжайте свайпать, чтобы найти свою пару!
            </p>
            <Button
              onClick={() => setCurrentPage?.('swipe')}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Начать свайпать
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <Card
                key={match.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectMatch(match)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={match.photo}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {match.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">
                        {match.name}, {match.age}
                      </h3>
                      {match.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {match.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {match.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {match.lastMessageTime}
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage?.('swipe')}
            className="gap-2"
          >
            <Icon name="Heart" size={20} />
            Продолжить свайпать
          </Button>
        </div>
      </div>
    </div>
  );
}
