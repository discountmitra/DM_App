export interface ConstructionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  price?: string;
  details?: string;
  rating: number;
  reviews: number;
  availability: string;
  image?: string;
  normalUserOffer?: string;
  vipUserOffer?: string;
  phone?: string;
}

export const constructionCategories = [
  "Cement",
  "Steel", 
  "Bricks",
  "Paints",
  "RMC",
  "Tiles & Marbles",
  "Interior Services",
  "Machinery",
] as const;

export type ConstructionCategoryKey = typeof constructionCategories[number];

export const constructionData: ConstructionItem[] = [
  // Cement
  {
    id: "ultratech-cement",
    name: "Ultratech Cement",
    description: "Ultratech Cement, Ultratech Cement Super",
    category: "Cement",
    icon: "cube",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/ultratech-cement/2.png",
    rating: 4.8,
    reviews: 1200,
    availability: "Available Now",
    normalUserOffer: "Material supply: ₹5 off\nLabour charges: Standard rate\nBooking charges: ₹9",
    vipUserOffer: "Material supply: ₹10 off\nLabour charges: Standard rate\nBooking charges: Free",
    phone: "8247556370",
  },
  {
    id: "birla-cement",
    name: "Birla Cement",
    description: "MP Birla Cement",
    category: "Cement",
    icon: "cube",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/birla-cement/1.jpg",
    rating: 4.6,
    reviews: 820,
    availability: "Available Now",
    normalUserOffer: "Material supply: ₹5 off\nLabour charges: Standard rate\nBooking charges: ₹9",
    vipUserOffer: "Material supply: ₹10 off\nLabour charges: Standard rate\nBooking charges: Free",
    phone: "8247556370",
  },
  {
    id: "ambuja-cement",
    name: "Ambuja Cement",
    description: "Ambuja Cement, Ambuja Plus, Ambuja Kawachi",
    category: "Cement",
    icon: "cube",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/ambuja-cement/1.png",
    rating: 4.7,
    reviews: 930,
    availability: "Available Now",
    phone: "8247556370",
  },
  {
    id: "bangur-cement",
    name: "Bangur Cement",
    description: "Bangur Cement",
    category: "Cement",
    icon: "cube",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/bangur-cement/1.png",
    rating: 4.5,
    reviews: 640,
    availability: "Available Now",
    phone: "8247556370",
  },

  // Steel
  {
    id: "psk-steel",
    name: "PSK Steel",
    description: "PSK TTM 600+ SD",
    category: "Steel",
    icon: "construct",
    image: "https://images.unsplash.com/photo-1676310149114-3f6310957ca6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlZWx8ZW58MHx8MHx8fDA%3D",
    rating: 4.7,
    reviews: 710,
    availability: "Available Now",
    normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
    vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
    phone: "8247556370",
  },
  {
    id: "jindal-steel",
    name: "Jindal Steel",
    description: "Jindal Steel, Jindal Pantha",
    category: "Steel",
    icon: "construct",
    image: "https://plus.unsplash.com/premium_photo-1664297475950-40a4e9aefea5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN0ZWVsfGVufDB8fDB8fHww",
    rating: 4.6,
    reviews: 980,
    availability: "Available Now",
    normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
    vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
    phone: "8247556370",
  },
  {
    id: "tata-steel",
    name: "TATA Steel",
    description: "TATA Steel",
    category: "Steel",
    icon: "construct",
    image: "https://plus.unsplash.com/premium_photo-1677612031010-5424f4ea90ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RlZWx8ZW58MHx8MHx8fDA%3D",
    rating: 4.6,
    reviews: 860,
    availability: "Available Now",
    normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
    vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
    phone: "8247556370",
  },

  // Bricks
  {
    id: "red-bricks",
    name: "Red Bricks",
    description: "Top Quality Red Bricks",
    category: "Bricks",
    icon: "apps",
    image: "https://plus.unsplash.com/premium_photo-1683120912204-c16b67c17008?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJyaWNrfGVufDB8fDB8fHww",
    rating: 4.7,
    reviews: 540,
    availability: "Available Now",
    normalUserOffer: "Bricks: ₹500 off\nDelivery: Free\nBooking charges: ₹9",
    vipUserOffer: "Bricks: ₹1000 off\nDelivery: Free\nBooking charges: Free",
    phone: "8247556370",
  },
  {
    id: "cement-bricks",
    name: "Cement Bricks",
    description: "All Sizes",
    category: "Bricks",
    icon: "apps",
    image: "https://images.unsplash.com/photo-1657007508392-d68322544f70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNlbWVudCUyMGJyaWNrfGVufDB8fDB8fHww",
    rating: 4.6,
    reviews: 420,
    availability: "Available Now",
    normalUserOffer: "Bricks: ₹500 off\nDelivery: Free\nBooking charges: ₹9",
    vipUserOffer: "Bricks: ₹1000 off\nDelivery: Free\nBooking charges: Free",
    phone: "8247556370",
  },

  // Paints
  {
    id: "asian-paints",
    name: "Asian Paints",
    description: "All Ranges (1ltr to 20ltrs)",
    category: "Paints",
    icon: "color-palette",
    image: "https://images.unsplash.com/photo-1658402995914-22a4ba7e1a94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
    rating: 4.8,
    reviews: 1120,
    availability: "Available Now",
    phone: "8247556370",
  },
  {
    id: "nerolac-paints",
    name: "Nerolac Paints",
    description: "All Ranges (1ltr to 20ltrs)",
    category: "Paints",
    icon: "color-palette",
    image: "https://images.unsplash.com/photo-1711467486181-bf24c3befb3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
    rating: 4.7,
    reviews: 760,
    availability: "Available Now",
    phone: "8247556370",
  },
  {
    id: "berger-paints",
    name: "Berger Paints",
    description: "All Ranges (1ltr to 20ltrs)",
    category: "Paints",
    icon: "color-palette",
    image: "https://images.unsplash.com/photo-1573421706309-8e71afba54a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
    rating: 4.6,
    reviews: 690,
    availability: "Available Now",
    phone: "8247556370",
  },

  // RMC
  {
    id: "rmc-anytime",
    name: "Ready Mix Concrete – Any Time",
    description: "Professional concrete delivery service",
    category: "RMC",
    icon: "cube",
    image: "https://images.unsplash.com/photo-1573421706309-8e71afba54a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
    rating: 4.8,
    reviews: 880,
    availability: "Available Now",
    phone: "8247556370",
  },

  // Tiles & Marbles
  {
    id: "tiles",
    name: "Tiles",
    description: "All Types",
    category: "Tiles & Marbles",
    icon: "grid",
    image: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VGlsZXN8ZW58MHx8MHx8fDA%3D",
    rating: 4.6,
    reviews: 730,
    availability: "Available Now",
    phone: "8247556370",
  },
  {
    id: "marbles",
    name: "Marbles",
    description: "All Types",
    category: "Tiles & Marbles",
    icon: "grid",
    image: "https://plus.unsplash.com/premium_photo-1681414728775-7aa0607c41cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFyYmxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    rating: 4.6,
    reviews: 730,
    availability: "Available Now",
    phone: "8247556370",
  },
  {
    id: "interior-design",
    name: "Interior Design",
    description: "Top Brands (Ashirvad, Prince, Kisan, Supreme & More)",
    category: "Interior Services",
    icon: "water",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    rating: 4.7,
    reviews: 780,
    availability: "Available Now",
    normalUserOffer: "Free estimation\nBooking charges: ₹9",
    vipUserOffer: "Free estimation\nFree monitoring\nBooking charges: Free",
    phone: "8247556370",
  },

  // Machinery
  {
    id: "jcb",
    name: "JCB",
    description: "On time & professional drivers",
    category: "Machinery",
    icon: "construct",
    image: "https://images.unsplash.com/photo-1690719495572-bc42843eae29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amNifGVufDB8fDB8fHww",
    rating: 4.8,
    reviews: 820,
    availability: "Available Now",
    phone: "8247556370",
  },
];

export const getConstructionItemById = (id: string) => constructionData.find(item => item.id === id);

export const getConstructionItemsByCategory = (category: ConstructionCategoryKey) => 
  constructionData.filter(item => item.category === category);
