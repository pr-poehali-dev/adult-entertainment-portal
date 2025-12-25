import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SwipeHeaderProps {
  matches: number;
  viewedToday: number;
  freeLimit: number;
  isPremium: boolean;
  filteredProfilesCount: number;
  currentIndex: number;
  activeFiltersCount: number;
  onOpenFilters: () => void;
}

export default function SwipeHeader({
  matches,
  viewedToday,
  freeLimit,
  isPremium,
  filteredProfilesCount,
  currentIndex,
  activeFiltersCount,
  onOpenFilters,
}: SwipeHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Знакомства
        </h1>
        <div className="flex-1 flex justify-end">
          {!isPremium && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              {viewedToday}/{freeLimit}
            </Badge>
          )}
        </div>
      </div>
      {matches > 0 && (
        <Badge className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600">
          <Icon name="Heart" size={14} className="mr-1" />
          {matches} {matches === 1 ? 'совпадение' : 'совпадений'}
        </Badge>
      )}
      <Button
        variant="outline"
        className="w-full mt-4 bg-white/90 backdrop-blur-sm relative"
        onClick={onOpenFilters}
      >
        <Icon name="Filter" size={18} className="mr-2" />
        Фильтры поиска
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
