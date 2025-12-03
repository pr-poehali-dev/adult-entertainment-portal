import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { EnhancedMessageInput } from '@/components/messages/EnhancedMessageInput';
import { ChatWatermark } from '@/components/messages/ChatWatermark';

interface Message {
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

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

const MessagesPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const handleScreenshotPrevention = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
        alert('Скриншоты запрещены в чате для защиты конфиденциальности');
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.chat-protected')) {
        e.preventDefault();
        return false;
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() || '';
      const target = (e.target as HTMLElement)?.closest('.chat-protected');
      if (target && selection) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleScreenshotPrevention);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('keydown', handleScreenshotPrevention);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Анна',
      lastMessage: 'Спасибо за интерес! Готова ответить на вопросы',
      time: '14:23',
      unread: 2,
      avatar: 'А',
      online: true
    },
    {
      id: 2,
      name: 'Мария',
      lastMessage: 'Да, это время мне подходит',
      time: '12:45',
      unread: 0,
      avatar: 'М',
      online: true
    },
    {
      id: 3,
      name: 'Виктория',
      lastMessage: 'Встретимся завтра в 18:00?',
      time: 'Вчера',
      unread: 0,
      avatar: 'В',
      online: false
    },
    {
      id: 4,
      name: 'Диана',
      lastMessage: 'Отлично, жду подтверждения',
      time: '25 ноя',
      unread: 1,
      avatar: 'Д',
      online: false
    }
  ]);

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Здравствуйте! Интересует ваша услуга VIP сопровождения', sender: 'me', time: '14:15', read: true },
      { id: 2, text: 'Здравствуйте! Спасибо за интерес. Буду рада ответить на все вопросы', sender: 'other', time: '14:18', read: true },
      { id: 3, text: 'Какие варианты встречи возможны?', sender: 'me', time: '14:20', read: true },
      { 
        id: 4, 
        text: 'Вот пример моего портфолио', 
        sender: 'other', 
        time: '14:22', 
        read: false,
        attachment: {
          type: 'image',
          name: 'portfolio.jpg',
          url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          size: '2.4 MB'
        }
      },
      { id: 5, text: 'Предлагаю встречу в ресторане или приватную обстановку. Обсудим детали лично', sender: 'other', time: '14:23', read: false },
      { id: 6, text: 'Спасибо за интерес! Готова ответить на вопросы', sender: 'other', time: '14:23', read: false }
    ],
    2: [
      { id: 1, text: 'Добрый день! Хотел бы забронировать встречу', sender: 'me', time: '12:30', read: true },
      { id: 2, text: 'Здравствуйте! Какое время вас интересует?', sender: 'other', time: '12:35', read: true },
      { id: 3, text: 'Завтра вечером, около 19:00', sender: 'me', time: '12:40', read: true },
      { id: 4, text: 'Да, это время мне подходит', sender: 'other', time: '12:45', read: true }
    ],
    3: [
      { id: 1, text: 'Привет! Как твои дела?', sender: 'other', time: 'Вчера 18:00', read: true },
      { id: 2, text: 'Отлично! Встретимся завтра в 18:00?', sender: 'other', time: 'Вчера 18:05', read: true }
    ],
    4: [
      { id: 1, text: 'Подтверждаете бронирование?', sender: 'me', time: '25 ноя 16:30', read: true },
      { id: 2, text: 'Отлично, жду подтверждения', sender: 'other', time: '25 ноя 16:45', read: true }
    ]
  });

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (files: FileList) => {
    setSelectedFiles(Array.from(files));
  };

  const handleAddAudio = (audioBlob: Blob) => {
    if (!selectedChatId) return;
    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const newMessage: Message = {
      id: Date.now(),
      text: 'Аудиосообщение',
      sender: 'me',
      time: currentTime,
      read: true,
      attachment: {
        type: 'audio',
        name: 'audio.webm',
        url: URL.createObjectURL(audioBlob),
      }
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: '🎤 Аудиосообщение', time: currentTime }
        : chat
    ));
  };

  const handleAddLocation = (location: { lat: number; lng: number }) => {
    if (!selectedChatId) return;
    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const newMessage: Message = {
      id: Date.now(),
      text: 'Геопозиция',
      sender: 'me',
      time: currentTime,
      read: true,
      attachment: {
        type: 'location',
        name: 'location',
        url: `https://www.google.com/maps?q=${location.lat},${location.lng}`,
        location: location,
      }
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: '📍 Геопозиция', time: currentTime }
        : chat
    ));
  };

  const handleSendMessage = () => {
    if ((!messageText.trim() && selectedFiles.length === 0) || !selectedChatId) return;

    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        const isImage = file.type.startsWith('image/');
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          text: messageText || (isImage ? 'Изображение' : 'Файл'),
          sender: 'me',
          time: currentTime,
          read: true,
          attachment: {
            type: isImage ? 'image' : 'file',
            name: file.name,
            url: URL.createObjectURL(file),
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
          }
        };

        setMessages(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
        }));
      });
      
      setSelectedFiles([]);
    } else {
      const newMessage: Message = {
        id: Date.now(),
        text: messageText,
        sender: 'me',
        time: currentTime,
        read: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
      }));
    }

    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: messageText || 'Вложение', time: currentTime }
        : chat
    ));

    setMessageText('');
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-wide mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Сообщения</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        <Card className="lg:col-span-1 bg-card border-border flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle>Чаты</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="px-4 pb-4">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedChatId === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    
                    {chat.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground min-w-[20px] h-5 flex items-center justify-center">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border flex flex-col relative overflow-hidden">
          <ChatWatermark userName={selectedChat?.name} />
          {selectedChat ? (
            <>
              <CardHeader className="pb-4 relative z-20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.online ? 'В сети' : 'Не в сети'}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Icon name="MoreVertical" size={20} />
                  </Button>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 chat-protected select-none relative z-20">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 select-none pointer-events-auto ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                    >
                      {message.attachment && message.attachment.type === 'image' && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          <img 
                            src={message.attachment.url} 
                            alt={message.attachment.name}
                            className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity pointer-events-none"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                          />
                        </div>
                      )}
                      
                      {message.attachment && message.attachment.type === 'file' && (
                        <div className="mb-2 p-3 rounded-lg bg-background/10 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center">
                            <Icon name="FileText" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                            <p className="text-xs opacity-70">{message.attachment.size}</p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="shrink-0"
                            onClick={() => window.open(message.attachment!.url, '_blank')}
                          >
                            <Icon name="Download" size={16} />
                          </Button>
                        </div>
                      )}

                      {message.attachment && message.attachment.type === 'audio' && (
                        <div className="mb-2 p-3 rounded-lg bg-background/10">
                          <audio controls className="w-full">
                            <source src={message.attachment.url} type="audio/webm" />
                          </audio>
                        </div>
                      )}

                      {message.attachment && message.attachment.type === 'location' && message.attachment.location && (
                        <div className="mb-2 p-3 rounded-lg bg-background/10">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon name="MapPin" size={20} className="text-primary" />
                            <div>
                              <p className="text-sm font-medium">Геопозиция</p>
                              <p className="text-xs opacity-70">
                                {message.attachment.location.lat.toFixed(6)}, {message.attachment.location.lng.toFixed(6)}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(message.attachment!.url, '_blank')}
                          >
                            <Icon name="ExternalLink" size={14} className="mr-2" />
                            Открыть на карте
                          </Button>
                        </div>
                      )}
                      
                      {message.text && (
                        <p className="text-sm leading-relaxed select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{message.text}</p>
                      )}
                      
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`text-xs ${
                          message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </span>
                        {message.sender === 'me' && (
                          <Icon 
                            name={message.read ? 'CheckCheck' : 'Check'} 
                            size={14} 
                            className={message.read ? 'text-primary-foreground' : 'text-primary-foreground/70'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              <Separator />
              
              <EnhancedMessageInput
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                onRemoveFile={removeSelectedFile}
                onAddAudio={handleAddAudio}
                onAddLocation={handleAddLocation}
              />
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <Icon name="MessageCircle" size={64} className="mx-auto text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold">Выберите чат</h3>
                <p className="text-muted-foreground">Выберите диалог из списка слева</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;