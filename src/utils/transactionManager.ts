import { Transaction, TransactionType, TransactionStatus, Currency } from '@/types';

export const createTransaction = (data: {
  type: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  status?: TransactionStatus;
  relatedBookingId?: number;
  fromUser?: string;
  toUser?: string;
  fee?: number;
}): Transaction => {
  return {
    id: Date.now(),
    type: data.type,
    amount: data.amount,
    currency: data.currency,
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
    description: data.description,
    relatedBookingId: data.relatedBookingId,
    fromUser: data.fromUser,
    toUser: data.toUser,
    fee: data.fee || 0,
  };
};

export const completeTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };
};

export const failTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    status: 'failed',
    completedAt: new Date().toISOString(),
  };
};

export const cancelTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    status: 'cancelled',
    completedAt: new Date().toISOString(),
  };
};

// Создание транзакции для пополнения
export const createDepositTransaction = (
  amount: number,
  currency: Currency
): Transaction => {
  return createTransaction({
    type: 'deposit',
    amount,
    currency,
    description: `Пополнение счета ${currency}`,
    status: 'completed', // Мгновенное зачисление для демо
  });
};

// Создание транзакции для вывода
export const createWithdrawTransaction = (
  amount: number,
  currency: Currency,
  address: string
): Transaction => {
  return createTransaction({
    type: 'withdraw',
    amount,
    currency,
    description: `Вывод средств на ${address.substring(0, 20)}...`,
    status: 'pending',
  });
};

// Создание транзакции для оплаты бронирования
export const createBookingPaymentTransaction = (
  bookingId: number,
  amount: number,
  currency: Currency,
  sellerName: string
): Transaction => {
  return createTransaction({
    type: 'booking_payment',
    amount,
    currency,
    description: `Оплата встречи с ${sellerName}`,
    status: 'completed',
    relatedBookingId: bookingId,
    toUser: sellerName,
  });
};

// Создание транзакции для возврата
export const createBookingRefundTransaction = (
  bookingId: number,
  amount: number,
  currency: Currency,
  reason: string
): Transaction => {
  return createTransaction({
    type: 'booking_refund',
    amount,
    currency,
    description: `Возврат средств: ${reason}`,
    status: 'completed',
    relatedBookingId: bookingId,
  });
};

// Создание транзакции для продавца (получение оплаты)
export const createBookingReceivedTransaction = (
  bookingId: number,
  amount: number,
  currency: Currency,
  buyerName: string,
  fee: number
): Transaction => {
  return createTransaction({
    type: 'booking_received',
    amount: amount - fee,
    currency,
    description: `Получение оплаты от ${buyerName}`,
    status: 'completed',
    relatedBookingId: bookingId,
    fromUser: buyerName,
    fee,
  });
};

// Создание транзакции для продления встречи
export const createBookingExtendTransaction = (
  bookingId: number,
  amount: number,
  currency: Currency,
  hours: number,
  sellerName: string
): Transaction => {
  return createTransaction({
    type: 'booking_extend',
    amount,
    currency,
    description: `Продление встречи на ${hours} ч с ${sellerName}`,
    status: 'completed',
    relatedBookingId: bookingId,
    toUser: sellerName,
  });
};

// Создание транзакции для VIP
export const createVIPPaymentTransaction = (
  amount: number,
  currency: Currency,
  planName: string
): Transaction => {
  return createTransaction({
    type: 'vip_payment',
    amount,
    currency,
    description: `Оплата VIP статуса: ${planName}`,
    status: 'completed',
  });
};

// Создание транзакции для чаевых (отправитель)
export const createTipSentTransaction = (
  amount: number,
  currency: Currency,
  sellerName: string
): Transaction => {
  return createTransaction({
    type: 'tip_sent',
    amount,
    currency,
    description: `Чаевые для ${sellerName}`,
    status: 'completed',
    toUser: sellerName,
  });
};

// Создание транзакции для чаевых (получатель)
export const createTipReceivedTransaction = (
  amount: number,
  currency: Currency,
  buyerName: string
): Transaction => {
  return createTransaction({
    type: 'tip_received',
    amount,
    currency,
    description: `Чаевые от ${buyerName}`,
    status: 'completed',
    fromUser: buyerName,
  });
};

// Фильтрация транзакций по дате
export const filterTransactionsByDate = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter(t => {
    const date = new Date(t.createdAt);
    return date >= startDate && date <= endDate;
  });
};

// Расчет баланса из транзакций
export const calculateBalanceFromTransactions = (
  transactions: Transaction[],
  currency: Currency,
  initialBalance: number = 0
): number => {
  const incoming = transactions
    .filter(t => 
      t.currency === currency && 
      t.status === 'completed' &&
      ['deposit', 'booking_refund', 'booking_received', 'tip_received'].includes(t.type)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const outgoing = transactions
    .filter(t => 
      t.currency === currency && 
      t.status === 'completed' &&
      ['withdraw', 'booking_payment', 'booking_extend', 'vip_payment', 'tip_sent'].includes(t.type)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return initialBalance + incoming - outgoing;
};

// Статистика транзакций
export const getTransactionStats = (transactions: Transaction[]) => {
  const completed = transactions.filter(t => t.status === 'completed');
  
  const totalIncome = completed
    .filter(t => ['deposit', 'booking_refund', 'booking_received', 'tip_received'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = completed
    .filter(t => ['withdraw', 'booking_payment', 'booking_extend', 'vip_payment', 'tip_sent'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = completed
    .reduce((sum, t) => sum + (t.fee || 0), 0);

  return {
    totalIncome,
    totalExpense,
    totalFees,
    netBalance: totalIncome - totalExpense,
    transactionCount: completed.length,
  };
};

// Экспорт транзакций в CSV
export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
  const headers = ['Дата', 'Тип', 'Описание', 'Сумма', 'Валюта', 'Статус', 'Комиссия'];
  const rows = transactions.map(t => [
    new Date(t.createdAt).toLocaleString('ru-RU'),
    t.type,
    t.description,
    t.amount.toString(),
    t.currency,
    t.status,
    (t.fee || 0).toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};
