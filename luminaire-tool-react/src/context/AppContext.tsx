import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CalculationInputs, AllResults } from '../types';

// Default inputs matching current HTML implementation
const defaultInputs: CalculationInputs = {
  gridFactor: 0.39,
  electricityRate: 0.26,
  inflationRate: 0.03,
  decarbonizationRate: 0.03,
  controlCoeff: 0.75,
  controlCostCoeff: 1.15,
  operationalHours: 4990,
  projectLife: 15,
  l90Factor: 0.9,
  l70Factor: 0.7,
  baseline: {
    wattage: 12,
    flux: 1000,
    qty: 500,
    l90Lifetime: 50000,
    l70Lifetime: 120000,
    gwp: 10,
    eol: 0.5,
    cost: 260
  },
  proposed: {
    wattage: 9,
    flux: 1059,
    qty: 473.48,
    l90Lifetime: 45000,
    l70Lifetime: 100000,
    gwp: 20,
    eol: 1.5,
    cost: 220
  }
};

interface AppState {
  inputs: CalculationInputs;
  results: AllResults | null;
  activeTab: string;
  isComparisonMode: boolean;
  isLoading: boolean;
}

type AppAction =
  | { type: 'UPDATE_INPUT'; field: string; value: number }
  | { type: 'UPDATE_LUMINAIRE_INPUT'; luminaire: 'baseline' | 'proposed'; field: string; value: number }
  | { type: 'SET_RESULTS'; results: AllResults }
  | { type: 'SET_ACTIVE_TAB'; tab: string }
  | { type: 'TOGGLE_COMPARISON_MODE' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'LOAD_PRESET'; preset: CalculationInputs };

const initialState: AppState = {
  inputs: defaultInputs,
  results: null,
  activeTab: 'gwp',
  isComparisonMode: false,
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.field]: action.value,
        },
      };
    
    case 'UPDATE_LUMINAIRE_INPUT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.luminaire]: {
            ...state.inputs[action.luminaire],
            [action.field]: action.value,
          },
        },
      };
    
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.results,
        isLoading: false,
      };
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.tab,
      };
    
    case 'TOGGLE_COMPARISON_MODE':
      return {
        ...state,
        isComparisonMode: !state.isComparisonMode,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading,
      };
    
    case 'LOAD_PRESET':
      return {
        ...state,
        inputs: action.preset,
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}