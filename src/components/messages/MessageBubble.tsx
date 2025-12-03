import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 select-none pointer-events-auto ${
          message.sender === 'me'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      >
        {message.attachment && message.attachment.type === 'image' && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img 
              src={message.attachment.url} 
              alt={message.attachment.name}
              className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity pointer-events-none"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
            />
          </div>
        )}
        
        {message.attachment && message.attachment.type === 'file' && (
          <div className="mb-2 p-3 rounded-lg bg-background/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center">
              <Icon name="FileText" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.attachment.name}</p>
              <p className="text-xs opacity-70">{message.attachment.size}</p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="shrink-0"
              onClick={() => window.open(message.attachment!.url, '_blank')}
            >
              <Icon name="Download" size={16} />
            </Button>
          </div>
        )}

        {message.attachment && message.attachment.type === 'audio' && (
          <div className="mb-2 p-3 rounded-lg bg-background/10">
            <audio controls className="w-full">
              <source src={message.attachment.url} type="audio/webm" />
            </audio>
          </div>
        )}

        {message.attachment && message.attachment.type === 'location' && message.attachment.location && (
          <div className="mb-2 p-3 rounded-lg bg-background/10">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="MapPin" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium">Геопозиция</p>
                <p className="text-xs opacity-70">
                  {message.attachment.location.lat.toFixed(6)}, {message.attachment.location.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(message.attachment!.url, '_blank')}
            >
              <Icon name="ExternalLink" size={14} className="mr-2" />
              Открыть на карте
            </Button>
          </div>
        )}
        
        {message.text && (
          <p className="text-sm leading-relaxed select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{message.text}</p>
        )}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${
            message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {message.time}
          </span>
          {message.sender === 'me' && (
            <Icon 
              name={message.read ? 'CheckCheck' : 'Check'} 
              size={14} 
              className={message.read ? 'text-primary-foreground' : 'text-primary-foreground/70'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
