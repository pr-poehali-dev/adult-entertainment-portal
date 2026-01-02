import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { BusinessType } from '@/types';
import { BusinessVerificationData } from './BusinessVerification';

interface BusinessProfileTabProps {
  businessType: BusinessType;
  verificationData: BusinessVerificationData | null;
}

export const BusinessProfileTab = ({ businessType, verificationData }: BusinessProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="User" size={24} />
          Мой профиль
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Icon name="Building2" size={32} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {businessType === 'organization' ? verificationData?.companyName : 'Частное лицо'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {verificationData?.responsiblePerson.firstName} {verificationData?.responsiblePerson.lastName}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{verificationData?.responsiblePerson.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Телефон</p>
              <p className="font-medium">{verificationData?.responsiblePerson.phone}</p>
            </div>
            {businessType === 'organization' && verificationData?.taxId && (
              <div>
                <p className="text-sm text-muted-foreground">ИНН</p>
                <p className="font-medium">{verificationData.taxId}</p>
              </div>
            )}
            {businessType === 'organization' && verificationData?.legalAddress && (
              <div>
                <p className="text-sm text-muted-foreground">Юридический адрес</p>
                <p className="font-medium">{verificationData.legalAddress}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
