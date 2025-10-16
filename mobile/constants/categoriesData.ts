export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  comingSoon?: boolean;
}

export const categories: Category[] = [
  // Primary order
  { id: "1", title: "Food", subtitle: "Restaurants & Dine Out", icon: "fast-food", color: "#FF6B6B" },
  { id: "2", title: "Healthcare", subtitle: "Hospitals & Clinics", icon: "medkit", color: "#4ECDC4" },
  { id: "4", title: "Home Services", subtitle: "Repair & Maintenance", icon: "build", color: "#FFA502" },
  { id: "8", title: "Events", subtitle: "Event Management", icon: "calendar", color: "#27AE60" },
  { id: "12", title: "Shopping", subtitle: "Malls & Fashion", icon: "shirt", color: "#7c3aed" },
  { id: "13", title: "Construction", subtitle: "Building & Materials", icon: "construct", color: "#EAB308" },
  { id: "6", title: "Beauty & Salon", subtitle: "Hair & Beauty Care", icon: "color-palette", color: "#B53471" },
  { id: "14", title: "Others", subtitle: "Custom Service Requests", icon: "add-circle", color: "#6B46C1" },
  // The rest
  { id: "3", title: "Travel", subtitle: "Hotels & Booking", icon: "airplane", color: "#45B7D1", comingSoon: true },
  // Removed Automobiles
  { id: "7", title: "Bar", subtitle: "Drinks & Nightlife", icon: "wine", color: "#8E44AD", comingSoon: true },
  // Removed Financial Services
  // Removed Education
  { id: "11", title: "Electronics", subtitle: "Tech & Gadgets", icon: "phone-portrait", color: "#2C3E50", comingSoon: true },
];

export const getCategoryById = (id: string) => categories.find(c => c.id === id);

export const getCategoryByTitle = (title: string) => categories.find(c => c.title === title);
