# Current Implementation Calculation Analysis

## Overview
Analysis of the current HTML/JavaScript calculation implementation to understand formulas and identify potential gaps vs Excel model.

**Analysis Date**: 02/06/2025  
**Implementation File**: index.html (lines 1327-1700+)

## Core Calculation Functions

### 1. Main Calculation Flow (`calculateAll()`)

**Function**: Lines 1327-1400  
**Purpose**: Orchestrates all calculations for baseline vs proposed scenarios

**Input Structure**:
```javascript
inputs = {
    // Grid and financial parameters
    gridFactor: 0.39,                 // kg CO2e/kWh
    electricityRate: 0.26,            // $/kWh
    inflationRate: 0.03,              // annual %
    
    // Control system parameters
    controlCoeff: 0.75,               // energy reduction multiplier
    controlCostCoeff: 1.15,           // cost increase multiplier
    
    // Operational parameters
    operationalHours: 4990,           // annual hours
    projectLife: 15,                  // years
    l90Factor: 0.9,                   // L90 maintenance factor
    l70Factor: 0.7,                   // L70 maintenance factor
    
    // Luminaire specifications (baseline & proposed)
    baseline/proposed: {
        wattage: number,              // watts per fixture
        flux: number,                 // lumens per fixture
        qty: number,                  // number of fixtures
        l90Lifetime: number,          // hours to L90
        l70Lifetime: number,          // hours to L70
        gwp: number,                  // kg CO2e manufacturing
        eol: number,                  // kg CO2e end of life
        cost: number                  // $ per fixture
    }
}
```

**Scenarios Calculated**:
1. `without` - No control system
2. `with` - With control system (energy reduced by controlCoeff)
3. `withMaintenance` - With control + maintenance dimming

### 2. Core Calculation Engine (`calculateLuminaire()`)

**Function**: Lines 1402-1476  
**Purpose**: Calculates GWP and cost metrics for a single luminaire scenario

**Key Calculations**:

#### Energy Calculations
```javascript
// Annual energy consumption
annualEnergy = wattage * qty * operationalHours * energyMultiplier * maintenanceMultiplier / 1000

// Total energy over project life
totalEnergy = annualEnergy * projectLife
```

#### Lifetime and Replacement Calculations
```javascript
// Lifetime in years
lifetimeYears = lifetime / operationalHours

// Number of replacements needed
replacements = Math.max(0, Math.ceil(projectLife / lifetimeYears) - 1)
```

#### GWP Calculations
```javascript
// Operational GWP (constant grid factor - NO DECARBONIZATION)
operationalGWP = totalEnergy * gridFactor

// Embodied GWP (manufacturing)
embodiedGWP = gwp * qty * (1 + replacements)

// End of life GWP
eolGWP = eol * qty * (1 + replacements)

// Total GWP
totalGWP = operationalGWP + embodiedGWP + eolGWP
```

#### Financial Calculations
```javascript
// Initial costs
initialCost = cost * qty * costMultiplier

// Replacement costs (no timing or inflation adjustments)
replacementCost = cost * qty * replacements * costMultiplier

// Annual operating cost
annualOperatingCost = annualEnergy * electricityRate

// Total operating cost with inflation
totalOperatingCost = 0;
for (var year = 0; year < projectLife; year++) {
    totalOperatingCost += annualOperatingCost * Math.pow(1 + inflationRate, year);
}

// Total cost
totalCost = initialCost + replacementCost + totalOperatingCost
```

## Identified Calculation Gaps vs Excel Model

### 🚨 CRITICAL GAPS IDENTIFIED

#### 1. **Missing Grid Decarbonization** 
- **Current**: Uses constant `gridFactor` for all years
- **Excel Model Expected**: Declining grid carbon intensity over time
- **Formula Needed**: `gridFactor * (1 - decarbRate)^year` for each year
- **Impact**: Significant overestimation of operational GWP in later years

