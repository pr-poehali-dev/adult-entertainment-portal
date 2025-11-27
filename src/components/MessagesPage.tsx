import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
  attachment?: {
    type: 'image' | 'file';
    name: string;
    url: string;
    size?: string;
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
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [chats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Анна Смирнова',
      lastMessage: 'Спасибо за интерес! Готова ответить на вопросы',
      time: '14:23',
      unread: 2,
      avatar: 'АС',
      online: true
    },
    {
      id: 2,
      name: 'Виктория Лебедева',
      lastMessage: 'Да, это время мне подходит',
      time: '12:45',
      unread: 0,
      avatar: 'ВЛ',
      online: true
    },
    {
      id: 3,
      name: 'Елена Романова',
      lastMessage: 'Встретимся завтра в 18:00?',
      time: 'Вчера',
      unread: 0,
      avatar: 'ЕР',
      online: false
    },
    {
      id: 4,
      name: 'Марина Волкова',
      lastMessage: 'Отлично, жду подтверждения',
      time: '25 ноя',
      unread: 1,
      avatar: 'МВ',
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSendMessage = () => {
    if ((!messageText.trim() && selectedFiles.length === 0) || !selectedChatId) return;

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        const isImage = file.type.startsWith('image/');
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          text: messageText || (isImage ? 'Изображение' : 'Файл'),
          sender: 'me',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
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
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        read: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
      }));
    }

    setMessageText('');
    setShowAttachmentMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
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

        <Card className="lg:col-span-2 bg-card border-border flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="pb-4">
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
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.attachment && message.attachment.type === 'image' && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          <img 
                            src={message.attachment.url} 
                            alt={message.attachment.name}
                            className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.attachment!.url, '_blank')}
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
                      
                      {message.text && (
                        <p className="text-sm leading-relaxed">{message.text}</p>
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
              
              <div className="p-4">
                {selectedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="p-2 pr-8 rounded-lg bg-muted flex items-center gap-2 max-w-[200px]">
                          <Icon name={file.type.startsWith('image/') ? 'Image' : 'FileText'} size={16} />
                          <span className="text-xs truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 relative"
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    >
                      <Icon name="Paperclip" size={20} />
                    </Button>
                    
                    {showAttachmentMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                        <button
                          onClick={() => {
                            document.getElementById('file-upload')?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                        >
                          <Icon name="Image" size={20} className="text-primary" />
                          <div>
                            <p className="text-sm font-medium">Изображение</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG, GIF</p>
                          </div>
                        </button>
                        <Separator />
                        <button
                          onClick={() => {
                            document.getElementById('file-upload')?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                        >
                          <Icon name="FileText" size={20} className="text-primary" />
                          <div>
                            <p className="text-sm font-medium">Документ</p>
                            <p className="text-xs text-muted-foreground">PDF, DOC, TXT</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Напишите сообщение..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-background border-border pr-20"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() && selectedFiles.length === 0}
                    >
                      <Icon name="Send" size={18} className={messageText.trim() || selectedFiles.length > 0 ? "text-primary" : "text-muted-foreground"} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 px-2">
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Icon name="Shield" size={14} />
                    Безопасный чат
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Icon name="Lock" size={14} />
                    Шифрование E2E
                  </button>
                </div>
              </div>
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