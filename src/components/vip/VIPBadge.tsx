import { Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VIPBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VIPBadge = ({ size = 'md', showText = true }: VIPBadgeProps) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  };
  
  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-full`}>
      <Crown size={iconSize[size]} className="fill-current" />
      {showText && t.vip.badge}
    </span>
  );
};
