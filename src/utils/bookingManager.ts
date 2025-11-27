import { Booking, BookingStatus, Currency } from '@/types';

export const createBooking = (data: {
  serviceId: number;
  serviceName: string;
  serviceCategory: string;
  sellerId: number;
  sellerName: string;
  buyerId: number;
  buyerName: string;
  date: string;
  time: string;
  duration: number;
  pricePerHour: number;
  currency: Currency;
  note?: string;
}): Booking => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 минут

  return {
    id: Date.now(),
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    serviceCategory: data.serviceCategory,
    sellerId: data.sellerId,
    sellerName: data.sellerName,
    buyerId: data.buyerId,
    buyerName: data.buyerName,
    date: data.date,
    time: data.time,
    duration: data.duration,
    pricePerHour: data.pricePerHour,
    totalPrice: data.pricePerHour * data.duration,
    currency: data.currency,
    status: 'pending_seller_confirmation',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
};

export const confirmBooking = (booking: Booking): Booking => {
  return {
    ...booking,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
    expiresAt: undefined,
  };
};

export const rejectBooking = (booking: Booking): Booking => {
  return {
    ...booking,
    status: 'rejected',
  };
};

export const sellerReady = (booking: Booking): Booking => {
  if (booking.status !== 'confirmed') return booking;
  return {
    ...booking,
    status: 'seller_ready',
    sellerReadyAt: new Date().toISOString(),
  };
};

export const buyerReady = (booking: Booking): Booking => {
  if (booking.status !== 'seller_ready') return booking;
  
  const totalSeconds = booking.duration * 3600;
  
  return {
    ...booking,
    status: 'in_progress',
    buyerReadyAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    remainingTime: totalSeconds,
  };
};

export const extendBooking = (booking: Booking, amount: number, pricePerHour: number): Booking => {
  if (booking.status !== 'in_progress') return booking;
  
  const isVirtualSex = booking.serviceCategory === 'virtual';
  let additionalSeconds: number;
  let additionalCost: number;
  let additionalHours: number;
  
  if (isVirtualSex) {
    additionalSeconds = amount * 60;
    additionalHours = amount / 60;
    additionalCost = (amount / 60) * pricePerHour;
  } else {
    additionalSeconds = amount * 3600;
    additionalHours = amount;
    additionalCost = amount * pricePerHour;
  }
  
  return {
    ...booking,
    duration: booking.duration + additionalHours,
    totalPrice: booking.totalPrice + additionalCost,
    remainingTime: (booking.remainingTime || 0) + additionalSeconds,
  };
};

export const completeBooking = (booking: Booking): Booking => {
  return {
    ...booking,
    status: 'completed',
    completedAt: new Date().toISOString(),
    remainingTime: 0,
  };
};

export const cancelBooking = (booking: Booking): Booking => {
  return {
    ...booking,
    status: 'cancelled',
  };
};

export const getBookingStatusLabel = (status: BookingStatus): { text: string; color: string } => {
  const statusLabels: Record<BookingStatus, { text: string; color: string }> = {
    pending_seller_confirmation: { text: 'Ожидает подтверждения', color: 'yellow' },
    confirmed: { text: 'Подтверждено', color: 'blue' },
    seller_ready: { text: 'Продавец готова', color: 'cyan' },
    buyer_ready: { text: 'Покупатель готов', color: 'cyan' },
    in_progress: { text: 'Встреча идет', color: 'green' },
    completed: { text: 'Завершено', color: 'gray' },
    cancelled: { text: 'Отменено', color: 'red' },
    rejected: { text: 'Отклонено', color: 'red' },
  };
  
  return statusLabels[status];
};

export const canExtendBooking = (booking: Booking, userBalance: number): boolean => {
  return booking.status === 'in_progress' && userBalance >= booking.pricePerHour;
};

export const isBookingExpired = (booking: Booking): boolean => {
  if (!booking.expiresAt) return false;
  return new Date() > new Date(booking.expiresAt);
};