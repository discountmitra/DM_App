export interface HealthcarePricing {
  description: string;
  location: string;
  normal_user: {
    OP: string;
  };
  vip_user: {
    OP: string;
    Lab_IP_Discount?: string;
    Pharmacy_Discount?: string;
    Specs_Glass_Discount?: string;
    Extra_Benefits?: string[];
    Lab_Test_Discount?: string;
    General_Items_Discount?: string;
  };
}

export const healthcarePricingData: HealthcarePricing[] = [
  {
    "description": "Amrutha Children's Hospital",
    "location": "Near Vani Nursing Home, Sardar Nagar, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹400 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹299",
      "Lab_IP_Discount": "30% Instant Discount on Lab & IP Services",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Lulu Children's Hospital",
    "location": "Ambedkar Chowrasta, Beside Amma Hospital, Rajanna Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹300 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹199",
      "Lab_IP_Discount": "15% Instant Discount on Lab & IP Services",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Life Hospital",
    "location": "In front of Municipal Office, Gandhinagar, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹300 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹199",
      "Lab_IP_Discount": "20% Instant Discount on Lab & IP Services",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Vasavi General Hospital",
    "location": "Beside Amma Hospital, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹300 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹199",
      "Lab_IP_Discount": "25% Instant Discount on Lab & IP Services",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Siddi Vinayaka E.N.T. Hospital",
    "location": "Beside Vinayaka Ortho Care, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹300 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹199",
      "Lab_IP_Discount": "30% Instant Discount on Lab & IP Services",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Shiva Sai Opticals",
    "location": "Beside Quality Fast Food, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹99 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹90 OFF – Pay only ₹9",
      "Specs_Glass_Discount": "40% Discount on Specs & Glasses"
    }
  },
  {
    "description": "Aditya Neuro & Ortho",
    "location": "Siddulwada, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹400 (No discount in OP)"
    },
    "vip_user": {
      "OP": "Pay ₹399",
      "Lab_IP_Discount": "20% Instant Discount on Lab & IP",
      "Pharmacy_Discount": "10% Discount on Pharmacy"
    }
  },
  {
    "description": "Chandana Chest Hospital",
    "location": "Beside Vani Nursing Home, Sircilla",
    "normal_user": {
      "OP": "Book OP for ₹300 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹100 OFF – Pay only ₹199",
      "Lab_IP_Discount": "25% Discount on Lab & IP",
      "Pharmacy_Discount": "5% Discount on Pharmacy"
    }
  },
  {
    "description": "Vihana Multispeciality Dental Care",
    "location": "Karimnagar–Sircilla Road, Near Old Bus Stand, Sircilla",
    "normal_user": {
      "OP": "Book OP @ ₹99 (No discount in OP)"
    },
    "vip_user": {
      "OP": "₹50 OFF – Pay ₹49 Only",
      "Extra_Benefits": ["Free X-Ray", "30% Discount on All Services"]
    }
  },
  {
    "description": "Sri Siddi Vinayaka Medical",
    "location": "Near Old Bus Stand, beside Vinayaka Ortho Care, Sircilla",
    "normal_user": {
      "OP": "No OP Applicable"
    },
    "vip_user": {
      "Pharmacy_Discount": "23% Discount on Pharmacy (Ethical Medicines)",
      "General_Items_Discount": "10% Discount on General Items"
    }
  },
  {
    "description": "Discountmithra Lab",
    "location": "Near Old Bus Stand, Sircilla",
    "normal_user": {
      "OP": "No OP Applicable"
    },
    "vip_user": {
      "Lab_Test_Discount": "40% Discount on All Local Tests"
    }
  }
];

// Function to calculate healthcare pricing based on hospital name and user type
export const calculateHealthcarePricing = (hospitalName: string, hospitalLocation: string, isVip: boolean) => {
  // Find matching hospital by name and location
  const hospital = healthcarePricingData.find(h => 
    h.description.toLowerCase().includes(hospitalName.toLowerCase()) ||
    hospitalName.toLowerCase().includes(h.description.toLowerCase()) ||
    h.location.toLowerCase().includes(hospitalLocation.toLowerCase()) ||
    hospitalLocation.toLowerCase().includes(h.location.toLowerCase())
  );

  if (!hospital) {
    // Default pricing if hospital not found
    return {
      normalPrice: 0,
      vipPrice: 0,
      displayText: "Free",
      originalPrice: 0,
      discount: 0
    };
  }

  const normalOpText = hospital.normal_user.OP;
  const vipOpText = hospital.vip_user.OP;

  // Extract prices from text
  const extractPrice = (text: string): number => {
    const match = text.match(/₹(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const normalPrice = extractPrice(normalOpText);
  
  if (isVip) {
    // For VIP users, extract the final price after discount
    if (vipOpText.includes("Pay only ₹")) {
      const vipPrice = extractPrice(vipOpText);
      const originalPrice = normalPrice;
      const discount = originalPrice - vipPrice;
      return {
        normalPrice,
        vipPrice,
        displayText: `₹${vipPrice}`,
        originalPrice,
        discount
      };
    } else if (vipOpText.includes("Pay ₹")) {
      const vipPrice = extractPrice(vipOpText);
      return {
        normalPrice,
        vipPrice,
        displayText: `₹${vipPrice}`,
        originalPrice: normalPrice,
        discount: normalPrice - vipPrice
      };
    } else {
      // No OP applicable
      return {
        normalPrice: 0,
        vipPrice: 0,
        displayText: "Free",
        originalPrice: 0,
        discount: 0
      };
    }
  } else {
    // For normal users - apply ₹100 discount only to hospitals, keep other services at original prices
    if (normalPrice === 0) {
      return {
        normalPrice: 0,
        vipPrice: 0,
        displayText: "Free",
        originalPrice: 0,
        discount: 0
      };
    } else {
      // Check if it's a hospital (contains "Hospital" in the name)
      const isHospital = hospitalName.toLowerCase().includes('hospital');
      
      if (isHospital) {
        // Apply ₹100 discount only to hospitals
        const discountedPrice = Math.max(0, normalPrice - 100);
        return {
          normalPrice: discountedPrice,
          vipPrice: 0,
          displayText: `₹${discountedPrice}`,
          originalPrice: normalPrice,
          discount: 100
        };
      } else {
        // Keep original prices for other services
        return {
          normalPrice,
          vipPrice: 0,
          displayText: `₹${normalPrice}`,
          originalPrice: normalPrice,
          discount: 0
        };
      }
    }
  }
};
