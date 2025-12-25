import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AudioPlayerProps {
  audioUrl: string;
  duration?: number;
  className?: string;
}

export const AudioPlayer = ({ audioUrl, duration, className = '' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    
    audioRef.current.onloadedmetadata = () => {
      if (audioRef.current) {
        setAudioDuration(Math.floor(audioRef.current.duration));
      }
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(Math.floor(audioRef.current.currentTime));
        }
      }, 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioDuration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(Math.floor(newTime));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-3 bg-muted rounded-lg ${className}`}>
      <Button
        size="sm"
        variant="outline"
        onClick={togglePlayback}
        className="h-10 w-10 p-0 flex-shrink-0"
      >
        <Icon name={isPlaying ? 'Pause' : 'Play'} size={18} />
      </Button>
      
      <div className="flex-1 space-y-1">
        <div 
          className="h-2 bg-background rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1">
            <Icon name="Volume2" size={12} />
            <span>Аудио-приветствие</span>
          </div>
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>
    </div>
  );
};
