import Dashboard from './components/Dashboard/Dashboard';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg-primary">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App
