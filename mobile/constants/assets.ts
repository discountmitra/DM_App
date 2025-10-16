// Central assets used on Home tab, exported in the same shape as deals

// Deals used on Home tab (combined here for single-source of truth)
export interface Deal {
  id: number;
  image: string;
  title?: string;
  description?: string;
}

export const deals: ReadonlyArray<Deal> = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884717/1_hj0mlp.jpg",
    title: "Vishala Shopping Mall",
    description: "Get exclusive discounts at Vishala Shopping Mall"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884714/2_bolxxh.jpg",
    title: "Food & Restaurants",
    description: "Discover amazing restaurants and food deals"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884719/3_h5xxtl.jpg",
    title: "LULU Children's Hospital",
    description: "Quality healthcare for your children"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884736/4_fhom8u.png",
    title: "Hair Zone Makeover",
    description: "Professional hair and beauty services"
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884771/5_xrcjpv.png",
    title: "Ultratech Cement",
    description: "Premium construction materials"
  },
];

// Additional home images (logos/banners/etc) kept in the same format for DB/storage consistency
export const homeImages: ReadonlyArray<Deal> = [
  {
    id: 101,
    image: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png`,
    title: 'VIP Banner',
    description: 'VIP membership promotional banner'
  },
  {
    id: 102,
    image: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png`,
    title: 'App Logo',
    description: 'Branding logo used across app'
  },
  {
    id: 103,
    image: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/no-data.svg`,
    title: 'No Data Illustration',
    description: 'Empty state illustration'
  },
  {
    id: 104,
    image: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/soon.svg`,
    title: 'Coming Soon Illustration',
    description: 'Upcoming feature placeholder'
  },
];

// Compatibility exports for existing screens (URLs only, no local requires)
export const vipBannerImage = { uri: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png` } as const;
export const logoImage = { uri: `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png` } as const;
export const noDataSvgUrl = `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/no-data.svg` as const;
export const soonSvgUrl = `https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/soon.svg` as const;
// Use logo as a generic default placeholder (remote only)
export const defaultImage = logoImage;
