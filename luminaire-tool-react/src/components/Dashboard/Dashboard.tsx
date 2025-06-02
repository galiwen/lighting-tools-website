import Header from './Header';
import SummaryMetrics from './SummaryMetrics';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';

export default function Dashboard() {

  return (
    <div className="container max-w-7xl mx-auto px-lg py-lg">
      <Header />
      <SummaryMetrics />
      <TabNavigation />
      <TabContent />
    </div>
  );
}