import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import CreatePartyModal, { PartyFormData } from './CreatePartyModal';
import { PrivateParty } from '@/types';

interface PartiesPageProps {
  onPartyClick: (partyId: number) => void;
  currentUserId: number;
}

const PartiesPage = ({ onPartyClick, currentUserId }: PartiesPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [parties, setParties] = useState<PrivateParty[]>([
    {
      id: 1,
      organizerId: 1,
      organizerName: 'Анна Волкова',
      organizerAvatar: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      organizerRating: 4.9,
      title: 'Закрытая вечеринка для избранных',
      description: 'Эксклюзивная вечеринка в стиле 90-х. Живая музыка, премиальные напитки, интересные знакомства.',
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
      rules: ['Строгий фейс-контроль', 'Дресс-код: стиль 90-х', 'Полная конфиденциальность'],
      dresscode: 'Стиль 90-х',
      ageRestriction: '21+',
      isVerified: true,
      createdAt: '2024-12-01T10:00:00Z',
    },
    {
      id: 2,
      organizerId: 2,
      organizerName: 'Мария Соколова',
      organizerAvatar: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/cf786e95-b283-46c8-bd07-da6faa13ebcf.jpg',
      organizerRating: 4.7,
      title: 'Маскарад в венецианском стиле',
      description: 'Роскошная вечеринка-маскарад в атмосфере таинственности и элегантности.',
      city: 'Санкт-Петербург',
      date: '2024-12-20',
      time: '21:00',
      theme: 'Венецианский маскарад',
      maxTickets: 25,
      soldTickets: 8,
      ticketPrices: {
        female: 5000,
        couple: 12000,
        male: 8000,
      },
      currency: 'RUB',
      coverImage: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/cf786e95-b283-46c8-bd07-da6faa13ebcf.jpg',
      images: [],
      rules: ['Обязательно наличие маски', 'Элегантный наряд', 'Без фото и видео'],
      dresscode: 'Вечернее платье / Смокинг',
      ageRestriction: '25+',
      isVerified: true,
      createdAt: '2024-12-02T15:00:00Z',
    },
  ]);

  const [selectedCity, setSelectedCity] = useState('all');

  const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Сочи'];

  const handleCreateParty = (formData: PartyFormData) => {
    const newParty: PrivateParty = {
      id: Date.now(),
      organizerId: currentUserId,
      organizerName: 'Вы',
      organizerAvatar: '',
      organizerRating: 5.0,
      title: formData.title,
      description: formData.description,
      city: formData.city,
      date: formData.date,
      time: formData.time,
      theme: formData.theme,
      maxTickets: formData.maxTickets,
      soldTickets: 0,
      ticketPrices: formData.ticketPrices,
      currency: formData.currency,
      coverImage: formData.coverImage || 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      images: [],
      rules: formData.rules.filter(r => r.trim()),
      dresscode: formData.dresscode,
      ageRestriction: formData.ageRestriction,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    setParties([newParty, ...parties]);
    setShowCreateModal(false);
  };

  const filteredParties = parties.filter((party) => {
    const matchesSearch = 
      party.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === 'all' || party.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Приватные вечеринки</h1>
            <p className="text-muted-foreground">Эксклюзивные закрытые мероприятия</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            <Icon name="PartyPopper" size={20} className="mr-2" />
            Создать вечеринку
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, теме, городу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCity === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCity('all')}
            >
              Все города
            </Button>
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {filteredParties.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="PartyPopper" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Вечеринки не найдены</h3>
            <p className="text-muted-foreground mb-4">Попробуйте изменить параметры поиска</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParties.map((party) => (
              <Card
                key={party.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onPartyClick(party.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={party.coverImage}
                    alt={party.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    {party.isVerified && (
                      <Badge className="bg-blue-500">
                        <Icon name="BadgeCheck" size={14} className="mr-1" />
                        Проверено
                      </Badge>
                    )}
                    <Badge className="bg-purple-500">
                      {party.ageRestriction}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white">
                      <img
                        src={party.organizerAvatar}
                        alt={party.organizerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm">
                        <div className="font-semibold">{party.organizerName}</div>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={12} fill="currentColor" />
                          <span>{party.organizerRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{party.title}</h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      <span>{new Date(party.date).toLocaleDateString('ru-RU')} в {party.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} />
                      <span>{party.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={16} />
                      <span>{party.theme}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      <Icon name="Users" size={14} className="inline mr-1" />
                      {party.soldTickets}/{party.maxTickets} мест
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">От</div>
                      <div className="font-bold text-lg">
                        {Math.min(party.ticketPrices.female, party.ticketPrices.male, party.ticketPrices.couple).toLocaleString()} {getCurrencySymbol(party.currency)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreatePartyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateParty}
      />
    </div>
  );
};

export default PartiesPage;
