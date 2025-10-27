// Enable loading TypeScript module from mobile/constants/eventsData.ts
require('dotenv').config();
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    esModuleInterop: true,
    allowJs: true,
    target: 'ES2020',
  },
});
const path = require('path');
const { sequelize } = require('../src/db');
const EventService = require('../src/models/EventService');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const eventsModulePath = path.resolve(__dirname, '../../mobile/constants/eventsData.ts');
    const { eventData } = require(eventsModulePath);

    // Normalize and upsert all
    const records = eventData.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description || null,
      category: e.category,
      icon: e.icon || null,
      price: e.price || null,
      details: e.details || null,
      capacity: e.capacity || null,
      location: e.location || null,
      rating: typeof e.rating === 'number' ? e.rating : 0,
      reviews: typeof e.reviews === 'number' ? e.reviews : 0,
      availability: e.availability || null,
      image: e.image || null,
      normalUserOffer: e.normalUserOffer || null,
      vipUserOffer: e.vipUserOffer || null,
      phone: e.phone || null,
      gallery: Array.isArray(e.gallery) ? e.gallery : null,
    }));

    for (const rec of records) {
      await EventService.upsert(rec);
    }

    console.log(`Seeded ${records.length} events successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding all events failed:', err);
    process.exit(1);
  }
}

run();


