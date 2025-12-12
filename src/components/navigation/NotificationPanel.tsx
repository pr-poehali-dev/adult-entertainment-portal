import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Notification, Page } from '@/types';

interface NotificationPanelProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  setCurrentPage: (page: Page) => void;
  onClose: () => void;
}

export const NotificationPanel = ({
  notifications,
  setNotifications,
  setCurrentPage,
  onClose,
}: NotificationPanelProps) => {
  return (
    <div className="absolute right-0 top-12 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 animate-fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-lg">Уведомления</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
          }}
        >
          Прочитать все
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="BellOff" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Нет уведомлений</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                !notif.read ? 'bg-primary/5' : ''
              }`}
              onClick={() => {
                setNotifications(
                  notifications.map(n =>
                    n.id === notif.id ? { ...n, read: true } : n
                  )
                );
                if (notif.type === 'message') setCurrentPage('messages');
                if (notif.type === 'booking') setCurrentPage('profile');
                onClose();
              }}
            >
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.type === 'message' ? 'bg-blue-500/20' :
                  notif.type === 'booking' ? 'bg-green-500/20' :
                  notif.type === 'review' ? 'bg-yellow-500/20' :
                  'bg-purple-500/20'
                }`}>
                  <Icon 
                    name={
                      notif.type === 'message' ? 'MessageCircle' :
                      notif.type === 'booking' ? 'Calendar' :
                      notif.type === 'review' ? 'Star' :
                      'Bell'
                    } 
                    size={20}
                    className={
                      notif.type === 'message' ? 'text-blue-500' :
                      notif.type === 'booking' ? 'text-green-500' :
                      notif.type === 'review' ? 'text-yellow-500' :
                      'text-purple-500'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.text}</p>
                  {notif.type === 'referral' && notif.amount && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                        +{notif.amount} {notif.currency}
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${
                        notif.referralLevel === 1 ? 'bg-primary/10 text-primary' :
                        notif.referralLevel === 2 ? 'bg-blue-500/10 text-blue-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {notif.referralLevel} линия
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};