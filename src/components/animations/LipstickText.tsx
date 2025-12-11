import { useEffect, useRef, useState } from 'react';

interface LipstickTextProps {
  text?: string;
  className?: string;
}

export const LipstickText = ({ text = 'LOVE IS', className = '' }: LipstickTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isDrawn) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const fontSize = Math.min(rect.width / 6, 120);
    ctx.font = `bold ${fontSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const lipstickGradient = ctx.createLinearGradient(0, 0, rect.width, 0);
    lipstickGradient.addColorStop(0, '#dc2626');
    lipstickGradient.addColorStop(0.5, '#ef4444');
    lipstickGradient.addColorStop(1, '#dc2626');

    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, rect.width / 2);
    glowGradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
    glowGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

    const drawPath = (pathPoints: { x: number; y: number }[], callback: () => void) => {
      let currentPoint = 0;
      const step = 3;
      
      const animate = () => {
        if (currentPoint >= pathPoints.length) {
          callback();
          return;
        }

        const point = pathPoints[currentPoint];
        
        ctx.shadowColor = 'rgba(220, 38, 38, 0.5)';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = lipstickGradient;
        ctx.lineWidth = 12;
        
        ctx.beginPath();
        if (currentPoint > 0) {
          const prevPoint = pathPoints[currentPoint - 1];
          ctx.moveTo(prevPoint.x, prevPoint.y);
        } else {
          ctx.moveTo(point.x, point.y);
        }
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        const sparkleChance = Math.random();
        if (sparkleChance > 0.7) {
          const sparkleSize = Math.random() * 4 + 2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(point.x + (Math.random() - 0.5) * 10, point.y + (Math.random() - 0.5) * 10, sparkleSize, 0, Math.PI * 2);
          ctx.fill();
        }

        currentPoint += step;
        requestAnimationFrame(animate);
      };
      
      animate();
    };

    const getTextPath = (text: string, x: number, y: number): { x: number; y: number }[] => {
      const points: { x: number; y: number }[] = [];
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const startX = x - textWidth / 2;
      
      const resolution = 2;
      
      for (let i = 0; i < textWidth; i += resolution) {
        const charX = startX + i;
        
        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y);
        const imageData = ctx.getImageData((charX - 5) * dpr, (y - fontSize / 2) * dpr, 10 * dpr, fontSize * dpr);
        
        let hasPixel = false;
        for (let py = 0; py < imageData.height; py += 4) {
          for (let px = 0; px < imageData.width; px += 4) {
            const index = (py * imageData.width + px) * 4;
            if (imageData.data[index + 3] > 128) {
              hasPixel = true;
              break;
            }
          }
          if (hasPixel) break;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (hasPixel) {
          const offsetY = (Math.random() - 0.5) * 3;
          points.push({ x: charX, y: y + offsetY });
        }
      }
      
      return points;
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    setTimeout(() => {
      const pathPoints = getTextPath(text, centerX, centerY);
      
      drawPath(pathPoints, () => {
        ctx.shadowColor = 'rgba(220, 38, 38, 0.6)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = lipstickGradient;
        ctx.fillText(text, centerX, centerY);
        
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeText(text, centerX, centerY);
        
        setIsDrawn(true);
      });
    }, 500);

  }, [text, isDrawn]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '200px',
          minHeight: '150px'
        }}
      />
    </div>
  );
};
