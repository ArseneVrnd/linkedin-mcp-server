import clsx from 'clsx';

const statusConfig = {
  saved: { label: 'Saved', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  phone_screen: { label: 'Phone Screen', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
  technical_interview: { label: 'Technical', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  onsite: { label: 'Onsite', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  offer: { label: 'Offer', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  negotiation: { label: 'Negotiation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  ghosted: { label: 'Ghosted', color: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
};

export const STATUS_OPTIONS = Object.entries(statusConfig).map(([value, { label }]) => ({ value, label }));

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.saved;
  return (
    <span className={clsx('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', cfg.color)}>
      {cfg.label}
    </span>
  );
}
