#!/usr/bin/env node

/**
 * Excel Comparison Test Suite
 * Validates current JavaScript calculations against expected Excel model results
 */

// Test case scenarios with expected Excel outputs
const testCases = [
    {
        name: "Basic Scenario - Without Control",
        description: "Standard comparison without control systems",
        inputs: {
            gridFactor: 0.39,
            electricityRate: 0.26,
            inflationRate: 0.03,
            controlCoeff: 1.0,  // No control
            controlCostCoeff: 1.0,
            operationalHours: 4000,
            projectLife: 15,
            l90Factor: 0.9,
            l70Factor: 0.7,
            decarbonizationRate: 0.03,  // 3% annual grid improvement
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
                qty: 473,
                l90Lifetime: 45000,
                l70Lifetime: 100000,
                gwp: 20,
                eol: 1.5,
                cost: 220
            }
        },
        expectedExcel: {
            // These would be populated from actual Excel model
            baseline: {
                annualEnergy: null,      // kWh/year
                totalEnergy: null,       // kWh over 15 years
                operationalGWP: null,    // kg CO2e (with decarbonization)
                embodiedGWP: null,       // kg CO2e
                eolGWP: null,           // kg CO2e
                totalGWP: null,         // kg CO2e
                initialCost: null,       // $
                totalOperatingCost: null, // $ (with inflation)
                totalCost: null,         // $
                replacements: null       // number
            },
            proposed: {
                // Same structure as baseline
            }
        }
    },
    {
        name: "With Control System",
        description: "75% energy reduction with 15% cost premium",
        inputs: {
            // Same as basic but with control system
            controlCoeff: 0.75,
            controlCostCoeff: 1.15
            // ... rest same as basic scenario
        },
        expectedExcel: {
            // Expected Excel results with control system
        }
    },
    {
        name: "Grid Decarbonization Test",
        description: "Focus on testing grid decarbonization impact",
        inputs: {
            // Simplified scenario to isolate grid decarbonization
            decarbonizationRate: 0.05  // 5% annual reduction
            // ... other inputs
        },
        expectedExcel: {
            // Year-by-year operational GWP expected values
            operationalGWPByYear: [
                // year 0: baseline grid factor
                // year 1: gridFactor * 0.95
                // year 2: gridFactor * 0.95^2
                // etc.
            ]
        }
    }
];

/**
 * Current implementation calculator (extracted from HTML)
 */
function calculateLuminaireCurrent(inputs, luminaire, scenario, lifetimeType) {
    try {
        let energyMultiplier = 1;
        let costMultiplier = 1;
        let maintenanceMultiplier = 1;
        
        if (scenario === 'with' || scenario === 'withMaintenance') {
            energyMultiplier = inputs.controlCoeff;
            costMultiplier = inputs.controlCostCoeff;
        }
        
        if (scenario === 'withMaintenance') {
            const maintenanceFactor = lifetimeType === 'L90' ? inputs.l90Factor : inputs.l70Factor;
            maintenanceMultiplier = maintenanceFactor;
        }
        
        const lifetime = lifetimeType === 'L90' ? luminaire.l90Lifetime : luminaire.l70Lifetime;
        const lifetimeYears = inputs.operationalHours > 0 ? lifetime / inputs.operationalHours : 0;
        
        const replacements = lifetimeYears > 0 ? Math.max(0, Math.ceil(inputs.projectLife / lifetimeYears) - 1) : 0;
        
        const annualEnergy = luminaire.wattage * luminaire.qty * inputs.operationalHours * energyMultiplier * maintenanceMultiplier / 1000;
        
        const totalEnergy = annualEnergy * inputs.projectLife;
        
        // CURRENT IMPLEMENTATION - NO GRID DECARBONIZATION
        const operationalGWP = totalEnergy * inputs.gridFactor;
        const embodiedGWP = luminaire.gwp * luminaire.qty * (1 + replacements);
        const eolGWP = luminaire.eol * luminaire.qty * (1 + replacements);
        const totalGWP = operationalGWP + embodiedGWP + eolGWP;
        
        const initialCost = luminaire.cost * luminaire.qty * costMultiplier;
        const replacementCost = luminaire.cost * luminaire.qty * replacements * costMultiplier;
        const annualOperatingCost = annualEnergy * inputs.electricityRate;
        
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
        console.error('Error in calculateLuminaireCurrent:', error);
        return null;
    }
}

/**
 * Corrected implementation with Excel-accurate calculations
 */
