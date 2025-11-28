import { useState } from 'react';
import { PrivateAlbum } from '@/types';
import Icon from '@/components/ui/icon';

interface PinCodeModalProps {
  album: PrivateAlbum;
  onClose: () => void;
  onSuccess: () => void;
}

export function PinCodeModal({ album, onClose, onSuccess }: PinCodeModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    if (newPin.every(digit => digit !== '')) {
      const enteredPin = newPin.join('');
      if (enteredPin === album.pinCode) {
        setTimeout(() => onSuccess(), 300);
      } else {
        setError('Неверный PIN-код');
        setTimeout(() => {
          setPin(['', '', '', '']);
          setError('');
          const firstInput = document.getElementById('pin-0');
          firstInput?.focus();
        }, 1000);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Введите PIN-код</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Введите 4-значный PIN-код для доступа к альбому
            </p>
            <p className="font-semibold mt-1">{album.title}</p>
          </div>

          <div className="flex gap-3 justify-center">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  error ? 'border-destructive' : 'border-border'
                }`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 justify-center text-destructive text-sm">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>PIN-код был отправлен продавцом после покупки</p>
          </div>
        </div>
      </div>
    </div>
  );
}
