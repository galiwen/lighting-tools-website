# Luminaire GWP & Cost Assessment Tool

A comprehensive, mobile-optimized web-based tool for evaluating the environmental and financial impacts of lighting systems throughout their lifecycle, comparing Global Warming Potential (GWP) and total cost of ownership.

**Developed by:** Dimitrios Tsiokaras - [dimitrios@electrolight.com](mailto:dimitrios@electrolight.com)

## Overview

The Luminaire GWP & Cost Assessment Tool enables lighting professionals to make data-driven decisions by comparing different luminaire options across multiple dimensions:
- Environmental impact (GWP/carbon footprint)
- Total cost of ownership
- Impact of control systems
- L70 vs L90 lifetime comparisons

## Key Features

### 1. **L70 vs L90 Comparison**
- Compares environmental impact using different lifetime maintenance factors
- Automatically adjusts quantities based on maintenance factors (÷0.9 for L90, ÷0.7 for L70)
- Calculates replacement schedules based on respective lifetimes
- Visual comparison through stacked bar charts

### 2. **GWP Lifecycle Analysis**
- Evaluates carbon footprint across three lifecycle stages:
  - **Stage A**: Manufacturing (embodied carbon)
  - **Stage B**: Operations (energy consumption)
  - **Stage C**: End of Life (disposal/recycling)
- Progressive analysis showing impact of:
  - Base scenario (no controls)
  - With control systems
  - With control systems + maintenance dimming

### 3. **Financial Analysis**
- Comprehensive total cost of ownership calculation including:
  - Initial investment costs
  - Replacement costs over project lifetime
  - Operational costs (with inflation adjustment)
- Control system cost multiplier effects
- Annual operational savings calculations

### 4. **Control System Modeling**
- Models the impact of lighting controls on both GWP and costs
- Configurable control coefficient (default 0.75 = 25% energy reduction)
- Maintenance dimming factor to account for overlighting compensation

### 5. **Mobile Optimization** *(New)*
- Fully responsive design that works seamlessly on smartphones, tablets, and desktops
- Touch-optimized interface with appropriately sized tap targets
- Horizontally scrollable tabs and tables with visual indicators
- Dynamic chart sizing and labeling for optimal mobile viewing
- Enhanced form inputs that prevent unwanted zooming on iOS devices

## Getting Started

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in browser
- Internet connection (for loading Chart.js library)
- Works on all devices - desktop, tablet, and mobile

### Usage
1. Open the HTML file in a web browser
2. A welcome modal will appear explaining the tool's purpose
3. Enter your specific data in the "Data Entry" tab
4. Click "Calculate Analysis" to generate results
5. Navigate between tabs to view different analyses (swipe or scroll on mobile)

## Mobile Interface Features

### Touch-Friendly Design
- **Large tap targets**: All interactive elements are sized for easy touch interaction
- **Scrollable tabs**: Swipe horizontally through navigation tabs on small screens
- **Responsive tables**: Tables scroll horizontally with visual cues on mobile
- **Optimized modals**: Welcome screen adapts to mobile viewports with tap-to-close functionality

### Adaptive Layouts
- **Fluid typography**: Text sizes scale smoothly between mobile and desktop using CSS clamp()
- **Responsive grids**: Input fields stack vertically on small screens for better usability
- **Dynamic charts**: Automatically resize and adjust labels based on screen size
- **Landscape support**: Special handling for phones in landscape orientation

### Performance Optimizations
- **Prevented zoom issues**: Form inputs configured to prevent unwanted zooming on iOS
- **Smooth animations**: Touch-optimized transitions and feedback
- **Efficient resizing**: Debounced handlers for orientation changes

## Input Parameters

### Market Data
| Parameter | Description | Default |
|-----------|-------------|---------|
| CO2e Grid Factor | Carbon intensity of electricity grid (kg/kWh) | 0.39 |
| Current Electricity Rate | Cost of electricity ($/kWh) | 0.26 |
| Average Inflation Rate | Annual inflation rate for cost projections | 0.03 |

### Project Data
| Parameter | Description | Default |
|-----------|-------------|---------|
| Control System Coefficient | Energy reduction factor when controls applied | 0.75 |
| Control Additional Cost Coefficient | Cost multiplier for control systems | 1.15 |
| Operational Hours/Year | Annual operating hours | 4990 |
| Anticipated Project Life | Project duration in years | 15 |
| L90 Luminaire Maintenance Factor | Light output at L90 lifetime | 0.9 |
| L70 Luminaire Maintenance Factor | Light output at L70 lifetime | 0.7 |

### Luminaire Specifications
For both Baseline (A) and Proposed (B) luminaires:
- **Wattage** (W)
- **Flux Lumens** (lm) - light output
- **Efficacy** (lm/W) - automatically calculated
- **Quantity** - number of fixtures
- **L90 Lifetime** (hours) - time to 90% light output
- **L70 Lifetime** (hours) - time to 70% light output
- **GWP - Cradle to Gate** (kgCO2e) - manufacturing emissions
- **GWP - End of Life** (kgCO2e) - disposal emissions
- **Supply + Install Cost** ($) - per unit cost

