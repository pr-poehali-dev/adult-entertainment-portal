import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ContactCensorshipNotice = () => {
  return (
    <Card className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Icon name="ShieldAlert" size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Защита конфиденциальности
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Для вашей безопасности все контактные данные в сообщениях автоматически скрываются:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span>Номера телефонов → <span className="text-red-500 font-bold">**********</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span>Telegram/Instagram → <span className="text-red-500 font-bold">**********</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span>Email адреса → <span className="text-red-500 font-bold">**********</span></span>
              </li>
            </ul>
            <p className="text-xs text-blue-600 dark:text-blue-400 italic">
              Используйте кнопку "Купить контакт" в профиле продавца для безопасного обмена данными
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
