import { useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../lib/api';

export default function CoverLetterGenerator({ jobId, onGenerated }) {
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!content.trim()) return;
    try {
      const letter = await api.saveCoverLetter(jobId, content);
      onGenerated(letter);
      setContent('');
      setShowEditor(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowEditor(!showEditor)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Write Cover Letter
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {showEditor && (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="Write or paste your cover letter..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
          >
            <Save size={14} /> Save
          </button>
        </div>
      )}
    </div>
  );
}
