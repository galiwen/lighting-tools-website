import type { CalculationInputs, LuminaireInputs, LuminaireResults, LifetimeType, ScenarioType } from '../types';

/**
 * Core calculation engine extracted from current HTML implementation
 * Maintains Excel parity with all critical fixes implemented
 */

export function calculateLuminaire(
  inputs: CalculationInputs,
  luminaire: LuminaireInputs,
  scenario: ScenarioType,
  lifetimeType: LifetimeType
): LuminaireResults {
  try {
    let energyMultiplier = 1;
    let costMultiplier = 1;
    let maintenanceMultiplier = 1;

    // Apply control system adjustments
    if (scenario === 'with' || scenario === 'withMaintenance') {
      energyMultiplier = inputs.controlCoeff;
      costMultiplier = inputs.controlCostCoeff;
    }

    // Apply maintenance factor dimming (CORRECTED formula per Excel model)
    if (scenario === 'withMaintenance') {
      const maintenanceFactor = lifetimeType === 'L90' ? inputs.l90Factor : inputs.l70Factor;
      // CRITICAL: Corrected maintenance dimming formula: (1-(1-factor)/2)
      maintenanceMultiplier = (1 - (1 - maintenanceFactor) / 2);
    }

    // Calculate lifetime and replacements
    const lifetime = lifetimeType === 'L90' ? luminaire.l90Lifetime : luminaire.l70Lifetime;
    const lifetimeYears = inputs.operationalHours > 0 ? lifetime / inputs.operationalHours : 0;
    const replacements = lifetimeYears > 0 ? Math.max(0, Math.ceil(inputs.projectLife / lifetimeYears) - 1) : 0;

    // Energy calculations
    const annualEnergy = luminaire.wattage * luminaire.qty * inputs.operationalHours * energyMultiplier * maintenanceMultiplier / 1000;
    const totalEnergy = annualEnergy * inputs.projectLife;

    // GWP calculations with grid decarbonization (CORRECTED implementation)
    let operationalGWP = 0;
    for (let year = 0; year < inputs.projectLife; year++) {
      const gridFactorForYear = inputs.gridFactor * Math.pow(1 - (inputs.decarbonizationRate || 0), year);
      operationalGWP += annualEnergy * gridFactorForYear;
    }

    const embodiedGWP = luminaire.gwp * luminaire.qty * (1 + replacements);
    const eolGWP = luminaire.eol * luminaire.qty * (1 + replacements);
    const totalGWP = operationalGWP + embodiedGWP + eolGWP;

    // Cost calculations
    const initialCost = luminaire.cost * luminaire.qty * costMultiplier;
    
    // CORRECTED: Replacement cost timing with proper inflation
    let replacementCost = 0;
    if (replacements > 0 && lifetimeYears > 0) {
      for (let rep = 1; rep <= replacements; rep++) {
        const replacementYear = Math.floor(rep * lifetimeYears);
        const inflatedCost = luminaire.cost * luminaire.qty * costMultiplier * 
                           Math.pow(1 + inputs.inflationRate, replacementYear);
        replacementCost += inflatedCost;
      }
    }

    const annualOperatingCost = annualEnergy * inputs.electricityRate;
    
    // Operating cost with inflation
    let totalOperatingCost = 0;
    for (let year = 0; year < inputs.projectLife; year++) {
      totalOperatingCost += annualOperatingCost * Math.pow(1 + inputs.inflationRate, year);
    }

    const totalCost = initialCost + replacementCost + totalOperatingCost;

    return {
      annualEnergy,
      totalEnergy,
      totalGWP,
      initialCost,
      replacementCost,
      annualOperatingCost,
      totalOperatingCost,
      totalCost,
      operationalGWP,
      embodiedGWP,
      eolGWP,
      lifetimeYears,
      replacements
    };
  } catch (error) {
    console.error('Error in calculateLuminaire:', error);
    // Return safe defaults
    return {
      annualEnergy: 0,
      totalEnergy: 0,
      totalGWP: 0,
      initialCost: 0,
      replacementCost: 0,
      annualOperatingCost: 0,
      totalOperatingCost: 0,
      totalCost: 0,
      operationalGWP: 0,
      embodiedGWP: 0,
      eolGWP: 0,
      lifetimeYears: 0,
      replacements: 0
    };
  }
}

export function calculateAllScenarios(inputs: CalculationInputs) {
  try {
    const scenarios: ScenarioType[] = ['without', 'with', 'withMaintenance'];
    
    // Adjust quantities for L90 analysis (divide by L90 factor)
    const adjustedBaselineL90 = {
      ...inputs.baseline,
      qty: inputs.baseline.qty / inputs.l90Factor
    };
    
    const adjustedProposedL90 = {
      ...inputs.proposed,
      qty: inputs.proposed.qty / inputs.l90Factor
    };

    const resultsL90: Record<ScenarioType, { baseline: LuminaireResults; proposed: LuminaireResults }> = {} as any;
    const resultsL70: Record<ScenarioType, { baseline: LuminaireResults; proposed: LuminaireResults }> = {} as any;

    scenarios.forEach(scenario => {
      resultsL90[scenario] = {
        baseline: calculateLuminaire(inputs, adjustedBaselineL90, scenario, 'L90'),
        proposed: calculateLuminaire(inputs, adjustedProposedL90, scenario, 'L90')
      };
      resultsL70[scenario] = {
        baseline: calculateLuminaire(inputs, inputs.baseline, scenario, 'L70'),
        proposed: calculateLuminaire(inputs, inputs.proposed, scenario, 'L70')
      };
    });

    return {
      L90: resultsL90,
      L70: resultsL70,
      adjustedQuantities: {
        baselineL90: adjustedBaselineL90.qty,
        proposedL90: adjustedProposedL90.qty
      }
    };
  } catch (error) {
    console.error('Error in calculateAllScenarios:', error);
    throw error;
  }
}

/**
 * Calculate GWP reduction percentage
 */
export function calculateGWPReduction(baselineGWP: number, proposedGWP: number): number {
  return baselineGWP > 0 ? ((baselineGWP - proposedGWP) / baselineGWP * 100) : 0;
}

/**
 * Calculate payback period in years
 */
export function calculatePaybackPeriod(
  baselineCost: number, 
  proposedCost: number, 
  annualSavings: number
): number {
  const upfrontDifference = proposedCost - baselineCost;
  return annualSavings > 0 ? Math.max(0, upfrontDifference / annualSavings) : 0;
}

/**
 * Calculate timeline data with grid decarbonization
 */
export function calculateTimelineData(inputs: CalculationInputs): any[] {
  try {
    const timelineData = [];
    
    // Get baseline calculations
    const baselineAnnualEnergy = inputs.baseline.wattage * inputs.baseline.qty * inputs.operationalHours / 1000;
    const proposedAnnualEnergy = inputs.proposed.wattage * inputs.proposed.qty * inputs.operationalHours / 1000;

    for (let year = 0; year < inputs.projectLife; year++) {
      const gridFactorForYear = inputs.gridFactor * Math.pow(1 - (inputs.decarbonizationRate || 0.03), year);
      const baselineEmissions = baselineAnnualEnergy * gridFactorForYear;
      const proposedEmissions = proposedAnnualEnergy * gridFactorForYear;
      
      timelineData.push({
        year: year + 1,
        baselineEmissions,
        proposedEmissions,
        gridFactor: gridFactorForYear,
        savings: baselineEmissions - proposedEmissions
      });
    }

    return timelineData;
  } catch (error) {
    console.error('Error in calculateTimelineData:', error);
    return [];
  }
}