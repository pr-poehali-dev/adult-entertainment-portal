export interface PaymentWebhookData {
  telegram_user_id: number;
  payment: {
    amount: number;
    currency: string;
    payload: {
      type: string;
      rub?: number;
      love?: number;
      [key: string]: any;
    };
    telegram_payment_charge_id: string;
    provider_payment_charge_id?: string;
  };
}

export const handlePaymentWebhook = (
  data: PaymentWebhookData,
  onBalanceUpdate: (amount: number, currency: string) => void,
  onNotification: (title: string, description: string) => void
) => {
  const { payment } = data;
  const { payload, amount, currency } = payment;

  if (payload.type === 'love_purchase' && payload.love) {
    onBalanceUpdate(payload.love, 'LOVE');
    onNotification(
      '💗 LOVE токены зачислены!',
      `На ваш баланс зачислено ${payload.love} LOVE токенов`
    );
  } else if (payload.type === 'balance_topup') {
    onBalanceUpdate(amount, currency);
    onNotification(
      '💰 Баланс пополнен!',
      `На ваш счёт зачислено ${amount} ${currency}`
    );
  }
};

export const listenForPayments = (
  telegramUserId: number,
  onPayment: (data: PaymentWebhookData) => void
) => {
  const checkPayments = async () => {
    try {
      const eventSource = new EventSource(
        `https://functions.poehali.dev/05a886f0-8259-4934-933b-0f3e1e110704/payments/stream?user_id=${telegramUserId}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onPayment(data);
      };

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(() => checkPayments(), 30000);
      };

      return eventSource;
    } catch (error) {
      console.error('Error listening for payments:', error);
    }
  };

  return checkPayments();
};
