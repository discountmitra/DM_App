const { sequelize } = require('../src/db');
const Salon = require('../src/models/Salon');

const salons = [
  {
    id: 'hair-zone-makeover',
    name: 'Hair Zone Makeover',
    address: 'Near Gandhi Nagar, Subash Nagar Road, Sircilla',
    category: 'men',
    phone: '9866339443',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBoYWlyY3V0JTIwYmFyYmVyJTIwYmFyYmVyJTIwc2hvcHxlbnwxfHx8fDE3NTYyMzI0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    services: [
      {
        id: 'hair-zone-package',
        name: 'Hair Zone Makeover',
        description: 'Complete grooming services - Haircuts, Facial, Tattoo',
        price: 130,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBoYWlyY3V0JTIwYmFyYmVyJTIwc2hvcHxlbnwxfHx8fDE3NTYyMzI0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Hair zone',
        subcategory: 'Men'
      }
    ]
  }
];

(async () => {
  try {
    console.log('Seeding salons...');
    await Salon.sync({ force: true });
    await Salon.bulkCreate(salons);
    console.log('Seeded salons:', salons.length);
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
})();


