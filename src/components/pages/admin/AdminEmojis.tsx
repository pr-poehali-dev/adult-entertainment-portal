import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BrandEmoji, BrandEmojiCategory } from '@/types';
import { brandEmojis as initialEmojis } from '@/data/brandEmojis';
import { cn } from '@/lib/utils';

const categories: { id: BrandEmojiCategory; label: string; icon: string }[] = [
  { id: 'love', label: 'Любовь', icon: 'Heart' },
  { id: 'flirt', label: 'Флирт', icon: 'Smile' },
  { id: 'hot', label: 'Горячо', icon: 'Flame' },
  { id: 'party', label: 'Тусовка', icon: 'PartyPopper' },
  { id: 'vip', label: 'VIP', icon: 'Crown' },
  { id: 'money', label: 'Деньги', icon: 'DollarSign' },
];

export const AdminEmojis = () => {
  const { toast } = useToast();
  const [emojis, setEmojis] = useState<BrandEmoji[]>(initialEmojis);
  const [filterCategory, setFilterCategory] = useState<BrandEmojiCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmoji, setEditingEmoji] = useState<BrandEmoji | null>(null);

  const [formData, setFormData] = useState({
    emoji: '',
    name: '',
    category: 'love' as BrandEmojiCategory,
    isPremium: false,
  });

  const filteredEmojis = emojis.filter(emoji => 
    filterCategory === 'all' || emoji.category === filterCategory
  );

  const handleAddEmoji = () => {
    if (!formData.emoji || !formData.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const newEmoji: BrandEmoji = {
      id: `custom-${Date.now()}`,
      emoji: formData.emoji,
      name: formData.name,
      category: formData.category,
      isPremium: formData.isPremium,
    };

    setEmojis([...emojis, newEmoji]);
    setShowAddModal(false);
    resetForm();

    toast({
      title: 'Эмодзи добавлен',
      description: `${formData.emoji} ${formData.name} успешно добавлен`,
    });
  };

  const handleEditEmoji = () => {
    if (!editingEmoji) return;

    setEmojis(emojis.map(e => 
      e.id === editingEmoji.id 
        ? { ...e, ...formData }
        : e
    ));

    setEditingEmoji(null);
    resetForm();

    toast({
      title: 'Эмодзи обновлён',
      description: 'Изменения сохранены',
    });
  };

  const handleDeleteEmoji = (id: string) => {
    setEmojis(emojis.filter(e => e.id !== id));
    
    toast({
      title: 'Эмодзи удалён',
      description: 'Эмодзи успешно удалён из базы',
    });
  };

  const startEdit = (emoji: BrandEmoji) => {
    setEditingEmoji(emoji);
    setFormData({
      emoji: emoji.emoji,
      name: emoji.name,
      category: emoji.category,
      isPremium: emoji.isPremium || false,
    });
  };

  const resetForm = () => {
    setFormData({
      emoji: '',
      name: '',
      category: 'love',
      isPremium: false,
    });
  };

  const cancelEdit = () => {
    setEditingEmoji(null);
    setShowAddModal(false);
    resetForm();
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = { all: emojis.length };
    categories.forEach(cat => {
      stats[cat.id] = emojis.filter(e => e.category === cat.id).length;
    });
    return stats;
  };

  const stats = getCategoryStats();
  const premiumCount = emojis.filter(e => e.isPremium).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Smile" size={24} className="text-primary" />
                Фирменные эмодзи
              </CardTitle>
              <CardDescription>
                Управление эмодзи для чатов • Всего: {emojis.length} • Premium: {premiumCount}
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить эмодзи
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            filterCategory === 'all' && "ring-2 ring-primary"
          )}
          onClick={() => setFilterCategory('all')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm font-medium">Все</p>
            <p className="text-2xl font-bold text-primary">{stats.all}</p>
          </CardContent>
        </Card>

        {categories.map(cat => (
          <Card 
            key={cat.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filterCategory === cat.id && "ring-2 ring-primary"
            )}
            onClick={() => setFilterCategory(cat.id)}
          >
            <CardContent className="p-4 text-center">
              <Icon name={cat.icon as any} size={24} className="mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">{cat.label}</p>
              <p className="text-2xl font-bold">{stats[cat.id]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(showAddModal || editingEmoji) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingEmoji ? 'Редактировать эмодзи' : 'Добавить новый эмодзи'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emoji">Эмодзи</Label>
                <Input
                  id="emoji"
                  placeholder="😊"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="text-3xl text-center"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Улыбка"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as BrandEmojiCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium">Premium эмодзи</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id="premium"
                    checked={formData.isPremium}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.isPremium ? 'Только для VIP' : 'Доступен всем'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
              <Button onClick={editingEmoji ? handleEditEmoji : handleAddEmoji}>
                {editingEmoji ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {filterCategory === 'all' 
              ? 'Все эмодзи' 
              : `Категория: ${categories.find(c => c.id === filterCategory)?.label}`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredEmojis.map(emoji => (
              <Card 
                key={emoji.id}
                className="relative group hover:shadow-lg transition-all"
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="text-4xl">{emoji.emoji}</div>
                  <p className="text-xs text-center font-medium truncate w-full">{emoji.name}</p>
                  {emoji.isPremium && (
                    <Icon name="Crown" size={14} className="text-yellow-500" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEdit(emoji)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteEmoji(emoji.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmojis.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Smile" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Нет эмодзи в этой категории</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
