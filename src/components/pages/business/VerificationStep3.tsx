import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type DocumentType = 'passport' | 'driver_license' | 'international_passport';

interface DocumentData {
  type: DocumentType;
  series: string;
  number: string;
  photoFront: string | null;
  photoWithDocument: string | null;
}

interface VerificationStep3Props {
  document: DocumentData;
  photoFrontPreview: string | null;
  photoWithDocPreview: string | null;
  onDocumentChange: (field: keyof DocumentData, value: string | DocumentType) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'with_document') => void;
}

export const VerificationStep3 = ({
  document,
  photoFrontPreview,
  photoWithDocPreview,
  onDocumentChange,
  onFileUpload,
}: VerificationStep3Props) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Документ для верификации</h3>
      
      <div className="space-y-2">
        <Label>Тип документа *</Label>
        <Select
          value={document.type}
          onValueChange={(value: DocumentType) => onDocumentChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passport">Паспорт РФ</SelectItem>
            <SelectItem value="driver_license">Водительское удостоверение</SelectItem>
            <SelectItem value="international_passport">Загранпаспорт</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="docSeries">Серия *</Label>
          <Input
            id="docSeries"
            value={document.series}
            onChange={(e) => onDocumentChange('series', e.target.value)}
            placeholder="1234"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="docNumber">Номер *</Label>
          <Input
            id="docNumber"
            value={document.number}
            onChange={(e) => onDocumentChange('number', e.target.value)}
            placeholder="567890"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Фото документа (разворот с фото) *</Label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
            {photoFrontPreview ? (
              <div className="space-y-3">
                <img src={photoFrontPreview} alt="Документ" className="max-h-48 mx-auto rounded-lg" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photoFront')?.click()}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Изменить фото
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('photoFront')?.click()}
                className="w-full"
              >
                <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Нажмите для загрузки</p>
              </button>
            )}
            <input
              id="photoFront"
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload(e, 'front')}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Селфи с документом *</Label>
          <p className="text-xs text-muted-foreground">Держите документ рядом с лицом, чтобы были видны оба</p>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
            {photoWithDocPreview ? (
              <div className="space-y-3">
                <img src={photoWithDocPreview} alt="Селфи с документом" className="max-h-48 mx-auto rounded-lg" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photoWithDoc')?.click()}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Изменить фото
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('photoWithDoc')?.click()}
                className="w-full"
              >
                <Icon name="Camera" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Нажмите для загрузки селфи</p>
              </button>
            )}
            <input
              id="photoWithDoc"
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => onFileUpload(e, 'with_document')}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Требования к фото:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Все данные должны быть четко видны</li>
              <li>Фото без бликов и размытия</li>
              <li>Документ действующий (не просрочен)</li>
              <li>На селфи видно лицо и документ одновременно</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
