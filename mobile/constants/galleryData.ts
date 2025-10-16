export interface GalleryImage {
  id: number;
  url: string;
  category: string;
  caption?: string;
}

export const defaultGalleryImages: GalleryImage[] = [
  // Ambience
  { 
    id: 1, 
    url: 'https://images.unsplash.com/photo-1683318528692-6cfe0ae76817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGFtYmllbmNlfGVufDB8fDB8fHww', 
    category: 'Ambience', 
    caption: 'Warm ambience with cozy seating' 
  },
  { 
    id: 2, 
    url: 'https://images.unsplash.com/photo-1578231177134-f1bbe379b054?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D', 
    category: 'Ambience', 
    caption: 'Modern decor and lighting' 
  },
  // Food Images
  { 
    id: 3, 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D', 
    category: 'Food Images', 
    caption: 'Signature dish presentation' 
  },
  { 
    id: 4, 
    url: 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D', 
    category: 'Food Images', 
    caption: 'Delicious biryani bowl' 
  },
  // Food Menu
  { 
    id: 5, 
    url: 'https://images.unsplash.com/photo-1515697320591-f3eb3566bc3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lbnV8ZW58MHx8MHx8fDA%3D', 
    category: 'Food Menu', 
    caption: 'Restaurant menu' 
  },
];

export const galleryTabs = ['All', 'Ambience', 'Food Images', 'Food Menu'];

// Construction Galleries
export const constructionInteriorDesignImages: string[] = [
  'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/interior-design/6.jpg',
  'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/interior-design/1.jpg',
  'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/interior-design/2.jpg',
  'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/interior-design/4.jpg',
  'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/construction/interior-design/5.jpg',
];