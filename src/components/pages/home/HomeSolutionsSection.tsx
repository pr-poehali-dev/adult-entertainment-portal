import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const HomeSolutionsSection = () => {
  const solutions = [
    {
      problem: 'Фейковые аккаунты',
      description: 'Девушка на фото не соответствует действительности',
      solution: 'Все девушки проходят верификацию KYC перед размещением объявлений',
      icon: 'ShieldCheck',
      color: 'text-emerald-500'
    },
    {
      problem: 'Скам-сайты с подписками',
      description: 'Платные подписки без гарантий качества',
      solution: 'У нас есть платный и бесплатный раздел — выбирайте сами',
      icon: 'DollarSign',
      color: 'text-blue-500'
    },
    {
      problem: 'Переводы мошенницам',
      description: 'Риск потери денег при прямых переводах',
      solution: 'Все платежи проходят через ЭСКРОУ счёт — деньги переводятся исполнителю только после подтверждения выполнения заказа',
      icon: 'Lock',
      color: 'text-amber-500'
    },
    {
      problem: 'Контрольная закупка',
      description: 'Страх передачи наличных и прямых переводов',
      solution: 'Нет факта передачи денег наличкой — всё через безопасный онлайн-счёт',
      icon: 'Ban',
      color: 'text-rose-500'
    },
    {
      problem: 'Утечка переписок',
      description: 'Страх, что чаты увидят третьи лица',
      solution: 'Все чаты надёжно шифруются и защищены от копирования и скриншотов',
      icon: 'MessageSquareLock',
      color: 'text-violet-500'
    }
  ];

  return (
    <section className="py-12 px-4 pb-6 bg-gradient-to-b from-muted/30 to-background w-full overflow-hidden">
      <div className="max-w-wide mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="gold-shimmer">Проблемы онлайн-знакомств,</span>
            <br />
            <span className="text-muted-foreground text-2xl md:text-3xl lg:text-4xl">которые мы решили</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Безопасность, прозрачность и защита каждой сделки — вот наши приоритеты
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {solutions.map((item, index) => (
            <Card 
              key={index}
              className="group hover:scale-105 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-slide-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-muted/50 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={item.icon as any} size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-foreground">
                      {item.problem}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Дополнительная фича - справки о здоровье */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Icon name="FileCheck" size={48} className="text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Справки о здоровье
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Исполнители могут прикрепить медицинские справки (по желанию). 
                  Справка даёт <span className="font-semibold text-primary">приоритетное размещение</span> и 
                  <span className="font-semibold text-primary"> эксклюзивные условия на 30 дней</span>.
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Icon name="Award" size={24} />
                <span className="text-sm">Премиум статус</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};