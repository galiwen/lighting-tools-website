import { useAppContext } from '../../context/AppContext';
import SmartInput from './SmartInput';
import { marketRanges } from '../../data/industry-ranges';

export default function ProjectInputs() {
  const { state, dispatch } = useAppContext();

  const handleInputChange = (field: string, value: number) => {
    dispatch({ type: 'UPDATE_INPUT', field, value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-lg border border-border">
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-xl font-semibold text-text-primary">Project Parameters</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Market & Financial Settings</span>
          <div className="w-3 h-3 bg-metric-blue rounded-full opacity-75" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {/* Grid Factor */}
        <SmartInput
          label="Grid Carbon Factor"
          value={state.inputs.gridFactor}
          onChange={(value) => handleInputChange('gridFactor', value)}
          field="gridFactor"
          category="market"
          range={marketRanges.gridFactor}
          helpText="Lower values indicate cleaner electricity grids with more renewable energy"
        />

        {/* Electricity Rate */}
        <SmartInput
          label="Electricity Rate"
          value={state.inputs.electricityRate}
          onChange={(value) => handleInputChange('electricityRate', value)}
          field="electricityRate"
          category="market"
          range={marketRanges.electricityRate}
          helpText="Commercial electricity cost including demand charges and fees"
        />

        {/* Project Life */}
        <SmartInput
          label="Project Life"
          value={state.inputs.projectLife}
          onChange={(value) => handleInputChange('projectLife', value)}
          field="projectLife"
          category="market"
          range={marketRanges.projectLife}
          helpText="Analysis timeframe for lifecycle cost and environmental impact"
        />

        {/* Operational Hours */}
        <SmartInput
          label="Annual Operating Hours"
          value={state.inputs.operationalHours}
          onChange={(value) => handleInputChange('operationalHours', value)}
          field="operationalHours"
          category="market"
          range={marketRanges.operationalHours}
          helpText="Total hours per year that lighting is actively operating"
        />

        {/* Inflation Rate */}
        <SmartInput
          label="Inflation Rate"
          value={state.inputs.inflationRate * 100}
          onChange={(value) => handleInputChange('inflationRate', value / 100)}
          field="inflationRate"
          category="market"
          range={{
            ...marketRanges.inflationRate,
            min: marketRanges.inflationRate.min * 100,
            max: marketRanges.inflationRate.max * 100,
            typical: marketRanges.inflationRate.typical * 100
          }}
          helpText="Expected annual cost inflation for energy and replacement materials"
        />

        {/* Decarbonization Rate */}
        <SmartInput
          label="Grid Decarbonization Rate"
          value={state.inputs.decarbonizationRate * 100}
          onChange={(value) => handleInputChange('decarbonizationRate', value / 100)}
          field="decarbonizationRate"
          category="market"
          range={{
            ...marketRanges.decarbonizationRate,
            min: marketRanges.decarbonizationRate.min * 100,
            max: marketRanges.decarbonizationRate.max * 100,
            typical: marketRanges.decarbonizationRate.typical * 100
          }}
          helpText="Annual improvement in grid carbon intensity as renewables increase"
        />
      </div>

      {/* Advanced Controls Section */}
      <div className="mt-lg pt-lg border-t border-border-light">
        <h3 className="text-lg font-medium text-text-primary mb-md">Control System Parameters</h3>
        <p className="text-sm text-text-secondary mb-lg">
          Configure lighting control systems for occupancy sensing, daylight harvesting, and scheduling
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {/* Control Coefficient */}
          <SmartInput
            label="Energy Reduction Factor"
            value={state.inputs.controlCoeff}
            onChange={(value) => handleInputChange('controlCoeff', value)}
            field="controlCoeff"
            category="market"
            range={marketRanges.controlCoeff}
            helpText="Fraction of energy saved through occupancy sensors and daylight harvesting"
          />

          {/* Control Cost Coefficient */}
          <SmartInput
            label="Control Cost Multiplier"
            value={state.inputs.controlCostCoeff}
            onChange={(value) => handleInputChange('controlCostCoeff', value)}
            field="controlCostCoeff"
            category="market"
            range={marketRanges.controlCostCoeff}
            helpText="Additional cost factor for installing control systems"
          />

          {/* L90 Factor */}
          <SmartInput
            label="L90 Maintenance Factor"
            value={state.inputs.l90Factor}
            onChange={(value) => handleInputChange('l90Factor', value)}
            field="l90Factor"
            category="market"
            range={{
              min: 0.7,
              max: 1.0,
              typical: 0.9,
              unit: 'factor',
              description: 'Maintenance factor for 90% lumen output',
              industryNote: 'Typical range: 0.85-0.95 for well-maintained systems'
            }}
            helpText="Design factor accounting for luminaire maintenance and dirt accumulation"
          />

          {/* L70 Factor */}
          <SmartInput
            label="L70 Maintenance Factor"
            value={state.inputs.l70Factor}
            onChange={(value) => handleInputChange('l70Factor', value)}
            field="l70Factor"
            category="market"
            range={{
              min: 0.5,
              max: 0.9,
              typical: 0.7,
              unit: 'factor',
              description: 'Maintenance factor for 70% lumen output',
              industryNote: 'End-of-useful-life maintenance factor'
            }}
            helpText="Conservative maintenance factor for end-of-life analysis"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-lg pt-lg border-t border-border-light">
        <h3 className="text-lg font-medium text-text-primary mb-md">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              dispatch({ type: 'UPDATE_INPUT', field: 'gridFactor', value: 0.39 });
              dispatch({ type: 'UPDATE_INPUT', field: 'electricityRate', value: 0.26 });
              dispatch({ type: 'UPDATE_INPUT', field: 'decarbonizationRate', value: 0.03 });
            }}
            className="px-3 py-1 text-sm bg-metric-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            US Average
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'UPDATE_INPUT', field: 'gridFactor', value: 0.28 });
              dispatch({ type: 'UPDATE_INPUT', field: 'electricityRate', value: 0.22 });
              dispatch({ type: 'UPDATE_INPUT', field: 'decarbonizationRate', value: 0.05 });
            }}
            className="px-3 py-1 text-sm bg-metric-green text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            EU Average
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'UPDATE_INPUT', field: 'gridFactor', value: 0.15 });
              dispatch({ type: 'UPDATE_INPUT', field: 'electricityRate', value: 0.18 });
              dispatch({ type: 'UPDATE_INPUT', field: 'decarbonizationRate', value: 0.06 });
            }}
            className="px-3 py-1 text-sm bg-success text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Low Carbon Grid
          </button>
        </div>
      </div>
    </div>
  );
}