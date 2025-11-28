import { ReferralUser } from '@/types';

export const REFERRAL_COMMISSION_RATES = {
  level1: 0.10, // 10%
  level2: 0.05, // 5%
  level3: 0.01, // 1%
};

export function generateReferralCode(userId: number, userName: string): string {
  const cleanName = userName.replace(/\s+/g, '').toLowerCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${userId}${randomSuffix}`;
}

export function generateReferralLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?ref=${referralCode}`;
}

export function parseReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('ref');
  } catch {
    return null;
  }
}

export function calculateCommission(amount: number, level: 1 | 2 | 3): number {
  const rates = {
    1: REFERRAL_COMMISSION_RATES.level1,
    2: REFERRAL_COMMISSION_RATES.level2,
    3: REFERRAL_COMMISSION_RATES.level3,
  };
  
  return amount * rates[level];
}

export function buildReferralTree(
  users: ReferralUser[],
  rootUserId: number
): { level1: ReferralUser[]; level2: ReferralUser[]; level3: ReferralUser[] } {
  const level1 = users.filter(u => u.level === 1);
  const level2 = users.filter(u => u.level === 2);
  const level3 = users.filter(u => u.level === 3);
  
  return { level1, level2, level3 };
}

export function validateReferralCode(code: string): boolean {
  return code.length >= 4 && /^[a-zA-Z0-9]+$/.test(code);
}

export function getReferralLevelLabel(level: 1 | 2 | 3): string {
  const labels = {
    1: 'Прямые рефералы (10%)',
    2: 'Рефералы 2 уровня (5%)',
    3: 'Рефералы 3 уровня (1%)',
  };
  
  return labels[level];
}
