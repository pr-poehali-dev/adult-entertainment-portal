import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface HealthCertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  canUpload: boolean;
  nextAvailableUpload?: string | null;
}

export const HealthCertificateUploadModal = ({
  isOpen,
  onClose,
  onSubmit,
  canUpload,
  nextAvailableUpload,
}: HealthCertificateUploadModalProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла: 10 МБ",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast({
          title: "Неверный формат",
          description: "Поддерживаются только изображения и PDF",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Файл не выбран",
        description: "Пожалуйста, загрузите справку",
        variant: "destructive",
      });
      return;
    }

    if (!canUpload) {
      toast({
        title: "Загрузка недоступна",
        description: "Вы можете загружать справку раз в 3 месяца",
        variant: "destructive",
      });
      return;
    }

    onSubmit(selectedFile);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FileHeart" size={28} className="text-green-500" />
            Загрузка справки "СЕКС НА ПЛЯЖЕ"
          </DialogTitle>
          <DialogDescription className="text-base">
            Медицинская справка для получения статуса "Здоровый продавец"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-green-500 bg-green-500/10">
            <AlertDescription className="text-sm">
              <div className="flex items-start gap-2">
                <Icon name="Gift" size={16} className="text-green-600 mt-0.5" />
                <div className="text-green-600">
                  <strong className="block mb-1">Преимущества загрузки справки:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Статус "Здоровый продавец" на 3 месяца</li>
                    <li>Бесплатный VIP статус на 3 месяца</li>
                    <li>Повышенное доверие клиентов</li>
                    <li>Приоритет в результатах поиска</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {!canUpload && nextAvailableUpload && (
            <Alert className="border-yellow-500 bg-yellow-500/10">
              <AlertDescription className="text-sm text-yellow-600 flex items-center gap-2">
                <Icon name="Clock" size={16} />
                Следующая загрузка будет доступна {new Date(nextAvailableUpload).toLocaleDateString('ru-RU')}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <label className="text-sm font-semibold">Требования к справке:</label>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Название: "СЕКС НА ПЛЯЖЕ"</li>
              <li>Выдана не более 1 месяца назад</li>
              <li>Печать и подпись медицинского учреждения</li>
              <li>Формат: JPG, PNG, PDF (до 10 МБ)</li>
            </ul>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
            {selectedFile ? (
              <div className="space-y-3">
                <Icon name="FileCheck" size={48} className="mx-auto text-green-500" />
                <div>
                  <p className="font-semibold text-lg">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} МБ
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <Icon name="X" size={16} />
                  Удалить
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold mb-1">
                    Перетащите файл сюда
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    или нажмите кнопку ниже
                  </p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    disabled={!canUpload}
                  />
                  <Button variant="outline" disabled={!canUpload} asChild>
                    <span>
                      <Icon name="Upload" size={16} />
                      Выбрать файл
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || !canUpload}
              className="flex-1 bg-green-500 hover:bg-green-600"
              size="lg"
            >
              <Icon name="CheckCircle" size={20} />
              Загрузить справку
            </Button>
            <Button variant="outline" onClick={onClose} size="lg">
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
