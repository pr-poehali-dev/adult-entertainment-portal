import { useState } from 'react';
import { PrivateAlbum, MediaItem } from '@/types';
import Icon from '@/components/ui/icon';

interface AlbumViewModalProps {
  album: PrivateAlbum;
  onClose: () => void;
}

export function AlbumViewModal({ album, onClose }: AlbumViewModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const getMediaIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'photo': return 'Image';
      case 'video': return 'Video';
      case 'audio': return 'Music';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{album.title}</h2>
            <p className="text-sm text-muted-foreground">{album.mediaCount} материалов</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedMedia ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMedia(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={16} />
                Назад к альбому
              </button>

              <div className="bg-black rounded-lg overflow-hidden">
                {selectedMedia.type === 'photo' && (
                  <img
                    src={selectedMedia.url}
                    alt="Фото"
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
                {selectedMedia.type === 'video' && selectedMedia.url && (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full max-h-[70vh]"
                  />
                )}
                {selectedMedia.type === 'audio' && selectedMedia.url && (
                  <div className="p-8 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-4">
                      <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="Music" size={64} className="text-primary" />
                      </div>
                      <audio
                        src={selectedMedia.url}
                        controls
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.mediaItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-accent hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={item.thumbnail}
                    alt="Медиа"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                    <Icon name={getMediaIcon(item.type)} size={14} className="text-white" />
                    {item.duration && (
                      <span className="text-xs text-white">{item.duration}</span>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Icon name="Play" size={24} className="text-black ml-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
