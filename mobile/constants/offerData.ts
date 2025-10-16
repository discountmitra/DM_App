export interface CategoryOffers {
  normal: string[];
  vip: string[];
}

export interface ServiceOffers {
  [serviceType: string]: CategoryOffers;
}

// Service-specific offers for each category
export const serviceOffers: Record<string, ServiceOffers> = {
  'hospital': {
    'Hospitals': {
      normal: [
        'OP consultation: 10% off',
        'Lab tests: 15% off',
        'Emergency: Priority booking'
      ],
      vip: [
        'OP consultation: 25% off',
        'Lab tests: 30% off',
        'Emergency: Free consultation'
      ]
    },
    'Diagnostics': {
      normal: [
        'Blood tests: 15% off',
        'X-ray: 10% off',
        'MRI/CT: 5% off'
      ],
      vip: [
        'Blood tests: 25% off',
        'X-ray: 20% off',
        'MRI/CT: 15% off'
      ]
    },
    'Pharmacy': {
      normal: [
        'Medicines: 10% off',
        'Generic drugs: 15% off',
        'Delivery: Free'
      ],
      vip: [
        'Medicines: 20% off',
        'Generic drugs: 25% off',
        'Delivery: Express free'
      ]
    },
    'Dental': {
      normal: [
        'Consultation: 10% off',
        'Cleaning: 15% off',
        'X-ray: Free'
      ],
      vip: [
        'Consultation: 25% off',
        'Cleaning: 30% off',
        'X-ray: Free'
      ]
    },
    'Eye': {
      normal: [
        'Eye test: 10% off',
        'Spectacles: 15% off',
        'Lenses: 10% off'
      ],
      vip: [
        'Eye test: 25% off',
        'Spectacles: 30% off',
        'Lenses: 20% off'
      ]
    },
    'ENT': {
      normal: [
        'Consultation: 10% off',
        'Hearing test: 15% off',
        'Treatment: 10% off'
      ],
      vip: [
        'Consultation: 25% off',
        'Hearing test: 30% off',
        'Treatment: 20% off'
      ]
    }
  },
  'home-service': {
    'Repairs & Maintenance': {
      normal: [
        'Service call: ₹200',
        'Repair: 10% off',
        'Emergency: ₹300'
      ],
      vip: [
        'Free service call',
        'Repair: 25% off',
        'Emergency: Free'
      ]
    },
    'Cleaning & Pest Control': {
      normal: [
        'Deep cleaning: 15% off',
        'Pest control: 10% off',
        'Monthly service: 20% off'
      ],
      vip: [
        'Deep cleaning: 30% off',
        'Pest control: 25% off',
        'Monthly service: 40% off'
      ]
    },
    'Security & Surveillance': {
      normal: [
        'CCTV installation: 10% off',
        'Monitoring: 15% off',
        'Maintenance: Free'
      ],
      vip: [
        'CCTV installation: 25% off',
        'Monitoring: 30% off',
        'Maintenance: Free'
      ]
    }
  },
  'event': {
    'Decoration': {
      normal: [
        'Basic decoration: 15% off',
        'Theme setup: 10% off',
        'Flowers: 20% off'
      ],
      vip: [
        'Premium decoration: 30% off',
        'Luxury theme: 25% off',
        'Premium flowers: 35% off'
      ]
    },
    'DJ & Lighting': {
      normal: [
        'DJ service: 15% off',
        'Sound system: 10% off',
        'Lighting: 20% off'
      ],
      vip: [
        'Premium DJ: 30% off',
        'Professional sound: 25% off',
        'LED lighting: 35% off'
      ]
    },
    'Tent House': {
      normal: [
        'Tent rental: 10% off',
        'Furniture: 15% off',
        'Setup: Free'
      ],
      vip: [
        'Premium tent: 25% off',
        'Luxury furniture: 30% off',
        'Setup: Free'
      ]
    },
    'Function Halls': {
      normal: [
        'Hall booking: 10% off',
        'Catering: 15% off',
        'Decoration: 20% off'
      ],
      vip: [
        'Premium hall: 25% off',
        'Premium catering: 30% off',
        'Luxury decoration: 35% off'
      ]
    },
    'Catering': {
      normal: [
        'Veg menu: 10% off',
        'Non-veg: 15% off',
        'Staff: Free'
      ],
      vip: [
        'Premium veg: 25% off',
        'Premium non-veg: 30% off',
        'Staff: Premium free'
      ]
    },
    'Mehendi Art': {
      normal: [
        'Bridal mehendi: 15% off',
        'Party mehendi: 10% off',
        'Design: Free'
      ],
      vip: [
        'Luxury bridal: 30% off',
        'Premium party: 25% off',
        'Design: Custom free'
      ]
    }
  },
  'construction': {
    'Cement': {
      normal: [
        'Material supply: ₹5 off',
        'Labour charges: Standard rate',
        'Booking charges: ₹9'
      ],
      vip: [
        'Material supply: ₹10 off',
        'Labour charges: Standard rate',
        'Booking charges: Free'
      ]
    },
    'Steel': {
      normal: [
        'Steel: 5% off',
        'Delivery charges: Standard rate (market rate)',
        'Booking charges: ₹9'
      ],
      vip: [
        'Steel: 10% off',
        'Delivery charges: Standard rate (market rate)',
        'Booking charges: Free'
      ]
    },
    'Bricks': {
      normal: [
        'Bricks: ₹500 off',
        'Delivery: Free',
        'Booking charges: ₹9'
      ],
      vip: [
        'Bricks: ₹1000 off',
        'Delivery: Free',
        'Booking charges: Free'
      ]
    },
    'Interior Services': {
      normal: [
        'Free estimation',
        'Booking charges: ₹9'
      ],
      vip: [
        'Free estimation',
        'Free monitoring',
        'Booking charges: Free'
      ]
    }
  },
  'food': {
    'Restaurants': {
      normal: [
        'Dine-out: 5% off',
        'Online payment: Available'
      ],
      vip: [
        'Dine-out: 10% off',
        'Online payment: Available'
      ]
    }
  },
  'shopping': {
    'Vishala Shopping Mall': {
      normal: [
        'Discount: 5% off'
      ],
      vip: [
        'Discount: 10% off'
      ]
    },
    'Trends': {
      normal: [
        'Discount: 3% off'
      ],
      vip: [
        'Discount: 5% off'
      ]
    },
    'Adven Mens Store': {
      normal: [
        'Discount: 7% off'
      ],
      vip: [
        'Discount: 15% off'
      ]
    },
    'Jockey': {
      normal: [
        'Discount: 6% off'
      ],
      vip: [
        'Discount: 12% off'
      ]
    }
  },
  'beauty': {
    'Haircuts': {
      normal: [
        'Haircut: ₹110 (was ₹130)',
        'Styling: 10% off',
        'Wash: Free'
      ],
      vip: [
        'Premium haircut: ₹99',
        'Styling: 25% off',
        'Wash: Premium free'
      ]
    },
    'Facial': {
      normal: [
        'Facial: ₹180 (was ₹200)',
        'De-tan: 15% off',
        'Masks: 10% off'
      ],
      vip: [
        'Luxury facial: ₹149',
        'De-tan: 30% off',
        'Masks: 25% off'
      ]
    },
    'Coloring': {
      normal: [
        'Hair color: 10% off',
        'Highlights: 15% off',
        'Treatment: 20% off'
      ],
      vip: [
        'Premium color: 25% off',
        'Highlights: 30% off',
        'Treatment: 35% off'
      ]
    },
    'Spa': {
      normal: [
        'Spa treatment: 15% off',
        'Massage: 10% off',
        'Aromatherapy: 20% off'
      ],
      vip: [
        'Luxury spa: 30% off',
        'Premium massage: 25% off',
        'Aromatherapy: 35% off'
      ]
    }
  }
};