#### 2. **Simplified Maintenance Factor Implementation**
- **Current**: Direct multiplication by `maintenanceFactor` (0.9 or 0.7)
- **Excel Expected**: More complex dimming formula: `(1-(1-factor)/2)`
- **Current Formula**: `energyMultiplier * maintenanceMultiplier`
- **Expected Formula**: `energyMultiplier * (1-(1-maintenanceFactor)/2)`
- **Impact**: Energy consumption calculations may be inaccurate

#### 3. **Missing Loan Financing Calculations**
- **Current**: Simple cost addition with inflation
- **Excel Expected**: PMT function equivalent for loan payments
- **Missing**: Interest rates, loan terms, payment schedules
- **Impact**: Financial calculations incomplete for financed projects

#### 4. **Simplified Replacement Cost Timing**
- **Current**: All replacement costs treated as immediate
- **Excel Expected**: Replacement costs timed to actual replacement years with proper inflation
- **Current**: `replacementCost = cost * qty * replacements * costMultiplier`
- **Expected**: Time-value-of-money adjustments for replacement timing

### 🟡 MODERATE GAPS

#### 5. **L90/L70 Quantity Adjustments**
- **Current**: Simple division `qty / l90Factor`
- **Validation Needed**: Confirm this matches Excel approach
- **Note**: This appears correct but needs verification

#### 6. **Control System Cost Modeling**
- **Current**: Simple multiplier `controlCostCoeff`
- **Validation Needed**: Verify this matches Excel complexity

### ✅ CORRECTLY IMPLEMENTED

#### 1. **Basic Energy Calculations**
- Annual energy consumption formula appears correct
- Wattage × quantity × hours conversion is standard

#### 2. **Inflation Calculations**
- Operating cost inflation uses compound interest correctly
- `Math.pow(1 + inflationRate, year)` is accurate

#### 3. **GWP Component Structure**
- Operational + Embodied + End-of-Life structure is correct
- Component calculations are straightforward and accurate

#### 4. **Replacement Logic**
- `Math.ceil(projectLife / lifetimeYears) - 1` logic is sound
- Handles edge cases with `Math.max(0, ...)` properly

## Validation Test Cases Needed

### Test Case 1: Basic Scenario
```javascript
inputs = {
    gridFactor: 0.39,
    electricityRate: 0.26,
    inflationRate: 0.03,
    controlCoeff: 0.75,
    operationalHours: 4000,
    projectLife: 15,
    l90Factor: 0.9,
    baseline: {
        wattage: 12, flux: 1000, qty: 500,
        l90Lifetime: 50000, l70Lifetime: 120000,
        gwp: 10, eol: 0.5, cost: 260
    },
    proposed: {
        wattage: 9, flux: 1059, qty: 473,
        l90Lifetime: 45000, l70Lifetime: 100000,
        gwp: 20, eol: 1.5, cost: 220
    }
}
```

### Test Case 2: Grid Decarbonization Impact
- Same as Test Case 1 but with 3% annual grid decarbonization
- Compare operational GWP year-by-year

### Test Case 3: Maintenance Factor Verification
- Test both L90 and L70 scenarios
- Compare energy calculations with correct dimming formula

## Accuracy Assessment Priority

### Immediate Testing Required:
1. **Grid Decarbonization**: Likely 15-25% overestimation in current implementation
2. **Maintenance Factor**: Potentially 5-10% energy calculation error
3. **Replacement Timing**: Financial accuracy impact varies by scenario

### Validation Method:
1. Create Excel test scenarios with known inputs/outputs
2. Run current JavaScript calculations
3. Quantify percentage differences
4. Prioritize fixes by impact magnitude

## Estimated Impact of Gaps

**Conservative Estimate**:
- Grid decarbonization missing: 15-25% operational GWP overestimation
- Maintenance factor error: 5-10% energy calculation variance
- Replacement timing: 2-5% financial calculation variance
- **Combined potential error: 20-40%** (confirming planning document assessment)

**Next Steps**:
1. Implement missing Excel calculations
2. Create automated comparison testing
3. Quantify actual vs estimated errors
4. Prioritize fixes by user impact