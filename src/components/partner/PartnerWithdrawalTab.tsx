import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { PartnerStats, WithdrawalRequest } from '@/contexts/PartnerProgramContext';
import { Currency } from '@/types';

interface PartnerWithdrawalTabProps {
  stats: PartnerStats;
  withdrawalRequests: WithdrawalRequest[];
  withdrawalAmount: string;
  setWithdrawalAmount: (value: string) => void;
  withdrawalCurrency: Currency;
  setWithdrawalCurrency: (value: Currency) => void;
  withdrawalMethod: string;
  setWithdrawalMethod: (value: string) => void;
  withdrawalDetails: string;
  setWithdrawalDetails: (value: string) => void;
  handleWithdrawalRequest: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export const PartnerWithdrawalTab = ({
  stats,
  withdrawalRequests,
  withdrawalAmount,
  setWithdrawalAmount,
  withdrawalCurrency,
  setWithdrawalCurrency,
  withdrawalMethod,
  setWithdrawalMethod,
  withdrawalDetails,
  setWithdrawalDetails,
  handleWithdrawalRequest,
  getStatusBadge,
}: PartnerWithdrawalTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="DollarSign" size={20} />
            Запросить вывод средств
          </CardTitle>
          <CardDescription>
            Доступно для вывода: <span className="font-bold text-primary">{stats.availableForWithdrawal.toLocaleString()} ₽</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Сумма</Label>
            <Input 
              id="amount"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>

          <div>
            <Label htmlFor="currency">Валюта</Label>
            <Select value={withdrawalCurrency} onValueChange={(v) => setWithdrawalCurrency(v as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">RUB (₽)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="method">Способ вывода</Label>
            <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Банковская карта</SelectItem>
                <SelectItem value="crypto">Криптовалюта</SelectItem>
                <SelectItem value="wallet">Электронный кошелёк</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="details">Реквизиты</Label>
            <Input 
              id="details"
              value={withdrawalDetails}
              onChange={(e) => setWithdrawalDetails(e.target.value)}
              placeholder="Номер карты / адрес кошелька"
            />
          </div>

          <Button onClick={handleWithdrawalRequest} className="w-full">
            <Icon name="Send" size={18} className="mr-2" />
            Запросить вывод
          </Button>

          <p className="text-xs text-muted-foreground">
            Минимальная сумма вывода: 1000 ₽. Обработка заявки: 1-3 рабочих дня.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" size={20} />
            История выводов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {withdrawalRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Пока нет заявок на вывод</p>
              </div>
            ) : (
              withdrawalRequests.map((request) => (
                <div key={request.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{request.amount.toLocaleString()} {request.currency}</h4>
                      <p className="text-sm text-muted-foreground">{request.details}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Запрошено: {new Date(request.requestedAt).toLocaleDateString('ru-RU')}</p>
                    {request.completedAt && (
                      <p>Выполнено: {new Date(request.completedAt).toLocaleDateString('ru-RU')}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
