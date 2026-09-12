/**
 * Polish plural for "danie": 1 danie, 2–4 dania, 5+ / teens dań.
 */
export function dishWord(count: number): string {
  const n = Math.abs(Math.trunc(count));
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return 'danie';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'dania';
  return 'dań';
}

export function formatDishCount(count: number): string {
  return `${count} ${dishWord(count)}`;
}

/** Map English dietary tag keys to Polish labels for UI. */
export const DIET_TAG_LABELS_PL: Record<string, string> = {
  'high-protein': 'Wysokobiałkowe',
  'gluten-free': 'Bez glutenu',
  vegetarian: 'Wegetariańskie',
  vegan: 'Wegańskie',
  keto: 'Keto',
  'low-calorie': 'Niskokaloryczne',
  none: 'Bez ograniczeń',
};

export function dietTagLabel(tag: string): string {
  return DIET_TAG_LABELS_PL[tag] ?? tag;
}
