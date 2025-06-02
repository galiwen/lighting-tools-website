import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateAllScenarios, calculateGWPReduction } from '../../calculations/core';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  bgColor: string;
  textColor?: string;
}

function MetricCard({ title, value, unit, bgColor, textColor = 'text-white' }: MetricCardProps) {
  return (
    <div className={`${bgColor} ${textColor} p-lg rounded-lg shadow-md`}>
      <div className="text-sm font-medium opacity-90 mb-1">{title}</div>
      <div className="text-2xl md:text-3xl font-bold">
        {value}
        <span className="text-lg ml-1 opacity-80">{unit}</span>
      </div>
    </div>
  );
}

export default function SummaryMetrics() {
  const { state, dispatch } = useAppContext();

  // Calculate results when inputs change
  useEffect(() => {
    const calculateResults = async () => {
      dispatch({ type: 'SET_LOADING', loading: true });
      
      try {
        const results = calculateAllScenarios(state.inputs);
        dispatch({ type: 'SET_RESULTS', results });
      } catch (error) {
        console.error('Calculation error:', error);
        dispatch({ type: 'SET_LOADING', loading: false });
      }
    };

    calculateResults();
  }, [state.inputs, dispatch]);

  // Extract metric values from results
  const getMetricValues = () => {
    if (!state.results) {
      return {
        totalEmissions: '0',
        overallReduction: '0.0',
        totalCost: '0',
        paybackPeriod: '0.0'
      };
    }

    const proposedGWP = state.results.L90.without.proposed.totalGWP;
    const baselineGWP = state.results.L90.without.baseline.totalGWP;
    const gwpReduction = calculateGWPReduction(baselineGWP, proposedGWP);
    
    const proposedCost = state.results.L90.without.proposed.totalCost;
    const baselineCost = state.results.L90.without.baseline.totalCost;
    const annualSavings = (baselineCost - proposedCost) / state.inputs.projectLife;
    const payback = annualSavings > 0 ? Math.max(0, (proposedCost - baselineCost) / annualSavings) : 0;

    return {
      totalEmissions: Math.round(proposedGWP).toLocaleString(),
      overallReduction: gwpReduction.toFixed(1),
      totalCost: Math.round(proposedCost).toLocaleString(),
      paybackPeriod: payback.toFixed(1)
    };
  };

  const metrics = getMetricValues();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xxl">
      <MetricCard
        title="Total GWP Emissions"
        value={metrics.totalEmissions}
        unit="kgCO₂e"
        bgColor="bg-metric-green"
      />
      <MetricCard
        title="Overall GWP Reduction"
        value={metrics.overallReduction}
        unit="%"
        bgColor="bg-metric-blue"
      />
      <MetricCard
        title="15-Year Total Cost"
        value={`$${metrics.totalCost}`}
        unit=""
        bgColor="bg-metric-purple"
      />
      <MetricCard
        title="Payback Period"
        value={metrics.paybackPeriod}
        unit="years"
        bgColor="bg-metric-peach"
      />
    </div>
  );
}