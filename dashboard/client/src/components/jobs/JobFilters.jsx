import SearchInput from '../ui/SearchInput';
import { STATUS_OPTIONS } from './StatusBadge';

export default function JobFilters({ search, onSearchChange, status, onStatusChange, tags, selectedTag, onTagChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-64">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search jobs..." />
      </div>
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select
        value={selectedTag}
        onChange={e => onTagChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
      >
        <option value="">All Tags</option>
        {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
      </select>
    </div>
  );
}
