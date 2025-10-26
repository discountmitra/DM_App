// Using built-in fetch (Node.js 18+)

async function testAssetsAPI() {
  try {
    console.log('🔧 Testing Assets API');
    console.log('====================');
    
    const response = await fetch('http://192.168.0.12:4000/assets');
    const data = await response.json();
    
    console.log(`✅ Assets API working - ${data.length} assets found`);
    
    // Check for VIP info asset
    const vipInfoAsset = data.find(asset => asset.type === 'vip_info');
    if (vipInfoAsset) {
      console.log('✅ VIP info asset found:');
      console.log(`   ID: ${vipInfoAsset.id}`);
      console.log(`   Type: ${vipInfoAsset.type}`);
      console.log(`   Title: ${vipInfoAsset.title}`);
      console.log(`   Image URL: ${vipInfoAsset.image}`);
    } else {
      console.log('❌ VIP info asset not found');
    }
    
    // Check for VIP banner asset
    const vipBannerAsset = data.find(asset => asset.type === 'vip_banner');
    if (vipBannerAsset) {
      console.log('✅ VIP banner asset found:');
      console.log(`   ID: ${vipBannerAsset.id}`);
      console.log(`   Type: ${vipBannerAsset.type}`);
      console.log(`   Title: ${vipBannerAsset.title}`);
      console.log(`   Image URL: ${vipBannerAsset.image}`);
    } else {
      console.log('❌ VIP banner asset not found');
    }
    
    console.log('\n🏁 Assets API test completed');
    
  } catch (error) {
    console.error('❌ Error testing Assets API:', error.message);
  }
}

testAssetsAPI();
