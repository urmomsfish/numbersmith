export const PRO_PRICING = { MONTHLY: 7.99, YEARLY: 59.99 } as const;

export const PLAN_DURATION_DAYS = { MONTHLY: 30, YEARLY: 365 } as const;

export const TRIAL_DAYS = 7;

export function yearlySavingsPercent() {
  const monthlyAnnualized = PRO_PRICING.MONTHLY * 12;
  return Math.round(((monthlyAnnualized - PRO_PRICING.YEARLY) / monthlyAnnualized) * 100);
}
