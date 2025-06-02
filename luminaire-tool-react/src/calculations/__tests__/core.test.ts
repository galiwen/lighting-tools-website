import { describe, it, expect } from 'vitest';
import { calculateLuminaire, calculateAllScenarios, calculateGWPReduction } from '../core';
import type { CalculationInputs } from '../../types';

// Test data matching current HTML implementation defaults
const defaultInputs: CalculationInputs = {
  gridFactor: 0.39,
  electricityRate: 0.26,
  inflationRate: 0.03,
  decarbonizationRate: 0.03,
  controlCoeff: 0.75,
  controlCostCoeff: 1.15,
  operationalHours: 4990,
  projectLife: 15,
  l90Factor: 0.9,
  l70Factor: 0.7,
  baseline: {
    wattage: 12,
    flux: 1000,
    qty: 500,
    l90Lifetime: 50000,
    l70Lifetime: 120000,
    gwp: 10,
    eol: 0.5,
    cost: 260
  },
  proposed: {
    wattage: 9,
    flux: 1059,
    qty: 473.48,
    l90Lifetime: 45000,
    l70Lifetime: 100000,
    gwp: 20,
    eol: 1.5,
    cost: 220
  }
};

describe('Core Calculation Engine', () => {
  describe('calculateLuminaire', () => {
    it('should calculate basic luminaire without controls', () => {
      const result = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'without',
        'L90'
      );

      // Basic validation - should produce reasonable results
      expect(result.annualEnergy).toBeGreaterThan(0);
      expect(result.totalGWP).toBeGreaterThan(0);
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.lifetimeYears).toBeGreaterThan(0);
    });

    it('should apply control coefficients correctly', () => {
      const withoutControls = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'without',
        'L90'
      );

      const withControls = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'with',
        'L90'
      );

      // Energy should be reduced by control coefficient
      expect(withControls.annualEnergy).toBe(withoutControls.annualEnergy * defaultInputs.controlCoeff);
      
      // Initial cost should be increased by cost coefficient
      expect(withControls.initialCost).toBe(withoutControls.initialCost * defaultInputs.controlCostCoeff);
    });

    it('should apply maintenance factor dimming correctly', () => {
      const withMaintenance = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'withMaintenance',
        'L90'
      );

      const withControlsOnly = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'with',
        'L90'
      );

      // Maintenance should reduce energy consumption further
      const expectedMaintenanceMultiplier = (1 - (1 - defaultInputs.l90Factor) / 2);
      const expectedEnergy = withControlsOnly.annualEnergy * expectedMaintenanceMultiplier / defaultInputs.controlCoeff * defaultInputs.controlCoeff;
      
      expect(withMaintenance.annualEnergy).toBeCloseTo(expectedEnergy, 2);
    });

    it('should calculate replacements correctly', () => {
      const result = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'without',
        'L90'
      );

      const expectedLifetimeYears = defaultInputs.baseline.l90Lifetime / defaultInputs.operationalHours;
      const expectedReplacements = Math.max(0, Math.ceil(defaultInputs.projectLife / expectedLifetimeYears) - 1);

      expect(result.lifetimeYears).toBeCloseTo(expectedLifetimeYears, 2);
      expect(result.replacements).toBe(expectedReplacements);
    });

    it('should apply grid decarbonization over time', () => {
      const result = calculateLuminaire(
        defaultInputs,
        defaultInputs.baseline,
        'without',
        'L90'
      );

      // Manual calculation of operational GWP with decarbonization
      let expectedOperationalGWP = 0;
      for (let year = 0; year < defaultInputs.projectLife; year++) {
        const gridFactorForYear = defaultInputs.gridFactor * Math.pow(1 - defaultInputs.decarbonizationRate, year);
        expectedOperationalGWP += result.annualEnergy * gridFactorForYear;
      }

      expect(result.operationalGWP).toBeCloseTo(expectedOperationalGWP, 1);
    });
  });

  describe('calculateAllScenarios', () => {
    it('should calculate all scenarios and lifetime types', () => {
      const results = calculateAllScenarios(defaultInputs);

      expect(results.L90).toBeDefined();
      expect(results.L70).toBeDefined();
      expect(results.adjustedQuantities).toBeDefined();

      // Check all scenarios exist
      ['without', 'with', 'withMaintenance'].forEach(scenario => {
        expect(results.L90[scenario as keyof typeof results.L90]).toBeDefined();
        expect(results.L70[scenario as keyof typeof results.L70]).toBeDefined();
      });

      // L90 quantities should be adjusted
      expect(results.adjustedQuantities.baselineL90).toBe(defaultInputs.baseline.qty / defaultInputs.l90Factor);
      expect(results.adjustedQuantities.proposedL90).toBe(defaultInputs.proposed.qty / defaultInputs.l90Factor);
    });

    it('should produce different results for L70 vs L90', () => {
      const results = calculateAllScenarios(defaultInputs);

      const l90Result = results.L90.without.baseline;
      const l70Result = results.L70.without.baseline;

      // Results should be different due to different quantities and lifetimes
      expect(l90Result.totalGWP).not.toBe(l70Result.totalGWP);
      expect(l90Result.totalCost).not.toBe(l70Result.totalCost);
    });
  });

  describe('calculateGWPReduction', () => {
    it('should calculate percentage reduction correctly', () => {
      const baseline = 1000;
      const proposed = 800;
      const reduction = calculateGWPReduction(baseline, proposed);

      expect(reduction).toBe(20); // 20% reduction
    });

    it('should handle zero baseline', () => {
      const reduction = calculateGWPReduction(0, 800);
      expect(reduction).toBe(0);
    });

    it('should handle negative reduction (increase)', () => {
      const baseline = 800;
      const proposed = 1000;
      const reduction = calculateGWPReduction(baseline, proposed);

      expect(reduction).toBe(-25); // 25% increase
    });
  });
});

// Excel parity test - this should match current HTML output exactly
describe('Excel Parity Validation', () => {
  it('should match current HTML implementation results', () => {
    const results = calculateAllScenarios(defaultInputs);
    
    // These values should match the current working HTML implementation
    // Update these values after confirming they match the current tool's output
    const l90WithoutBaseline = results.L90.without.baseline;
    const l90WithoutProposed = results.L90.without.proposed;

    // Basic sanity checks - exact values to be confirmed against HTML
    expect(l90WithoutBaseline.annualEnergy).toBeGreaterThan(25000); // Should be ~29,940 kWh
    expect(l90WithoutProposed.annualEnergy).toBeGreaterThan(20000); // Should be ~21,241 kWh
    
    expect(l90WithoutBaseline.totalGWP).toBeGreaterThan(150000); // Should be significant
    expect(l90WithoutProposed.totalGWP).toBeGreaterThan(100000); // Should be less than baseline

    // Cost calculations
    expect(l90WithoutBaseline.totalCost).toBeGreaterThan(200000);
    expect(l90WithoutProposed.totalCost).toBeGreaterThan(150000);

    console.log('L90 Without Controls - Baseline Results:', {
      annualEnergy: l90WithoutBaseline.annualEnergy,
      totalGWP: l90WithoutBaseline.totalGWP,
      totalCost: l90WithoutBaseline.totalCost,
      replacements: l90WithoutBaseline.replacements
    });

    console.log('L90 Without Controls - Proposed Results:', {
      annualEnergy: l90WithoutProposed.annualEnergy,
      totalGWP: l90WithoutProposed.totalGWP,
      totalCost: l90WithoutProposed.totalCost,
      replacements: l90WithoutProposed.replacements
    });
  });
});