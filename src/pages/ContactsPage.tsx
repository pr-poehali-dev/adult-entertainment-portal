import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface ContactsPageProps {
  setCurrentPage: (page: string) => void;
}

export const ContactsPage = ({ setCurrentPage }: ContactsPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const contactMethods = [
    {
      icon: 'Mail',
      title: 'Email',
      value: 'support@example.com',
      description: 'Ответим в течение 24 часов',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: 'MessageCircle',
      title: 'Telegram',
      value: '@support_bot',
      description: 'Быстрая поддержка в чате',
      color: 'from-sky-500 to-blue-500',
    },
    {
      icon: 'Phone',
      title: 'Телефон',
      value: '+7 (800) 123-45-67',
      description: 'Звонки с 9:00 до 21:00 МСК',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const faqs = [
    {
      question: 'Как зарегистрироваться на платформе?',
      answer: 'Нажмите кнопку "Регистрация" в верхнем меню и следуйте инструкциям. Процесс займет не более 2 минут.',
    },
    {
      question: 'Безопасны ли платежи?',
      answer: 'Да, все платежи защищены и проходят через сертифицированные платежные системы.',
    },
    {
      question: 'Как связаться с продавцом?',
      answer: 'Используйте встроенный мессенджер на странице объявления для безопасной связи.',
    },
    {
      question: 'Что делать если возникла проблема?',
      answer: 'Свяжитесь с нашей службой поддержки любым удобным способом - мы всегда готовы помочь.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Контакты</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы всегда рады помочь! Выберите удобный способ связи
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-32 bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                <Icon name={method.icon as any} size={48} className="text-white" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-2">{method.title}</h3>
                <p className="text-primary font-semibold mb-2">{method.value}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Напишите нам</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Имя</label>
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Тема</label>
                  <Input
                    type="text"
                    placeholder="Тема обращения"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение</label>
                  <Textarea
                    placeholder="Опишите ваш вопрос или проблему..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить сообщение
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-2 flex items-start gap-2">
                        <Icon name="HelpCircle" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        {faq.question}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-7">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-8 text-center">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">База знаний</h3>
                <p className="text-muted-foreground mb-4">
                  Найдите ответы на популярные вопросы в нашей базе знаний
                </p>
                <Button variant="outline" onClick={() => setCurrentPage('user-guide')}>
                  Перейти к руководству
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Нужна срочная помощь?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Наша служба поддержки работает 24/7
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Icon name="MessageCircle" size={18} />
                Открыть чат поддержки
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Icon name="Phone" size={18} />
                Позвонить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
