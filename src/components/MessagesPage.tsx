import { useState, useEffect } from 'react';
import { ChatList } from '@/components/messages/ChatList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { Chat, Message } from '@/components/messages/types';

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
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onChatSelect={setSelectedChatId}
        />

        <ChatWindow
          selectedChat={selectedChat}
          currentMessages={currentMessages}
          messageText={messageText}
          setMessageText={setMessageText}
          selectedFiles={selectedFiles}
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onAddAudio={handleAddAudio}
          onAddLocation={handleAddLocation}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
