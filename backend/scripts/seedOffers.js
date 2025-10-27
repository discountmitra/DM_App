require('dotenv').config();
const { sequelize } = require('../src/db');
const Offer = require('../src/models/Offer');

const offersData = [
  // Hospital offers
  { category: 'hospital', serviceType: 'Hospitals', userType: 'normal', offerText: 'OP consultation: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Hospitals', userType: 'normal', offerText: 'Lab tests: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Hospitals', userType: 'normal', offerText: 'Emergency: Priority booking', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Hospitals', userType: 'vip', offerText: 'OP consultation: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Hospitals', userType: 'vip', offerText: 'Lab tests: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Hospitals', userType: 'vip', offerText: 'Emergency: Free consultation', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Diagnostics', userType: 'normal', offerText: 'Blood tests: 15% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Diagnostics', userType: 'normal', offerText: 'X-ray: 10% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Diagnostics', userType: 'normal', offerText: 'MRI/CT: 5% off', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Diagnostics', userType: 'vip', offerText: 'Blood tests: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Diagnostics', userType: 'vip', offerText: 'X-ray: 20% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Diagnostics', userType: 'vip', offerText: 'MRI/CT: 15% off', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Pharmacy', userType: 'normal', offerText: 'Medicines: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Pharmacy', userType: 'normal', offerText: 'Generic drugs: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Pharmacy', userType: 'normal', offerText: 'Delivery: Free', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Pharmacy', userType: 'vip', offerText: 'Medicines: 20% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Pharmacy', userType: 'vip', offerText: 'Generic drugs: 25% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Pharmacy', userType: 'vip', offerText: 'Delivery: Express free', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Dental', userType: 'normal', offerText: 'Consultation: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Dental', userType: 'normal', offerText: 'Cleaning: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Dental', userType: 'normal', offerText: 'X-ray: Free', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Dental', userType: 'vip', offerText: 'Consultation: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Dental', userType: 'vip', offerText: 'Cleaning: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Dental', userType: 'vip', offerText: 'X-ray: Free', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Eye', userType: 'normal', offerText: 'Eye test: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Eye', userType: 'normal', offerText: 'Spectacles: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Eye', userType: 'normal', offerText: 'Lenses: 10% off', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Eye', userType: 'vip', offerText: 'Eye test: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Eye', userType: 'vip', offerText: 'Spectacles: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Eye', userType: 'vip', offerText: 'Lenses: 20% off', displayOrder: 3 },

  { category: 'hospital', serviceType: 'ENT', userType: 'normal', offerText: 'Consultation: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'ENT', userType: 'normal', offerText: 'Hearing test: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'ENT', userType: 'normal', offerText: 'Treatment: 10% off', displayOrder: 3 },
  { category: 'hospital', serviceType: 'ENT', userType: 'vip', offerText: 'Consultation: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'ENT', userType: 'vip', offerText: 'Hearing test: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'ENT', userType: 'vip', offerText: 'Treatment: 20% off', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Veterinary', userType: 'normal', offerText: 'Consultation: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Veterinary', userType: 'normal', offerText: 'Vaccination: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Veterinary', userType: 'normal', offerText: 'Treatment: 10% off', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Veterinary', userType: 'vip', offerText: 'Consultation: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Veterinary', userType: 'vip', offerText: 'Vaccination: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Veterinary', userType: 'vip', offerText: 'Treatment: 20% off', displayOrder: 3 },

  { category: 'hospital', serviceType: 'Clinics', userType: 'normal', offerText: 'OP consultation: 10% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Clinics', userType: 'normal', offerText: 'Lab tests: 15% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Clinics', userType: 'normal', offerText: 'Follow-up: Free', displayOrder: 3 },
  { category: 'hospital', serviceType: 'Clinics', userType: 'vip', offerText: 'OP consultation: 25% off', displayOrder: 1 },
  { category: 'hospital', serviceType: 'Clinics', userType: 'vip', offerText: 'Lab tests: 30% off', displayOrder: 2 },
  { category: 'hospital', serviceType: 'Clinics', userType: 'vip', offerText: 'Follow-up: Free', displayOrder: 3 },

  // Home Service offers
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'normal', offerText: 'Service call: ₹200', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'normal', offerText: 'Repair: 10% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'normal', offerText: 'Emergency: ₹300', displayOrder: 3 },
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'vip', offerText: 'Free service call', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'vip', offerText: 'Repair: 25% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Repairs & Maintenance', userType: 'vip', offerText: 'Emergency: Free', displayOrder: 3 },

  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'normal', offerText: 'Deep cleaning: 15% off', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'normal', offerText: 'Pest control: 10% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'normal', offerText: 'Monthly service: 20% off', displayOrder: 3 },
  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'vip', offerText: 'Deep cleaning: 30% off', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'vip', offerText: 'Pest control: 25% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Cleaning & Pest Control', userType: 'vip', offerText: 'Monthly service: 40% off', displayOrder: 3 },

  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'normal', offerText: 'CCTV installation: 10% off', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'normal', offerText: 'Monitoring: 15% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'normal', offerText: 'Maintenance: Free', displayOrder: 3 },
  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'vip', offerText: 'CCTV installation: 25% off', displayOrder: 1 },
  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'vip', offerText: 'Monitoring: 30% off', displayOrder: 2 },
  { category: 'home-service', serviceType: 'Security & Surveillance', userType: 'vip', offerText: 'Maintenance: Free', displayOrder: 3 },

  // Event offers
  { category: 'event', serviceType: 'Decoration', userType: 'normal', offerText: 'Basic decoration: 15% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Decoration', userType: 'normal', offerText: 'Theme setup: 10% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Decoration', userType: 'normal', offerText: 'Flowers: 20% off', displayOrder: 3 },
  { category: 'event', serviceType: 'Decoration', userType: 'vip', offerText: 'Premium decoration: 30% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Decoration', userType: 'vip', offerText: 'Luxury theme: 25% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Decoration', userType: 'vip', offerText: 'Premium flowers: 35% off', displayOrder: 3 },

  { category: 'event', serviceType: 'DJ & Lighting', userType: 'normal', offerText: 'DJ service: 15% off', displayOrder: 1 },
  { category: 'event', serviceType: 'DJ & Lighting', userType: 'normal', offerText: 'Sound system: 10% off', displayOrder: 2 },
  { category: 'event', serviceType: 'DJ & Lighting', userType: 'normal', offerText: 'Lighting: 20% off', displayOrder: 3 },
  { category: 'event', serviceType: 'DJ & Lighting', userType: 'vip', offerText: 'Premium DJ: 30% off', displayOrder: 1 },
  { category: 'event', serviceType: 'DJ & Lighting', userType: 'vip', offerText: 'Professional sound: 25% off', displayOrder: 2 },
  { category: 'event', serviceType: 'DJ & Lighting', userType: 'vip', offerText: 'LED lighting: 35% off', displayOrder: 3 },

  { category: 'event', serviceType: 'Tent House', userType: 'normal', offerText: 'Tent rental: 10% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Tent House', userType: 'normal', offerText: 'Furniture: 15% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Tent House', userType: 'normal', offerText: 'Setup: Free', displayOrder: 3 },
  { category: 'event', serviceType: 'Tent House', userType: 'vip', offerText: 'Premium tent: 25% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Tent House', userType: 'vip', offerText: 'Luxury furniture: 30% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Tent House', userType: 'vip', offerText: 'Setup: Free', displayOrder: 3 },

  { category: 'event', serviceType: 'Function Halls', userType: 'normal', offerText: 'Hall booking: 10% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Function Halls', userType: 'normal', offerText: 'Catering: 15% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Function Halls', userType: 'normal', offerText: 'Decoration: 20% off', displayOrder: 3 },
  { category: 'event', serviceType: 'Function Halls', userType: 'vip', offerText: 'Premium hall: 25% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Function Halls', userType: 'vip', offerText: 'Premium catering: 30% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Function Halls', userType: 'vip', offerText: 'Luxury decoration: 35% off', displayOrder: 3 },

  { category: 'event', serviceType: 'Catering', userType: 'normal', offerText: 'Veg menu: 10% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Catering', userType: 'normal', offerText: 'Non-veg: 15% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Catering', userType: 'normal', offerText: 'Staff: Free', displayOrder: 3 },
  { category: 'event', serviceType: 'Catering', userType: 'vip', offerText: 'Premium veg: 25% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Catering', userType: 'vip', offerText: 'Premium non-veg: 30% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Catering', userType: 'vip', offerText: 'Staff: Premium free', displayOrder: 3 },

  { category: 'event', serviceType: 'Mehendi Art', userType: 'normal', offerText: 'Bridal mehendi: 15% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Mehendi Art', userType: 'normal', offerText: 'Party mehendi: 10% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Mehendi Art', userType: 'normal', offerText: 'Design: Free', displayOrder: 3 },
  { category: 'event', serviceType: 'Mehendi Art', userType: 'vip', offerText: 'Luxury bridal: 30% off', displayOrder: 1 },
  { category: 'event', serviceType: 'Mehendi Art', userType: 'vip', offerText: 'Premium party: 25% off', displayOrder: 2 },
  { category: 'event', serviceType: 'Mehendi Art', userType: 'vip', offerText: 'Design: Custom free', displayOrder: 3 },

  // Construction offers
  { category: 'construction', serviceType: 'Cement', userType: 'normal', offerText: 'Material supply: ₹5 off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Cement', userType: 'normal', offerText: 'Labour charges: Standard rate', displayOrder: 2 },
  { category: 'construction', serviceType: 'Cement', userType: 'normal', offerText: 'Booking charges: ₹9', displayOrder: 3 },
  { category: 'construction', serviceType: 'Cement', userType: 'vip', offerText: 'Material supply: ₹10 off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Cement', userType: 'vip', offerText: 'Labour charges: Standard rate', displayOrder: 2 },
  { category: 'construction', serviceType: 'Cement', userType: 'vip', offerText: 'Booking charges: Free', displayOrder: 3 },

  { category: 'construction', serviceType: 'Steel', userType: 'normal', offerText: 'Steel: 5% off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Steel', userType: 'normal', offerText: 'Delivery charges: Standard rate (market rate)', displayOrder: 2 },
  { category: 'construction', serviceType: 'Steel', userType: 'normal', offerText: 'Booking charges: ₹9', displayOrder: 3 },
  { category: 'construction', serviceType: 'Steel', userType: 'vip', offerText: 'Steel: 10% off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Steel', userType: 'vip', offerText: 'Delivery charges: Standard rate (market rate)', displayOrder: 2 },
  { category: 'construction', serviceType: 'Steel', userType: 'vip', offerText: 'Booking charges: Free', displayOrder: 3 },

  { category: 'construction', serviceType: 'Bricks', userType: 'normal', offerText: 'Bricks: ₹500 off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Bricks', userType: 'normal', offerText: 'Delivery: Free', displayOrder: 2 },
  { category: 'construction', serviceType: 'Bricks', userType: 'normal', offerText: 'Booking charges: ₹9', displayOrder: 3 },
  { category: 'construction', serviceType: 'Bricks', userType: 'vip', offerText: 'Bricks: ₹1000 off', displayOrder: 1 },
  { category: 'construction', serviceType: 'Bricks', userType: 'vip', offerText: 'Delivery: Free', displayOrder: 2 },
  { category: 'construction', serviceType: 'Bricks', userType: 'vip', offerText: 'Booking charges: Free', displayOrder: 3 },

  { category: 'construction', serviceType: 'Interior Services', userType: 'normal', offerText: 'Free estimation', displayOrder: 1 },
  { category: 'construction', serviceType: 'Interior Services', userType: 'normal', offerText: 'Booking charges: ₹9', displayOrder: 2 },
  { category: 'construction', serviceType: 'Interior Services', userType: 'vip', offerText: 'Free estimation', displayOrder: 1 },
  { category: 'construction', serviceType: 'Interior Services', userType: 'vip', offerText: 'Free monitoring', displayOrder: 2 },
  { category: 'construction', serviceType: 'Interior Services', userType: 'vip', offerText: 'Booking charges: Free', displayOrder: 3 },

  // Food offers
  { category: 'food', serviceType: 'Restaurants', userType: 'normal', offerText: 'Dine-out: 5% off', displayOrder: 1 },
  { category: 'food', serviceType: 'Restaurants', userType: 'normal', offerText: 'Online payment: Available', displayOrder: 2 },
  { category: 'food', serviceType: 'Restaurants', userType: 'vip', offerText: 'Dine-out: 10% off', displayOrder: 1 },
  { category: 'food', serviceType: 'Restaurants', userType: 'vip', offerText: 'Online payment: Available', displayOrder: 2 },

  // Shopping offers
  { category: 'shopping', serviceType: 'Vishala Shopping Mall', userType: 'normal', offerText: 'Discount: 5% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Vishala Shopping Mall', userType: 'vip', offerText: 'Discount: 10% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Trends', userType: 'normal', offerText: 'Discount: 3% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Trends', userType: 'vip', offerText: 'Discount: 5% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Adven Mens Store', userType: 'normal', offerText: 'Discount: 7% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Adven Mens Store', userType: 'vip', offerText: 'Discount: 15% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Jockey', userType: 'normal', offerText: 'Discount: 6% off', displayOrder: 1 },
  { category: 'shopping', serviceType: 'Jockey', userType: 'vip', offerText: 'Discount: 12% off', displayOrder: 1 },

  // Beauty offers
  { category: 'beauty', serviceType: 'Haircuts', userType: 'normal', offerText: 'Haircut: ₹110 (was ₹130)', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Haircuts', userType: 'normal', offerText: 'Styling: 10% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Haircuts', userType: 'normal', offerText: 'Wash: Free', displayOrder: 3 },
  { category: 'beauty', serviceType: 'Haircuts', userType: 'vip', offerText: 'Premium haircut: ₹99', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Haircuts', userType: 'vip', offerText: 'Styling: 25% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Haircuts', userType: 'vip', offerText: 'Wash: Premium free', displayOrder: 3 },

  { category: 'beauty', serviceType: 'Facial', userType: 'normal', offerText: 'Facial: ₹180 (was ₹200)', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Facial', userType: 'normal', offerText: 'De-tan: 15% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Facial', userType: 'normal', offerText: 'Masks: 10% off', displayOrder: 3 },
  { category: 'beauty', serviceType: 'Facial', userType: 'vip', offerText: 'Luxury facial: ₹149', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Facial', userType: 'vip', offerText: 'De-tan: 30% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Facial', userType: 'vip', offerText: 'Masks: 25% off', displayOrder: 3 },

  { category: 'beauty', serviceType: 'Coloring', userType: 'normal', offerText: 'Hair color: 10% off', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Coloring', userType: 'normal', offerText: 'Highlights: 15% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Coloring', userType: 'normal', offerText: 'Treatment: 20% off', displayOrder: 3 },
  { category: 'beauty', serviceType: 'Coloring', userType: 'vip', offerText: 'Premium color: 25% off', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Coloring', userType: 'vip', offerText: 'Highlights: 30% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Coloring', userType: 'vip', offerText: 'Treatment: 35% off', displayOrder: 3 },

  { category: 'beauty', serviceType: 'Spa', userType: 'normal', offerText: 'Spa treatment: 15% off', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Spa', userType: 'normal', offerText: 'Massage: 10% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Spa', userType: 'normal', offerText: 'Aromatherapy: 20% off', displayOrder: 3 },
  { category: 'beauty', serviceType: 'Spa', userType: 'vip', offerText: 'Luxury spa: 30% off', displayOrder: 1 },
  { category: 'beauty', serviceType: 'Spa', userType: 'vip', offerText: 'Premium massage: 25% off', displayOrder: 2 },
  { category: 'beauty', serviceType: 'Spa', userType: 'vip', offerText: 'Aromatherapy: 35% off', displayOrder: 3 }
];

async function seedOffers() {
  try {
    console.log('🌱 Starting to seed offers...');
    
    // Sync the model to create the table
    await Offer.sync({ force: false });
    console.log('✅ Synced offers table');
    
    // Clear existing offers
    await Offer.destroy({ where: {} });
    console.log('✅ Cleared existing offers');
    
    // Insert new offers
    await Offer.bulkCreate(offersData);
    console.log(`✅ Successfully seeded ${offersData.length} offers`);
    
    console.log('🎉 Offers seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding offers:', error);
  } finally {
    await sequelize.close();
  }
}

seedOffers();

