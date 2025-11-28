import { paidAds } from '@/data/workOpportunities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export const AdminAds = () => {
  const { toast } = useToast();

  const handleAction = (adId: number, action: string) => {
    toast({
      title: 'Действие выполнено',
      description: `Действие "${action}" применено к объявлению #${adId}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Управление объявлениями</h2>
        <p className="text-muted-foreground">Всего объявлений: {paidAds.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Всего объявлений', value: paidAds.length, icon: 'Megaphone', color: 'text-blue-500' },
          { label: 'Premium', value: paidAds.filter(ad => ad.isPremium).length, icon: 'Crown', color: 'text-amber-500' },
          { label: 'Просмотров', value: paidAds.reduce((sum, ad) => sum + ad.views, 0), icon: 'Eye', color: 'text-green-500' }
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
          <CardTitle>Список объявлений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paidAds.map((ad) => (
              <div key={ad.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <img 
                  src={ad.images[0]} 
                  alt={ad.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {ad.title}
                        {ad.isPremium && <Badge className="bg-gradient-to-r from-amber-500 to-amber-600"><Icon name="Crown" size={12} className="mr-1" />Premium</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{ad.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{ad.price.toLocaleString()} ₽</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                        <Icon name="Eye" size={12} />
                        {ad.views} просмотров
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span><Badge variant="outline">{ad.category}</Badge></span>
                      <span className="flex items-center gap-1"><Icon name="User" size={12} />{ad.sellerName}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />{ad.location}</span>
                      <span>{new Date(ad.postedDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAction(ad.id, 'просмотр')}>
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(ad.id, 'редактирование')}>
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(ad.id, 'удаление')}>
                        <Icon name="Trash" size={14} />
                      </Button>
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
