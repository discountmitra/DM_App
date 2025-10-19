require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS', moduleResolution: 'Node', esModuleInterop: true },
});
const path = require('path');
const { sequelize } = require('../src/db');
const ConstructionService = require('../src/models/ConstructionService');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const constructionModulePath = path.resolve(__dirname, '../../mobile/constants/constructionData.ts');
    const galleryModulePath = path.resolve(__dirname, '../../mobile/constants/galleryData.ts');
    const { constructionData } = require(constructionModulePath);
    const { constructionInteriorDesignImages } = require(galleryModulePath);

    const records = constructionData.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      category: it.category,
      icon: it.icon || null,
      price: it.price || null,
      details: it.details || null,
      rating: typeof it.rating === 'number' ? it.rating : 0,
      reviews: typeof it.reviews === 'number' ? it.reviews : 0,
      availability: it.availability || null,
      image: it.image || null,
      normalUserOffer: it.normalUserOffer || null,
      vipUserOffer: it.vipUserOffer || null,
      phone: it.phone || null,
      // Only interior-design has gallery images today
      gallery: it.id === 'interior-design' ? constructionInteriorDesignImages : null,
    }));

    for (const rec of records) {
      await ConstructionService.upsert(rec);
    }

    console.log(`Seeded ${records.length} construction items successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding construction failed:', err);
    process.exit(1);
  }
}

run();


