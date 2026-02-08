import Header from '../components/layout/Header';
import StatsCards from '../components/analytics/StatsCards';
import ApplicationsChart from '../components/analytics/ApplicationsChart';
import StatusPieChart from '../components/analytics/StatusPieChart';
import PipelineFunnel from '../components/analytics/PipelineFunnel';
import InterviewList from '../components/interviews/InterviewList';
import { useAnalytics } from '../hooks/useAnalytics';
import { useInterviews } from '../hooks/useInterviews';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function Dashboard() {
  const { dark, toggle } = useTheme();
  const { summary, timeline, pipeline, loading } = useAnalytics();
  const { interviews, refetch: refetchInterviews } = useInterviews({ upcoming: 'true' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" dark={dark} toggle={toggle} />
      <div className="p-6 space-y-6">
        <StatsCards summary={summary} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApplicationsChart data={timeline} />
          <StatusPieChart data={summary?.statusCounts} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineFunnel data={pipeline} />
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium mb-4">Upcoming Interviews</h3>
            <InterviewList
              interviews={interviews.slice(0, 5)}
              onDelete={async (id) => { await api.deleteInterview(id); refetchInterviews(); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
