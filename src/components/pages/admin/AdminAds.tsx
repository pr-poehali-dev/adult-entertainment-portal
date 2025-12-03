import { useState } from 'react';
import { catalogItems } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { CatalogItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const AdminAds = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<CatalogItem[]>(catalogItems);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleApprove = (itemId: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isApproved: true, isAdminModerated: true } : item
    ));
    toast({
      title: 'Объявление одобрено',
      description: `Объявление #${itemId} успешно одобрено`,
    });
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    setItems(items.map(item => 
      item.id === editingItem.id ? { ...editingItem, isAdminModerated: true } : item
    ));
    toast({
      title: 'Изменения сохранены',
      description: `Объявление #${editingItem.id} успешно обновлено`,
    });
    setShowEditDialog(false);
    setEditingItem(null);
  };

  const handleDelete = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
    toast({
      title: 'Объявление удалено',
      description: `Объявление #${itemId} успешно удалено`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Управление объявлениями</h2>
        <p className="text-muted-foreground">Всего объявлений: {items.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Всего объявлений', value: items.length, icon: 'Megaphone', color: 'text-blue-500' },
          { label: 'Одобренные', value: items.filter(item => item.isApproved).length, icon: 'CheckCircle', color: 'text-green-500' },
          { label: 'Ожидают модерации', value: items.filter(item => !item.isAdminModerated).length, icon: 'Clock', color: 'text-amber-500' }
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
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {item.title}
                        {item.verified && <Badge className="bg-blue-500"><Icon name="BadgeCheck" size={12} className="mr-1" />Верифицирован</Badge>}
                        {item.isApproved && <Badge className="bg-green-500"><Icon name="CheckCircle" size={12} className="mr-1" />Одобрено</Badge>}
                        {!item.isAdminModerated && <Badge variant="outline" className="border-amber-500 text-amber-500"><Icon name="Clock" size={12} className="mr-1" />Модерация</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description || 'Описание отсутствует'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{item.price}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Icon name="Star" size={12} className="inline" /> {item.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span><Badge variant="outline">{item.category}</Badge></span>
                      <span className="flex items-center gap-1"><Icon name="User" size={12} />{item.seller}</span>
                      {item.location && <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />{item.location}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.isApproved && (
                        <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(item.id)}>
                          <Icon name="CheckCircle" size={14} className="mr-1" />
                          Одобрить
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Icon name="Edit" size={14} className="mr-1" />
                        Редактировать
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование объявления #{editingItem?.id}</DialogTitle>
            <DialogDescription>
              Внесите изменения в объявление
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Цена</label>
                  <Input
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Категория</label>
                  <Input
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Локация</label>
                <Input
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};