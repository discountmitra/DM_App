export type HealthcareCategoryKey = "All" | "Hospitals" | "Clinics" | "Pharmacy" | "Diagnostics" | "Dental" | "Eye" | "ENT" | "Veterinary";

export interface HealthcareProvider {
  id: string;
  name: string;
  location: string;
  bookingPay: number;
  bookingCashback: number;
  specialOffers: string[];
  phone: string;
  category: HealthcareCategoryKey;
  image?: string;
}

export const healthcareCategories: HealthcareCategoryKey[] = [
  "All",
  "Hospitals",
  "Diagnostics",
  "Pharmacy",
  "Dental",
  "Eye",
  "ENT",
  "Veterinary",
];

export const healthcareData: HealthcareProvider[] = [
  {
    id: "amrutha-children",
    name: "Amrutha Children's Hospital",
    location: "Near Vani Nursing Home, Sardar Nagar, Sircilla",
    bookingPay: 400,
    bookingCashback: 100,
    specialOffers: ["Lab & IP Services – 15% Discount"],
    phone: "9876543210",
    category: "Hospitals",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/amrutha-kids-hospital/2.jpg",
  },
  {
    id: "lulu-children",
    name: "Lulu Children's Hospital",
    location: "Ambedkar Chowrasta, beside Amma Hospital, Rajanna Sircilla",
    bookingPay: 300,
    bookingCashback: 100,
    specialOffers: ["Lab & IP Services – 15% Discount", "Pharmacy – 10% Discount"],
    phone: "8876543210",
    category: "Hospitals",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/lulu-kidshospital/1.jpeg",
  },
  {
    id: "life-hospital",
    name: "Life Hospital (Gynaecology / MD)",
    location: "Opposite Municipal Office, Gandhinagar, Sircilla",
    bookingPay: 300,
    bookingCashback: 100,
    specialOffers: ["Lab & IP Services – 10% Discount"],
    phone: "9705021177",
    category: "Hospitals",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/life-hospital/1.jpeg",
  },
  {
    id: "vasavi-general",
    name: "Vasavi General Hospital (General MD)",
    location: "Beside Amma Hospital, Sircilla",
    bookingPay: 300,
    bookingCashback: 100,
    specialOffers: ["Lab & IP Services – 15% Discount", "Pharmacy – 10% Discount"],
    phone: "7876543210",
    category: "Hospitals",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/vasavi-general-hsptl/1.jpg",
  },
  {
    id: "siddivinayaka-ent",
    name: "Siddivinayaka ENT Hospital (ENT MD)",
    location: "Beside Vinayaka Ortho Care, Sircilla",
    bookingPay: 300,
    bookingCashback: 100,
    specialOffers: ["Lab & IP Services – 10% Discount", "Pharmacy – 10% Discount"],
    phone: "6876543210",
    category: "ENT",
    image: "https://images.unsplash.com/photo-1717497932377-7758b8d5b45e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEVOVCUyMGhvc3BpdGFsfGVufDB8fDB8fHww",
  },
  {
    id: "shiva-sai-opticals",
    name: "Shiva Sai Opticals",
    location: "Beside Quality Fast Food, Sircilla",
    bookingPay: 100,
    bookingCashback: 50,
    specialOffers: ["Spectacles starting from just ₹699"],
    phone: "5876543210",
    category: "Eye",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/shivasai-opticals/1.jpeg",
  },
  {
    id: "aditya-neuro",
    name: "Aditya Neuro & Ortho",
    location: "Siddulawada, Sircilla",
    bookingPay: 300,
    bookingCashback: 0,
    specialOffers: [
      "Lab Tests – 10% Discount (Excluding outsourced tests)",
      "IP Billing – 10% Discount (Excluding Consumables, Pharmacy & Surgical items)",
      "Pharmacy – 10% Discount",
    ],
    phone: "8247556370",
    category: "Clinics",
    image: "https://plus.unsplash.com/premium_photo-1661373766140-91267929f644?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG5ldXJvJTIwaG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "chandana-chest",
    name: "Chandana Chest Hospital",
    location: "Beside Vani Nursing Home, Sircilla",
    bookingPay: 300,
    bookingCashback: 100,
    specialOffers: [
      "IP Billing – 10% Discount (Excluding Consumables, Pharmacy & Surgical items)",
      "Lab Tests – 10% Discount (Excluding outsourced tests)",
    ],
    phone: "7799663223",
    category: "Hospitals",
    image: "https://images.unsplash.com/photo-1619070284836-e850273d69ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoZXN0JTIwaG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "vihana-dental",
    name: "Vihana Multispeciality Dental Care",
    location: "Karimnagar – Sircilla Road, Old Bus Stand, Sircilla",
    bookingPay: 99,
    bookingCashback: 50,
    specialOffers: [
      "X-ray – FREE (worth ₹300)",
      "Dental Care – 20% Discount",
      "Laser Flap Surgery – Up to 25% Discount",
    ],
    phone: "4876543210",
    category: "Dental",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/vihaana-dental/1.webp",
  },
  {
    id: "sri-siddi-vinayaka-medical",
    name: "Sri Siddi Vinayaka Medical",
    location: "near old bustand, vinayaka ortho care pakkana , sircilla",
    bookingPay: 0,
    bookingCashback: 0,
    specialOffers: [
      "18% Discount on Pharmacy",
      "5% Discount on General Item",
      "23% Discount on Pharmacy (Ethical Medicines)",
      "10% Discount on General Items",
    ],
    phone: "",
    category: "Pharmacy",
    image: "https://plus.unsplash.com/premium_photo-1682129961512-cec819b87215?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWVkaWNhbCUyMHN0b3JlfGVufDB8fDB8fHww",
  },
  {
    id: "yamini-veterinary",
    name: "Yamini Veterinary Medical Hall",
    location: "Near Bus Stand, Sircilla",
    bookingPay: 0,
    bookingCashback: 0,
    specialOffers: [
      "Wholesale & Retail Pharmacy",
      "Medicines and tonics for cows, dogs, goats, hens and more",
    ],
    phone: "",
    category: "Veterinary",
    image: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/healthcare/yamini-veterinary/1.jpg",
  },
];
