require('dotenv').config();
const Asset = require('../src/models/Asset');
const { sequelize } = require('../src/db');

const assetData = [
  // Deals
  {
    type: 'deal',
    image: 'https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884717/1_hj0mlp.jpg',
    title: 'Vishala Shopping Mall',
    description: 'Get exclusive discounts at Vishala Shopping Mall',
  },
  {
    type: 'deal',
    image: 'https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884714/2_bolxxh.jpg',
    title: 'Food & Restaurants',
    description: 'Discover amazing restaurants and food deals',
  },
  {
    type: 'deal',
    image: 'https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884719/3_h5xxtl.jpg',
    title: 'LULU Children\'s Hospital',
    description: 'Quality healthcare for your children',
  },
  {
    type: 'deal',
    image: 'https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884736/4_fhom8u.png',
    title: 'Hair Zone Makeover',
    description: 'Professional hair and beauty services',
  },
  {
    type: 'deal',
    image: 'https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884771/5_xrcjpv.png',
    title: 'Ultratech Cement',
    description: 'Premium construction materials',
  },

  // Home Images
  {
    type: 'home_image',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png',
    title: 'VIP Banner',
    description: 'VIP membership promotional banner',
  },
  {
    type: 'home_image',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png',
    title: 'App Logo',
    description: 'Branding logo used across app',
  },
  {
    type: 'home_image',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/no-data.svg',
    title: 'No Data Illustration',
    description: 'Empty state illustration',
  },
  {
    type: 'home_image',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/soon.svg',
    title: 'Coming Soon Illustration',
    description: 'Upcoming feature placeholder',
  },

  // Special Assets for easy access
  {
    type: 'vip_banner',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png',
    title: 'VIP Banner',
    description: 'VIP membership promotional banner',
  },
  {
    type: 'logo',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png',
    title: 'App Logo',
    description: 'Branding logo used across app',
  },
  {
    type: 'no_data_svg',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/no-data.svg',
    title: 'No Data Illustration',
    description: 'Empty state illustration',
  },
  {
    type: 'soon_svg',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/soon.svg',
    title: 'Coming Soon Illustration',
    description: 'Upcoming feature placeholder',
  },
  {
    type: 'vip_info',
    image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-info.jpg',
    title: 'VIP Info',
    description: 'VIP information banner for VIP users',
  },
];

async function seedAssets() {
  try {
    console.log('Starting Assets seeding...');
    
    // Sync the model
    await Asset.sync({ force: true });
    console.log('Assets table synced');

    // Insert asset data
    await Asset.bulkCreate(assetData);
    console.log(`Successfully seeded ${assetData.length} asset entries`);

    console.log('Assets seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Assets data:', error);
  } finally {
    await sequelize.close();
  }
}

seedAssets();
