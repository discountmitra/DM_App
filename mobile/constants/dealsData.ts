export interface Deal {
  id: number;
  image: string;
  title?: string;
  description?: string;
}

export const deals: Deal[] = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884717/1_hj0mlp.jpg",
    title: "Vishala Shopping Mall",
    description: "Get exclusive discounts at Vishala Shopping Mall"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884714/2_bolxxh.jpg",
    title: "Food & Restaurants",
    description: "Discover amazing restaurants and food deals"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884719/3_h5xxtl.jpg",
    title: "LULU Children's Hospital",
    description: "Quality healthcare for your children"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884736/4_fhom8u.png",
    title: "Hair Zone Makeover",
    description: "Professional hair and beauty services"
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884771/5_xrcjpv.png",
    title: "Ultratech Cement",
    description: "Premium construction materials"
  },
];

export const getDealById = (id: number) => deals.find(d => d.id === id);
