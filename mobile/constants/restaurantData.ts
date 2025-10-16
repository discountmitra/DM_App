export type MenuItem = {
  item: string;
  price: number | { half: number; full: number };
};

export type MenuCategory = {
  [key: string]: MenuItem[];
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  image: string;
  specialist: string[];
  menu: MenuCategory | MenuItem[] | any | null;
  discounts: {
    normal_users: string;
    vip_users: string;
  };
  actions: {
    book_table: string;
  };
  offers: {
    cashback: string;
    payment: string;
  };
  photos: string[];
  rating: number;
  reviews: number;
  distance: string;
  phone: string;
  openTime: string;
  area: string;
  priceForTwo: string;
  opensIn: string;
  savePercent?: number;
};

export const restaurantData: Restaurant[] = [
  {
    id: "1",
    name: "ICE HOUSE",
    category: "Food",
    image: "https://images.unsplash.com/photo-1729001195966-6ca581448b4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdHJhdW50fGVufDB8fDB8fHww",
    specialist: ["Pizza", "Burger", "Ice Creams", "French Fries", "Mocktails", "Thickshakes"],
    menu: null,
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: {
      book_table: "Book Now"
    },
    offers: {
      cashback: "Up to 7% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/icehouse.jpg"],
    rating: 4.5,
    reviews: 250,
    distance: "6km",
    phone: "9494724660",
    openTime: "10:00 AM - 11:00 PM",
    area: "Gandi Maisa...",
    priceForTwo: "₹300 for two",
    opensIn: "Open Now",
    savePercent: 10,
  },
  {
    id: "4",
    name: "Sithaara Family Restaurant",
    category: "Food",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/sitaara/1.jpg",
    specialist: ["South Indian", "North Indian", "Chinese"],
    menu: null,
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: {
      book_table: "Book Now"
    },
    offers: {
      cashback: "Up to 7% cashback",
      payment: "Online Payment"
    },
    photos: [
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/sitaara/2.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/sitaara/3.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/sitaara/4.jpg"
    ],
    rating: 4.6,
    reviews: 420,
    distance: "2.1km",
    phone: "9247500687",
    openTime: "11:00 AM - 11:00 PM",
    area: "Gandhi Chowk Beside Radha Madhav Shopping Mall, Sircilla, Telangana 505301",
    priceForTwo: "₹600 for two",
    opensIn: "Open Now",
    savePercent: 10,
  },
  {
    id: "5",
    name: "Riyan Dhaba",
    category: "Food",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/1.jpg",
    specialist: ["Dhaba Style","Open kitchen 25+ tables , 100+ capacity", "Non-Veg Curry", "Tandoor"],
    menu: null,
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: {
      book_table: "Book Now"
    },
    offers: {
      cashback: "Up to 10% cashback",
      payment: "Online Payment"
    },
    photos: [
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/2.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/4.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/3.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/5.jpg",
      "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/food/riyan/6.jpg",
    ],
    rating: 4.5,
    reviews: 310,
    distance: "6.5km",
    phone: "8897324816",
    openTime: "11:00 AM - 10:00 PM",
    area: "Sy No 1139, near Mallikarjuna Temple, Ragudu, Sircilla Rural, Telangana 505302",
    priceForTwo: "₹700 for two",
    opensIn: "Open Now",
    savePercent: 10,
  },
  {
    id: "2",
    name: "Shankar Chat",
    image: "https://images.unsplash.com/photo-1596522869169-95231d2b6864?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFuaSUyMHB1cml8ZW58MHx8MHx8fDA%3D",
    category: "Food",
    specialist: ["Pani Puri", "Chaat"],
    menu: null,
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: { 
      book_table: "Book Now"
    },
    offers: {
      cashback: "Up to 10% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/shankarchat.jpg"],
    rating: 4.8,
    reviews: 180,
    distance: "9km",
    phone: "+91 98765 43211",
    openTime: "11:00 AM - 10:00 PM",
    area: "Kompally",
    priceForTwo: "₹700 for two",
    opensIn: "Opens in 17 mins",
    savePercent: 10,
  },
  {
    id: "3",
    name: "Indian Fast Food",
    category: "Food",
    image: "https://images.unsplash.com/photo-1594179047519-f347310d3322?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZhc3QlMjBmb29kfGVufDB8fDB8fHww",
    specialist: ["Rice", "Noodles", "Manchurian (Veg, Non-Veg & Egg)"],
    menu: null,
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: { 
      book_table: "Book Now"
    },
    offers: {
      cashback: "Up to 10% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/indianfastfood.jpg"],
    rating: 4.6,
    reviews: 320,
    distance: "9km",
    phone: "+91 98765 43212",
    openTime: "12:00 PM - 11:00 PM",
    area: "Pet Basheera...",
    priceForTwo: "₹500 for two",
    opensIn: "Opens in 17 mins",
    savePercent: 10,
  },
];


