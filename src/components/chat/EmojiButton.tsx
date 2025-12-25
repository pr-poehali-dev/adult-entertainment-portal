import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { EmojiPicker } from './EmojiPicker';

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
  isPremium?: boolean;
}

export const EmojiButton = ({ onEmojiSelect, isPremium = false }: EmojiButtonProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShowPicker(!showPicker)}
        className="h-9 w-9"
      >
        <Icon name="Smile" size={20} />
      </Button>

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full mb-2 right-0 z-50"
        >
          <EmojiPicker onEmojiSelect={handleEmojiSelect} isPremium={isPremium} />
        </div>
      )}
    </div>
  );
};
