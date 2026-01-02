import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PartnerReferral } from '@/contexts/PartnerProgramContext';

interface PartnerReferralsTabProps {
  referrals: PartnerReferral[];
}

export const PartnerReferralsTab = ({ referrals }: PartnerReferralsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Users" size={20} />
          Мои рефералы ({referrals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                {referral.userAvatar ? (
                  <img src={referral.userAvatar} alt={referral.userName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                    {referral.userName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{referral.userName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      referral.level === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
                      referral.level === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                    }`}>
                      {referral.level} линия
                    </span>
                    {referral.isActive && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Зарегистрирован {new Date(referral.registeredAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">+{referral.yourEarnings.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground">Потрачено: {referral.totalSpent.toLocaleString()} ₽</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
