// Healthcare pricing configuration ONLY for specific health category services (custom per hospital/service)

type CustomPricing = { basePrice: number, normal: number, vip: number };

export const healthcarePricing: {
  custom: Record<string, CustomPricing>
} = {
  custom: {
    'amrutha-children':   { basePrice: 400, normal: 300, vip: 300 },
    'lulu-children':      { basePrice: 300, normal: 200, vip: 200 },
    'life-hospital':      { basePrice: 300, normal: 200, vip: 200 },
    'vasavi-general':     { basePrice: 300, normal: 200, vip: 200 },
    'siddivinayaka-ent':  { basePrice: 300, normal: 200, vip: 200 },
    'shiva-sai-opticals': { basePrice: 100, normal: 50,  vip: 0   },
    'aditya-neuro':       { basePrice: 400, normal: 400, vip: 400 },
    'chandana-chest':     { basePrice: 300, normal: 200, vip: 200 },
    'vihana-dental':      { basePrice: 300, normal: 100, vip: 0   },
    'sri-siddi-vinayaka-medical': { basePrice: 9,   normal: 9,   vip: 0   },
    'yamini-veterinary':         { basePrice: 9,   normal: 9,   vip: 0   },
  },
};

export const customHealthcarePriceIds: string[] = [
  'amrutha-children',
  'lulu-children',
  'life-hospital',
  'vasavi-general',
  'siddivinayaka-ent',
  'shiva-sai-opticals',
  'aditya-neuro',
  'chandana-chest',
  'vihana-dental',
  'sri-siddi-vinayaka-medical',
  'yamini-veterinary',
];

// Only checks service id (by string or .id on obj) and returns relevant custom pricing.
// Returns a { basePrice, finalPrice } object for the requested user type.
export function getHealthcarePricing(
  serviceTypeOrObj: string | { id?: string },
  isVip: boolean = false
): { basePrice: number; finalPrice: number } {
  let id: string | null = null;
  if (typeof serviceTypeOrObj === 'string') {
    id = serviceTypeOrObj.toLowerCase();
  } else if (serviceTypeOrObj && typeof serviceTypeOrObj === 'object') {
    id = (serviceTypeOrObj.id || '').toLowerCase();
  }
  if (id && Object.prototype.hasOwnProperty.call(healthcarePricing.custom, id)) {
    const info = healthcarePricing.custom[id] as CustomPricing;
    return { basePrice: info.basePrice, finalPrice: isVip ? info.vip : info.normal };
  }
  return { basePrice: 0, finalPrice: 0 };
}
