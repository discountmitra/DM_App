const { sequelize } = require('../src/db');
const ShoppingItem = require('../src/models/ShoppingItem');

// Shopping data from mobile/constants/shoppingData.ts
const shoppingData = [
  {
    id: "vishala-shopping-mall",
    name: "Vishala Shopping Mall",
    specialist: "Men, Women & Kids Shopping mall",
    description: "Normal: 5% off • VIP: 10% off",
    image: "https://plus.unsplash.com/premium_photo-1683121817275-85d1dcf9e4c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvcHBpbmclMjBtYWxsfGVufDB8fDB8fHww",
  },
  {
    id: "cmr-shopping-mall",
    name: "CMR Shopping Mall",
    specialist: "Men, Women & Kids Shopping mall",
    description: "Normal: 5% off • VIP: 10% off",
    image: "https://img.staticmb.com/mbcontent/images/crop/uploads/2024/11/cmr-shopping-mall_0_1200.jpg.webp",
  },
  {
    id: "adven-mens-store",
    name: "Adven Mens Store sircilla",
    specialist: "Men Shopping Center",
    description: "Normal: 7% off • VIP: 15% off)",
    image: "https://images.unsplash.com/photo-1559204260-9d9f024ab30a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVucyUyMHN0b3JlfGVufDB8fDB8fHww",
  },
  {
    id: "trends",
    name: "Trends",
    specialist: "Store",
    description: "Normal: 3% off • VIP: 5% off",
    image: "https://www.legalmantra.net/admin/assets/upload_image/blog/Trends.jpg",
  },
  {
    id: "jockey-india",
    name: "Jockey India",
    specialist: "https://www.jockey.in/",
    description: "Normal: 6% off • VIP: 12% off)",
    image: "https://www.infinitimall.com/wp-content/uploads/2023/09/Jockey-Malad-Infinti-Mall-1.jpg",
  },
];

async function seedShopping() {
  try {
    console.log('Starting shopping data seeding...');
    
    // Sync the model with the database
    await ShoppingItem.sync({ force: true });
    console.log('ShoppingItem table synced');
    
    // Insert all shopping items
    await ShoppingItem.bulkCreate(shoppingData);
    console.log(`Successfully seeded ${shoppingData.length} shopping items`);
    
    console.log('Shopping data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding shopping data:', error);
  } finally {
    await sequelize.close();
  }
}

seedShopping();
