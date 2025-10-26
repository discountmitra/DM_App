require('dotenv').config();
const Asset = require('../src/models/Asset');
const { sequelize } = require('../src/db');

async function addVipInfoImage() {
  try {
    console.log('Adding VIP info image to database...');
    
    // Check if VIP info image already exists
    const existingVipInfo = await Asset.findOne({
      where: { type: 'vip_info' }
    });
    
    if (existingVipInfo) {
      console.log('VIP info image already exists in database');
      console.log('Existing record:', existingVipInfo.toJSON());
      return;
    }
    
    // Add VIP info image
    const vipInfoAsset = await Asset.create({
      type: 'vip_info',
      image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-info.jpg',
      title: 'VIP Info',
      description: 'VIP information banner for VIP users'
    });
    
    console.log('✅ VIP info image added successfully:', vipInfoAsset.toJSON());
    
  } catch (error) {
    console.error('❌ Error adding VIP info image:', error.message);
  } finally {
    await sequelize.close();
  }
}

addVipInfoImage();
