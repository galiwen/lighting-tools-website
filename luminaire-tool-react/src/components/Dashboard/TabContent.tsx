import { useAppContext } from '../../context/AppContext';
import ProjectInputs from '../Inputs/ProjectInputs';
import LuminaireInputs from '../Inputs/LuminaireInputs';

export default function TabContent() {
  const { state } = useAppContext();

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
          <div className="space-y-lg">
            <ProjectInputs />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <LuminaireInputs
                title="Baseline System"
                type="baseline"
                icon="💡"
                bgColor="bg-gray-600"
              />
              
              <LuminaireInputs
                title="Proposed System"
                type="proposed"
                icon="⚡"
                bgColor="bg-metric-blue"
              />
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