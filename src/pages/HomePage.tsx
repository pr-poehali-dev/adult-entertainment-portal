import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export const HomePage = ({ setCurrentPage }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Добро пожаловать!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя мир интересных встреч и качественных услуг
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-2xl glass-effect hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setCurrentPage('online-search')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mb-6 mx-auto">
              <Icon name="Search" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Поиск</h3>
            <p className="text-muted-foreground text-center">
              Найдите подходящего человека с помощью умных фильтров и персонализированного поиска
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-effect hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setCurrentPage('all-ads')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-6 mx-auto">
              <Icon name="Grid3x3" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Объявления</h3>
            <p className="text-muted-foreground text-center">
              Просматривайте актуальные объявления от проверенных пользователей
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-effect hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setCurrentPage('business-services')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 mx-auto">
              <Icon name="Briefcase" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Услуги</h3>
            <p className="text-muted-foreground text-center">
              Профессиональные услуги от агентств и специалистов
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl glass-effect">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Shield" size={24} className="text-green-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Безопасность</h4>
                <p className="text-muted-foreground">
                  Проверенные анкеты, безопасные платежи и защита данных
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="CheckCircle" size={24} className="text-blue-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Верификация</h4>
                <p className="text-muted-foreground">
                  Система проверки пользователей для вашей уверенности
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl glass-effect">
            <h4 className="text-xl font-bold mb-6">Популярные категории</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('online-search')}
              >
                <Icon name="Users" size={18} className="mr-3" />
                Встречи
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('business-services')}
              >
                <Icon name="Sparkles" size={18} className="mr-3" />
                Эскорт услуги
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('business-services')}
              >
                <Icon name="Heart" size={18} className="mr-3" />
                Массаж
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
