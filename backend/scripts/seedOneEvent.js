const { sequelize } = require('../src/db');
const EventService = require('../src/models/EventService');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const data = {
      id: 'birthday-decoration',
      name: 'Birthday Decoration',
      description: 'Celebrate More, Spend Less! We customize decorations to fit your budget',
      category: 'Decoration',
      icon: 'gift',
      price: 'Starting at ₹1,499',
      details: 'Custom decorations for all budgets',
      rating: 4.8,
      reviews: 1200,
      availability: 'Available Now',
      image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/bdy/1.jpg',
      normalUserOffer: 'Basic decoration: ₹1,499\nStandard theme: 15% off\nPhotography: ₹2,000\nCatering: 10% off',
      vipUserOffer: 'Premium decoration: 30% off\nLuxury theme: 25% off\nProfessional photography: 20% off\nPremium catering: 20% off\nFree event coordination',
      phone: '8247556370',
      gallery: [
        'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/bdy/2.jpg',
        'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/bdy/3.jpg',
        'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/bdy/4.jpg',
      ],
    };

    await EventService.upsert(data);
    console.log('Seeded one event successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();


