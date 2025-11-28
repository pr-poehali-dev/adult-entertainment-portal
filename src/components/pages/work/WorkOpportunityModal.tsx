import { useState } from 'react';
import { WorkOpportunity } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ApplyModal, ApplicationData } from './ApplyModal';

interface WorkOpportunityModalProps {
  work: WorkOpportunity;
  onClose: () => void;
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  return symbols[currency] || currency;
};

export const WorkOpportunityModal = ({ work, onClose }: WorkOpportunityModalProps) => {
  const { toast } = useToast();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleContact = () => {
    toast({
      title: 'Контакт скопирован',
      description: `${work.contactInfo} скопирован в буфер обмена`,
    });
    navigator.clipboard.writeText(work.contactInfo);
  };

  const handleApply = (applicationData: ApplicationData) => {
    console.log('Application submitted:', applicationData);
    toast({
      title: 'Отклик отправлен!',
      description: 'Ваша заявка отправлена работодателю',
    });
    setShowApplyModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 overflow-hidden">
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-white" />
          </button>
          {work.isVerified && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Icon name="ShieldCheck" size={16} />
              Проверенная компания
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-3xl font-bold mb-2">{work.title}</h2>
            {work.company && (
              <p className="text-lg text-white/90">{work.company}</p>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="Wallet" size={18} />
                <span className="text-sm font-medium">Оплата</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {work.paymentAmount.toLocaleString()} {getCurrencySymbol(work.currency)}+
              </div>
              <div className="text-xs text-muted-foreground mt-1">{work.payment}</div>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="Clock" size={18} />
                <span className="text-sm font-medium">Длительность</span>
              </div>
              <div className="text-lg font-bold">{work.duration}</div>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="MapPin" size={18} />
                <span className="text-sm font-medium">Локация</span>
              </div>
              <div className="text-lg font-bold">{work.location}</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="FileText" size={20} />
              Описание
            </h3>
            <p className="text-muted-foreground leading-relaxed">{work.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="CheckCircle" size={20} />
              Требования
            </h3>
            <ul className="space-y-2">
              {work.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Icon name="Check" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Опубликовано {new Date(work.postedDate).toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowApplyModal(true)} className="flex-1 gap-2" size="lg">
                <Icon name="Send" size={18} />
                Откликнуться на вакансию
              </Button>
              <Button onClick={handleContact} variant="outline" size="lg" className="gap-2">
                <Icon name="MessageCircle" size={18} />
                {work.contactInfo}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          work={work}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
        />
      )}
    </div>
  );
};