// Fallback to category-level offers for backward compatibility
export const categoryOffers: Record<string, CategoryOffers> = {
  'food': {
    normal: [
      'Dine-out: 5% off',
      'Online payment: Available'
    ],
    vip: [
      'Dine-out: 10% off',
      'Online payment: Available'
    ]
  },
  'hospital': {
    normal: [
      'OP consultation: 10% off',
      'Lab tests: 15% off',
      'Pharmacy: 10% off'
    ],
    vip: [
      'OP consultation: 25% off',
      'Lab tests: 30% off',
      'Pharmacy: 20% off'
    ]
  },
  'home-service': {
    normal: [
      'Service call: ₹200',
      'Repair: 10% off',
      'Emergency: ₹300'
    ],
    vip: [
      'Free service call',
      'Repair: 25% off',
      'Emergency: Free'
    ]
  },
  'event': {
    normal: [
      'Decoration: 15% off',
      'Photography: ₹2000',
      'Catering: 10% off'
    ],
    vip: [
      'Decoration: 30% off',
      'Photography: 20% off',
      'Catering: 20% off'
    ]
  },
  'construction': {
    normal: [
      'Material supply: ₹5 off',
      'Labour charges: Standard rate',
      'Booking charges: ₹9'
    ],
    vip: [
      'Material supply: ₹10 off',
      'Labour charges: Standard rate',
      'Booking charges: Free'
    ]
  },
  'shopping': {
    normal: [
      'Discount: 5% off',
      'Online payment: Available'
    ],
    vip: [
      'Discount: 10% off',
      'Online payment: Available'
    ]
  },
  'beauty': {
    normal: [
      'Haircut: ₹110',
      'Facial: ₹180',
      'Coloring: 10% off'
    ],
    vip: [
      'Haircut: ₹99',
      'Facial: ₹149',
      'Coloring: 25% off'
    ]
  }
};
