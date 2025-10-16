// Central assets index file for managing all image references
// This makes it easy to swap images or update paths in the future

// Remote asset URLs (Supabase)
const SUPABASE_BASE = 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets';

export const Assets = {
  // Default images (kept local as not requested to migrate)
  default: require('../assets/default.png'),
  deal: require('../assets/deal.png'),

  // Remote URLs
  vipBannerUrl: `${SUPABASE_BASE}/vip-banner.png`,
  noDataUrl: `${SUPABASE_BASE}/no-data.svg`,
  soonUrl: `${SUPABASE_BASE}/soon.svg`,
  logoUrl: `${SUPABASE_BASE}/logo.png`,

  // Sample images (if any)
  c1: require('../assets/c1.png'),
  c2: require('../assets/c2.jpg'),
  c3: require('../assets/c3.jpg'),
} as const;

// Type for asset keys
export type AssetKey = keyof typeof Assets;

// Helper function to get asset by key
export const getAsset = (key: AssetKey) => Assets[key];

// Helper function to check if asset exists
export const hasAsset = (key: string): key is AssetKey => key in Assets;

// Individual exports for convenience
export const defaultImage = Assets.default;

// Image component friendly sources for remote PNGs
export const vipBannerImage = { uri: Assets.vipBannerUrl } as const;
export const logoImage = { uri: Assets.logoUrl } as const;

// Expose illustration URLs for SvgUri usage
export const noDataSvgUrl = Assets.noDataUrl;
export const soonSvgUrl = Assets.soonUrl;
