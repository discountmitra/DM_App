export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  category: string;
  caption?: string;
}

export const reviews: Review[] = [
  { id: 1, name: 'NarEnder Reddy', rating: 5, comment: 'Must visit place', date: '16 Jul 2025' },
  { id: 2, name: 'Sarah P', rating: 4, comment: 'Great food and ambiance', date: '15 Jul 2025' },
  { id: 3, name: 'Mike L', rating: 5, comment: 'Excellent service!', date: '14 Jul 2025' },
  { id: 4, name: 'Emma W', rating: 3, comment: 'Average food quality', date: '13 Jul 2025' },
  { id: 5, name: 'John D', rating: 5, comment: 'Amazing experience!', date: '12 Jul 2025' },
];

export const galleryImages: GalleryImage[] = [
  // Ambience
  { id: 1, url: 'https://images.unsplash.com/photo-1683318528692-6cfe0ae76817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGFtYmllbmNlfGVufDB8fDB8fHww', category: 'Ambience', caption: 'Warm ambience with cozy seating' },
  { id: 2, url: 'https://images.unsplash.com/photo-1578231177134-f1bbe379b054?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D', category: 'Ambience', caption: 'Modern decor and lighting' },
  // Food Images
  { id: 3, url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D', category: 'Food Images', caption: 'Signature dish presentation' },
  { id: 4, url: 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D', category: 'Food Images', caption: 'Delicious biryani bowl' },
  // Food Menu
  { id: 5, url: 'https://images.unsplash.com/photo-1515697320591-f3eb3566bc3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lbnV8ZW58MHx8MHx8fDA%3D', category: 'Food Menu', caption: 'Restaurant menu' },
];

export const galleryTabs = ['All', 'Ambience', 'Food Images', 'Food Menu'];

// Generate consistent avatar colors based on name
export const getAvatarColor = (name: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getReviewsByRating = (minRating: number) => 
  reviews.filter(review => review.rating >= minRating);

export const getGalleryImagesByCategory = (category: string) => 
  galleryImages.filter(image => image.category === category);
