import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface HealthCertificateStatusProps {
  expiry: string | null;
}

export const HealthCertificateStatus = ({ expiry }: HealthCertificateStatusProps) => {
  if (!expiry) return null;

  const expiryDate = new Date(expiry);
  const now = new Date();
  const isExpired = expiryDate < now;
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 14 && daysLeft > 0;

  if (isExpired) {
    return (
      <Alert className="border-red-500 bg-red-500/10">
        <AlertDescription className="text-sm text-red-600 flex items-center gap-2">
          <Icon name="XCircle" size={16} />
          Срок действия справки истек {expiryDate.toLocaleDateString('ru-RU')}
        </AlertDescription>
      </Alert>
    );
  }

  if (isExpiringSoon) {
    return (
      <Alert className="border-yellow-500 bg-yellow-500/10">
        <AlertDescription className="text-sm text-yellow-600 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} />
          Срок действия справки истекает через {daysLeft} дней ({expiryDate.toLocaleDateString('ru-RU')})
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-500 bg-green-500/10">
      <AlertDescription className="text-sm text-green-600 flex items-center gap-2">
        <Icon name="CheckCircle" size={16} />
        Справка действительна до {expiryDate.toLocaleDateString('ru-RU')} (осталось {daysLeft} дней)
      </AlertDescription>
    </Alert>
  );
};
