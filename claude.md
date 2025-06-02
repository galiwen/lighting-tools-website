# Claude Implementation Guide for Luminaire GWP & Cost Assessment Tool

## Project Overview

You are implementing a modern redesign of the Luminaire GWP & Cost Assessment Tool. This tool helps lighting professionals evaluate the environmental (Global Warming Potential) and financial impacts of different luminaire options over their lifecycle.

**Developer**: Dimitrios Tsiokaras - dimitrios@electrolight.com

## Core Principles

1. **Simplicity First**: Avoid over-engineering. Start simple, add complexity only when validated by user needs
2. **Calculation Accuracy**: Never compromise on calculation correctness - all results must match the Excel model within 0.1%
3. **Real-time Feedback**: Show impact of changes immediately, but use staged updates to prevent overwhelming users
4. **Educational Focus**: Help users understand what drives GWP and costs, not just calculate them
5. **Mobile-First**: Ensure full functionality on all devices

## Technical Stack (As Implemented)

```
- Enhanced HTML/CSS/JavaScript (single-page application)
- Custom CSS with design system variables (mobile-first)
- Chart.js for data visualizations
- Vanilla JavaScript with modern patterns
- Professional responsive design with collapsible sections
- Advanced interactive features and export capabilities
```

**Note**: After validation testing, the enhancement approach proved superior to React migration by preserving the working, well-designed foundation while focusing on calculation accuracy and user value.

## Calculation Model

### Critical Calculations to Preserve

All calculations must match the original Excel model exactly:

1. **L70 vs L90 Analysis**
   - Quantity adjustments: L90 (÷0.9), L70 (÷0.7)
   - Replacement calculations based on lifetime hours
   
2. **GWP Calculations**
   ```typescript
   Total GWP = Embodied + Operational + End of Life
   
   Embodied = Manufacturing GWP × Adjusted Quantity × (1 + Replacements)
   Operational = Σ(Annual Energy × Grid Factor × Control Factor)
   End of Life = EOL GWP × Adjusted Quantity × (1 + Replacements)
   ```

3. **Grid Decarbonization**
   - Apply exponential decay: `gridFactor × (1 - decarbRate)^year`
   
4. **Financial Calculations**
   - Include inflation adjustment
   - Control system cost coefficients
   - Replacement scheduling

## UI Architecture

### Single-Page Layout
```
┌─────────────────────────────────────────────────────┐
│                 SUMMARY METRICS                      │
│  Total GWP | 15-Year Cost | Payback | Efficiency    │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│              COLLAPSIBLE INPUT SECTIONS              │
│  > Project Details      ▼                            │
│  > Luminaire Specs      ▼                            │
│  > Control Strategy     ▼                            │
│  > Financial Parameters ▼                            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│               RESULTS & VISUALIZATION                │
│  [Unified chart showing GWP and cost impacts]       │
│  [Calculation breakdowns with explanations]         │
└─────────────────────────────────────────────────────┘
```

### Smart Input Component Pattern

Each input should show:
- Current value with immediate validation
- Industry range/typical values
- Impact indicator (% change from baseline)
- Help tooltip with context

```tsx
<SmartInput
  label="Wattage per Fixture"
  value={wattage}
  unit="W"
  industryRange={{ min: 8, max: 15 }}
  helpText="Power consumption of each luminaire"
  showImpact={true}
/>
```

## ⚠️ **CRITICAL STRATEGIC DECISION POINT**

### Current Status: STRATEGIC FORK REQUIRING IMMEDIATE DECISION

**Date**: February 2025  
**Issue**: Project scope expansion from focused tool enhancement to enterprise platform transformation  
**Decision Required**: Choose implementation path within 48 hours to maintain project momentum  

### **STRATEGIC OPTIONS ANALYSIS**

#### **Option A: Focused Enhancement (RECOMMENDED)** ✅
- **Scope**: React migration with Excel parity and mobile optimization
- **Timeline**: 6-8 weeks
- **Risk**: 🟢 Low-Medium
- **Alignment**: ✅ Maintains "simplicity first" core principle
- **Resource Requirements**: 1 developer, realistic scope

**Implementation Plan**:
- Week 1-2: React setup, calculation migration to TypeScript
- Week 3-4: UI components, maintain current design excellence
- Week 5-6: Enhanced features, comparison mode, educational tooltips
- Week 7-8: Mobile optimization, testing, deployment

#### **Option B: Enterprise Platform Transformation** ⚠️
- **Scope**: Multi-standard analysis, advanced grid intelligence, enterprise financial platform
- **Timeline**: 6-12 months (realistic vs. claimed 3-6 months)
- **Risk**: 🔴 High
- **Concerns**: 🚨 Violates "simplicity first", unvalidated business assumptions
- **Resource Requirements**: 2-3 developers, extensive market validation required

