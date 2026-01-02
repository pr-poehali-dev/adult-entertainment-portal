import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cryptoDepositApi } from '@/lib/api';

interface CryptoDepositFormProps {
  onSuccess: () => void;
}

interface CryptoAddress {
  address: string;
  tag?: string;
  currency: string;
  invoice_id?: string;
  created_at?: string;
}

const SUPPORTED_CRYPTOS = [
  { code: 'BTC', name: 'Bitcoin', icon: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum', icon: 'Coins' },
  { code: 'USDT', name: 'Tether', icon: 'DollarSign' },
  { code: 'LTC', name: 'Litecoin', icon: 'Coins' },
  { code: 'BCH', name: 'Bitcoin Cash', icon: 'Bitcoin' }
];

export const CryptoDepositForm = ({ onSuccess }: CryptoDepositFormProps) => {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [depositAddress, setDepositAddress] = useState<CryptoAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDepositAddress(selectedCrypto);
  }, [selectedCrypto]);

  const loadDepositAddress = async (currency: string) => {
    setIsLoading(true);
    try {
      const response = await cryptoDepositApi.getDepositAddress(currency);
      if (response.success) {
        setDepositAddress(response.deposit);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить адрес депозита',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!depositAddress?.address) return;
    
    try {
      await navigator.clipboard.writeText(depositAddress.address);
      setCopied(true);
      toast({
        title: 'Скопировано!',
        description: 'Адрес скопирован в буфер обмена'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать адрес',
        variant: 'destructive'
      });
    }
  };

  const handleCopyTag = async () => {
    if (!depositAddress?.tag) return;
    
    try {
      await navigator.clipboard.writeText(depositAddress.tag);
      toast({
        title: 'Скопировано!',
        description: 'Tag скопирован в буфер обмена'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать tag',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Bitcoin" size={24} className="text-orange-600" />
          Пополнение криптовалютой
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-3 block">Выберите криптовалюту</Label>
          <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <TabsList className="grid grid-cols-5 w-full">
              {SUPPORTED_CRYPTOS.map(crypto => (
                <TabsTrigger key={crypto.code} value={crypto.code}>
                  <div className="flex flex-col items-center gap-1">
                    <Icon name={crypto.icon as any} size={20} />
                    <span className="text-xs">{crypto.code}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {SUPPORTED_CRYPTOS.map(crypto => (
              <TabsContent key={crypto.code} value={crypto.code} className="space-y-4 mt-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border border-orange-200 dark:border-orange-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                      <Icon name={crypto.icon as any} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{crypto.name}</h3>
                      <p className="text-sm text-muted-foreground">Уникальный адрес для депозита</p>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : depositAddress ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Адрес для пополнения {crypto.code}
                        </Label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-900 rounded-lg p-4 font-mono text-sm break-all">
                            {depositAddress.address}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyAddress}
                            className="h-auto border-2 border-orange-200 dark:border-orange-900 hover:bg-orange-100 dark:hover:bg-orange-950"
                          >
                            <Icon name={copied ? "Check" : "Copy"} size={20} className={copied ? "text-green-600" : ""} />
                          </Button>
                        </div>
                      </div>

                      {depositAddress.tag && (
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Tag / Memo (обязательно указать при переводе!)
                          </Label>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-red-200 dark:border-red-900 rounded-lg p-4 font-mono text-sm">
                              {depositAddress.tag}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleCopyTag}
                              className="h-auto border-2 border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950"
                            >
                              <Icon name="Copy" size={20} />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold mb-1">Внимание!</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>Отправляйте только {crypto.name} на этот адрес</li>
                              <li>Минимальная сумма депозита: уточните в CryptoCloud</li>
                              <li>Средства зачислятся после подтверждения в сети</li>
                              {depositAddress.tag && (
                                <li className="text-red-600 dark:text-red-400 font-semibold">
                                  Обязательно укажите Tag/Memo при переводе!
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Не удалось загрузить адрес
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Как это работает:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Скопируйте уникальный адрес для выбранной криптовалюты</li>
                <li>Отправьте криптовалюту на этот адрес из вашего кошелька</li>
                <li>Дождитесь подтверждений в блокчейн сети</li>
                <li>Средства автоматически зачислятся на ваш баланс</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
