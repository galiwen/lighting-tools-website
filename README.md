README: Luminaire GWP Calculator and Comparison Tool
1. Project Overview
The "Luminaire GWP Calculator and Comparison Tool" is a single-page web application designed to help users assess and compare the Global Warming Potential (GWP) of different lighting setups. Users can input project-specific parameters and detailed data for up to three types of luminaires. The tool then calculates the GWP across various lifecycle stages (Manufacturing - Stage A, Operational Use - Stage B, End-of-Life - Stage EOL) and visualizes these results in stacked bar charts, allowing for easy comparison under different operational scenarios (L70 vs. L90 lifetimes, impact of control systems, and maintenance dimming).

The application is built as a single HTML file, utilizing Tailwind CSS for styling and Chart.js for dynamic data visualization. The user interface aims for a clean, minimalist design with "Noto Sans" as the primary font.

2. Key Features
Data Input: Allows for comprehensive data entry for overall project parameters and specific details for up to three distinct luminaires.

GWP Calculation: Implements detailed GWP calculations considering:

Manufacturing (Stage A) based on per-unit GWP and quantity, including replacements.

Operational Use (Stage B) based on wattage, operational hours, project life, CO2e grid factor, and adjusted by maintenance factors (L70 & L90).

End-of-Life (Stage EOL) based on per-unit GWP and quantity, including replacements.

Scenario Analysis:

Compares GWP based on L70 and L90 luminaire lifetimes.

Analyzes GWP reduction with control systems (using L90 lifetime as a baseline).

Analyzes GWP reduction with control systems combined with maintenance dimming (using L90 lifetime as a baseline).

Graphical Results: Displays GWP comparisons in three interactive stacked bar charts, showing the proportional impact of Stage A, B, and EOL for each scenario.

Responsive Design: The application is designed to be responsive and usable across various screen sizes.

Simplified UI: Features a minimalist design with clear typography and simple line-based UI elements.

3. Design and Layout
The application is structured as a single page with two main tabs:

Header:

Main Title: "LUMINAIRE GWP CALCULATOR AND COMPARISON TOOL"

Developer Credit: "Developed by Dimitrios Tsiokaras - dimitrios@electrolight.com"

Main Content Area:

Tabs Navigation:

"DATA" Tab: Active by default, for all user inputs.

"RESULTS" Tab: For displaying calculated GWP charts.

Active tab is indicated by a black bottom border and black text; inactive tabs have gray text.

"DATA" Tab Content:

Introductory paragraph explaining the purpose of the section.

Project Parameters Section: A bordered section for global inputs like CO2e grid factor, control savings, operational hours, project life, maintenance dimming savings, and L70/L90 maintenance factors.

Luminaires Input Section: A grid layout dynamically populated with input sections for up to three luminaires. Each luminaire section is bordered and includes fields for its specific data.

"Calculate & View Results" Button: A prominent black button to trigger calculations and switch to the results view.

"RESULTS" Tab Content:

Introductory paragraph explaining the charts.

Charts Display: A two-column grid (on larger screens) displaying three chart containers. Each chart container has a border and a title.

Chart 1: GWP L90 vs L70 Comparison

Chart 2: GWP Comparison With Control (L90 Baseline)

Chart 3: GWP With Control & Maintenance Dimming (L90 Baseline)

"Back to Data" Button: A gray button to navigate back to the data input tab.

Footer:

A simple text indicating "Luminaire GWP Calculator v1.0".

4. Input Fields
All input fields use a simple border style and are clearly labeled in black text.

4.1. Project Parameters (Located in the "DATA" Tab)
CO2e Grid Factor (kg/kWh): Default: 0.233

Control System Savings (%): Default: 30

Operational Hours/Year: Default: 3000

Anticipated Project Life (years): Default: 10

Maintenance Dimming Savings (%): Default: 10

Maintenance Factor L70: Default: 0.70 (Used to adjust operational GWP for L70 scenarios)

Maintenance Factor L90: Default: 0.90 (Used to adjust operational GWP for L90 scenarios)

4.2. Luminaire Specific Data (Repeated for Luminaire 1, Luminaire 2, Luminaire 3 in the "DATA" Tab)
Default values are based on the user-provided screenshot:

Luminaire 1 Defaults:

Wattage (W): 12

Flux Lumens (lm): 1000

Efficacy (lm/W): Auto-calculated (83.33), read-only.

Quantity: 120

Lifetime L70 (hours): 100000

Lifetime L90 (hours): 50000

GWP - Stage A (kgCO2e/unit): 10

GWP - EOL (kgCO2e/unit): 0.5

Luminaire 2 Defaults:

Wattage (W): 10

Flux Lumens (lm): 1000

Efficacy (lm/W): Auto-calculated (100.00), read-only.

Quantity: 100

Lifetime L70 (hours): 80000

Lifetime L90 (hours): 40000

GWP - Stage A (kgCO2e/unit): 11

GWP - EOL (kgCO2e/unit): 0.5

Luminaire 3 Defaults:

Wattage (W): 12

Flux Lumens (lm): 900

