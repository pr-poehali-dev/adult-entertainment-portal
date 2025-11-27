import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface HealthCertificateBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export const HealthCertificateBadge = ({ size = 'md' }: HealthCertificateBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <Badge className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none ${sizeClasses[size]}`}>
      <Icon name="Heart" size={iconSize[size]} className="fill-current" />
      Здоровый продавец
    </Badge>
  );
};
