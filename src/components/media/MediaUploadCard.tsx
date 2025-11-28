import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadCardProps {
  type: 'audio' | 'video' | 'photos';
  currentMedia?: string | string[] | null;
  onUpload: (files: File[]) => void;
  onRemove: (index?: number) => void;
}

export const MediaUploadCard = ({ 
  type, 
  currentMedia, 
  onUpload, 
  onRemove 
}: MediaUploadCardProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const config = {
    audio: {
      title: 'Аудио приветствие',
      description: 'Запишите голосовое приветствие для клиентов',
      icon: 'Mic',
      accept: 'audio/*',
      maxSize: 10,
      maxFiles: 1,
      placeholder: 'MP3, WAV до 10 МБ',
    },
    video: {
      title: 'Промо-видео',
      description: 'Загрузите короткое видео о себе и услугах',
      icon: 'Video',
      accept: 'video/*',
      maxSize: 50,
      maxFiles: 1,
      placeholder: 'MP4, MOV до 50 МБ',
    },
    photos: {
      title: 'Фото профиля',
      description: 'Добавьте до 3 фотографий',
      icon: 'Image',
      accept: 'image/*',
      maxSize: 5,
      maxFiles: 3,
      placeholder: 'JPG, PNG до 5 МБ каждое',
    },
  };

  const currentConfig = config[type];
  const mediaArray = Array.isArray(currentMedia) ? currentMedia : currentMedia ? [currentMedia] : [];
  const canUploadMore = mediaArray.length < currentConfig.maxFiles;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (mediaArray.length + files.length > currentConfig.maxFiles) {
      toast({
        title: "Превышен лимит",
        description: `Максимум ${currentConfig.maxFiles} ${type === 'photos' ? 'фото' : 'файл'}`,
        variant: "destructive",
      });
      return;
    }

    for (const file of files) {
      if (file.size > currentConfig.maxSize * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: `Максимальный размер: ${currentConfig.maxSize} МБ`,
          variant: "destructive",
        });
        return;
      }
    }

    onUpload(files);
    toast({
      title: "Загружено успешно",
      description: `${files.length} ${files.length === 1 ? 'файл' : 'файла'} загружен`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const fakeEvent = { target: { files } } as any;
    handleFileSelect(fakeEvent);
  };

  const renderMediaPreview = () => {
    if (type === 'audio' && mediaArray[0]) {
      return (
        <div className="space-y-3">
          <audio controls className="w-full">
            <source src={mediaArray[0]} />
          </audio>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRemove()} 
            className="w-full"
          >
            <Icon name="Trash2" size={16} />
            Удалить
          </Button>
        </div>
      );
    }

    if (type === 'video' && mediaArray[0]) {
      return (
        <div className="space-y-3">
          <video controls className="w-full rounded-lg max-h-64">
            <source src={mediaArray[0]} />
          </video>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRemove()} 
            className="w-full"
          >
            <Icon name="Trash2" size={16} />
            Удалить
          </Button>
        </div>
      );
    }

    if (type === 'photos' && mediaArray.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-3">
          {mediaArray.map((photo, index) => (
            <div key={index} className="relative group">
              <img 
                src={photo} 
                alt={`Фото ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name={currentConfig.icon as any} size={24} className="text-primary" />
          {currentConfig.title}
          {type === 'photos' && mediaArray.length > 0 && (
            <span className="text-sm text-muted-foreground font-normal">
              ({mediaArray.length}/3)
            </span>
          )}
        </CardTitle>
        <CardDescription>{currentConfig.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mediaArray.length > 0 && renderMediaPreview()}

        {canUploadMore && (
          <>
            <Alert>
              <AlertDescription className="text-xs flex items-center gap-2">
                <Icon name="Info" size={14} />
                {currentConfig.placeholder}
              </AlertDescription>
            </Alert>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/20 hover:border-primary/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-semibold mb-1">
                Перетащите файл сюда
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                или нажмите кнопку ниже
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept={currentConfig.accept}
                  multiple={type === 'photos'}
                  onChange={handleFileSelect}
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Icon name="Upload" size={16} />
                    Выбрать {type === 'photos' ? 'фото' : 'файл'}
                  </span>
                </Button>
              </label>
            </div>
          </>
        )}

        {type === 'photos' && mediaArray.length >= 3 && (
          <Alert className="border-green-500 bg-green-500/10">
            <AlertDescription className="text-sm text-green-600 flex items-center gap-2">
              <Icon name="CheckCircle" size={16} />
              Все фото загружены (3/3)
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
