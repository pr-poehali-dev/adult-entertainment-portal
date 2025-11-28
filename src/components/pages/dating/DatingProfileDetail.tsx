import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { DatingProfile } from './DatingProfileCard';

interface DatingProfileDetailProps {
  profile: DatingProfile;
  onBack: () => void;
  isLiked: boolean;
  isMatch: boolean;
  onLike: () => void;
  onUnlike: () => void;
}

export const DatingProfileDetail = ({ 
  profile, 
  onBack, 
  isLiked, 
  isMatch, 
  onLike, 
  onUnlike 
}: DatingProfileDetailProps) => {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад
          </Button>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
                {profile.online && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Онлайн
                  </div>
                )}
              </div>
              {profile.photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {profile.photos.slice(1).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Фото ${idx + 2}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {profile.name}, {profile.age}
                      {profile.verified && (
                        <Icon name="CheckCircle2" size={24} className="inline ml-2 text-blue-500" />
                      )}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      {profile.city}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="User" size={16} />
                      О себе
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.about}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Heart" size={16} />
                      Ищу
                    </h3>
                    <Badge className="bg-pink-500">{profile.lookingFor}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Sparkles" size={16} />
                      Интересы
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map(interest => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Info" size={16} />
                      Параметры
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Возраст</p>
                        <p className="font-semibold">{profile.age} лет</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Рост</p>
                        <p className="font-semibold">{profile.height} см</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {isLiked ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={onUnlike}
                      className="flex-1 h-14 text-lg border-2 border-pink-500 text-pink-500"
                    >
                      <Icon name="HeartOff" size={20} className="mr-2" />
                      Убрать лайк
                    </Button>
                    {isMatch && (
                      <Button className="flex-1 h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Icon name="MessageCircle" size={20} className="mr-2" />
                        Написать
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={onLike}
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    <Icon name="Heart" size={20} className="mr-2" />
                    Мне нравится
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
