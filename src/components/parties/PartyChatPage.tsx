import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { PartyChat, ChatMessage, PartyApplication, CallStatus } from '@/types';

interface PartyChatPageProps {
  applicationId: number;
  currentUserId: number;
  isOrganizer: boolean;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onPaymentComplete?: () => void;
}

const PartyChatPage = ({ applicationId, currentUserId, isOrganizer, onBack, onApprove, onReject, onPaymentComplete }: PartyChatPageProps) => {
  const [messageText, setMessageText] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState<'interview' | 'approved' | 'rejected' | 'paid'>('interview');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      chatId: 1,
      senderId: isOrganizer ? currentUserId + 1 : currentUserId,
      senderName: isOrganizer ? 'Гость' : 'Вы',
      senderAvatar: '',
      type: 'system',
      content: 'Собеседование началось. Организатор может задать вам вопросы о вашей заинтересованности в мероприятии.',
      timestamp: new Date().toISOString(),
      read: true,
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Вы',
      senderAvatar: '',
      type: 'text',
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        chatId: 1,
        senderId: isOrganizer ? currentUserId + 1 : 1,
        senderName: isOrganizer ? 'Гость' : 'Организатор',
        senderAvatar: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
        type: 'text',
        content: isOrganizer
          ? 'Спасибо за ответ! Это важная информация.'
          : 'Благодарю за интерес! Расскажите немного о себе.',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCallActive(true);

    const callMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Система',
      senderAvatar: '',
      type: 'system',
      content: `${type === 'audio' ? 'Аудио' : 'Видео'} звонок начат`,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, callMessage]);
  };

  const handleEndCall = () => {
    const endMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Система',
      senderAvatar: '',
      type: 'system',
      content: `${callType === 'audio' ? 'Аудио' : 'Видео'} звонок завершен. Длительность: ${formatCallDuration(callDuration)}`,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, endMessage]);
    setIsCallActive(false);
    setCallType(null);
  };

  const handleApprove = () => {
    setApplicationStatus('approved');
    const approvalMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Система',
      senderAvatar: '',
      type: 'system',
      content: '✅ Заявка одобрена! Теперь можно оплатить билет.',
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, approvalMessage]);
    onApprove?.();
  };

  const handleReject = () => {
    setApplicationStatus('rejected');
    const rejectMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Система',
      senderAvatar: '',
      type: 'system',
      content: '❌ Заявка отклонена.',
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, rejectMessage]);
    onReject?.();
  };

  const handlePayment = () => {
    setApplicationStatus('paid');
    const paymentMessage: ChatMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: currentUserId,
      senderName: 'Система',
      senderAvatar: '',
      type: 'system',
      content: '💳 Оплата прошла успешно! Билет забронирован.',
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, paymentMessage]);
    onPaymentComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад к вечеринке
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <img
                        src="https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{isOrganizer ? 'Гость' : 'Организатор'}</h3>
                      <p className="text-sm text-muted-foreground">Собеседование</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCallActive ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStartCall('audio')}
                          title="Аудио звонок"
                        >
                          <Icon name="Phone" size={20} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStartCall('video')}
                          title="Видео звонок"
                        >
                          <Icon name="Video" size={20} />
                        </Button>
                      </>
                    ) : (
                      <Button variant="destructive" onClick={handleEndCall}>
                        <Icon name="PhoneOff" size={18} className="mr-2" />
                        Завершить ({formatCallDuration(callDuration)})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {isCallActive && (
                  <div className="mb-6 p-6 bg-primary/10 rounded-xl text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                      <Icon name={callType === 'video' ? 'Video' : 'Phone'} size={40} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      {callType === 'video' ? 'Видео звонок' : 'Аудио звонок'}
                    </h3>
                    <p className="text-muted-foreground">{formatCallDuration(callDuration)}</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'system' ? 'justify-center' : msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'system' ? (
                      <div className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground max-w-md text-center">
                        {msg.content}
                      </div>
                    ) : (
                      <div className={`flex gap-3 max-w-[70%] ${msg.senderId === currentUserId ? 'flex-row-reverse' : ''}`}>
                        {msg.senderId !== currentUserId && msg.senderAvatar && (
                          <Avatar className="w-8 h-8">
                            <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" />
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              msg.senderId === currentUserId
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-2">
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Напишите сообщение..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Статус заявки</h3>

                {applicationStatus === 'interview' && (
                  <>
                    <Badge className="mb-4">На собеседовании</Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      Организатор проводит собеседование. Используйте чат или звонки для общения.
                    </p>

                    {isOrganizer && (
                      <div className="space-y-2">
                        <Button className="w-full" onClick={handleApprove}>
                          <Icon name="Check" size={18} className="mr-2" />
                          Одобрить заявку
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={handleReject}>
                          <Icon name="X" size={18} className="mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {applicationStatus === 'approved' && (
                  <>
                    <Badge className="mb-4 bg-green-500">Одобрено</Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      Поздравляем! Ваша заявка одобрена. Теперь вы можете оплатить билет.
                    </p>

                    {!isOrganizer && (
                      <Button className="w-full" onClick={handlePayment}>
                        <Icon name="CreditCard" size={18} className="mr-2" />
                        Оплатить билет
                      </Button>
                    )}
                  </>
                )}

                {applicationStatus === 'rejected' && (
                  <>
                    <Badge className="mb-4 bg-red-500">Отклонено</Badge>
                    <p className="text-sm text-muted-foreground">
                      К сожалению, ваша заявка была отклонена организатором.
                    </p>
                  </>
                )}

                {applicationStatus === 'paid' && (
                  <>
                    <Badge className="mb-4 bg-blue-500">Оплачено</Badge>
                    <div className="text-center p-6 bg-green-500/10 rounded-lg">
                      <Icon name="CheckCircle" size={48} className="mx-auto mb-3 text-green-500" />
                      <p className="font-semibold mb-2">Билет забронирован!</p>
                      <p className="text-sm text-muted-foreground">
                        Вы успешно оплатили билет на вечеринку. До встречи!
                      </p>
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-3 text-sm">Информация о вечеринке</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Calendar" size={16} />
                      <span>15 декабря в 22:00</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span>Москва</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Sparkles" size={16} />
                      <span>Ретро 90-е</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyChatPage;
