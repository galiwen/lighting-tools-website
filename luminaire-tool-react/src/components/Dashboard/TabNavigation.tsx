import { useAppContext } from '../../context/AppContext';

const tabs = [
  { id: 'gwp', label: 'GWP Results', icon: '🌱' },
  { id: 'financial', label: 'Financial Analysis', icon: '💰' },
  { id: 'inputs', label: 'Project Inputs', icon: '⚙️' },
  { id: 'breakdown', label: 'Calculation Breakdown', icon: '🔍' },
];

export default function TabNavigation() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="mb-lg">
      <div className="flex flex-wrap bg-white rounded-lg shadow-sm p-1 border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.id })}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200
              flex-1 min-w-0 justify-center
              ${
                state.activeTab === tab.id
                  ? 'bg-metric-blue text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}