export const RACKET_WEIGHTS = ['2U', '3U', '4U', '5U'] as const;
export const RACKET_GRIPS = ['G4', 'G5', 'G6'] as const;
export const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'] as const;
export const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const SHUTTLE_SPEEDS = ['76', '77'] as const;
export const BAG_SIZES = ['3 cây', '6 cây', '9 cây', '12 cây'] as const;

export type SpecKind = 'racket' | 'shoes' | 'apparel' | 'shuttle' | 'bag' | 'generic';

export function specKindFromSlug(slug?: string): SpecKind {
  const value = (slug ?? '').toLowerCase();
  if (value.includes('vot')) return 'racket';
  if (value.includes('giay')) return 'shoes';
  if (value.includes('cau-long') && (value.includes('ong') || value.includes('shuttle'))) return 'shuttle';
  if (value.includes('balo') || value.includes('bao-vot') || value.includes('tui')) return 'bag';
  if (value.includes('ao') || value.includes('quan') || value.includes('phu-kien')) return 'apparel';
  return 'generic';
}

export function parseVariantSpecs(attributes?: string) {
  if (!attributes) return { size: '', weight: '', grip: '', color: '' };
  try {
    const parsed = JSON.parse(attributes) as Record<string, string>;
    return {
      size: parsed.size ?? '',
      weight: parsed.weight ?? '',
      grip: parsed.grip ?? '',
      color: parsed.color ?? '',
    };
  } catch {
    return { size: '', weight: '', grip: '', color: '' };
  }
}
