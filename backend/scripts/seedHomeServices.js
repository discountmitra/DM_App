require('dotenv').config();
const { sequelize } = require('../src/db');
const HomeService = require('../src/models/HomeService');

const homeServicesData = [
  // Repairs & Maintenance
  {
    id: "plumber-services",
    name: "Plumber Services",
    description: "Water Leakage, Pipe Installation, Faucet Repair",
    category: "Repairs & Maintenance",
    icon: "water",
    price: "₹299",
    discount: "Save 20%",
    rating: 4.8,
    reviews: 1200,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1683141410787-c4dbd2220487?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D",
    normalUserOffer: "Service call: ₹200\nPipe repair: 10% off\nEmergency service: ₹300\nWarranty: 30 days",
    vipUserOffer: "Free service call\nPremium repair: 25% off\nPriority emergency: Free\nExtended warranty: 90 days\nFree maintenance check",
  },
  {
    id: "electrician-services",
    name: "Electrician Services", 
    description: "Wiring, Appliance Repair, Switch Installation",
    category: "Repairs & Maintenance",
    icon: "flash",
    price: "₹399",
    discount: "Save 15%",
    rating: 4.7,
    reviews: 980,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D",
    normalUserOffer: "Service call: ₹250\nWiring repair: 15% off\nAppliance repair: 10% off\nWarranty: 45 days",
    vipUserOffer: "Free service call\nPremium wiring: 30% off\nPriority appliance repair: 20% off\nExtended warranty: 120 days\nFree safety inspection",
  },
  {
    id: "ac-fridge-repair",
    name: "AC & Fridge Repair",
    description: "Cooling System Maintenance, Gas Refill",
    category: "Repairs & Maintenance",
    icon: "snow",
    price: "₹599",
    discount: "Save 25%",
    rating: 4.6,
    reviews: 750,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D",
    normalUserOffer: "Service call: ₹300\nGas refill: 20% off\nAC cleaning: ₹500\nWarranty: 60 days",
    vipUserOffer: "Free service call\nPremium gas refill: 35% off\nFree AC cleaning\nExtended warranty: 180 days\nFree seasonal maintenance",
  },
  {
    id: "ro-water-purifier",
    name: "RO Water Purifier Repair",
    description: "Water Filtration System, Filter Replacement",
    category: "Repairs & Maintenance",
    icon: "water",
    price: "₹199",
    discount: "Save 30%",
    rating: 4.5,
    reviews: 650,
    availability: "Available Now",
    image: "https://images.unsplash.com/photo-1662647343354-5a03bbbd1d45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Uk8lMjB3YXRlciUyMHB1cmlmaWVyfGVufDB8fDB8fHww",
  },
  {
    id: "tv-installation",
    name: "TV Installation & Repair",
    description: "Entertainment System Setup, Wall Mounting",
    category: "Repairs & Maintenance",
    icon: "tv",
    price: "₹499",
    discount: "Save 18%",
    rating: 4.7,
    reviews: 890,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1723701630582-b2d418fd7e4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFRWJTIwcmVhcGFpcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "washing-machine-repair",
    name: "Washing Machine Repair",
    description: "Laundry Appliance Service, Motor Repair",
    category: "Repairs & Maintenance",
    icon: "shirt",
    price: "₹399",
    discount: "Save 22%",
    rating: 4.6,
    reviews: 720,
    availability: "Available Now",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V2FzaGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "microwave-oven-repair",
    name: "Microwave & Oven Repair",
    description: "Kitchen Appliance Service, Heating Element",
    category: "Repairs & Maintenance",
    icon: "restaurant",
    price: "₹299",
    discount: "Save 25%",
    rating: 4.5,
    reviews: 580,
    availability: "Available Now",
    image: "https://images.unsplash.com/photo-1565357253897-79d691886a73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T3ZlbnxlbnwwfHwwfHx8MA%3D%3D",
  },

  // Cleaning & Pest Control
  {
    id: "home-deep-cleaning",
    name: "Home Deep Cleaning",
    description: "Complete House Sanitization, Deep Scrub",
    category: "Cleaning & Pest Control",
    icon: "sparkles",
    price: "₹1299",
    discount: "Save 35%",
    rating: 4.9,
    reviews: 1500,
    availability: "Available Now",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SG9tZSUyMGNsZWFuaW5nfGVufDB8fDB8fHww",
  },
  {
    id: "sofa-carpet-cleaning",
    name: "Sofa & Carpet Cleaning",
    description: "Upholstery Deep Clean, Stain Removal",
    category: "Cleaning & Pest Control",
    icon: "home",
    price: "₹899",
    discount: "Save 28%",
    rating: 4.7,
    reviews: 950,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1677683510968-718b68269897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8SG9tZSUyMGNsZWFuaW5nfGVufDB8fDB8fHww",
  },
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Cockroaches, Termites, Mosquitoes Control",
    category: "Cleaning & Pest Control",
    icon: "bug",
    price: "₹999",
    discount: "Save 30%",
    rating: 4.8,
    reviews: 1300,
    availability: "Available Now",
    image: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVzdCUyMGNvbnRyb2x8ZW58MHx8MHx8fDA%3D",
  },

  // Security & Surveillance
  {
    id: "cctv-installation",
    name: "CCTV Installation & Maintenance",
    description: "Security Camera Systems, 24/7 Monitoring",
    category: "Security & Surveillance",
    icon: "videocam",
    price: "₹1999",
    discount: "Save 30%",
    rating: 4.9,
    reviews: 1800,
    availability: "Available Now",
    image: "https://plus.unsplash.com/premium_photo-1675016457613-2291390d1bf6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q0NUVnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

async function seedHomeServices() {
  try {
    await sequelize.authenticate();
    console.log('Connected to dm_app database');

    // Sync the model to create the table
    await HomeService.sync({ force: false });
    console.log('HomeService table synced');

    // Clear existing data
    await HomeService.destroy({ where: {} });
    console.log('Cleared existing home services data');

    // Insert new data
    await HomeService.bulkCreate(homeServicesData);
    console.log(`Successfully seeded ${homeServicesData.length} home services`);

    // Verify the data
    const count = await HomeService.count();
    console.log(`Total home services in database: ${count}`);

  } catch (error) {
    console.error('Error seeding home services:', error);
  } finally {
    await sequelize.close();
  }
}

seedHomeServices();

