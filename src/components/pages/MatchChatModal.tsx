import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MatchChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchName: string;
  matchPhoto: string;
  onSendMessage: (message: string) => void;
}

export default function MatchChatModal({
  isOpen,
  onClose,
  matchName,
  matchPhoto,
  onSendMessage,
}: MatchChatModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const quickMessages = [
    'Привет! 👋',
    'Как дела?',
    'Расскажи о себе',
    'Может встретимся? ☕',
  ];

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <Card className="w-full max-w-md p-6 animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={matchPhoto}
              alt={matchName}
              className="w-full h-full rounded-full object-cover border-4 border-pink-500"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <Icon name="Heart" size={16} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Это взаимно! 💕</h2>
          <p className="text-muted-foreground">
            Теперь вы можете написать {matchName}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Быстрые сообщения</label>
            <div className="grid grid-cols-2 gap-2">
              {quickMessages.map((msg, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => {
                    onSendMessage(msg);
                    onClose();
                  }}
                  className="text-sm h-auto py-2"
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Или напишите своё</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Написать позже
          </Button>
        </div>
      </Card>
    </div>
  );
}
