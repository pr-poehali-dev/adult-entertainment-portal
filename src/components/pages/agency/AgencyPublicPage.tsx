import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { useState } from 'react';

interface AgencyPublicPageProps {
  agencySlug: string;
  setCurrentPage: (page: Page) => void;
}

interface AgencyData {
  name: string;
  description: string;
  type: string;
  rating: number;
  verified: boolean;
  employeeCount: number;
  servicesCount: number;
  totalBookings: number;
  logo?: string;
  cover?: string;
  contacts: {
    phone?: string;
    telegram?: string;
    instagram?: string;
    website?: string;
  };
}

export const AgencyPublicPage = ({ agencySlug, setCurrentPage }: AgencyPublicPageProps) => {
  const [agency] = useState<AgencyData>({
    name: agencySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Премиальное агентство с проверенными специалистами и высоким уровнем сервиса. Работаем круглосуточно для вашего комфорта.',
    type: 'escort',
    rating: 4.8,
    verified: true,
    employeeCount: 24,
    servicesCount: 156,
    totalBookings: 1847,
    contacts: {
      phone: '+7 (900) 123-45-67',
      telegram: '@' + agencySlug,
      instagram: '@' + agencySlug,
      website: 'https://' + agencySlug + '.com'
    }
  });

  const getAgencyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      escort: 'Эскорт услуги',
      massage: 'Массаж',
      striptease: 'Стриптиз',
      virtual: 'Виртуальные услуги',
      realestate: 'Недвижимость'
    };
    return types[type] || 'Агентство';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div 
        className="h-64 bg-gradient-to-br from-purple-600 to-purple-400 relative"
        style={{
          backgroundImage: agency.cover ? `url(${agency.cover})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => setCurrentPage('home')}
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
                  {agency.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{agency.name}</h1>
                    {agency.verified && (
                      <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Icon name="CheckCircle" size={16} />
                        <span className="text-sm font-medium">Верифицировано</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-1">{getAgencyTypeLabel(agency.type)}</p>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Icon name="Star" size={18} />
                    <span className="font-semibold text-lg">{agency.rating}</span>
                    <span className="text-muted-foreground text-sm">({agency.totalBookings} отзывов)</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{agency.description}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary mb-1">{agency.employeeCount}</div>
                    <p className="text-sm text-muted-foreground">Специалистов</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary mb-1">{agency.servicesCount}</div>
                    <p className="text-sm text-muted-foreground">Услуг</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary mb-1">{agency.totalBookings}</div>
                    <p className="text-sm text-muted-foreground">Бронирований</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Phone" size={20} className="text-primary" />
                Контакты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agency.contacts.phone && (
                <a 
                  href={`tel:${agency.contacts.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon name="Phone" size={20} className="text-muted-foreground" />
                  <span>{agency.contacts.phone}</span>
                </a>
              )}
              {agency.contacts.telegram && (
                <a 
                  href={`https://t.me/${agency.contacts.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon name="Send" size={20} className="text-muted-foreground" />
                  <span>{agency.contacts.telegram}</span>
                </a>
              )}
              {agency.contacts.instagram && (
                <a 
                  href={`https://instagram.com/${agency.contacts.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon name="Instagram" size={20} className="text-muted-foreground" />
                  <span>{agency.contacts.instagram}</span>
                </a>
              )}
              {agency.contacts.website && (
                <a 
                  href={agency.contacts.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon name="Globe" size={20} className="text-muted-foreground" />
                  <span>{agency.contacts.website}</span>
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} className="text-primary" />
                О компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Преимущества</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                    <span className="text-sm text-muted-foreground">Проверенные специалисты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                    <span className="text-sm text-muted-foreground">Работаем круглосуточно</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                    <span className="text-sm text-muted-foreground">Конфиденциальность гарантирована</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                    <span className="text-sm text-muted-foreground">Гибкая система скидок</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} className="text-primary" />
              Наши специалисты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Список специалистов появится здесь</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
