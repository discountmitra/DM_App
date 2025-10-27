// Healthcare pricing configuration for different user types
export const healthcarePricing = {
  // Normal user pricing
  normal: {
    consultation: {
      basePrice: 500,
      discountPercent: 10,
      finalPrice: 450
    },
    emergency: {
      basePrice: 1000,
      discountPercent: 15,
      finalPrice: 850
    },
    surgery: {
      basePrice: 5000,
      discountPercent: 20,
      finalPrice: 4000
    },
    pharmacy: {
      basePrice: 200,
      discountPercent: 5,
      finalPrice: 190
    },
    labTest: {
      basePrice: 300,
      discountPercent: 12,
      finalPrice: 264
    },
    dental: {
      basePrice: 800,
      discountPercent: 18,
      finalPrice: 656
    },
    eyeCare: {
      basePrice: 600,
      discountPercent: 15,
      finalPrice: 510
    },
    physiotherapy: {
      basePrice: 400,
      discountPercent: 10,
      finalPrice: 360
    }
  },
  
  // VIP user pricing
  vip: {
    consultation: {
      basePrice: 500,
      discountPercent: 25,
      finalPrice: 375
    },
    emergency: {
      basePrice: 1000,
      discountPercent: 30,
      finalPrice: 700
    },
    surgery: {
      basePrice: 5000,
      discountPercent: 35,
      finalPrice: 3250
    },
    pharmacy: {
      basePrice: 200,
      discountPercent: 20,
      finalPrice: 160
    },
    labTest: {
      basePrice: 300,
      discountPercent: 25,
      finalPrice: 225
    },
    dental: {
      basePrice: 800,
      discountPercent: 30,
      finalPrice: 560
    },
    eyeCare: {
      basePrice: 600,
      discountPercent: 25,
      finalPrice: 450
    },
    physiotherapy: {
      basePrice: 400,
      discountPercent: 20,
      finalPrice: 320
    }
  }
};

// Helper function to get pricing for a specific service and user type
export const getHealthcarePricing = (serviceType: string, isVip: boolean = false) => {
  const userType = isVip ? 'vip' : 'normal';
  return healthcarePricing[userType][serviceType] || healthcarePricing[userType].consultation;
};

// Helper function to calculate discount amount
export const calculateDiscountAmount = (basePrice: number, discountPercent: number) => {
  return Math.round((basePrice * discountPercent) / 100);
};

// Helper function to calculate final price
export const calculateFinalPrice = (basePrice: number, discountPercent: number) => {
  const discountAmount = calculateDiscountAmount(basePrice, discountPercent);
  return basePrice - discountAmount;
};
