import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateAllScenarios, calculateGWPReduction } from '../../calculations/core';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  bgColor: string;
  textColor?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    isGood?: boolean;
  };
  isLoading?: boolean;
}

function MetricCard({ title, value, unit, bgColor, textColor = 'text-white', trend, isLoading = false }: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend || trend.direction === 'neutral') return null;
    
    if (trend.direction === 'up') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.isGood) {
      return trend.direction === 'down' ? 'text-green-200' : 'text-red-200';
    } else {
      return trend.direction === 'up' ? 'text-red-200' : 'text-green-200';
    }
  };

  return (
    <div className={`${bgColor} ${textColor} p-lg rounded-lg shadow-md relative overflow-hidden transition-all duration-300`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium opacity-90 mb-1">{title}</div>
          <div className="text-2xl md:text-3xl font-bold">
            {value}
            <span className="text-lg ml-1 opacity-80">{unit}</span>
          </div>
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {Math.abs(trend.value).toFixed(1)}% vs baseline
              </span>
            </div>
          )}
        </div>
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

  // Calculate trends
  const getTrends = () => {
    if (!state.results) return {};
    
    const baselineGWP = state.results.L90.without.baseline.totalGWP;
    const proposedGWP = state.results.L90.without.proposed.totalGWP;
    const baselineCost = state.results.L90.without.baseline.totalCost;
    const proposedCost = state.results.L90.without.proposed.totalCost;
    
    const gwpReduction = calculateGWPReduction(baselineGWP, proposedGWP);
    const costChange = baselineCost > 0 ? ((proposedCost - baselineCost) / baselineCost) * 100 : 0;
    
    return {
      gwp: {
        value: gwpReduction,
        direction: gwpReduction > 0 ? 'down' : gwpReduction < 0 ? 'up' : 'neutral',
        isGood: true // GWP reduction is good
      },
      cost: {
        value: costChange,
        direction: costChange > 0 ? 'up' : costChange < 0 ? 'down' : 'neutral',
        isGood: false // Cost increase is not good
      }
    };
  };

  const trends = getTrends();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xxl">
      <MetricCard
        title="Total GWP Emissions"
        value={metrics.totalEmissions}
        unit="kgCO₂e"
        bgColor="bg-metric-green"
        isLoading={state.isLoading}
        trend={trends.gwp ? {
          value: Math.abs(trends.gwp.value),
          direction: trends.gwp.direction as 'up' | 'down' | 'neutral',
          isGood: trends.gwp.isGood
        } : undefined}
      />
      <MetricCard
        title="Overall GWP Reduction"
        value={metrics.overallReduction}
        unit="%"
        bgColor="bg-metric-blue"
        isLoading={state.isLoading}
      />
      <MetricCard
        title="15-Year Total Cost"
        value={`$${metrics.totalCost}`}
        unit=""
        bgColor="bg-metric-purple"
        isLoading={state.isLoading}
        trend={trends.cost ? {
          value: Math.abs(trends.cost.value),
          direction: trends.cost.direction as 'up' | 'down' | 'neutral',
          isGood: trends.cost.isGood
        } : undefined}
      />
      <MetricCard
        title="Payback Period"
        value={metrics.paybackPeriod}
        unit="years"
        bgColor="bg-metric-peach"
        isLoading={state.isLoading}
      />
    </div>
  );
}