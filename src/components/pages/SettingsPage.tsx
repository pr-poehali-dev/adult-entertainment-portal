import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';

interface SettingsPageProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const SettingsPage = ({
  isDarkTheme,
  setIsDarkTheme,
  soundEnabled,
  setSoundEnabled,
}: SettingsPageProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gold-shimmer">Настройки</span>
          </h1>
          <p className="text-muted-foreground">Управление параметрами приложения</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Palette" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Внешний вид</h2>
                <p className="text-sm text-muted-foreground">Настройка темы оформления</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name={isDarkTheme ? "Moon" : "Sun"} size={20} />
                <div>
                  <p className="font-medium">Тема оформления</p>
                  <p className="text-sm text-muted-foreground">
                    {isDarkTheme ? 'Темная тема' : 'Светлая тема'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                variant={isDarkTheme ? "default" : "outline"}
                size="sm"
              >
                {isDarkTheme ? (
                  <>
                    <Icon name="Moon" size={16} className="mr-2" />
                    Темная
                  </>
                ) : (
                  <>
                    <Icon name="Sun" size={16} className="mr-2" />
                    Светлая
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Volume2" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Звук</h2>
                <p className="text-sm text-muted-foreground">Управление звуковыми уведомлениями</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={20} />
                <div>
                  <p className="font-medium">Звуковые уведомления</p>
                  <p className="text-sm text-muted-foreground">
                    {soundEnabled ? 'Включены' : 'Выключены'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant={soundEnabled ? "default" : "outline"}
                size="sm"
              >
                {soundEnabled ? (
                  <>
                    <Icon name="Volume2" size={16} className="mr-2" />
                    Включено
                  </>
                ) : (
                  <>
                    <Icon name="VolumeX" size={16} className="mr-2" />
                    Выключено
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Languages" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Язык</h2>
                <p className="text-sm text-muted-foreground">Выбор языка интерфейса</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('ru')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  language === 'ru'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇷🇺</span>
                  <div className="text-left">
                    <p className="font-medium">Русский</p>
                    <p className="text-xs text-muted-foreground">Russian</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  language === 'en'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇬🇧</span>
                  <div className="text-left">
                    <p className="font-medium">English</p>
                    <p className="text-xs text-muted-foreground">Английский</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Info" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">О приложении</h2>
                <p className="text-sm text-muted-foreground">Информация о платформе</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Версия</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Платформа</span>
                <span className="font-medium">Love is...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
