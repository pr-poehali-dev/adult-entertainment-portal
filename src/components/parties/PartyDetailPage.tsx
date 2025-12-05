import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { PrivateParty, PartyApplication } from '@/types';

interface PartyDetailPageProps {
  partyId: number;
  currentUserId: number;
  onBack: () => void;
  onStartChat: (applicationId: number) => void;
}

const PartyDetailPage = ({ partyId, currentUserId, onBack, onStartChat }: PartyDetailPageProps) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'couple'>('male');
  const [hasApplied, setHasApplied] = useState(false);

  const party: PrivateParty = {
    id: partyId,
    organizerId: 1,
    organizerName: 'Анна Волкова',
    organizerAvatar: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
    organizerRating: 4.9,
    title: 'Закрытая вечеринка для избранных',
    description: 'Эксклюзивная вечеринка в стиле 90-х. Живая музыка, премиальные напитки, интересные знакомства. Вечеринка пройдет в частном особняке с панорамным видом на город. В программе: DJ-сет, живая музыка, интерактивные развлечения.',
    city: 'Москва',
    date: '2024-12-15',
    time: '22:00',
    theme: 'Ретро 90-е',
    maxTickets: 30,
    soldTickets: 12,
    ticketPrices: {
      female: 3000,
      couple: 8000,
      male: 6000,
    },
    currency: 'RUB',
    coverImage: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
    images: [],
    rules: [
      'Строгий фейс-контроль - обязательное собеседование с организатором',
      'Дресс-код: стиль 90-х (джинсы, кроссовки, яркие аксессуары)',
      'Полная конфиденциальность - запрещена фото и видеосъемка',
      'Уважительное отношение ко всем гостям',
      'Употребление алкоголя в меру'
    ],
    dresscode: 'Стиль 90-х',
    ageRestriction: '21+',
    isVerified: true,
    createdAt: '2024-12-01T10:00:00Z',
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const handleApply = () => {
    setHasApplied(true);
    const applicationId = Date.now();
    setTimeout(() => {
      onStartChat(applicationId);
    }, 500);
  };

  const getPrice = () => {
    return party.ticketPrices[selectedGender];
  };

  const getGenderLabel = () => {
    switch (selectedGender) {
      case 'female': return 'Девушка';
      case 'couple': return 'Пара';
      case 'male': return 'Мужчина';
    }
  };

  const isOrganizer = currentUserId === party.organizerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад к вечеринкам
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={party.coverImage}
                alt={party.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                {party.isVerified && (
                  <Badge className="bg-blue-500">
                    <Icon name="BadgeCheck" size={14} className="mr-1" />
                    Проверено
                  </Badge>
                )}
                <Badge className="bg-purple-500">{party.ageRestriction}</Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <h1 className="text-4xl font-bold text-white mb-2">{party.title}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={18} />
                    <span>{new Date(party.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {party.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={18} />
                    <span>{party.city}</span>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={party.organizerAvatar}
                    alt={party.organizerName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{party.organizerName}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Star" size={16} fill="currentColor" className="text-yellow-500" />
                      <span>{party.organizerRating} • Организатор</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Icon name="Info" size={20} />
                      О вечеринке
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{party.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Sparkles" size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Тема</div>
                        <div className="font-semibold">{party.theme}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Свободно мест</div>
                        <div className="font-semibold">{party.maxTickets - party.soldTickets} из {party.maxTickets}</div>
                      </div>
                    </div>

                    {party.dresscode && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="Shirt" size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Дресс-код</div>
                          <div className="font-semibold">{party.dresscode}</div>
                        </div>
                      </div>
                    )}

                    {party.ageRestriction && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="ShieldCheck" size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Возраст</div>
                          <div className="font-semibold">{party.ageRestriction}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Icon name="Shield" size={20} />
                      Правила вечеринки
                    </h3>
                    <ul className="space-y-2">
                      {party.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <Icon name="Check" size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Бронирование билета</h3>

                {!isOrganizer ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div>
                        <Label className="text-sm mb-2 block">Тип билета</Label>
                        <Select value={selectedGender} onValueChange={(v: any) => setSelectedGender(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">
                              <div className="flex items-center justify-between w-full">
                                <span>Девушка</span>
                                <span className="ml-4 font-semibold">{party.ticketPrices.female.toLocaleString()} {getCurrencySymbol(party.currency)}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="couple">
                              <div className="flex items-center justify-between w-full">
                                <span>Пара</span>
                                <span className="ml-4 font-semibold">{party.ticketPrices.couple.toLocaleString()} {getCurrencySymbol(party.currency)}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="male">
                              <div className="flex items-center justify-between w-full">
                                <span>Мужчина</span>
                                <span className="ml-4 font-semibold">{party.ticketPrices.male.toLocaleString()} {getCurrencySymbol(party.currency)}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Стоимость билета:</span>
                        <span className="text-2xl font-bold">{getPrice().toLocaleString()} {getCurrencySymbol(party.currency)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!hasApplied ? (
                        <>
                          <Button className="w-full" size="lg" onClick={handleApply}>
                            <Icon name="MessageCircle" size={20} className="mr-2" />
                            Начать собеседование
                          </Button>
                          <p className="text-xs text-center text-muted-foreground">
                            Для участия требуется собеседование с организатором. После одобрения появится кнопка оплаты.
                          </p>
                        </>
                      ) : (
                        <div className="text-center p-4 bg-green-500/10 rounded-lg">
                          <Icon name="Check" size={32} className="mx-auto mb-2 text-green-500" />
                          <p className="font-semibold">Заявка отправлена!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Организатор получил вашу заявку. Открыт чат для собеседования.
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Icon name="ShieldCheck" size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Безопасная оплата через эскроу</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="Lock" size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Полная конфиденциальность</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="MessageCircle" size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Поддержка 24/7</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Icon name="Crown" size={48} className="mx-auto mb-4 text-yellow-500" />
                    <h4 className="font-semibold mb-2">Ваша вечеринка</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Вы организатор этого мероприятия
                    </p>
                    <Button variant="outline" className="w-full">
                      <Icon name="Users" size={18} className="mr-2" />
                      Заявки ({party.soldTickets})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className, ...props }: any) => (
  <label className={`text-sm font-medium ${className || ''}`} {...props}>
    {children}
  </label>
);

export default PartyDetailPage;
