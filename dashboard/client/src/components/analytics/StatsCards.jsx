import { Briefcase, Send, Users, Award, XCircle, Percent } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total Jobs', icon: Briefcase, color: 'text-primary-600' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'text-blue-600' },
  { key: 'interviews', label: 'Interviews', icon: Users, color: 'text-purple-600' },
  { key: 'offers', label: 'Offers', icon: Award, color: 'text-amber-600' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
  { key: 'responseRate', label: 'Response Rate', icon: Percent, color: 'text-green-600', suffix: '%' },
];

export default function StatsCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(({ key, label, icon: Icon, color, suffix }) => (
        <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
            <Icon size={16} className={color} />
          </div>
          <div className="text-2xl font-bold">{summary[key]}{suffix || ''}</div>
        </div>
      ))}
    </div>
  );
}
