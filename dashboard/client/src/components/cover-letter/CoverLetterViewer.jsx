import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

export default function CoverLetterViewer({ letter, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span className="text-sm font-medium">
            Cover Letter - {format(new Date(letter.generated_at), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); handleCopy(); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600 rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-sm whitespace-pre-wrap">
          {letter.content}
        </div>
      )}
    </div>
  );
}
