import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { EnhancedMessageInput } from './EnhancedMessageInput';
import { ChatWatermark } from './ChatWatermark';
import { MessageBubble } from './MessageBubble';
import { ContactCensorshipNotice } from './ContactCensorshipNotice';
import { Chat, Message } from './types';

interface ChatWindowProps {
  selectedChat: Chat | undefined;
  currentMessages: Message[];
  messageText: string;
  setMessageText: (text: string) => void;
  selectedFiles: File[];
  onSendMessage: () => void;
  onFileSelect: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onAddAudio: (audioBlob: Blob) => void;
  onAddLocation: (location: { lat: number; lng: number }) => void;
  isPremium?: boolean;
}

export const ChatWindow = ({
  selectedChat,
  currentMessages,
  messageText,
  setMessageText,
  selectedFiles,
  onSendMessage,
  onFileSelect,
  onRemoveFile,
  onAddAudio,
  onAddLocation,
  isPremium = false,
}: ChatWindowProps) => {
  if (!selectedChat) {
    return (
      <Card className="lg:col-span-2 bg-card border-border flex flex-col items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Выберите чат</h3>
          <p className="text-muted-foreground">Выберите беседу из списка, чтобы начать общение</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 bg-card border-border flex flex-col relative overflow-hidden">
      <ChatWatermark userName={selectedChat?.name} />
      <CardHeader className="pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedChat.avatar}
              </AvatarFallback>
            </Avatar>
            {selectedChat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedChat.online ? 'В сети' : 'Не в сети'}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 chat-protected select-none relative z-20">
        <ContactCensorshipNotice />
        {currentMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </CardContent>
      
      <Separator />
      
      <EnhancedMessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSendMessage={onSendMessage}
        onFileSelect={onFileSelect}
        selectedFiles={selectedFiles}
        onRemoveFile={onRemoveFile}
        onAddAudio={onAddAudio}
        onAddLocation={onAddLocation}
        isPremium={isPremium}
      />
    </Card>
  );
};