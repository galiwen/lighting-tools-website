// Core calculation types matching Excel model

export interface LuminaireInputs {
  wattage: number;
  flux: number;
  qty: number;
  l90Lifetime: number;
  l70Lifetime: number;
  gwp: number;
  eol: number;
  cost: number;
}

export interface ProjectInputs {
  gridFactor: number;
  electricityRate: number;
  inflationRate: number;
  decarbonizationRate: number;
  controlCoeff: number;
  controlCostCoeff: number;
  operationalHours: number;
  projectLife: number;
  l90Factor: number;
  l70Factor: number;
}

export interface CalculationInputs extends ProjectInputs {
  baseline: LuminaireInputs;
  proposed: LuminaireInputs;
}

export interface LuminaireResults {
  annualEnergy: number;
  totalEnergy: number;
  totalGWP: number;
  initialCost: number;
  replacementCost: number;
  annualOperatingCost: number;
  totalOperatingCost: number;
  totalCost: number;
  operationalGWP: number;
  embodiedGWP: number;
  eolGWP: number;
  lifetimeYears: number;
  replacements: number;
}

export interface ScenarioResults {
  baseline: LuminaireResults;
  proposed: LuminaireResults;
}

export interface AllResults {
  L90: {
    without: ScenarioResults;
    with: ScenarioResults;
    withMaintenance: ScenarioResults;
  };
  L70: {
    without: ScenarioResults;
    with: ScenarioResults;
    withMaintenance: ScenarioResults;
  };
  adjustedQuantities: {
    baselineL90: number;
    proposedL90: number;
  };
}

export type LifetimeType = 'L90' | 'L70';
export type ScenarioType = 'without' | 'with' | 'withMaintenance';

export interface ComparisonResults {
  gwpReduction: number;
  costReduction: number;
  paybackPeriod: number;
  annualSavings: number;
}

export interface TimelineDataPoint {
  year: number;
  baselineEmissions: number;
  proposedEmissions: number;
  gridFactor: number;
  savings: number;
}

export interface SensitivityParameter {
  name: string;
  factor: keyof CalculationInputs;
  change: number;
  impact: number;
}