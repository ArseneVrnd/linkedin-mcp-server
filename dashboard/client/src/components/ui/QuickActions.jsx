import { Plus, Search, RefreshCw, Download, Upload, Tag, Trash2, FileText, Sparkles } from 'lucide-react';

const ACTIONS = {
  new: { icon: Plus, label: 'New', color: 'bg-primary-600 hover:bg-primary-700' },
  search: { icon: Search, label: 'Search', color: 'bg-blue-600 hover:bg-blue-700' },
  refresh: { icon: RefreshCw, label: 'Refresh', color: 'bg-gray-600 hover:bg-gray-700' },
  import: { icon: Upload, label: 'Import', color: 'bg-green-600 hover:bg-green-700' },
  export: { icon: Download, label: 'Export', color: 'bg-purple-600 hover:bg-purple-700' },
  tag: { icon: Tag, label: 'Tag', color: 'bg-yellow-600 hover:bg-yellow-700' },
  delete: { icon: Trash2, label: 'Delete', color: 'bg-red-600 hover:bg-red-700' },
  generate: { icon: Sparkles, label: 'Generate', color: 'bg-indigo-600 hover:bg-indigo-700' },
  coverLetter: { icon: FileText, label: 'Cover Letter', color: 'bg-blue-600 hover:bg-blue-700' },
};

export default function QuickActions({ actions = [], className = '' }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action, index) => {
        const config = ACTIONS[action.type] || {};
        const Icon = config.icon || Plus;

        return (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            title={action.tooltip || config.label}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium
              transition-all shadow-sm hover:shadow
              disabled:opacity-50 disabled:cursor-not-allowed
              ${action.color || config.color || 'bg-gray-600 hover:bg-gray-700'}
              ${action.className || ''}
            `}
          >
            <Icon size={16} />
            {action.label !== false && (
              <span>{action.label || config.label}</span>
            )}
            {action.shortcut && (
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                {action.shortcut}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Quick action bar that can be placed anywhere
 */
export function QuickActionBar({ children, title }) {
  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      <div className="flex gap-2 flex-wrap">
        {children}
      </div>
    </div>
  );
}