## Calculations & Methodology

### Quantity Adjustment
To ensure fair comparison with equivalent light output:
- L90 analysis: Quantity ÷ 0.9
- L70 analysis: Quantity ÷ 0.7

### Replacement Calculations
```
Lifetime in years = L70/L90 hours ÷ Annual operating hours
Replacements = CEILING(Project life ÷ Lifetime in years) - 1
```

### GWP Calculations
```
Operational GWP = Total Energy × Grid Factor
Embodied GWP = Unit GWP × Quantity × (1 + Replacements)
End of Life GWP = EOL GWP × Quantity × (1 + Replacements)
Total GWP = Operational + Embodied + End of Life
```

### Financial Calculations
```
Initial Cost = Unit Cost × Quantity × Control Cost Coefficient
Replacement Cost = Unit Cost × Quantity × Replacements × Control Cost Coefficient
Annual Operating Cost = Annual Energy × Electricity Rate
Total Operating Cost = Σ(Annual Cost × (1 + Inflation Rate)^year)
Total Cost = Initial + Replacement + Operating Costs
```

### Control System Effects
- Energy consumption multiplied by control coefficient (e.g., 0.75)
- Costs multiplied by control cost coefficient (e.g., 1.15)
- Maintenance dimming further reduces energy by maintenance factor

## Output Interpretation

### GWP Results
- **Positive percentages** indicate reduction (improvement)
- **Negative percentages** indicate increase
- Results show both A→B comparison and impact of controls

### Financial Results
- **Cost savings** shown as percentages
- **Annual operational savings** in dollars
- **Payback period** can be inferred from savings rates

### Charts
- **Stacked bar charts** show component breakdown
- **Hover tooltips** provide detailed values and percentages (tap on mobile)
- **Color coding**:
  - Orange: Manufacturing/Initial costs
  - Blue: Operations/Operating costs
  - Teal: End of Life
  - Yellow: Replacement costs
- **Mobile adaptations**: 
  - Shortened labels on small screens
  - Rotated axis labels for better readability
  - Dynamic font sizing based on viewport

## Technical Details

### Built With
- **HTML5** - Structure and layout with mobile viewport meta tags
- **CSS3** - Responsive styling with Noto Sans font
- **JavaScript** - Calculations and interactivity
- **Chart.js 4.4.0** - Data visualization with mobile optimizations
- **Google Fonts** - Typography

### Browser Compatibility
- Chrome 90+ (Mobile & Desktop)
- Firefox 88+ (Mobile & Desktop)
- Safari 14+ (iOS & macOS)
- Edge 90+ (Mobile & Desktop)
- Samsung Internet 14+

### Mobile-Specific Features
- **Viewport Configuration**: Prevents unwanted zooming and ensures proper scaling
- **Touch Event Handling**: Optimized for touch interactions
- **Responsive Breakpoints**: 
  - Mobile: < 480px
  - Tablet: 480px - 768px
  - Desktop: > 768px
- **Orientation Support**: Handles both portrait and landscape modes
- **Scroll Indicators**: Visual cues for horizontally scrollable content

### Code Structure
- Self-contained single HTML file
- No external dependencies except Chart.js CDN
- Responsive design for various screen sizes
- Clean, maintainable JavaScript with error handling
- Mobile-first CSS approach with progressive enhancement

## Default Values

### Baseline Luminaire A
- 12W, 1000 lumens (83.3 lm/W)
- Quantity: 500
- L90: 50,000 hours
- L70: 120,000 hours

### Proposed Luminaire B
- 9W, 1059 lumens (117.7 lm/W)
- Quantity: 473.48
- L90: 45,000 hours
- L70: 100,000 hours

## Known Limitations

- **Offline Usage**: Requires internet connection for Chart.js library
- **Print Layout**: Optimized for screen viewing; printing may require adjustments
- **Very Small Screens**: Minimum recommended screen width is 320px

## Future Enhancements

Potential improvements for future versions:
- Offline capability with service workers
- Data export functionality (CSV, PDF)
- Project saving/loading capabilities
- Multi-language support
- Dark mode theme
- Advanced sensitivity analysis tools

## License

This tool is provided as-is for professional use in lighting design and assessment. For commercial use or redistribution, please contact the developer.

## Contact & Support

**Developer:** Dimitrios Tsiokaras  
**Email:** [dimitrios@electrolight.com](mailto:dimitrios@electrolight.com)

For bug reports, feature requests, or technical support, please contact the developer directly.

## Version History

### Version 2.0 (Current)
- Complete mobile optimization
- Touch-friendly interface
- Responsive charts and tables
- Improved navigation for small screens
- Enhanced form usability on mobile devices

### Version 1.0
- Initial release with desktop-focused design
- Core GWP and financial analysis features
- L70 vs L90 comparison functionality

## Acknowledgments

This tool was developed to support sustainable lighting design decisions by providing transparent, comprehensive lifecycle analysis capabilities to lighting professionals, now accessible on any device.