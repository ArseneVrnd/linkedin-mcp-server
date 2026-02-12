import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Kanban, FileText, Calendar, Settings, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/resume', icon: FileText, label: 'Resume' },
  { to: '/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [mcpConnected, setMcpConnected] = useState(false);

  useEffect(() => {
    api.mcpStatus().then(s => setMcpConnected(s.connected)).catch(() => setMcpConnected(false));
    const interval = setInterval(() => {
      api.mcpStatus().then(s => setMcpConnected(s.connected)).catch(() => setMcpConnected(false));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600">Job Tracker</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {mcpConnected ? (
            <><Wifi size={14} className="text-green-500" /> MCP Connected</>
          ) : (
            <><WifiOff size={14} className="text-red-400" /> MCP Disconnected</>
          )}
        </div>
      </div>
    </aside>
  );
}
