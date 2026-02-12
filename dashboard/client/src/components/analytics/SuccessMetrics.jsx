import { useMemo } from 'react';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

export default function SuccessMetrics({ jobs }) {
  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const applied = jobs.filter(j => ['applied', 'phone_screen', 'technical_interview', 'onsite', 'offer', 'accepted'].includes(j.status)).length;
    const interviews = jobs.filter(j => ['phone_screen', 'technical_interview', 'onsite'].includes(j.status)).length;
    const offers = jobs.filter(j => ['offer', 'negotiation', 'accepted'].includes(j.status)).length;
    const rejected = jobs.filter(j => j.status === 'rejected').length;

    const applicationRate = totalJobs > 0 ? ((applied / totalJobs) * 100).toFixed(1) : 0;
    const interviewRate = applied > 0 ? ((interviews / applied) * 100).toFixed(1) : 0;
    const offerRate = interviews > 0 ? ((offers / interviews) * 100).toFixed(1) : 0;
    const rejectionRate = applied > 0 ? ((rejected / applied) * 100).toFixed(1) : 0;

    // Calculate average time to interview
    const jobsWithInterviews = jobs.filter(j =>
      j.date_applied && ['phone_screen', 'technical_interview', 'onsite', 'offer', 'accepted'].includes(j.status)
    );

    let avgDaysToInterview = 0;
    if (jobsWithInterviews.length > 0) {
      const totalDays = jobsWithInterviews.reduce((sum, job) => {
        const applied = new Date(job.date_applied);
        const updated = new Date(job.date_updated);
        const days = Math.floor((updated - applied) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgDaysToInterview = Math.round(totalDays / jobsWithInterviews.length);
    }

    return {
      totalJobs,
      applied,
      interviews,
      offers,
      rejected,
      applicationRate,
      interviewRate,
      offerRate,
      rejectionRate,
      avgDaysToInterview
    };
  }, [jobs]);

  const metricCards = [
    {
      label: 'Application Rate',
      value: `${metrics.applicationRate}%`,
      subtitle: `${metrics.applied} of ${metrics.totalJobs} jobs`,
      icon: TrendingUp,
      color: 'blue',
      trend: metrics.applicationRate > 50 ? 'up' : metrics.applicationRate > 20 ? 'neutral' : 'down'
    },
    {
      label: 'Interview Conversion',
      value: `${metrics.interviewRate}%`,
      subtitle: `${metrics.interviews} of ${metrics.applied} applied`,
      icon: Target,
      color: 'purple',
      trend: metrics.interviewRate > 30 ? 'up' : metrics.interviewRate > 15 ? 'neutral' : 'down'
    },
    {
      label: 'Offer Rate',
      value: `${metrics.offerRate}%`,
      subtitle: `${metrics.offers} of ${metrics.interviews} interviews`,
      icon: Award,
      color: 'green',
      trend: metrics.offerRate > 30 ? 'up' : metrics.offerRate > 15 ? 'neutral' : 'down'
    },
    {
      label: 'Avg Time to Interview',
      value: `${metrics.avgDaysToInterview}d`,
      subtitle: 'Days from application',
      icon: Clock,
      color: 'orange',
      trend: metrics.avgDaysToInterview < 7 ? 'up' : metrics.avgDaysToInterview < 14 ? 'neutral' : 'down'
    },
  ];

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    neutral: 'text-yellow-600 dark:text-yellow-400',
    down: 'text-red-600 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium mb-4">Success Metrics</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, i) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
          };

          return (
            <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${colorClasses[metric.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${trendColors[metric.trend]}`}>
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {metric.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium mb-2">💡 Insights</h4>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          {metrics.interviewRate < 20 && (
            <li>• Your interview rate is below average. Consider improving your resume or application materials.</li>
          )}
          {metrics.applicationRate < 30 && (
            <li>• You're applying to less than 30% of saved jobs. Set a goal to apply more consistently.</li>
          )}
          {metrics.offerRate > 30 && (
            <li>• Great offer rate! Your interview skills are strong.</li>
          )}
          {metrics.avgDaysToInterview < 7 && (
            <li>• Companies are responding quickly! Keep up the momentum.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
