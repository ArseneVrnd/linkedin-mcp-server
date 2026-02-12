import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function Settings() {
  const { dark, toggle } = useTheme();
  const [mcpStatus, setMcpStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkMcp = async () => {
    setChecking(true);
    try {
      const status = await api.mcpStatus();
      setMcpStatus(status.connected);
    } catch {
      setMcpStatus(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkMcp(); }, []);

  return (
    <div>
      <Header title="Settings" dark={dark} toggle={toggle} />
      <div className="p-6 max-w-2xl space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                dark ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">MCP Server Connection</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mcpStatus ? (
                  <><Wifi size={18} className="text-green-500" /> <span className="text-green-600 font-medium">Connected</span></>
                ) : mcpStatus === false ? (
                  <><WifiOff size={18} className="text-red-400" /> <span className="text-red-500 font-medium">Disconnected</span></>
                ) : (
                  <span className="text-gray-500">Checking...</span>
                )}
              </div>
              <button
                onClick={checkMcp}
                disabled={checking}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={checking ? 'animate-spin' : ''} /> Check
              </button>
            </div>
            <p className="text-sm text-gray-500">
              The LinkedIn MCP server should be running at <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">http://127.0.0.1:8000/mcp</code>
            </p>
            <p className="text-xs text-gray-400">
              Start it with: <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">cd linkedin-mcp-server && uv run -m linkedin_mcp_server --transport streamable-http --port 8000</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
