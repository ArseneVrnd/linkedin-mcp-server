import { useState } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function JobImport({ onImported }) {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState({});
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keywords.trim()) return;
    setSearching(true);
    setError(null);
    setResults([]);

    try {
      const data = await api.mcpSearchJobs({ keywords, location, limit: 25 });
      const raw = data.raw || '';

      // Parse the MCP response - try to extract job listings
      // The MCP server returns text content with job info
      const lines = raw.split('\n').filter(l => l.trim());
      const parsed = [];
      let current = {};

      for (const line of lines) {
        if (line.includes('Title:') || line.includes('title:')) {
          if (current.title) parsed.push(current);
          current = { title: line.split(/[Tt]itle:\s*/)[1]?.trim() || '' };
        } else if (line.includes('Company:') || line.includes('company:')) {
          current.company = line.split(/[Cc]ompany:\s*/)[1]?.trim() || '';
        } else if (line.includes('Location:') || line.includes('location:')) {
          current.location = line.split(/[Ll]ocation:\s*/)[1]?.trim() || '';
        } else if (line.includes('URL:') || line.includes('url:') || line.includes('linkedin.com/jobs')) {
          const urlMatch = line.match(/https?:\/\/[^\s)]+/);
          if (urlMatch) {
            current.linkedin_url = urlMatch[0];
            const idMatch = urlMatch[0].match(/(\d{5,})/);
            if (idMatch) current.linkedin_job_id = idMatch[1];
          }
        } else if (line.includes('Salary:') || line.includes('salary:')) {
          current.salary = line.split(/[Ss]alary:\s*/)[1]?.trim() || '';
        }
      }
      if (current.title) parsed.push(current);

      if (parsed.length === 0) {
        // If parsing failed, show the raw result as a single entry
        setResults([{ raw, title: 'Search Results', company: 'See raw output' }]);
      } else {
        setResults(parsed);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleImport = async (job) => {
    const key = job.linkedin_job_id || job.title;
    setImporting(prev => ({ ...prev, [key]: true }));

    try {
      // If we have a job ID, try to get full details first
      let details = {};
      if (job.linkedin_job_id) {
        try {
          const detailData = await api.mcpJobDetails(job.linkedin_job_id);
          const raw = detailData.raw || '';
          // Try to extract description
          const descMatch = raw.match(/[Dd]escription:\s*([\s\S]*?)(?=\n[A-Z]|\n\n|$)/);
          if (descMatch) details.description = descMatch[1].trim();
        } catch {}
      }

      await api.mcpImportJob({
        title: job.title || 'Unknown Title',
        company: job.company || 'Unknown Company',
        location: job.location,
        salary: job.salary,
        description: details.description,
        linkedin_url: job.linkedin_url,
        linkedin_job_id: job.linkedin_job_id,
      });

      setImporting(prev => ({ ...prev, [key]: 'done' }));
      if (onImported) onImported();
    } catch (err) {
      setImporting(prev => ({ ...prev, [key]: 'error' }));
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

      {results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((job, i) => {
            const key = job.linkedin_job_id || job.title + i;
            const status = importing[key];
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.company} {job.location && `- ${job.location}`}</div>
                </div>
                <button
                  onClick={() => handleImport(job)}
                  disabled={status === true || status === 'done'}
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"
                >
                  {status === true ? (
                    <><Loader2 size={12} className="animate-spin" /> Importing</>
                  ) : status === 'done' ? (
                    'Imported'
                  ) : status === 'error' ? (
                    'Failed - Retry'
                  ) : (
                    <><Download size={12} /> Import</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
