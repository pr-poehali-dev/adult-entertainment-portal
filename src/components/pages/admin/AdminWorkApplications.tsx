import { workOpportunities } from '@/data/workOpportunities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export const AdminWorkApplications = () => {
  const { toast } = useToast();

  const mockApplications = [
    { id: 1, work: workOpportunities[0], applicant: 'Анастасия К.', email: 'anastasia@example.com', phone: '+7 999 123 45 67', date: '2024-11-27', status: 'pending' },
    { id: 2, work: workOpportunities[1], applicant: 'Мария С.', email: 'maria@example.com', phone: '+7 999 234 56 78', date: '2024-11-26', status: 'approved' },
    { id: 3, work: workOpportunities[2], applicant: 'Елена В.', email: 'elena@example.com', phone: '+7 999 345 67 89', date: '2024-11-28', status: 'pending' },
    { id: 4, work: workOpportunities[3], applicant: 'Виктория М.', email: 'victoria@example.com', phone: '+7 999 456 78 90', date: '2024-11-25', status: 'rejected' },
    { id: 5, work: workOpportunities[4], applicant: 'Ольга П.', email: 'olga@example.com', phone: '+7 999 567 89 01', date: '2024-11-28', status: 'pending' }
  ];

  const handleAction = (appId: number, action: string) => {
    toast({
      title: 'Действие выполнено',
      description: `Отклик #${appId} ${action}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; variant: any; icon: string }> = {
      pending: { label: 'На рассмотрении', variant: 'secondary', icon: 'Clock' },
      approved: { label: 'Одобрен', variant: 'default', icon: 'CheckCircle' },
      rejected: { label: 'Отклонен', variant: 'destructive', icon: 'X' }
    };
    const config = statuses[status];
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon name={config.icon as any} size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Отклики на вакансии</h2>
        <p className="text-muted-foreground">Всего откликов: {mockApplications.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'На рассмотрении', value: mockApplications.filter(a => a.status === 'pending').length, icon: 'Clock', color: 'text-orange-500' },
          { label: 'Одобрено', value: mockApplications.filter(a => a.status === 'approved').length, icon: 'CheckCircle', color: 'text-green-500' },
          { label: 'Отклонено', value: mockApplications.filter(a => a.status === 'rejected').length, icon: 'X', color: 'text-red-500' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon name={stat.icon as any} size={32} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список откликов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockApplications.map((app) => (
              <div key={app.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Briefcase" size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{app.work.title}</h3>
                      <p className="text-sm text-muted-foreground">{app.work.company}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Кандидат</div>
                      <div className="text-sm font-medium">{app.applicant}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm font-medium">{app.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Телефон</div>
                      <div className="text-sm font-medium">{app.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Дата отклика: {new Date(app.date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAction(app.id, 'просмотрен')}>
                        <Icon name="Eye" size={14} className="mr-1" />
                        Просмотреть
                      </Button>
                      {app.status === 'pending' && (
                        <>
                          <Button size="sm" variant="default" onClick={() => handleAction(app.id, 'одобрен')}>
                            <Icon name="Check" size={14} className="mr-1" />
                            Одобрить
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(app.id, 'отклонен')}>
                            <Icon name="X" size={14} className="mr-1" />
                            Отклонить
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
