# lighting-tools-website

1. Project Overview
The goal is to create a web-based "Luminaire GWP Calculator and Comparison Tool." This tool will allow users to input technical data for up to three different luminaires, along with project-specific parameters. Based on these inputs, the tool will calculate and visually compare their Global Warming Potential (GWP) under various operational scenarios. The design should closely follow the provided PDF mock-up.

2. Key Features
Data Input: Allow input for project-wide parameters and specific data for up to three types of luminaires.

GWP Calculation: Implement logic to calculate the total GWP for each luminaire, considering manufacturing (Stage A), operational energy use (Stage B), and end-of-life (EOL).

Scenario Analysis: Calculate GWP based on L70 and L90 lifetimes.

Impact of Controls: Calculate GWP savings from using control systems.

Impact of Maintenance Dimming: (Optional, if logic is clearly defined) Calculate GWP savings from a maintenance dimming strategy.

Graphical Results: Display GWP comparisons in bar charts for easy understanding.

Responsive Design: The website should be usable on different screen sizes.

3. Design and Layout (Based on PDF Mock-up)
The website will have a clear, two-tab interface:

Main Title: "LUMINAIRE GWP CALCULATOR AND COMPARISON TOOL"

Tabs:

DATA Tab (Default View): This tab will be for all data inputs.

Left-aligned Input Section:

Project Parameters (Global):

CO2e Grid Factor (kg/kWh)

Control System Coefficient (%)

Operational Hours/Year

Anticipated Project Life (years)

Luminaire Data Sections (for Luminaire 1, Luminaire 2, Luminaire 3):

Each luminaire section should be clearly delineated.

RESULTS Tab: This tab will display the calculated GWP comparisons in graphical form.

Right-aligned Results Section:

Display multiple bar charts as specified in the "Outputs/Results Display" section below.

4. Input Fields
4.1. Project Parameters (Under "DATA" Tab)
These fields apply to the entire project/comparison.

CO2e Grid Factor (kg/kWh): (Numeric input, e.g., 0.45)

Control System Coefficient (%): (Numeric input, e.g., 30 for 30% savings. This will be used to reduce operational energy.)

Operational Hours/Year: (Numeric input, e.g., 4000)

Anticipated Project Life (years): (Numeric input, e.g., 10)

4.2. Luminaire Specific Data (Under "DATA" Tab - repeated for Luminaire 1, Luminaire 2, Luminaire 3)
Wattage (W): (Numeric input, e.g., 50) - This is the operational power of one luminaire.

Flux Lumens (lm): (Numeric input, e.g., 5000)

Efficacy (lm/W): (Numeric input, e.g., 100) - Note: This can be calculated (Flux / Wattage). Clarify if this input is for user reference, validation, or if it actively participates in calculations (e.g., for maintenance dimming scenarios). For now, treat as a direct input.

Quantity: (Numeric input, e.g., 100) - Number of this luminaire type in the project.

Lifetime L70 (hours): (Numeric input, e.g., 50000)

Lifetime L90 (hours): (Numeric input, e.g., 30000)

GWP - Stage A (kgCO2e): (Numeric input, e.g., 5.5) - GWP for manufacturing one unit.

GWP - EOL (kgCO2e): (Numeric input, e.g., 0.5) - GWP for end-of-life processing of one unit.

5. Calculations Required
The core of the application is calculating the Total GWP for each luminaire under different conditions. The provided CSV ("GWP Luminaire Assessment & Comparison_Rev01.xlsx - L90 Analysis.csv") gives a detailed example of these calculations.

5.1. Intermediate Calculations (for each luminaire):
Total Operational Hours for Project:

TotalOpHours = Operational Hours/Year * Anticipated Project Life (years)

Number of Replacements:

Calculate separately for L70 and L90.

