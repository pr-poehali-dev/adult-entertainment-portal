import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number;
  existingAudioUrl?: string | null;
}

export const AudioRecorder = ({ 
  onRecordingComplete, 
  maxDuration = 20,
  existingAudioUrl 
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob, recordingTime);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteRecording = () => {
    if (confirm('Удалить аудио-приветствие?')) {
      setAudioUrl(null);
      setRecordingTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      onRecordingComplete(new Blob(), 0);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadAudioFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Пожалуйста, выберите аудио файл');
      return;
    }

    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      const duration = Math.floor(audio.duration);
      
      if (duration > maxDuration) {
        alert(`Максимальная длительность аудио ${maxDuration} секунд`);
        return;
      }

      setAudioUrl(audio.src);
      setRecordingTime(duration);
      onRecordingComplete(file, duration);
    };
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Icon name="Mic" size={16} />
            Аудио-приветствие
          </h4>
          <span className="text-xs text-muted-foreground">
            Макс. {maxDuration} сек
          </span>
        </div>

        {!audioUrl ? (
          <div className="space-y-3">
            {!isRecording ? (
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={startRecording}
                  className="w-full"
                  variant="default"
                >
                  <Icon name="Mic" size={18} className="mr-2" />
                  Записать голосовое приветствие
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={uploadAudioFile}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      type="button"
                      onClick={() => document.getElementById('audio-upload')?.click()}
                    >
                      <Icon name="Upload" size={18} className="mr-2" />
                      Загрузить аудио файл
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                  <span className="text-2xl font-bold font-mono">
                    {formatTime(recordingTime)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatTime(maxDuration)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!isPaused ? (
                    <Button onClick={pauseRecording} variant="outline" className="flex-1">
                      <Icon name="Pause" size={18} className="mr-2" />
                      Пауза
                    </Button>
                  ) : (
                    <Button onClick={resumeRecording} variant="outline" className="flex-1">
                      <Icon name="Play" size={18} className="mr-2" />
                      Продолжить
                    </Button>
                  )}
                  <Button onClick={stopRecording} variant="default" className="flex-1">
                    <Icon name="Square" size={18} className="mr-2" />
                    Остановить
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Расскажите о себе голосом, чтобы выделиться среди других объявлений
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={togglePlayback}
                  className="h-10 w-10 p-0"
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} size={18} />
                </Button>
                <div>
                  <p className="text-sm font-medium">Голосовое приветствие</p>
                  <p className="text-xs text-muted-foreground">
                    Длительность: {formatTime(recordingTime)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteRecording}
              >
                <Icon name="Trash2" size={18} />
              </Button>
            </div>

            <Button 
              onClick={() => {
                deleteRecording();
                setAudioUrl(null);
              }}
              variant="outline"
              className="w-full"
            >
              <Icon name="RotateCcw" size={18} className="mr-2" />
              Записать заново
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
