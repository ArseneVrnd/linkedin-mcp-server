import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  saved: '#9ca3af',
  applied: '#3b82f6',
  phone_screen: '#06b6d4',
  technical_interview: '#8b5cf6',
  onsite: '#6366f1',
  offer: '#f59e0b',
  negotiation: '#f97316',
  accepted: '#22c55e',
  rejected: '#ef4444',
  ghosted: '#78716c',
};

const LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  technical_interview: 'Technical',
  onsite: 'Onsite',
  offer: 'Offer',
  negotiation: 'Negotiation',
  accepted: 'Accepted',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

export default function StatusPieChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data yet.</p>;
  }

  const chartData = data
    .filter(d => d.count > 0)
    .map(d => ({ name: LABELS[d.status] || d.status, value: d.count, status: d.status }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status] || '#6366f1'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
