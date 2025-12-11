import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { DatingFilters } from './dating/DatingFilters';
import { DatingProfileCard, DatingProfile } from './dating/DatingProfileCard';
import { DatingProfileDetail } from './dating/DatingProfileDetail';
import { mockProfiles } from './dating/mockProfiles';

interface DatingPageProps {
  setCurrentPage: (page: Page) => void;
}

interface Match {
  id: number;
  profile: DatingProfile;
  matchedAt: string;
}

export const DatingPage = ({ setCurrentPage }: DatingPageProps) => {
  const { toast } = useToast();
  const [profiles] = useState<DatingProfile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<DatingProfile | null>(null);
  const [currentUserId] = useState(100);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([2, 5]);
  const [receivedLikes, setReceivedLikes] = useState<number[]>([1, 3, 4]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'likes' | 'matches'>('browse');
  const [filters, setFilters] = useState({
    gender: 'all',
    ageFrom: '',
    ageTo: '',
    city: 'all',
    lookingFor: 'all',
    onlineOnly: false
  });

  const filteredProfiles = profiles.filter(profile => {
    if (filters.gender !== 'all' && profile.gender !== filters.gender) return false;
    if (filters.ageFrom && profile.age < parseInt(filters.ageFrom)) return false;
    if (filters.ageTo && profile.age > parseInt(filters.ageTo)) return false;
    if (filters.city !== 'all' && profile.city !== filters.city) return false;
    if (filters.lookingFor !== 'all' && profile.lookingFor !== filters.lookingFor) return false;
    if (filters.onlineOnly && !profile.online) return false;
    return true;
  });

  const cities = Array.from(new Set(profiles.map(p => p.city)));

  const handleLike = (profileId: number) => {
    setLikedProfiles(prev => [...prev, profileId]);
    
    if (receivedLikes.includes(profileId)) {
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        const newMatch: Match = {
          id: Date.now(),
          profile,
          matchedAt: new Date().toISOString()
        };
        setMatches(prev => [...prev, newMatch]);
        
        toast({
          title: '🎉 Взаимная симпатия!',
          description: `У вас матч с ${profile.name}! Теперь вы можете начать общение.`,
          duration: 5000,
        });
      }
    } else {
      toast({
        title: '❤️ Лайк отправлен!',
        description: 'Если человек ответит взаимностью, вы получите матч.',
      });
    }
  };

  const handleUnlike = (profileId: number) => {
    setLikedProfiles(prev => prev.filter(id => id !== profileId));
    setMatches(prev => prev.filter(m => m.profile.id !== profileId));
    toast({
      title: 'Лайк отменён',
      description: 'Профиль убран из понравившихся',
    });
  };

  const whoLikesMe = profiles.filter(p => receivedLikes.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-pink-50/30 dark:via-pink-950/10 to-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('home')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('home')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Heart" size={48} className="text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Знакомства
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Найди интересных людей рядом с тобой. Бесплатные знакомства без скрытых платежей.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 p-1 bg-muted rounded-xl">
            <Button
              variant={activeTab === 'browse' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('browse')}
              className="rounded-lg"
            >
              <Icon name="Users" size={18} className="mr-2" />
              Обзор
            </Button>
            <Button
              variant={activeTab === 'likes' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('likes')}
              className="rounded-lg relative"
            >
              <Icon name="Heart" size={18} className="mr-2" />
              Кто лайкнул
              {receivedLikes.length > 0 && (
                <Badge className="ml-2 bg-pink-500">{receivedLikes.length}</Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'matches' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('matches')}
              className="rounded-lg relative"
            >
              <Icon name="Sparkles" size={18} className="mr-2" />
              Матчи
              {matches.length > 0 && (
                <Badge className="ml-2 bg-green-500">{matches.length}</Badge>
              )}
            </Button>
          </div>
        </div>

        <DatingFilters
          filters={filters}
          setFilters={setFilters}
          cities={cities}
          filteredCount={filteredProfiles.length}
        />

        {activeTab === 'likes' && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-2 border-pink-300 dark:border-pink-800">
              <CardContent className="pt-6 text-center">
                <Icon name="Heart" size={48} className="mx-auto text-pink-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Кто лайкнул меня</h3>
                <p className="text-muted-foreground mb-4">
                  {receivedLikes.length > 0 
                    ? `${receivedLikes.length} ${receivedLikes.length === 1 ? 'человек' : 'человека'} отправили вам лайк!`
                    : 'Пока никто не лайкнул вас. Продолжайте общаться!'}
                </p>
              </CardContent>
            </Card>

            {whoLikesMe.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {whoLikesMe.map(profile => (
                  <DatingProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => setSelectedProfile(profile)}
                    variant="liked"
                    showLikeButton={true}
                    onLike={() => handleLike(profile.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-300 dark:border-green-800">
              <CardContent className="pt-6 text-center">
                <Icon name="Sparkles" size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Ваши матчи</h3>
                <p className="text-muted-foreground mb-4">
                  {matches.length > 0 
                    ? `У вас ${matches.length} ${matches.length === 1 ? 'матч' : 'матча'}! Начните общение.`
                    : 'Пока нет матчей. Лайкайте анкеты, чтобы найти пару!'}
                </p>
              </CardContent>
            </Card>

            {matches.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {matches.map(match => (
                  <DatingProfileCard
                    key={match.id}
                    profile={match.profile}
                    onClick={() => setSelectedProfile(match.profile)}
                    variant="match"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'browse' && !selectedProfile && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <DatingProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => setSelectedProfile(profile)}
              />
            ))}
          </div>
        )}

        {selectedProfile && (
          <DatingProfileDetail
            profile={selectedProfile}
            onBack={() => setSelectedProfile(null)}
            isLiked={likedProfiles.includes(selectedProfile.id)}
            isMatch={matches.some(m => m.profile.id === selectedProfile.id)}
            onLike={() => handleLike(selectedProfile.id)}
            onUnlike={() => handleUnlike(selectedProfile.id)}
          />
        )}
      </div>
    </div>
  );
};