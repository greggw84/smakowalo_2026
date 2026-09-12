/** First-week box promo vs regular weekly box price (zł). Delivery is separate. */
export const PLAN_PRICES = {
  2: { promo: 119, regular: 179 },
  4: { promo: 229, regular: 329 },
  6: { promo: 319, regular: 469 },
} as const;

export type PlanPeople = keyof typeof PLAN_PRICES;

export const DELIVERY_FEE = 19;
export const FREE_DELIVERY_FROM = 350;

/** Approximate zł / porcja in week 1. Never say "pierwsza dostawa". */
export const PER_PORTION_WEEK1: Record<PlanPeople, string> = {
  2: 'ok. 12–20 zł / porcja w 1. tygodniu',
  4: 'ok. 14–19 zł / porcja w 1. tygodniu',
  6: 'ok. 13–18 zł / porcja w 1. tygodniu',
};

export function getPromoPrice(people: PlanPeople): number {
  return PLAN_PRICES[people].promo;
}

export function getRegularPrice(people: PlanPeople): number {
  return PLAN_PRICES[people].regular;
}

/** 0 zł with subscription OR box ≥ 350 zł; otherwise 19 zł. */
export function getDeliveryFee(isSubscription: boolean, boxPrice: number): number {
  if (isSubscription || boxPrice >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_FEE;
}

export function parseOsoby(value: string | null): PlanPeople | null {
  if (value === '2' || value === '4' || value === '6') return Number(value) as PlanPeople;
  return null;
}

/** sub=1 → subscription; default / sub=0 → one-time. */
export function parseSub(value: string | null): boolean {
  return value === '1';
}