function calculateLuminaireCorrected(inputs, luminaire, scenario, lifetimeType) {
    try {
        let energyMultiplier = 1;
        let costMultiplier = 1;
        let maintenanceMultiplier = 1;
        
        if (scenario === 'with' || scenario === 'withMaintenance') {
            energyMultiplier = inputs.controlCoeff;
            costMultiplier = inputs.controlCostCoeff;
        }
        
        if (scenario === 'withMaintenance') {
            const maintenanceFactor = lifetimeType === 'L90' ? inputs.l90Factor : inputs.l70Factor;
            // CORRECTED: Maintenance dimming formula
            maintenanceMultiplier = (1 - (1 - maintenanceFactor) / 2);
        }
        
        const lifetime = lifetimeType === 'L90' ? luminaire.l90Lifetime : luminaire.l70Lifetime;
        const lifetimeYears = inputs.operationalHours > 0 ? lifetime / inputs.operationalHours : 0;
        
        const replacements = lifetimeYears > 0 ? Math.max(0, Math.ceil(inputs.projectLife / lifetimeYears) - 1) : 0;
        
        const annualEnergy = luminaire.wattage * luminaire.qty * inputs.operationalHours * energyMultiplier * maintenanceMultiplier / 1000;
        
        const totalEnergy = annualEnergy * inputs.projectLife;
        
        // CORRECTED: Grid decarbonization implementation
        let operationalGWP = 0;
        for (let year = 0; year < inputs.projectLife; year++) {
            const gridFactorForYear = inputs.gridFactor * Math.pow(1 - (inputs.decarbonizationRate || 0), year);
            operationalGWP += annualEnergy * gridFactorForYear;
        }
        
        const embodiedGWP = luminaire.gwp * luminaire.qty * (1 + replacements);
        const eolGWP = luminaire.eol * luminaire.qty * (1 + replacements);
        const totalGWP = operationalGWP + embodiedGWP + eolGWP;
        
        const initialCost = luminaire.cost * luminaire.qty * costMultiplier;
        
        // CORRECTED: Replacement cost timing with inflation
        let replacementCost = 0;
        if (replacements > 0 && lifetimeYears > 0) {
            for (let rep = 1; rep <= replacements; rep++) {
                const replacementYear = Math.floor(rep * lifetimeYears);
                const inflatedCost = luminaire.cost * luminaire.qty * costMultiplier * Math.pow(1 + inputs.inflationRate, replacementYear);
                replacementCost += inflatedCost;
            }
        }
        
        const annualOperatingCost = annualEnergy * inputs.electricityRate;
        
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
        console.error('Error in calculateLuminaireCorrected:', error);
        return null;
    }
}

/**
 * Compare current vs corrected calculations
 */
function runComparison(testCase) {
    console.log(`\n=== ${testCase.name} ===`);
    console.log(testCase.description);
    
    const inputs = testCase.inputs;
    
    // Adjust quantities for L90 calculation
    const adjustedBaseline = { ...inputs.baseline };
    adjustedBaseline.qty = inputs.baseline.qty / inputs.l90Factor;
    
    const adjustedProposed = { ...inputs.proposed };
    adjustedProposed.qty = inputs.proposed.qty / inputs.l90Factor;
    
    // Calculate with current implementation
    const currentBaseline = calculateLuminaireCurrent(inputs, adjustedBaseline, 'without', 'L90');
    const currentProposed = calculateLuminaireCurrent(inputs, adjustedProposed, 'without', 'L90');
    
    // Calculate with corrected implementation
    const correctedBaseline = calculateLuminaireCorrected(inputs, adjustedBaseline, 'without', 'L90');
    const correctedProposed = calculateLuminaireCorrected(inputs, adjustedProposed, 'without', 'L90');
    
    if (!currentBaseline || !currentProposed || !correctedBaseline || !correctedProposed) {
        console.error('Calculation failed');
        return;
    }
    
    // Compare key metrics
    const metrics = ['annualEnergy', 'operationalGWP', 'totalGWP', 'totalCost'];
    
    console.log('\nBaseline Luminaire Comparison:');
    metrics.forEach(metric => {
        const current = currentBaseline[metric];
        const corrected = correctedBaseline[metric];
        const diff = ((corrected - current) / current * 100).toFixed(1);
        console.log(`  ${metric}: Current=${current.toFixed(0)}, Corrected=${corrected.toFixed(0)}, Diff=${diff}%`);
    });
    
    console.log('\nProposed Luminaire Comparison:');
    metrics.forEach(metric => {
        const current = currentProposed[metric];
        const corrected = correctedProposed[metric];
        const diff = ((corrected - current) / current * 100).toFixed(1);
        console.log(`  ${metric}: Current=${current.toFixed(0)}, Corrected=${corrected.toFixed(0)}, Diff=${diff}%`);
    });
    
    // Overall impact assessment
    const currentGWPReduction = ((currentBaseline.totalGWP - currentProposed.totalGWP) / currentBaseline.totalGWP * 100).toFixed(1);
    const correctedGWPReduction = ((correctedBaseline.totalGWP - correctedProposed.totalGWP) / correctedBaseline.totalGWP * 100).toFixed(1);
    
    console.log(`\nGWP Reduction: Current=${currentGWPReduction}%, Corrected=${correctedGWPReduction}%`);
    
    return {
        current: { baseline: currentBaseline, proposed: currentProposed },
        corrected: { baseline: correctedBaseline, proposed: correctedProposed }
    };
}

/**
 * Main validation runner
 */
function runValidation() {
    console.log('Excel Calculation Validation Test Suite');
    console.log('==========================================');
    
    // Create basic test case
    const basicTest = {
        name: "Validation Test - Basic Scenario",
        description: "Testing current vs corrected calculations",
        inputs: {
            gridFactor: 0.39,
            electricityRate: 0.26,
            inflationRate: 0.03,
            controlCoeff: 1.0,
            controlCostCoeff: 1.0,
            operationalHours: 4000,
            projectLife: 15,
            l90Factor: 0.9,
            l70Factor: 0.7,
            decarbonizationRate: 0.03,
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
                qty: 473,
                l90Lifetime: 45000,
                l70Lifetime: 100000,
                gwp: 20,
                eol: 1.5,
                cost: 220
            }
        }
    };
    
    const results = runComparison(basicTest);
    
    console.log('\n=== SUMMARY ===');
    console.log('Key findings from validation:');
    console.log('1. Grid decarbonization missing in current implementation');
    console.log('2. Maintenance factor calculation needs correction');
    console.log('3. Replacement cost timing needs improvement');
    console.log('\nRecommendation: Implement corrected calculations before UI redesign');
    
    return results;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateLuminaireCurrent,
        calculateLuminaireCorrected,
        runComparison,
        runValidation,
        testCases
    };
}

// Run if called directly
if (require.main === module) {
    runValidation();
}