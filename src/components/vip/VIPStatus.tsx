import { VIPBadge } from './VIPBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { VIPStatus as VIPStatusType } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface VIPStatusProps {
  status: VIPStatusType;
  expiry: string | null;
}

export const VIPStatus = ({ status, expiry }: VIPStatusProps) => {
  const { t } = useLanguage();
  
  if (status === 'none') return null;
  
  const now = new Date();
  const expiryDate = expiry ? new Date(expiry) : null;
  const isExpired = expiryDate && expiryDate < now;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  return (
    <Alert className={isExpired ? 'border-destructive bg-destructive/10' : 'border-yellow-500 bg-yellow-500/10'}>
      <div className="flex items-center gap-2">
        <VIPBadge size="md" />
        <AlertDescription className="flex-1">
          {isExpired ? (
            <span className="text-destructive font-semibold">{t.vip.expired}</span>
          ) : expiryDate ? (
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Calendar" size={14} />
              <span>{t.vip.expiresOn}: {expiryDate.toLocaleDateString()}</span>
              {daysLeft <= 7 && (
                <span className="text-yellow-600 font-semibold">
                  ({daysLeft} {t.vip.daysLeft})
                </span>
              )}
            </div>
          ) : null}
        </AlertDescription>
      </div>
    </Alert>
  );
};
