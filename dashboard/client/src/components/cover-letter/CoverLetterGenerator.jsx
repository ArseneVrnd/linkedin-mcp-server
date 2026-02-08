import { useState } from 'react';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { api } from '../../lib/api';

export default function CoverLetterGenerator({ jobId, onGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const letter = await api.generateCoverLetter(jobId);
      onGenerated(letter);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveManual = async () => {
    if (!content.trim()) return;
    try {
      const letter = await api.saveCoverLetter(jobId, content);
      onGenerated(letter);
      setContent('');
      setManualMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1.5"
        >
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {generating ? 'Generating...' : 'Generate with AI'}
        </button>
        <button
          onClick={() => setManualMode(!manualMode)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Write Manually
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {manualMode && (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="Write your cover letter..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
          <button
            onClick={handleSaveManual}
            className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
          >
            <Save size={14} /> Save
          </button>
        </div>
      )}
    </div>
  );
}
