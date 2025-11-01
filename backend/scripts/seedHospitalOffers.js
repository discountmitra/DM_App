require('dotenv').config();

require('ts-node/register');

// Diagnostic: Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables.');
  console.error('💡 Please set DATABASE_URL in your .env file or environment.');
  console.error('   Example: DATABASE_URL=postgres://user:password@host:port/database?sslmode=require');
  process.exit(1);
}

// Diagnostic: Check if DATABASE_URL looks valid (has password part)
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.includes('@') || dbUrl.split('@')[0].split(':').length < 3) {
  console.error('❌ DATABASE_URL appears to be malformed (missing password).');
  console.error('💡 Format should be: postgres://username:password@host:port/database');
  process.exit(1);
}

const { sequelize } = require('../src/db');
const HospitalOffer = require('../src/models/HospitalOffer');
const { healthcareData } = require('../../mobile/constants/healthcareData');

// Pricing mapping from healthcarePricing.ts
const healthcarePricing = {
  'amrutha-children': { basePrice: 400, normal: 300, vip: 300 },
  'lulu-children': { basePrice: 300, normal: 200, vip: 200 },
  'life-hospital': { basePrice: 300, normal: 200, vip: 200 },
  'vasavi-general': { basePrice: 300, normal: 200, vip: 200 },
  'siddivinayaka-ent': { basePrice: 300, normal: 200, vip: 200 },
  'shiva-sai-opticals': { basePrice: 100, normal: 50, vip: 0 },
  'aditya-neuro': { basePrice: 400, normal: 400, vip: 400 },
  'chandana-chest': { basePrice: 300, normal: 200, vip: 200 },
  'vihana-dental': { basePrice: 300, normal: 100, vip: 0 },
  'sri-siddi-vinayaka-medical': { basePrice: 9, normal: 9, vip: 0 },
  'yamini-veterinary': { basePrice: 9, normal: 9, vip: 0 },
};

async function seedHospitalOffers() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();

    let count = 0;

    // Loop through each healthcare provider
    for (const provider of healthcareData) {
      const pricing = healthcarePricing[provider.id];

      if (!pricing) {
        console.log(`No pricing found for ${provider.id}, skipping`);
        continue;
      }

      // Get special offers for this provider
      const specialOffers = provider.specialOffers || [];

      // Create normal user offers
      for (let i = 0; i < specialOffers.length; i++) {
        await HospitalOffer.upsert({
          serviceId: provider.id,
          serviceName: provider.name,
          category: provider.category,
          userType: 'normal',
          offerText: specialOffers[i],
          basePrice: pricing.basePrice,
          normalPrice: pricing.normal,
          vipPrice: pricing.vip,
          displayOrder: i + 1,
        });
        count++;
      }

      // Create VIP user offers (same offers)
      for (let i = 0; i < specialOffers.length; i++) {
        await HospitalOffer.upsert({
          serviceId: provider.id,
          serviceName: provider.name,
          category: provider.category,
          userType: 'vip',
          offerText: specialOffers[i],
          basePrice: pricing.basePrice,
          normalPrice: pricing.normal,
          vipPrice: pricing.vip,
          displayOrder: i + 1,
        });
        count++;
      }
    }

    console.log(`Seeded ${count} hospital offers for ${healthcareData.length} providers.`);
  } catch (e) {
    console.error('Seeding hospital offers failed:', e);
  } finally {
    await sequelize.close();
  }
}

seedHospitalOffers();

