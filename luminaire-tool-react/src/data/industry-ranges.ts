// Industry standard ranges and validation data for input components

export interface InputRange {
  min: number;
  max: number;
  typical: number;
  unit: string;
  description: string;
  industryNote?: string;
}

export interface InputValidation {
  [key: string]: InputRange;
}

// Market parameter ranges based on industry standards
export const marketRanges: InputValidation = {
  gridFactor: {
    min: 0.1,
    max: 1.2,
    typical: 0.39,
    unit: 'kgCO₂e/kWh',
    description: 'Electrical grid carbon intensity',
    industryNote: 'Varies by region: US avg 0.39, EU avg 0.28, renewables <0.1'
  },
  electricityRate: {
    min: 0.05,
    max: 0.50,
    typical: 0.26,
    unit: '$/kWh',
    description: 'Commercial electricity cost',
    industryNote: 'US commercial average: $0.26/kWh, varies by state and utility'
  },
  inflationRate: {
    min: 0.01,
    max: 0.08,
    typical: 0.03,
    unit: '%',
    description: 'Annual inflation rate for cost projections',
    industryNote: 'Historical US average: 3%, recent trends 2-4%'
  },
  decarbonizationRate: {
    min: 0.01,
    max: 0.08,
    typical: 0.03,
    unit: '%/year',
    description: 'Annual grid decarbonization rate',
    industryNote: 'Typical utility commitments: 2-5% annually toward net-zero'
  },
  operationalHours: {
    min: 1000,
    max: 8760,
    typical: 4990,
    unit: 'hours/year',
    description: 'Annual luminaire operating hours',
    industryNote: 'Office: 4000-5000h, Retail: 4000-6000h, 24/7: 8760h'
  },
  projectLife: {
    min: 10,
    max: 30,
    typical: 15,
    unit: 'years',
    description: 'Project analysis timeframe',
    industryNote: 'Typical building systems: 15-20 years, infrastructure: 25-30 years'
  },
  controlCoeff: {
    min: 0.5,
    max: 1.0,
    typical: 0.75,
    unit: 'factor',
    description: 'Energy reduction from lighting controls',
    industryNote: 'Occupancy sensors: 20-40%, daylight harvesting: 10-60%'
  },
  controlCostCoeff: {
    min: 1.0,
    max: 2.0,
    typical: 1.15,
    unit: 'multiplier',
    description: 'Cost increase for control systems',
    industryNote: 'Basic controls: +10-20%, advanced systems: +30-50%'
  }
};

// Luminaire specification ranges
export const luminaireRanges: InputValidation = {
  wattage: {
    min: 1,
    max: 100,
    typical: 12,
    unit: 'W',
    description: 'Luminaire power consumption',
    industryNote: 'LED: 8-25W typical, Fluorescent: 24-54W, HID: 70-400W'
  },
  flux: {
    min: 100,
    max: 15000,
    typical: 1000,
    unit: 'lumens',
    description: 'Light output of luminaire',
    industryNote: 'Office: 1000-3000lm, High bay: 8000-15000lm'
  },
  qty: {
    min: 1,
    max: 10000,
    typical: 500,
    unit: 'fixtures',
    description: 'Number of luminaires in project',
    industryNote: 'Small office: 50-200, Large facility: 1000-5000+'
  },
  l90Lifetime: {
    min: 20000,
    max: 100000,
    typical: 50000,
    unit: 'hours',
    description: 'Hours to 90% light output (L90)',
    industryNote: 'LED: 50K-100K hours, Fluorescent: 20K-30K hours'
  },
  l70Lifetime: {
    min: 30000,
    max: 150000,
    typical: 100000,
    unit: 'hours',
    description: 'Hours to 70% light output (L70)',
    industryNote: 'LED: 50K-150K hours, end-of-useful-life metric'
  },
  gwp: {
    min: 1,
    max: 100,
    typical: 15,
    unit: 'kgCO₂e/unit',
    description: 'Manufacturing carbon footprint',
    industryNote: 'LED: 10-30 kgCO₂e, Fluorescent: 5-15 kgCO₂e, varies by size'
  },
  eol: {
    min: 0.1,
    max: 10,
    typical: 1.0,
    unit: 'kgCO₂e/unit',
    description: 'End-of-life disposal impact',
    industryNote: 'Recycling: 0.5-2 kgCO₂e, Landfill: 2-5 kgCO₂e'
  },
  cost: {
    min: 50,
    max: 2000,
    typical: 220,
    unit: '$',
    description: 'Luminaire purchase price',
    industryNote: 'Basic LED: $100-300, High-performance: $300-800, Specialty: $500-2000'
  }
};

// Validation functions
export function validateInput(value: number, field: string, category: 'market' | 'luminaire'): {
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'info';
} {
  const ranges = category === 'market' ? marketRanges : luminaireRanges;
  const range = ranges[field];
  
  if (!range) {
    return { isValid: true, severity: 'info' };
  }

  if (value < range.min) {
    return {
      isValid: false,
      message: `Value below industry minimum (${range.min} ${range.unit})`,
      severity: 'error'
    };
  }

  if (value > range.max) {
    return {
      isValid: false,
      message: `Value exceeds industry maximum (${range.max} ${range.unit})`,
      severity: 'error'
    };
  }

  const typicalRange = {
    low: range.typical * 0.5,
    high: range.typical * 2.0
  };

  if (value < typicalRange.low || value > typicalRange.high) {
    return {
      isValid: true,
      message: `Unusual value (typical: ${range.typical} ${range.unit})`,
      severity: 'warning'
    };
  }

  return { isValid: true, severity: 'info' };
}

// Impact calculation helpers
export function calculateImpactIndicator(currentValue: number, baselineValue: number): {
  percentage: number;
  direction: 'increase' | 'decrease' | 'neutral';
  significance: 'major' | 'moderate' | 'minor';
} {
  const percentage = baselineValue > 0 ? ((currentValue - baselineValue) / baselineValue) * 100 : 0;
  
  const direction = percentage > 0.1 ? 'increase' : percentage < -0.1 ? 'decrease' : 'neutral';
  
  const absPercentage = Math.abs(percentage);
  const significance = absPercentage > 20 ? 'major' : absPercentage > 5 ? 'moderate' : 'minor';

  return { percentage, direction, significance };
}