**Critical Requirements if Option B**:
- 4-6 week discovery phase with 25+ enterprise customer interviews
- Business model validation and competitive analysis
- Technical feasibility prototyping
- Realistic resource and timeline planning

### **STRATEGIC RECOMMENDATION: Option A**

**Rationale**:
1. **CLAUDE.md Alignment**: Maintains core "simplicity first" principle
2. **Risk Management**: Proven approach vs. speculative enterprise features
3. **Resource Reality**: Matches available development capacity
4. **Market Validation**: Building on proven user needs
5. **Technical Soundness**: Enhancement preserves working foundation

### **COMPLETED IMPLEMENTATION STATUS** ✅

**Phase 0-3 Achievement Summary**:
- ✅ **Excel Accuracy**: 0.1% tolerance achieved consistently
- ✅ **Critical Calculation Fixes**: Grid decarbonization, replacement timing, maintenance factors
- ✅ **Enhanced Features**: Comparison mode, educational tooltips, calculation transparency
- ✅ **Advanced Features**: Preset scenarios, export functionality, cross-browser testing
- ✅ **Interactive Features**: Timeline charts, sensitivity analysis, user preferences
- ✅ **Mobile Optimization**: Full responsive functionality maintained
- ✅ **Professional Quality**: Industry-ready with comprehensive validation

**Current Implementation**: Enhanced HTML/CSS/JavaScript application that successfully delivers professional-grade luminaire assessment capabilities while maintaining excellent performance and usability.

## Key Implementation Details

### State Management
```typescript
interface AppState {
  inputs: {
    market: MarketData;
    project: ProjectData;
    luminaire: LuminaireSpec;
    comparison?: LuminaireSpec; // Optional comparison
  };
  results: {
    gwp: GWPResults;
    cost: CostResults;
    payback: number;
  };
  ui: {
    comparisonMode: boolean;
    expandedSections: string[];
  };
}
```

### Calculation Hook
```typescript
export function useCalculations(inputs: CalculationInputs) {
  const [results, setResults] = useState<Results | null>(null);
  
  // Debounced calculation
  const calculate = useMemo(
    () => debounce((inputs: CalculationInputs) => {
      const gwp = calculateGWP(inputs);
      const cost = calculateCosts(inputs);
      const payback = calculatePayback(cost);
      
      setResults({ gwp, cost, payback });
    }, 500),
    []
  );
  
  useEffect(() => {
    calculate(inputs);
  }, [inputs]);
  
  return results;
}
```

### Calculation Transparency

Always show how calculations work:
```
Total GWP = 234,567 kgCO2e [ℹ]

Click [ℹ] to see:
Manufacturing: 556 fixtures × 81 kg = 45,000 kgCO2e
Operations: 45,500 kWh/yr × 0.39 kg/kWh × 15 yrs = 178,000 kgCO2e  
End of Life: 556 fixtures × 20.8 kg = 11,567 kgCO2e
```

## Validation Requirements

1. **Calculation Accuracy**: All results must match Excel within 0.1%
2. **Performance**: Calculations complete in <50ms
3. **Responsive**: Full functionality on mobile devices
4. **Accessibility**: WCAG 2.1 AA compliance

## Common Pitfalls to Avoid

1. **Don't over-complicate the UI** - Users need clarity, not features
2. **Don't update everything instantly** - Use staged updates for visual stability
3. **Don't hide the math** - Show calculation breakdowns for trust
4. **Don't forget mobile** - Test on real devices throughout development

## Testing Strategy

```typescript
// Always validate against Excel
describe('Excel Parity Tests', () => {
  test('GWP calculations match Excel', () => {
    const result = calculateGWP(testInputs);
    expect(result.total).toBeCloseTo(excelResult.gwp, 1);
  });
});
```

## Color Palette

```css
:root {
  /* Semantic colors for impact */
  --color-positive: #10B981;  /* Green for improvements */
  --color-negative: #EF4444;  /* Red for increases */
  --color-neutral: #6B7280;   /* Gray for no change */
  
  /* UI colors */
  --color-primary: #2563EB;   /* Blue for primary actions */
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
}
```

## Remember

- The goal is to help users make better lighting decisions through understanding
- Every feature should make the tool simpler to use, not more complex
- Real-time feedback is powerful but must be implemented thoughtfully
- Always maintain calculation accuracy as the top priority

When implementing, start with the simplest version that provides value, then iterate based on user feedback.