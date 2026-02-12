import { useState } from 'react';
import { Search, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function JobImport({ onImported }) {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [savedCount, setSavedCount] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keywords.trim()) return;
    setSearching(true);
    setError(null);
    setResults([]);
    setSavedCount(0);

    try {
      const data = await api.mcpSearchJobs({ keywords, location, limit: 25 });
      const jobs = data.jobs || [];
      setSavedCount(data.autoSaved || 0);

      if (jobs.length > 0) {
        setResults(jobs);
      } else if (data.raw) {
        setResults([{ title: 'Search Results', company: 'See raw output', raw: data.raw }]);
      }

      if (onImported) onImported();
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="Job title, keywords..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
          className="w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 text-sm"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {savedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle size={16} />
          {savedCount} job{savedCount !== 1 ? 's' : ''} automatically saved to your tracker
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((job, i) => (
            <div key={job.id || job.linkedin_job_id || i} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="font-medium text-sm">{job.title}</div>
              <div className="text-xs text-gray-500">
                {job.company} {job.location && `- ${job.location}`}
              </div>
              {job.raw && (
                <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap max-h-40 overflow-y-auto">{job.raw}</pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
