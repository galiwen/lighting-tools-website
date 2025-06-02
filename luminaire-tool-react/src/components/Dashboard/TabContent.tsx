import { useAppContext } from '../../context/AppContext';

export default function TabContent() {
  const { state, dispatch } = useAppContext();

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'gwp':
        return (
          <div className="bg-white rounded-lg shadow-sm p-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">GWP Analysis Results</h2>
            <div className="text-text-secondary">
              <p className="mb-4">Global Warming Potential analysis comparing baseline and proposed lighting solutions.</p>
              {state.results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="bg-bg-primary p-md rounded-md">
                      <h3 className="font-medium text-text-primary mb-2">Baseline (Current)</h3>
                      <p className="text-sm">
                        Total GWP: <span className="font-semibold">
                          {Math.round(state.results.L90.without.baseline.totalGWP).toLocaleString()} kgCO₂e
                        </span>
                      </p>
                    </div>
                    <div className="bg-bg-primary p-md rounded-md">
                      <h3 className="font-medium text-text-primary mb-2">Proposed (LED)</h3>
                      <p className="text-sm">
                        Total GWP: <span className="font-semibold">
                          {Math.round(state.results.L90.without.proposed.totalGWP).toLocaleString()} kgCO₂e
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Calculating results...</p>
              )}
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="bg-white rounded-lg shadow-sm p-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">Financial Analysis</h2>
            <div className="text-text-secondary">
              <p className="mb-4">15-year lifecycle cost analysis including initial investment, operations, and replacements.</p>
              {state.results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="bg-bg-primary p-md rounded-md">
                      <h3 className="font-medium text-text-primary mb-2">Baseline Total Cost</h3>
                      <p className="text-sm">
                        ${Math.round(state.results.L90.without.baseline.totalCost).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-bg-primary p-md rounded-md">
                      <h3 className="font-medium text-text-primary mb-2">Proposed Total Cost</h3>
                      <p className="text-sm">
                        ${Math.round(state.results.L90.without.proposed.totalCost).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Calculating results...</p>
              )}
            </div>
          </div>
        );

      case 'inputs':
        return (
          <div className="bg-white rounded-lg shadow-sm p-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">Project Inputs</h2>
            <div className="text-text-secondary">
              <p className="mb-4">Configure project parameters and luminaire specifications.</p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-text-primary mb-4">Market Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Grid Factor (kgCO₂e/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={state.inputs.gridFactor}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_INPUT',
                          field: 'gridFactor',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Electricity Rate ($/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={state.inputs.electricityRate}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_INPUT',
                          field: 'electricityRate',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Project Life (years)
                      </label>
                      <input
                        type="number"
                        value={state.inputs.projectLife}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_INPUT',
                          field: 'projectLife',
                          value: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-4">Baseline Luminaire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Wattage (W)
                      </label>
                      <input
                        type="number"
                        value={state.inputs.baseline.wattage}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'baseline',
                          field: 'wattage',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={state.inputs.baseline.qty}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'baseline',
                          field: 'qty',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        GWP (kgCO₂e/unit)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={state.inputs.baseline.gwp}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'baseline',
                          field: 'gwp',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Cost ($)
                      </label>
                      <input
                        type="number"
                        value={state.inputs.baseline.cost}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'baseline',
                          field: 'cost',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-4">Proposed Luminaire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Wattage (W)
                      </label>
                      <input
                        type="number"
                        value={state.inputs.proposed.wattage}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'proposed',
                          field: 'wattage',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={state.inputs.proposed.qty}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'proposed',
                          field: 'qty',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        GWP (kgCO₂e/unit)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={state.inputs.proposed.gwp}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'proposed',
                          field: 'gwp',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Cost ($)
                      </label>
                      <input
                        type="number"
                        value={state.inputs.proposed.cost}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_LUMINAIRE_INPUT',
                          luminaire: 'proposed',
                          field: 'cost',
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-metric-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'breakdown':
        return (
          <div className="bg-white rounded-lg shadow-sm p-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">Calculation Breakdown</h2>
            <div className="text-text-secondary">
              <p className="mb-4">Detailed step-by-step calculation transparency.</p>
              {state.results ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">GWP Components (Proposed Solution)</h3>
                    <div className="bg-bg-primary p-md rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-sm">
                        <div>
                          <span className="font-medium">Manufacturing:</span>
                          <br />
                          {Math.round(state.results.L90.without.proposed.embodiedGWP).toLocaleString()} kgCO₂e
                        </div>
                        <div>
                          <span className="font-medium">Operations:</span>
                          <br />
                          {Math.round(state.results.L90.without.proposed.operationalGWP).toLocaleString()} kgCO₂e
                        </div>
                        <div>
                          <span className="font-medium">End of Life:</span>
                          <br />
                          {Math.round(state.results.L90.without.proposed.eolGWP).toLocaleString()} kgCO₂e
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-text-primary mb-3">Cost Components (Proposed Solution)</h3>
                    <div className="bg-bg-primary p-md rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-sm">
                        <div>
                          <span className="font-medium">Initial Cost:</span>
                          <br />
                          ${Math.round(state.results.L90.without.proposed.initialCost).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Operating Cost:</span>
                          <br />
                          ${Math.round(state.results.L90.without.proposed.totalOperatingCost).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Replacement Cost:</span>
                          <br />
                          ${Math.round(state.results.L90.without.proposed.replacementCost).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Calculating breakdown...</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderTabContent()}
    </div>
  );
}