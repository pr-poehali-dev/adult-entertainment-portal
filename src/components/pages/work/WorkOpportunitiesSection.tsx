import { useState } from 'react';
import { WorkOpportunity, WorkOpportunityType } from '@/types';
import { workOpportunities } from '@/data/workOpportunities';
import { WorkOpportunityCard } from './WorkOpportunityCard';
import { WorkOpportunityModal } from './WorkOpportunityModal';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const workTypeNames: Record<WorkOpportunityType, string> = {
  photo_shoot: 'Фотосессия',
  video_shoot: 'Видеосъемка',
  nude_photoshoot: 'НЮ фотосессия',
  porn_casting: 'Порнокастинг',
  first_time: 'Первый раз'
};

const workTypeIcons: Record<WorkOpportunityType, string> = {
  photo_shoot: 'Camera',
  video_shoot: 'Video',
  nude_photoshoot: 'Image',
  porn_casting: 'Film',
  first_time: 'Star'
};

export const WorkOpportunitiesSection = () => {
  const [selectedType, setSelectedType] = useState<WorkOpportunityType | 'all'>('all');
  const [selectedWork, setSelectedWork] = useState<WorkOpportunity | null>(null);

  const filteredOpportunities = selectedType === 'all' 
    ? workOpportunities 
    : workOpportunities.filter(w => w.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Filter" size={24} className="text-primary" />
          Тип работы
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className="gap-2"
          >
            <Icon name="Grid3x3" size={18} />
            Все ({workOpportunities.length})
          </Button>
          {Object.entries(workTypeNames).map(([type, name]) => {
            const count = workOpportunities.filter(w => w.type === type).length;
            return (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                onClick={() => setSelectedType(type as WorkOpportunityType)}
                className="gap-2"
              >
                <Icon name={workTypeIcons[type as WorkOpportunityType] as any} size={18} />
                {name} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((work) => (
          <WorkOpportunityCard
            key={work.id}
            work={work}
            onSelect={() => setSelectedWork(work)}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-16">
          <Icon name="Inbox" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">
            Нет доступных вакансий этого типа
          </p>
        </div>
      )}

      {selectedWork && (
        <WorkOpportunityModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
};
