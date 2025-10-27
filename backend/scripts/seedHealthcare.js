require('dotenv').config();
require('ts-node/register');

const { sequelize } = require('../src/db');
const { HealthcareProvider } = require('../src/models/HealthcareProvider');
const { healthcareData } = require('../../mobile/constants/healthcareData');

async function seedHealthcare() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();

    // Upsert to avoid duplicates on repeated runs
    for (const item of healthcareData) {
      await HealthcareProvider.upsert({
        id: item.id,
        name: item.name,
        location: item.location,
        bookingPay: item.bookingPay,
        bookingCashback: item.bookingCashback,
        specialOffers: item.specialOffers || [],
        phone: item.phone || '',
        category: item.category,
        image: item.image || null,
      });
    }
    console.log(`Seeded ${healthcareData.length} healthcare providers.`);
  } catch (e) {
    console.error('Seeding healthcare failed:', e);
  } finally {
    await sequelize.close();
  }
}

seedHealthcare();


