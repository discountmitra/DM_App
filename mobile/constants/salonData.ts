export interface SalonService {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
}

export interface SalonLocation {
  id: string;
  name: string;
  address: string;
  category: 'men' | 'women' | 'unisex';
  services: SalonService[];
  rating: number;
  reviews: number;
  image?: string;
  phone?: string;
}

export const salonCategories: { id: 'men' | 'women' | 'unisex'; label: string; description: string }[] = [
  { id: 'men', label: 'Men', description: 'Grooming services for men' },
  { id: 'women', label: 'Women', description: 'Beauty services for women' },
  { id: 'unisex', label: 'Unisex', description: 'Services for everyone' }
];

export const salonServices: SalonLocation[] = [
  {
    id: 'hair-zone-makeover',
    name: 'Hair Zone Makeover',
    address: 'Near Gandhi Nagar, Subash Nagar Road, Sircilla',
    category: 'men',
    phone: '9866339443',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBoYWlyY3V0JTIwYmFyYmVyJTIwc2hvcHxlbnwxfHx8fDE3NTYyMzI0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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

export const getSalonById = (id: string) => salonServices.find(s => s.id === id);

export const getSalonServicesByCategory = (category: 'men' | 'women' | 'unisex') => 
  salonServices.filter(s => s.category === category);

// Centralized service categories and pricing used by salon detail UI
// Services selection removed in UI; keep minimal structure for future use if needed