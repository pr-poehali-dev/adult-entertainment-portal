import { useState } from 'react';
import { BrandEmoji, BrandEmojiCategory } from '@/types';
import { brandEmojis } from '@/data/brandEmojis';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isPremium?: boolean;
}

const categories: { id: BrandEmojiCategory; label: string; icon: string }[] = [
  { id: 'love', label: 'Любовь', icon: 'Heart' },
  { id: 'flirt', label: 'Флирт', icon: 'Smile' },
  { id: 'hot', label: 'Горячо', icon: 'Flame' },
  { id: 'party', label: 'Тусовка', icon: 'PartyPopper' },
  { id: 'vip', label: 'VIP', icon: 'Crown' },
  { id: 'money', label: 'Деньги', icon: 'DollarSign' },
];

export const EmojiPicker = ({ onEmojiSelect, isPremium = false }: EmojiPickerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<BrandEmojiCategory>('love');

  const filteredEmojis = brandEmojis.filter(emoji => {
    if (emoji.category !== selectedCategory) return false;
    if (emoji.isPremium && !isPremium) return false;
    return true;
  });

  const handleEmojiClick = (emoji: BrandEmoji) => {
    if (emoji.isPremium && !isPremium) {
      return;
    }
    onEmojiSelect(emoji.emoji);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg w-80 max-h-96 flex flex-col">
      <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-shrink-0',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
            title={category.label}
          >
            <Icon name={category.icon as any} size={16} />
            <span className="text-xs">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 p-3 overflow-y-auto flex-1">
        {filteredEmojis.map(emoji => (
          <button
            key={emoji.id}
            onClick={() => handleEmojiClick(emoji)}
            disabled={emoji.isPremium && !isPremium}
            className={cn(
              'relative flex items-center justify-center text-3xl p-2 rounded-lg transition-all',
              emoji.isPremium && !isPremium
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-muted hover:scale-110 active:scale-95'
            )}
            title={emoji.name}
          >
            {emoji.emoji}
            {emoji.isPremium && (
              <Icon 
                name="Crown" 
                size={12} 
                className="absolute top-0 right-0 text-yellow-500"
              />
            )}
          </button>
        ))}
      </div>

      {!isPremium && (
        <div className="p-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Crown" size={12} className="text-yellow-500" />
            <span>Premium эмодзи доступны только VIP пользователям</span>
          </div>
        </div>
      )}
    </div>
  );
};
