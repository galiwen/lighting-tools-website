# Luminaire GWP & Cost Assessment Tool - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Input Parameters](#input-parameters)
3. [Analysis Modes](#analysis-modes)
4. [Understanding Results](#understanding-results)
5. [Export Options](#export-options)
6. [Advanced Features](#advanced-features)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Opening the Tool
1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. The tool loads instantly - no installation or setup required
3. All calculations happen in your browser - no data is sent to servers

### First Time Use
1. Start with a **Preset Scenario** to see example configurations
2. Review the default values - they represent industry averages
3. Adjust parameters to match your specific project
4. Watch results update in real-time

### Mobile Usage
- The tool is fully functional on tablets and smartphones
- Rotate to landscape for optimal chart viewing
- All features work with touch interactions

---

## Input Parameters

### Project Details Section

#### Grid Factor (kg CO2e/kWh)
- **What it is**: Carbon intensity of your local electricity grid
- **Typical values**: 
  - US average: 0.39
  - EU average: 0.28
  - Renewable grids: <0.1
- **Help**: Click the (i) icon for regional examples

#### Electricity Rate ($/kWh)
- **What it is**: Cost of electricity in your location
- **Typical values**: 
  - US commercial: $0.10-$0.26
  - EU commercial: $0.15-$0.35
- **Include**: All charges (energy, delivery, taxes)

#### Grid Decarbonization Rate (% per year)
- **What it is**: Annual reduction in grid carbon intensity
- **Typical values**: 1-3% per year
- **Conservative**: Use 1% if uncertain
- **Aggressive**: 3-5% for regions with renewable commitments

#### Project Lifetime (years)
- **What it is**: Analysis period for calculations
- **Typical values**: 10-25 years
- **Standard**: 15 years for most commercial projects

### Luminaire Specifications

#### Wattage per Fixture (W)
- **What it is**: Power consumption of each luminaire
- **How to find**: Check manufacturer data sheets
- **Include**: Total system wattage (lamp + driver)

#### Luminous Flux per Fixture (lm)
- **What it is**: Light output of each luminaire
- **Units**: Lumens (lm)
- **Efficacy**: Tool calculates lm/W automatically

#### Quantity of Fixtures
- **What it is**: Total number of luminaires in project
- **L70/L90 Adjustment**: Tool automatically adjusts quantities for light output analysis

#### Lifetime Hours
- **What it is**: Rated lifetime at L90 or L70
- **L90**: 90% of initial light output
- **L70**: 70% of initial light output
- **Typical LED**: 50,000-150,000 hours

#### Manufacturing GWP (kg CO2e)
- **What it is**: Embodied carbon in luminaire production
- **Typical values**: 20-150 kg CO2e per fixture
- **Source**: Manufacturer EPDs or industry databases

#### End-of-Life GWP (kg CO2e)
- **What it is**: Carbon impact of disposal/recycling
- **Typical values**: 5-30 kg CO2e per fixture
- **Conservative**: Use 25% of manufacturing GWP if unknown

#### Initial Cost per Fixture ($)
- **What it is**: Purchase price of luminaire
- **Include**: Fixture cost only (not installation)

### Control Strategy

#### Control Coefficient
- **What it is**: Energy reduction from controls
- **Values**: 
  - 1.0 = No controls
  - 0.8 = Basic scheduling (20% savings)
  - 0.6 = Occupancy sensing (40% savings)
  - 0.5 = Daylight + occupancy (50% savings)

#### Control Cost Coefficient
- **What it is**: Installation cost multiplier for controls
- **Values**:
  - 1.0 = No additional cost
  - 1.5 = Basic controls
  - 2.0 = Advanced controls

#### Maintenance/Dimming Factor
- **What it is**: Light loss factor for design
- **L90**: Typically 0.9
- **L70**: Typically 0.8
- **Lower = More conservative design

### Financial Parameters

#### Annual Hours of Operation
- **What it is**: Hours the lights are on per year
- **Calculation**: Hours/day × Days/week × Weeks/year
- **Examples**:
  - Office (12h × 5d × 50w): 3,000 hours
  - Retail (14h × 7d × 52w): 5,096 hours
  - 24/7 facility: 8,760 hours

#### Installation Cost per Fixture ($)
- **What it is**: Labor and materials for installation
- **Typical values**: $50-200 per fixture
- **Factors**: Ceiling height, accessibility, controls

#### Annual Inflation Rate (%)
- **What it is**: Expected cost escalation
- **Typical values**: 2-4%
- **Use**: For replacement cost projections

#### Financing Interest Rate (%)
- **What it is**: Cost of capital if financed
- **Set to 0**: For cash purchases
- **Typical values**: 4-8% for commercial loans

#### Loan Period (years)
- **What it is**: Financing term length
- **Common terms**: 5, 7, or 10 years
- **Must be**: Less than project lifetime

---

## Analysis Modes

### Single Analysis Mode
- **Purpose**: Evaluate one luminaire scenario
- **Use when**: Assessing a single option or retrofit
- **Results**: Absolute GWP and cost values

### Comparison Mode
- **Purpose**: Compare two luminaire options side-by-side
- **Access**: Click "Comparison Mode" toggle
- **Benefits**: 
  - See percentage differences
  - Identify better option quickly
  - Understand trade-offs

### Using Comparison Mode
1. Toggle "Comparison Mode" ON
2. Enter "Scenario A" parameters (typically existing)
3. Enter "Scenario B" parameters (typically proposed)
4. Review side-by-side results
5. Check percentage improvements

---

## Understanding Results

### Summary Metrics (Top Cards)

#### Total GWP Over Project Life
- **Units**: kg CO2e (kilograms of CO2 equivalent)
- **Includes**: Manufacturing + Operations + End-of-Life
- **Lower is better**: Indicates lower environmental impact

#### Total Cost Over 15 Years
- **Includes**: Initial + Installation + Operations + Replacements
- **Financing**: Added if loan parameters set
- **NPV**: Present value of all future costs

#### Payback Period
- **Calculation**: When operational savings offset higher initial cost
- **Units**: Years
- **Note**: Only shown in comparison mode when B costs more initially

#### System Efficacy
- **Calculation**: Total lumens ÷ Total watts
- **Units**: lm/W (lumens per watt)
- **Higher is better**: More light per unit energy

### Detailed Results Tabs

#### GWP Impact Tab
- **Embodied Carbon**: Manufacturing emissions × quantity × replacements
- **Operational Carbon**: Annual energy × grid factor × years (with decarbonization)
- **End-of-Life**: Disposal emissions × quantity × replacements
- **Chart**: Visual breakdown of carbon sources

#### Financial Analysis Tab
- **Initial Costs**: Purchase + installation
- **Operating Costs**: Annual electricity costs over project life
- **Replacement Costs**: Future replacements with inflation
- **Financing Costs**: Interest if loan parameters set
- **Chart**: Cost breakdown by category

#### Calculation Breakdown Tab
- **Purpose**: Full transparency of all calculations
- **Sections**: Every formula and intermediate value
- **Use**: Verify calculations or understand methodology

---

## Export Options

### PDF Report
- **Purpose**: Professional reports for clients or records
- **Contents**: All inputs, results, charts, and calculations
- **Format**: Print-optimized layout with your data
- **Access**: Click "Export" → "PDF Report"

### CSV Data
- **Purpose**: Further analysis in Excel or other tools
- **Contents**: All numerical data in tabular format
- **Structure**: Inputs and results in columns
- **Access**: Click "Export" → "CSV Data"

### JSON Export
- **Purpose**: Save complete scenario for later
- **Contents**: All parameters and results
- **Use**: Backup, sharing, or loading later
- **Access**: Click "Export" → "JSON"

---

## Advanced Features

### Preset Scenarios
Quick-start templates for common situations:
- **Efficient Office**: Modern LED with advanced controls
- **Balanced Approach**: Good efficiency with moderate cost
- **Budget Conscious**: Lower initial cost, acceptable efficiency
- **Retrofit Project**: Typical fluorescent to LED upgrade

### Educational Tooltips
- **Access**: Click (i) icons next to inputs
- **Contents**: Industry context and guidance
- **Examples**: Typical values, best practices

### Sensitivity Analysis
- **Location**: Advanced charts section
- **Purpose**: See which parameters most affect results
- **Use**: Focus optimization efforts

### User Preferences
- **Access**: Settings icon (gear)
- **Options**: 
  - Default values
  - Chart preferences
  - Calculation options
- **Persistence**: Settings saved in browser

---

## Tips & Best Practices

### For Accurate Analysis
1. **Use manufacturer data** when available
2. **Include all costs** (don't forget controls, installation)
3. **Be conservative** with uncertain values
4. **Consider future changes** (grid decarbonization, inflation)

### For Comparing Options
1. **Keep project parameters constant** (lifetime, rates)
2. **Ensure equal light levels** (use L70/L90 appropriately)
3. **Include control strategies** for both scenarios
4. **Check sensitivity** to key assumptions

### Common Pitfalls to Avoid
- Forgetting installation costs
- Ignoring control system benefits
- Using L70 and L90 incorrectly
- Not accounting for replacements
- Unrealistic project lifetimes

### Interpreting Results
- **GWP**: Focus on total lifecycle, not just operations
- **Cost**: Consider payback period and total ownership cost
- **Trade-offs**: Higher initial cost often means lower operating cost
- **Context**: Compare to industry benchmarks

---

## Troubleshooting

### Calculation Issues
**Results seem wrong**
- Check all inputs for typos
- Verify units (W not kW, $ not cents)
- Review calculation breakdown tab

**No payback shown**
- Only appears in comparison mode
- Only when Scenario B has higher initial cost
- Check that operational savings exist

### Display Issues
**Charts not showing**
- Refresh the page
- Try a different browser
- Check browser is up to date

**Mobile layout problems**
- Rotate to landscape for charts
- Pinch to zoom if needed
- Use tablet for best experience

### Export Problems
**PDF not generating**
- Allow pop-ups for the site
- Try Print → Save as PDF as alternative
- Check browser print settings

**CSV has formatting issues**
- Open in Excel or Google Sheets
- Check regional settings (comma vs semicolon)
- Import as text if needed

### Performance Issues
**Slow calculations**
- Normal for very large projects (>10,000 fixtures)
- Close other browser tabs
- Use desktop instead of mobile

**Page not loading**
- Check internet connection (for fonts)
- Clear browser cache
- Try incognito/private mode

---

## Contact & Support

For questions, suggestions, or bug reports:
- **Developer**: Dimitrios Tsiokaras
- **Email**: dimitrios@electrolight.com
- **Purpose**: Professional lighting analysis tool

Remember: This tool helps inform decisions but should be used alongside professional judgment and local requirements.