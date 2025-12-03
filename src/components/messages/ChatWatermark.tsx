import { useEffect, useState } from 'react';

interface ChatWatermarkProps {
  userName?: string;
}

export const ChatWatermark = ({ userName = 'Конфиденциально' }: ChatWatermarkProps) => {
  const [watermarks, setWatermarks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const generateWatermarks = () => {
      const marks = [];
      const rows = 6;
      const cols = 4;
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          marks.push({
            id: i * cols + j,
            x: (j * 25) + 5,
            y: (i * 16.66) + 5,
          });
        }
      }
      
      setWatermarks(marks);
    };

    generateWatermarks();
  }, []);

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ 
        mixBlendMode: 'soft-light',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {watermarks.map((mark) => (
        <div
          key={mark.id}
          className="absolute select-none"
          style={{
            left: `${mark.x}%`,
            top: `${mark.y}%`,
            transform: 'rotate(-25deg)',
            opacity: 0.05,
            fontSize: '12px',
            fontWeight: 600,
            color: 'currentColor',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          {userName} • {new Date().toLocaleDateString('ru-RU')}
        </div>
      ))}
    </div>
  );
};
