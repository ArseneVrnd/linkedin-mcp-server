import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  phone_screen: 'Phone',
  technical_interview: 'Technical',
  onsite: 'Onsite',
  offer: 'Offer',
  negotiation: 'Negotiation',
  accepted: 'Accepted',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

export default function PipelineFunnel({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data yet.</p>;
  }

  const chartData = data.map(d => ({
    name: LABELS[d.stage] || d.stage,
    count: d.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium mb-4">Pipeline Funnel</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
