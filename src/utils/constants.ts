// src/utils/constants.ts

export const SUCCESS_RATE_COLORS = {
  HIGH: 'text-emerald-500',
  MID: 'text-amber-500',
  LOW: 'text-red-500',
} as const;

export const GRADIENTS = [
  'bg-gradient-to-br from-indigo-500 to-purple-600',
  'bg-gradient-to-br from-purple-600 to-pink-600',
  'bg-gradient-to-br from-emerald-500 to-cyan-500',
  'bg-gradient-to-br from-amber-500 to-red-500',
  'bg-gradient-to-br from-blue-500 to-purple-600',
  'bg-gradient-to-br from-pink-600 to-rose-600',
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-lime-500 to-green-500',
];

export const getSuccessRateColor = (rate: number): string => {
  if (rate >= 90) return SUCCESS_RATE_COLORS.HIGH;
  if (rate >= 80) return SUCCESS_RATE_COLORS.MID;
  return SUCCESS_RATE_COLORS.LOW;
};

export const getRandomGradient = (): string => {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
};

export const USER_WALLET_ADDR_STORAGE_KEY = 'user_wallet';

export const CAMPAIGN_CONSTANTS = {
  MAX_KEYWORDS: 5,
  MIN_KEYWORDS: 1,
  MAX_DESCRIPTION_LENGTH: 500,
  DEFAULT_CAMPAIGN_DURATION_DAYS: 7,
  PLATFORM_FEE_PERCENTAGE: 0.1,
};

export const CAMPAIGN_TIPS = [
  'Higher budgets attract more participants',
  'Use unique keywords for better tracking',
  '7-14 days is optimal duration',
  'Clear token symbols work best',
];