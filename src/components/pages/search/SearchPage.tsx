import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-wide mx-auto px-4 py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl text-primary flex items-center gap-3">
            <Icon name="Search" size={36} />
            Поиск
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Введите запрос..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Icon name="Search" size={20} />
                Найти
              </Button>
            </div>
            
            <div className="text-center py-20 text-muted-foreground">
              <Icon name="Search" size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">Введите запрос для поиска</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};