Replacements_L70 = ceil(TotalOpHours / Lifetime L70 (hours)) - 1 (Subtract 1 because the initial installation is not a replacement. Ensure it's at least 0).

Replacements_L90 = ceil(TotalOpHours / Lifetime L90 (hours)) - 1 (Ensure it's at least 0).

If lifetime is 0 or not provided, handle appropriately (e.g., assume infinite replacements or show an error).

5.2. GWP Component Calculations (for each luminaire, calculated for both L70 and L90 scenarios):
Total GWP Stage A (Manufacturing):

TotalGWP_A = GWP - Stage A (kgCO2e) * Quantity * (1 + Replacements)

Calculate TotalGWP_A_L70 using Replacements_L70.

Calculate TotalGWP_A_L90 using Replacements_L90.

Total GWP Stage B (Operational Use):

EnergyConsumption_kWh_per_luminaire_per_year = Wattage (W) / 1000 * Operational Hours/Year

TotalEnergyConsumption_kWh_project_life = EnergyConsumption_kWh_per_luminaire_per_year * Quantity * Anticipated Project Life (years)

Base_GWP_B = TotalEnergyConsumption_kWh_project_life * CO2e Grid Factor (kg/kWh)

This Base_GWP_B is the same for L70 and L90 scenarios as it depends on total operational hours, not lifetime directly for energy use (lifetime affects replacements for Stage A and EOL).

Total GWP EOL (End of Life):

TotalGWP_EOL = GWP - EOL (kgCO2e) * Quantity * (1 + Replacements)

Calculate TotalGWP_EOL_L70 using Replacements_L70.

Calculate TotalGWP_EOL_L90 using Replacements_L90.

5.3. Total GWP Calculations (for each luminaire):
Total GWP (L70):

TotalGWP_L70 = TotalGWP_A_L70 + Base_GWP_B + TotalGWP_EOL_L70

Total GWP (L90):

TotalGWP_L90 = TotalGWP_A_L90 + Base_GWP_B + TotalGWP_EOL_L90

5.4. GWP Calculations with Controls:
GWP Stage B with Control:

GWP_B_Control = Base_GWP_B * (1 - Control System Coefficient (%) / 100)

Total GWP with Control (L70):

TotalGWP_L70_Control = TotalGWP_A_L70 + GWP_B_Control + TotalGWP_EOL_L70

Total GWP with Control (L90):

TotalGWP_L90_Control = TotalGWP_A_L90 + GWP_B_Control + TotalGWP_EOL_L90

5.5. GWP Calculations with Control and Maintenance Dimming:
This is the most complex calculation. The PDF indicates this comparison, and the CSV has columns like "Maintained Circuit Power (W) per luminaire" and "GWP L90 - Stage B with Control & Maint. Dimming (Total)".

Requirement: A clear formula or logic for how "Maintenance Dimming" affects the Wattage (W) or operational energy consumption over the luminaire's life is needed.

Option 1 (Simplified): Assume maintenance dimming provides an additional fixed percentage saving on the operational energy after controls are applied. This would need a new input field like "Maintenance Dimming Savings (%)".

Option 2 (Average Power): If maintenance dimming implies an average power consumption different from the input "Wattage (W)", this average power should be used for calculating GWP_B_Control_MaintDim. This might require an additional input field for "Average Dimmed Wattage (W)".

Guidance: For the initial build, if the logic for maintenance dimming is not straightforward from the provided Excel/CSV formulas, this graph might need to be simplified or deferred. The CSV columns suggest a pre-calculated "Maintained Circuit Power" is used. If this is the case, the website might need an input for "Maintained Wattage (W)" in addition to "Initial Wattage (W)" when maintenance dimming is considered.

Assuming a GWP_B_Control_MaintDim can be calculated:

TotalGWP_L70_Control_MaintDim = TotalGWP_A_L70 + GWP_B_Control_MaintDim + TotalGWP_EOL_L70

TotalGWP_L90_Control_MaintDim = TotalGWP_A_L90 + GWP_B_Control_MaintDim + TotalGWP_EOL_L90

6. Outputs/Results Display (Under "RESULTS" Tab)
The results should be displayed as bar charts. Each chart compares GWP values (in kgCO2e) for Luminaire 1, Luminaire 2, and Luminaire 3.

Chart 1: GWP L90 vs L70 Comparison

Type: Grouped Bar Chart

X-axis: Luminaire 1, Luminaire 2, Luminaire 3

Y-axis: kgCO2e

For each luminaire, two bars:

Bar 1: TotalGWP_L70

Bar 2: TotalGWP_L90

Legend: "L70", "L90"

Chart 2: GWP Comparison With Control

Type: Grouped Bar Chart

X-axis: Luminaire 1, Luminaire 2, Luminaire 3

Y-axis: kgCO2e

For each luminaire, two bars (choose one lifetime for base comparison, e.g., L70, or make it selectable):

Bar 1: TotalGWP_L70 (or selected lifetime baseline)

Bar 2: TotalGWP_L70_Control (or selected lifetime with control)

Legend: "Baseline GWP (L70)", "GWP with Control (L70)" (Adjust legend based on chosen lifetime)

Alternative: Could show four bars per luminaire: L70, L70+Control, L90, L90+Control. The PDF is simpler, implying a more direct comparison.

Chart 3: GWP Comparison With Control And Maintenance Dimming

Type: Grouped Bar Chart

X-axis: Luminaire 1, Luminaire 2, Luminaire 3

Y-axis: kgCO2e

For each luminaire, two bars (based on the GWP values derived from the maintenance dimming logic, e.g., using L70):

Bar 1: TotalGWP_L70_Control

Bar 2: TotalGWP_L70_Control_MaintDim

Legend: "GWP with Control (L70)", "GWP with Control & Maint. Dimming (L70)"

Note: The feasibility and accuracy of this chart depend heavily on the defined logic for "Maintenance Dimming" (see Section 5.5).

7. Technologies (Suggestions)
Frontend: HTML5, CSS3, JavaScript (ES6+)

Charting Library: A JavaScript library like Chart.js, ApexCharts, or D3.js (if more complex visualizations are needed). Chart.js is often a good balance of ease of use and capability for bar charts.

No Backend Required: All calculations can be performed client-side in JavaScript.

Styling: Use CSS to match the clean and professional look of the PDF mock-up. Consider using a lightweight CSS framework or utility classes if it speeds up development, but custom styling will be needed.

8. Important Considerations for the AI
Error Handling: Implement basic validation for inputs (e.g., numeric, non-negative). Handle cases like division by zero (e.g., if lifetime is 0).

Clarity of Calculations: The GWP calculation logic, especially for operational use (Stage B) and the impact of controls and maintenance dimming, is critical. The formulas provided above are interpretations. Refer to standard LCA methodologies for lighting if further clarification is needed, or use the structure implied by the CSV column calculations.

User Experience: Ensure the interface is intuitive. Inputs should be clearly labeled. Results should update automatically or via a "Calculate" button when data changes.

Maintenance Dimming Logic: This is the most ambiguous part. The AI will need to either:

Implement a specific, pre-defined formula for how maintenance dimming affects energy consumption.

Request clarification or make a reasonable, documented assumption (e.g., an additional percentage saving or requiring an "average power" input).

Initially, it might be best to focus on the first two graphs and make the third graph dependent on a clear definition for maintenance dimming.

Efficacy Input: Determine if the "Efficacy (lm/W)" input is actively used in calculations or is for informational purposes. If Wattage and Flux Lumens are provided, efficacy is Flux Lumens / Wattage. If the input efficacy is meant to reflect a maintained value or an average under dimming, this needs to be part of the maintenance dimming logic.

9. Footer
Include the text "Developed by Dimitrios Tsiokaras - dimitrios@electrolight.com" in the footer of the page, as shown in the PDF.

This README should provide a solid foundation for the code-generating AI to develop the Luminaire GWP Calculator.