Efficacy (lm/W): Auto-calculated (75.00), read-only.

Quantity: 130

Lifetime L70 (hours): 70000

Lifetime L90 (hours): 35000

GWP - Stage A (kgCO2e/unit): 15

GWP - EOL (kgCO2e/unit): 1

5. Calculation Logic
The core calculations are performed in JavaScript when the "Calculate & View Results" button is clicked.

Total Operational Hours for Project:

TotalOpHours = Operational Hours/Year * Anticipated Project Life (years)

Number of Replacements (for Stage A & EOL calculations):

Calculated separately for L70 and L90 scenarios for each luminaire.

Replacements = max(0, ceil(TotalOpHours / Luminaire Lifetime (L70 or L90)) - 1)

This determines the number of additional sets of luminaires needed after the initial installation.

GWP Stage A (Manufacturing):

TotalGWP_A = GWP_Stage_A_per_unit * Quantity * (1 + Replacements)

(1 + Replacements) accounts for the initial set plus all replacement sets.

GWP Stage EOL (End-of-Life):

TotalGWP_EOL = GWP_Stage_EOL_per_unit * Quantity * (1 + Replacements)

GWP Stage B (Operational Use - Base, Unadjusted):

BaseEnergyConsumption = (Wattage / 1000) * OperationalHoursYear * Quantity * AnticipatedProjectLife

GWP_B_Base_Unadjusted = BaseEnergyConsumption * CO2e_GridFactor

GWP Stage B (Adjusted by Maintenance Factor):

For L70 scenarios: GWP_B_L70_Adjusted = GWP_B_Base_Unadjusted / MaintenanceFactorL70

For L90 scenarios: GWP_B_L90_Adjusted = GWP_B_Base_Unadjusted / MaintenanceFactorL90

GWP Stage B (With Controls - L90 Baseline):

GWP_B_L90_Control = GWP_B_L90_Adjusted * (1 - ControlSystemSavings / 100)

GWP Stage B (With Controls & Maintenance Dimming - L90 Baseline):

GWP_B_L90_Control_Maint = GWP_B_L90_Control * (1 - MaintenanceDimmingSavings / 100)

Total GWP for Scenarios:

The total GWP for any given scenario is the sum of its calculated GWP_A, GWP_B_op (operational, adjusted as appropriate for the scenario), and GWP_EOL.

6. Outputs/Results Display ("RESULTS" Tab)
The results are visualized using three stacked bar charts generated by Chart.js. Each bar in the charts is divided into three segments representing GWP from Stage A (Manufacturing), Stage B (Operational), and Stage EOL.

Chart 1: GWP L90 vs L70 Comparison

Compares two stacks per luminaire:

Stack 1: L70 Scenario (GWP_A_L70, GWP_B_L70_Adjusted, GWP_EOL_L70)

Stack 2: L90 Scenario (GWP_A_L90, GWP_B_L90_Adjusted, GWP_EOL_L90)

Chart 2: GWP Comparison With Control (L90 Baseline)

Compares two stacks per luminaire, both based on L90 lifetimes and L90 Maintenance Factor:

Stack 1: L90 Baseline (GWP_A_L90, GWP_B_L90_Adjusted, GWP_EOL_L90)

Stack 2: L90 with Control (GWP_A_L90, GWP_B_L90_Control, GWP_EOL_L90)

Chart 3: GWP With Control & Maintenance Dimming (L90 Baseline)

Compares two stacks per luminaire, both based on L90 lifetimes and L90 Maintenance Factor:

Stack 1: L90 with Control (GWP_A_L90, GWP_B_L90_Control, GWP_EOL_L90)

Stack 2: L90 with Control & Maintenance Dimming (GWP_A_L90, GWP_B_L90_Control_Maint, GWP_EOL_L90)

Chart Styling:

Font: Noto Sans

Colors: Operational (Blue), Manufacturing (Orange), EOL (Gray)

Tooltips show the GWP for each segment on hover.

Legend clearly identifies the GWP stages.

7. Technologies Used
HTML5: Structure of the application.

Tailwind CSS v3: For styling and responsive layout (loaded via CDN).

JavaScript (ES6+): For all calculations, DOM manipulation, event handling, and Chart.js integration.

Chart.js v3.x or v4.x: For creating dynamic and interactive stacked bar charts (loaded via CDN).

Google Fonts: To load the "Noto Sans" font.

8. How to Use/Run
Save the entire HTML code as a single .html file (e.g., luminaire_gwp_calculator.html).

Open this HTML file in any modern web browser (e.g., Chrome, Firefox, Edge, Safari).

The application will load with default values in the "DATA" tab.

Modify the project parameters and luminaire data as needed.

Click the "Calculate & View Results" button.

The application will switch to the "RESULTS" tab and display the generated charts.

Use the "Back to Data" button to return to the input form and make further adjustments.

9. File Structure
The entire application is contained within a single HTML file. This includes:

HTML markup for the structure.

CSS styles (inline <style> block using Tailwind utility classes and some custom styles).

JavaScript code for logic and interactivity (inline <script> block).

This self-contained nature makes it easy to share and run.
