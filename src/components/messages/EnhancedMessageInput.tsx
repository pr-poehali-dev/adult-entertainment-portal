import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { hasCensoredContent } from '@/utils/contactCensorship';

interface EnhancedMessageInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  onFileSelect: (files: FileList) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  onAddAudio: (audioBlob: Blob) => void;
  onAddLocation: (location: { lat: number; lng: number }) => void;
}

export const EnhancedMessageInput = ({
  messageText,
  setMessageText,
  onSendMessage,
  onFileSelect,
  selectedFiles,
  onRemoveFile,
  onAddAudio,
  onAddLocation,
}: EnhancedMessageInputProps) => {
  const { toast } = useToast();
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAddAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: 'Аудио записано',
          description: `Длительность: ${recordingTime} сек`,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast({
        title: 'Ошибка доступа к микрофону',
        description: 'Разрешите доступ к микрофону в настройках браузера',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      streamRef.current = stream;
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (error) {
      toast({
        title: 'Ошибка доступа к камере',
        description: 'Разрешите доступ к камере в настройках браузера',
        variant: 'destructive',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            onFileSelect(dataTransfer.files);
            
            toast({
              title: 'Фото сделано',
            });
          }
        }, 'image/jpeg', 0.9);
      }
      
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const shareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onAddLocation({ lat: latitude, lng: longitude });
          
          toast({
            title: 'Геопозиция отправлена',
            description: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        },
        (error) => {
          toast({
            title: 'Ошибка определения местоположения',
            description: 'Разрешите доступ к геолокации в настройках браузера',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Геолокация недоступна',
        description: 'Ваш браузер не поддерживает геолокацию',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4">
      {showCamera && (
        <div className="mb-4 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button onClick={capturePhoto} size="lg" className="rounded-full">
              <Icon name="Camera" size={24} />
            </Button>
            <Button onClick={closeCamera} variant="destructive" size="lg" className="rounded-full">
              <Icon name="X" size={24} />
            </Button>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="p-2 pr-8 rounded-lg bg-muted flex items-center gap-2 max-w-[200px]">
                <Icon name={file.type.startsWith('image/') ? 'Image' : 'FileText'} size={16} />
                <span className="text-xs truncate">{file.name}</span>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isRecording && (
        <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Запись аудио...</span>
          </div>
          <span className="text-sm font-mono">{recordingTime} сек</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => e.target.files && onFileSelect(e.target.files)}
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 relative"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          >
            <Icon name="Paperclip" size={20} />
          </Button>
          
          {showAttachmentMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 min-w-[200px]">
              <button
                onClick={() => {
                  document.getElementById('file-upload')?.click();
                  setShowAttachmentMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
              >
                <Icon name="Image" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Фото/Видео</p>
                  <p className="text-xs text-muted-foreground">Из галереи</p>
                </div>
              </button>
              <Separator />
              <button
                onClick={() => {
                  openCamera();
                  setShowAttachmentMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
              >
                <Icon name="Camera" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Камера</p>
                  <p className="text-xs text-muted-foreground">Сделать фото</p>
                </div>
              </button>
              <Separator />
              <button
                onClick={() => {
                  shareLocation();
                  setShowAttachmentMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
              >
                <Icon name="MapPin" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Геопозиция</p>
                  <p className="text-xs text-muted-foreground">Поделиться местом</p>
                </div>
              </button>
              <Separator />
              <button
                onClick={() => {
                  document.getElementById('file-upload')?.click();
                  setShowAttachmentMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
              >
                <Icon name="FileText" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Документ</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, TXT</p>
                </div>
              </button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={isRecording ? stopRecording : startRecording}
        >
          <Icon name={isRecording ? 'Square' : 'Mic'} size={20} className={isRecording ? 'text-red-500' : ''} />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            placeholder="Напишите сообщение..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`bg-background border-border pr-20 ${hasCensoredContent(messageText) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {hasCensoredContent(messageText) && (
            <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <Icon name="AlertTriangle" size={12} />
              <span>Контакты будут скрыты</span>
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={onSendMessage}
            disabled={!messageText.trim() && selectedFiles.length === 0}
          >
            <Icon 
              name="Send" 
              size={18} 
              className={messageText.trim() || selectedFiles.length > 0 ? "text-primary" : "text-muted-foreground"} 
            />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-2 px-2">
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <Icon name="Shield" size={14} />
          Безопасный чат
        </button>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <Icon name="Lock" size={14} />
          Шифрование E2E
        </button>
      </div>
    </div>
  );
};