import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ReviewModalProps {
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  serviceName: string;
  onSubmitReview: (rating: number, text: string) => void;
}

const ReviewModal = ({ showReviewModal, setShowReviewModal, serviceName, onSubmitReview }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }
    if (reviewText.trim().length < 10) {
      alert('Отзыв должен содержать минимум 10 символов');
      return;
    }
    
    onSubmitReview(rating, reviewText);
    setRating(0);
    setHoveredRating(0);
    setReviewText('');
    setShowReviewModal(false);
  };

  return (
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Оставить отзыв</DialogTitle>
          <DialogDescription>
            Поделитесь впечатлениями о {serviceName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ваша оценка</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Icon
                    name="Star"
                    size={36}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-primary fill-primary'
                        : 'text-muted-foreground'
                    } transition-colors`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-semibold text-primary">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ваш отзыв</label>
            <Textarea
              placeholder="Расскажите о вашем опыте..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[120px] bg-background border-border resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {reviewText.length}/500 символов
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowReviewModal(false);
              setRating(0);
              setHoveredRating(0);
              setReviewText('');
            }}
            className="border-border"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Отправить отзыв
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
